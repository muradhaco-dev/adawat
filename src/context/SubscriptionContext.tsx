'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/lib/supabase/types';

export interface DailyUsage {
  date: string;
  signCount: number;
  bgCount: number;
}

export interface PaywallOptions {
  title?: string;
  message?: string;
  featureName?: string;
  limitText?: string;
}

interface SubscriptionContextType {
  user: any;
  profile: Profile | null;
  isPro: boolean;
  loading: boolean;
  dailyUsage: DailyUsage;
  paywallModal: {
    isOpen: boolean;
    options: PaywallOptions;
  };
  openPaywall: (options?: PaywallOptions) => void;
  closePaywall: () => void;
  checkCanUse: (tool: ToolCheckType, params?: any) => { allowed: boolean; reason?: string };
  recordUsage: (tool: 'bg_remove' | 'sign_pdf') => Promise<void>;
  refreshSubscription: () => Promise<void>;
  upgradeToPro: () => Promise<boolean>;
}

export type ToolCheckType = 
  | 'bg_remove' 
  | 'sign_pdf' 
  | 'pdf_merge' 
  | 'images_to_pdf' 
  | 'qr_custom_color' 
  | 'qr_logo' 
  | 'cv_template' 
  | 'cv_save';

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>(() => {
    const today = new Date().toISOString().split('T')[0];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`adawat_usage_${today}`);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        // ignore
      }
    }
    return { date: today, signCount: 0, bgCount: 0 };
  });

  const [paywallModal, setPaywallModal] = useState<{
    isOpen: boolean;
    options: PaywallOptions;
  }>({
    isOpen: false,
    options: {},
  });

  // Calculate isPro status
  const isPro = !!(
    profile &&
    profile.subscription_tier === 'pro' &&
    profile.subscription_status === 'active'
  );

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setProfile(data as Profile);
      } else if (error && error.code === 'PGRST116') {
        // Record doesn't exist yet, insert default free profile
        const newProfile: Partial<Profile> = {
          id: userId,
          email: user?.email || '',
          subscription_tier: 'free',
          subscription_status: 'active',
          daily_operations_count: 0,
          last_operation_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
        };
        const { data: created } = await supabase.from('profiles').insert(newProfile).select().single();
        if (created) setProfile(created as Profile);
      }
    } catch (err) {
      console.warn('Error fetching subscription profile:', err);
    }
  }, [user]);

  const refreshSubscription = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) {
      await fetchProfile(session.user.id);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id).finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id).finally(() => setLoading(false));
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Load and sync daily usage from storage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const key = user ? `adawat_usage_${user.id}_${today}` : `adawat_usage_guest_${today}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          setDailyUsage(parsed);
          return;
        }
      }
      const initial = { date: today, signCount: 0, bgCount: 0 };
      setDailyUsage(initial);
      localStorage.setItem(key, JSON.stringify(initial));
    } catch {
      // ignore
    }
  }, [user]);

  const openPaywall = (options: PaywallOptions = {}) => {
    setPaywallModal({
      isOpen: true,
      options: {
        title: options.title || 'ترقية إلى باقة Pro',
        message: options.message || 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود.',
        featureName: options.featureName || 'ميزات غير محدودة',
        limitText: options.limitText,
      },
    });
  };

  const closePaywall = () => {
    setPaywallModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Rule verification logic
  const checkCanUse = (tool: ToolCheckType, params?: any): { allowed: boolean; reason?: string } => {
    if (isPro) return { allowed: true };

    const today = new Date().toISOString().split('T')[0];
    const currentUsage = dailyUsage.date === today ? dailyUsage : { date: today, signCount: 0, bgCount: 0 };

    switch (tool) {
      case 'bg_remove':
        if (currentUsage.bgCount >= 2) {
          return {
            allowed: false,
            reason: 'لقد استنفدت الحد اليومي المجاني (صورتين يومياً). قم بالترقية لباقة Pro للتفريغ غير المحدود بدقة فائقة.',
          };
        }
        return { allowed: true };

      case 'sign_pdf':
        if (currentUsage.signCount >= 2) {
          return {
            allowed: false,
            reason: 'لقد استنفدت الحد اليومي المجاني (توقيعين يومياً). قم بالترقية لباقة Pro لتوقيع مستندات غير محدودة.',
          };
        }
        return { allowed: true };

      case 'pdf_merge': {
        const fileCount = params?.fileCount ?? 0;
        const totalSizeBytes = params?.totalSizeBytes ?? 0;
        const maxBytes = 15 * 1024 * 1024; // 15 MB
        if (fileCount > 5) {
          return {
            allowed: false,
            reason: `الحد الأقصى في الباقة المجانية هو 5 ملفات فقط (أنت تحاول دمج ${fileCount} ملفات). الترقية لباقة Pro تتيح دمج غير محدود.`,
          };
        }
        if (totalSizeBytes > maxBytes) {
          return {
            allowed: false,
            reason: `حجم الملفات يتجاوز الحد المجاني (15 ميجابايت). باقة Pro تمنحك حتى 100 ميجابايت في العملية الواحدة.`,
          };
        }
        return { allowed: true };
      }

      case 'images_to_pdf': {
        const imageCount = params?.imageCount ?? 0;
        if (imageCount > 10) {
          return {
            allowed: false,
            reason: `الحد الأقصى في الباقة المجانية هو 10 صور لكل ملف (أنت تحاول تحويل ${imageCount} صورة). قم بالترقية لدمج صور غير محدودة.`,
          };
        }
        return { allowed: true };
      }

      case 'qr_custom_color':
        return {
          allowed: false,
          reason: 'تخصيص ألوان كود الـ QR ميزة حصرية لمشتركي باقة Pro. الباقة المجانية توفر الكود القياسي بالأبيض والأسود.',
        };

      case 'qr_logo':
        return {
          allowed: false,
          reason: 'دمج الشعار (Logo) داخل كود الـ QR ميزة حصرية لمشتركي باقة Pro.',
        };

      case 'cv_template': {
        const templateId = params?.templateId;
        if (templateId === 'executive' || templateId === 'minimal') {
          return {
            allowed: false,
            reason: `قوالب السيرة الذاتية المتقدمة (ATS و EuroPass) مخصصة لمشتركي باقة Pro فقط.`,
          };
        }
        return { allowed: true };
      }

      case 'cv_save': {
        const existingCount = params?.existingCount ?? 0;
        if (existingCount >= 1) {
          return {
            allowed: false,
            reason: 'الباقة المجانية تتيح حفظ نسخة واحدة فقط. قم بالترقية لباقة Pro لحفظ وتعديل نسخ متعددة.',
          };
        }
        return { allowed: true };
      }

      default:
        return { allowed: true };
    }
  };

  const recordUsage = async (tool: 'bg_remove' | 'sign_pdf') => {
    const today = new Date().toISOString().split('T')[0];
    const key = user ? `adawat_usage_${user.id}_${today}` : `adawat_usage_guest_${today}`;

    setDailyUsage((prev) => {
      const isToday = prev.date === today;
      const updated: DailyUsage = {
        date: today,
        signCount: isToday ? prev.signCount + (tool === 'sign_pdf' ? 1 : 0) : tool === 'sign_pdf' ? 1 : 0,
        bgCount: isToday ? prev.bgCount + (tool === 'bg_remove' ? 1 : 0) : tool === 'bg_remove' ? 1 : 0,
      };
      try {
        localStorage.setItem(key, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // Update in Supabase profiles if user logged in
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({
            last_operation_date: today,
            daily_operations_count: (profile?.daily_operations_count || 0) + 1,
          })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Could not sync usage to Supabase:', err);
      }
    }
  };

  const upgradeToPro = async (): Promise<boolean> => {
    if (!user) {
      openPaywall({
        title: 'تسجيل الدخول مطلوب أولاً',
        message: 'يرجى تسجيل الدخول أو إنشاء حساب لربط اشتراك Pro بحسابك والاستفادة منه عبر جميع أجهزتك.',
      });
      return false;
    }

    try {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'pro',
          subscription_status: 'active',
          subscription_expires_at: expiresAt,
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile((prev: any) => ({
        ...prev,
        subscription_tier: 'pro',
        subscription_status: 'active',
        subscription_expires_at: expiresAt,
      }));

      return true;
    } catch (err) {
      console.error('Upgrade error:', err);
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        user,
        profile,
        isPro,
        loading,
        dailyUsage,
        paywallModal,
        openPaywall,
        closePaywall,
        checkCanUse,
        recordUsage,
        refreshSubscription,
        upgradeToPro,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
