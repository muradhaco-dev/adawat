'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Crown, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  ArrowLeft
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

  // Demo direct upgrade handler for testing & Supabase integration
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

      setMessage('تهانينا! تم تفعيل اشتراكك في باقة Pro بنجاح على قاعدة بيانات Supabase 🎉');
      setProfile((prev: any) => ({ ...prev, subscription_tier: 'pro' }));
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      alert('حدث خطأ: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const isPro = profile?.subscription_tier === 'pro';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3 border border-amber-200">
          <Crown className="w-4 h-4 text-amber-600" />
          <span>خطط مرنة وبسيطة للأفراد والشركات</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-950">
          استثمر في سرعتك وانطلق بدون قيود
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-3 leading-relaxed">
          جميع الأدوات الأساسية مجانية للجميع للأبد. اشترك في باقة Pro للحصول على سعة غير محدودة، وتجربة خالية تماماً من الإعلانات، وقوالب السيرة الذاتية الحصرية.
        </p>

        {/* Billing Switcher */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>
            شهرياً
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-blue-600 rounded-full p-1 relative transition-colors"
          >
            <div
              className={`w-6 h-6 bg-white rounded-full transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-0' : '-translate-x-6'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>
              سنوياً
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
              وفر 40% 🔥
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-bold text-center">
          {message}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* FREE PLAN */}
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">الباقة المجانية</h3>
                <p className="text-xs text-gray-500 mt-1">مثالية للاستخدام الفردي اليومي</p>
              </div>
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                مجاني للأبد
              </span>
            </div>

            <div className="my-6">
              <span className="text-4xl font-black text-gray-900">$0</span>
              <span className="text-xs text-gray-500 mr-2">بدون أي بطاقة بنكية</span>
            </div>

            <ul className="space-y-3 text-sm text-gray-700 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>دمج ملفات PDF حتى 5 ملفات معاً</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>توقيع ملفات الـ PDF إلكترونياً</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>إنشاء سيرة ذاتية مع القالب العصري الأساسي</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>إزالة خلفية الصور بدقة قياسية</span>
              </li>
              <li className="flex items-center gap-2.5 text-gray-400">
                <span className="w-4 h-4 text-center shrink-0">✕</span>
                <span>تتضمن إعلانات Google لدعم المنصة</span>
              </li>
            </ul>
          </div>

          <Link
            href="/"
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-xl text-center transition-colors block"
          >
            البدء مجاناً الآن
          </Link>
        </div>

        {/* PRO PLAN */}
        <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative flex flex-col justify-between border-2 border-indigo-500">
          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-950 font-black text-xs px-4 py-1 rounded-full shadow-md flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" />
            الأكثر طلباً واحترافية
          </div>

          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>باقة Pro الاحترافية</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-indigo-200 mt-1">للمحترفين وأصحاب المتاجر والباحثين عن وظائف</p>
              </div>
            </div>

            <div className="my-6">
              <span className="text-4xl font-black text-white">
                {billingCycle === 'yearly' ? '$3.99' : '$5.99'}
              </span>
              <span className="text-xs text-indigo-300 mr-2">/ شهرياً (تدفع سنوياً)</span>
            </div>

            <ul className="space-y-3 text-sm text-indigo-100 mb-8">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-bold">عمليات غير محدودة بدون أي قيود يومية</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>جميع قوالب السيرة الذاتية (الألمانية والأوروبية والخليجية)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>حفظ وتعديل نسخ متعددة من الـ CV بحسابك في Supabase</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>تفريغ الصور بدقة Ultra-HD عالية للمتاجر الكبرى</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-amber-300 font-bold">تصفح سريع وخالٍ تماماً من أي إعلانات</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgradeToPro}
            disabled={loading || isPro}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-950 font-black text-sm rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isPro
              ? 'أنت مشترك بالفعل في باقة Pro ⭐'
              : loading
              ? 'جاري تفعيل الاشتراك...'
              : 'ترقية الحساب الآن'}
          </button>
        </div>

      </div>

      {/* Trust & Guarantees */}
      <div className="mt-16 text-center text-xs text-gray-400 flex items-center justify-center gap-6">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          دفع آمن ومحمي بالكامل 100%
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-blue-600" />
          تفعيل لحظي فور الاشتراك
        </span>
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-purple-600" />
          إمكانية الإلغاء في أي وقت بنقرة واحدة
        </span>
      </div>

    </div>
  );
}
