'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Crown, 
  ShieldCheck, 
  Zap, 
  HelpCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase/client';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setProfile(data);
          });
      }
    });
  }, []);

  const handleUpgradeToPro = async () => {
    if (!user) {
      alert('يرجى تسجيل الدخول أو إنشاء حساب أولاً للاشتراك وتفعيل الباقة بحسابك');
      window.location.href = '/auth';
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'pro',
          subscription_status: 'active',
          subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage('تهانينا! تم تفعيل اشتراكك في باقة Pro بنجاح على حسابك 🎉');
      setProfile((prev: any) => ({ ...prev, subscription_tier: 'pro' }));
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (err: any) {
      alert('حدث خطأ: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const isPro = profile?.subscription_tier === 'pro';

  return (
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <Crown className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>خطط الاستخدام والترقية</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          كفاءة غير مقيدة، بسعر بسيط
        </h1>

        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          جميع الأدوات الأساسية مجانية للجميع للأبد. اشترك في باقة Pro لتجربة خالية تماماً من الإعلانات، وسعة حفظ غير محدودة، وقوالب السيرة الذاتية الحصرية.
        </p>

        {/* Billing Switcher: Slash Pill */}
        <div className="mt-10 inline-flex items-center p-1 bg-[#040406] border border-[#1c1d22] rounded-full">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-[#121317] text-[#ffffff] border border-[#2e3038]'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            اشتراك شهري
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-[#121317] text-[#ffffff] border border-[#2e3038]'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            <span>اشتراك سنوي</span>
            <span className="text-[10px] text-[#cc9166] font-mono">وفر 40%</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="max-w-md mx-auto mb-10 p-3.5 bg-[#121317] border border-[#cc9166]/50 rounded-[10px] text-[#e2e3e9] text-xs font-medium text-center">
          {message}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* FREE PLAN */}
        <div className="bg-[#040406] rounded-[10px] border border-[#1c1d22] p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#9194a1] block mb-1">
                  الباقة الأساسية
                </span>
                <h3 className="text-xl font-medium text-[#ffffff]">المجانية للأبد</h3>
              </div>
              <span className="text-xs font-mono text-[#5e616e] border border-[#1c1d22] px-2.5 py-0.5 rounded-full">
                0$
              </span>
            </div>

            <div className="my-6 pb-6 border-b border-[#1c1d22]">
              <span className="text-4xl font-serif text-[#ffffff]">$0</span>
              <span className="text-xs text-[#5e616e] mr-2 font-mono">/ بدون بطاقة</span>
            </div>

            <ul className="space-y-3.5 text-xs text-[#9194a1] mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0" />
                <span>دمج ملفات PDF حتى 5 ملفات دفعة واحدة</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0" />
                <span>توقيع ملفات PDF إلكترونياً</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0" />
                <span>صانع السيرة الذاتية (القالب الأساسي)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0" />
                <span>إزالة خلفية الصور بدقة عادية</span>
              </li>
              <li className="flex items-center gap-2.5 text-[#5e616e]">
                <span className="w-3.5 h-3.5 text-center shrink-0 font-mono">—</span>
                <span>تتضمن مساحات إعلانية لدعم المنصة</span>
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="w-full py-2.5 bg-transparent hover:bg-[#121317] text-[#ffffff] text-xs font-medium rounded-full border border-[#2e3038] hover:border-[#777a88] text-center transition-colors block"
          >
            الاستخدام الحالي
          </Link>
        </div>

        {/* PRO PLAN — Slash Gilded/Copper emphasis */}
        <div className="bg-[#040406] rounded-[10px] border border-[#cc9166]/60 p-8 relative flex flex-col justify-between">
          <div className="absolute -top-3 left-6 text-[10px] font-mono text-[#000000] bg-[#cc9166] px-3 py-0.5 rounded-full font-bold">
            PRO / الترقية الاحترافية
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-1">
                  الباقة المتقدمة
                </span>
                <h3 className="text-xl font-medium text-[#ffffff]">باقة Pro</h3>
              </div>
            </div>

            <div className="my-6 pb-6 border-b border-[#1c1d22]">
              <span className="text-4xl font-serif text-[#ffffff]">
                {billingCycle === 'yearly' ? '$3.99' : '$5.99'}
              </span>
              <span className="text-xs text-[#9194a1] mr-2 font-mono">/ شهرياً</span>
            </div>

            <ul className="space-y-3.5 text-xs text-[#e2e3e9] mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
                <span className="text-[#ffffff]">عمليات غير محدودة بدون قيود يومية</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
                <span>قوالب السيرة الذاتية الألمانية والأوروبية المعتمدة</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
                <span>حفظ وتعديل نسخ متعددة من الـ CV على Supabase</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
                <span>تفريغ الصور بدقة Ultra-HD فائقة النقاء</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
                <span className="text-[#cc9166]">تصفح فائق السرعة وخالٍ تماماً من الإعلانات</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgradeToPro}
            disabled={loading || isPro}
            className="w-full py-2.5 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium rounded-full transition-all disabled:opacity-50 active:scale-95 shadow-sm"
          >
            {isPro
              ? 'أنت مشترك بالفعل في باقة Pro'
              : loading
              ? 'جاري تفعيل الاشتراك...'
              : 'ترقية الحساب الآن'}
          </button>
        </div>

      </div>

      {/* Trust footers */}
      <div className="mt-20 text-center text-xs text-[#5e616e] flex flex-wrap items-center justify-center gap-8 font-mono">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#777a88]" />
          أمان ومصادقة مشفرة 100%
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#777a88]" />
          تفعيل فوري لحظة الترقية
        </span>
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#777a88]" />
          إمكانية الإلغاء في أي وقت
        </span>
      </div>

    </div>
  );
}
