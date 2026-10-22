'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lock, Mail, ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

interface AuthGuardProps {
  children: React.ReactNode;
  toolName?: string;
}

export default function AuthGuard({ children, toolName }: AuthGuardProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { lang } = useLanguage();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectPath = encodeURIComponent(pathname || '/tools');
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?redirect=${redirectPath}`,
        },
      });
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center px-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#cc9166] border-t-transparent animate-spin" />
        <p className="text-xs text-[#9194a1] font-mono">
          {lang === 'ar' ? 'جاري التحقق من صلاحية الوصول...' : 'Verifying user access...'}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[#040406] rounded-[14px] border border-[#1c1d22] p-8 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#cc9166] to-transparent" />
          
          {/* Lock Icon */}
          <div className="w-14 h-14 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[11px] font-mono uppercase tracking-widest text-[#cc9166] block mb-2">
            {lang === 'ar' ? 'منطقة محمية' : 'PROTECTED UTILITY'}
          </span>

          <h2 className="text-2xl font-serif text-[#ffffff] font-normal mb-3">
            {lang === 'ar' ? 'تسجيل الدخول مطلوب' : 'Sign in Required'}
          </h2>

          <p className="text-xs text-[#9194a1] leading-relaxed mb-8">
            {lang === 'ar'
              ? `لاستخدام ${toolName ? `أداة (${toolName})` : 'هذه الأداة'} ومعالجة ملفاتك وحفظ نتائجك بخصوصية كاملة، يجب تسجيل الدخول أو إنشاء حساب مجاني أولاً.`
              : `To use ${toolName ? `the (${toolName}) utility` : 'this utility'} and process your files with full privacy, please sign in or create a free account.`}
          </p>

          {/* Google OAuth Quick Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2 mb-3 active:scale-95 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{lang === 'ar' ? 'دخول فوري باستخدام Google' : 'Continue with Google'}</span>
          </button>

          {/* Email / Password Sign In */}
          <Link
            href={`/auth?redirect=${encodeURIComponent(pathname || '/tools')}`}
            className="w-full py-3 px-4 bg-[#121317] hover:bg-[#1c1d22] text-[#ffffff] text-xs font-medium rounded-full border border-[#2e3038] hover:border-[#cc9166] transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <Mail className="w-3.5 h-3.5 text-[#cc9166]" />
            <span>{lang === 'ar' ? 'تسجيل الدخول بالبريد الإلكتروني' : 'Sign in with Email'}</span>
          </Link>

          {/* Trust Badges */}
          <div className="pt-6 border-t border-[#1c1d22] flex items-center justify-around text-[10px] text-[#777a88]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'مجاني 100%' : 'Free Tier'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'بدون بطاقة بنكية' : 'No card needed'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowLeft className={`w-3 h-3 text-[#cc9166] ${lang === 'en' ? 'rotate-180' : ''}`} />
              <Link href="/tools" className="hover:text-[#ffffff] transition-colors">
                {lang === 'ar' ? 'تصفح الأدوات' : 'Browse Tools'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
