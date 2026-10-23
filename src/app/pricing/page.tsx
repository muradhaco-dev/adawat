'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  X, 
  Crown, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  Sparkles,
  FileText,
  Layers,
  PenTool,
  Image as ImageIcon,
  QrCode,
  FileCheck,
  Ban
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSubscription } from '@/context/SubscriptionContext';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { user, isPro, upgradeToPro, openPaywall } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpgrade = async () => {
    if (!user) {
      window.location.href = '/auth?redirect=/pricing';
      return;
    }

    try {
      setLoading(true);
      const success = await upgradeToPro();
      if (success) {
        setMessage('تهانينا! تم تفعيل اشتراكك في باقة Pro بنجاح على حسابك في Supabase 🎉');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        alert('تعذر إكمال الترقية، يرجى المحاولة مجدداً');
      }
    } catch (err: any) {
      alert('حدث خطأ: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const toolComparison = [
    {
      tool: 'صانع السيرة الذاتية (CV)',
      free: 'قوالب أساسية فقط، حفظ نسخة واحدة، وجود علامة مائية',
      pro: 'فتح جميع القوالب (ATS و EuroPass)، حفظ نسخ متعددة، إزالة العلامة المائية',
    },
    {
      tool: 'دمج وترتيب ملفات PDF',
      free: 'حد أقصى 5 ملفات بالعملية (إجمالي 15 ميجابايت)',
      pro: 'عدد غير محدود من الملفات، وحجم يصل إلى 100 ميجابايت',
    },
    {
      tool: 'توقيع المستندات إلكترونياً',
      free: 'حد أقصى توقيع مستندين (2) يومياً',
      pro: 'عدد غير محدود من التوقيعات اليومية',
    },
    {
      tool: 'إزالة وتفريغ خلفية الصور (AI)',
      free: 'حد أقصى صورتين (2) يومياً بجودة عادية (SD)',
      pro: 'استخدام غير محدود بجودة فائقة (Ultra-HD)',
    },
    {
      tool: 'صانع كود الـ QR الذكي',
      free: 'كود قياسي باللونين الأبيض والأسود فقط',
      pro: 'دمج الشعار (Logo) المخصص وتخصيص كافة الألوان',
    },
    {
      tool: 'محول الصور إلى PDF',
      free: 'حد أقصى 10 صور في الملف الواحد',
      pro: 'تجميع عدد غير محدود من الصور بدقة عالية',
    },
    {
      tool: 'الإعلانات وتجربة التصفح',
      free: 'مساحات إعلانية داعمة للمنصة أسفل الأدوات',
      pro: 'تجربة نظيفة وخالية تماماً من الإعلانات 100%',
    },
  ];

  return (
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <Crown className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>خطط الاستخدام والترقية الرسمية</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          كفاءة غير مقيدة، بسعر بسيط
        </h1>

        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          اختر الباقة المناسبة لاحتياجاتك اليومية. استمتع بالأدوات الأساسية مجاناً، أو ارتقِ إلى <strong className="text-[#ffffff]">باقة Pro بسعر $3.99 شهرياً</strong> لفتح كامل القدرات بلا قيود وبدون أي إعلانات.
        </p>

        {/* Billing Switcher */}
        <div className="mt-10 inline-flex items-center p-1 bg-[#040406] border border-[#1c1d22] rounded-full">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-1.5 rounded-full text-xs font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-[#121317] text-[#ffffff] border border-[#2e3038]'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            اشتراك شهري ($3.99)
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
            <span className="text-[10px] text-[#cc9166] font-mono">وفر شهرين</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="max-w-md mx-auto mb-10 p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-[10px] text-emerald-200 text-xs font-medium text-center shadow-lg">
          {message}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch mb-20">
        
        {/* FREE PLAN */}
        <div className="bg-[#040406] rounded-[14px] border border-[#1c1d22] p-8 flex flex-col justify-between relative">
          <div>
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#9194a1] block mb-1">
                  الباقة الأساسية
                </span>
                <h3 className="text-xl font-medium text-[#ffffff]">الباقة المجانية</h3>
              </div>
              <span className="text-xs font-mono text-[#5e616e] border border-[#1c1d22] px-2.5 py-0.5 rounded-full">
                0$ للأبد
              </span>
            </div>

            <div className="my-6 pb-6 border-b border-[#1c1d22]">
              <span className="text-4xl font-serif text-[#ffffff]">$0</span>
              <span className="text-xs text-[#5e616e] mr-2 font-mono">/ مجاناً للأبد</span>
              <p className="text-xs text-[#5e616e] mt-2">لكافة المستخدمين المسجلين مع قيود استخدام يومية خفيفة.</p>
            </div>

            <ul className="space-y-3.5 text-xs text-[#9194a1] mb-8">
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>دمج ملفات PDF حتى 5 ملفات (15 ميجابايت كحد أقصى)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>توقيع إلكتروني لمستندين (2) يومياً</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>تفريغ صورتين (2) يومياً بجودة عادية (SD)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>صانع السيرة الذاتية (قالب أساسي + حفظ نسخة واحدة للتحميل)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>صانع كود الـ QR القياسي (باللونين الأبيض والأسود فقط)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>تحويل الصور إلى PDF حتى 10 صور لكل ملف</span>
              </li>
              <li className="flex items-start gap-2.5 text-[#5e616e]">
                <span className="w-3.5 h-3.5 text-center shrink-0 font-mono mt-0.5">—</span>
                <span>تتضمن مساحات إعلانية في أسفل مساحة العمل لدعم الخوادم</span>
              </li>
            </ul>
          </div>

          <Link
            href="/tools"
            className="w-full py-2.5 bg-transparent hover:bg-[#121317] text-[#ffffff] text-xs font-medium rounded-full border border-[#2e3038] hover:border-[#777a88] text-center transition-colors block"
          >
            {isPro ? 'متابعة التصفح' : 'خطتك الحالية (ابدأ مجاناً)'}
          </Link>
        </div>

        {/* PRO PLAN — Slash Gilded/Copper emphasis */}
        <div className="bg-[#040406] rounded-[14px] border border-[#cc9166] p-8 relative flex flex-col justify-between shadow-2xl">
          <div className="absolute -top-3 left-6 text-[10px] font-mono text-[#000000] bg-[#cc9166] px-3.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
            <Crown className="w-3 h-3 text-[#000000]" />
            <span>باقة PRO الموصى بها</span>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-1">
                  الباقة المتقدمة الشاملة
                </span>
                <h3 className="text-xl font-medium text-[#ffffff]">باقة Pro الاحترافية</h3>
              </div>
            </div>

            <div className="my-6 pb-6 border-b border-[#1c1d22]">
              <span className="text-4xl font-serif text-[#ffffff]">
                {billingCycle === 'monthly' ? '$3.99' : '$34.99'}
              </span>
              <span className="text-xs text-[#cc9166] mr-2 font-mono">
                {billingCycle === 'monthly' ? '/ شهرياً' : '/ سنوياً (فقط $2.91/شهر)'}
              </span>
              <p className="text-xs text-[#9194a1] mt-2">وصول فوري وشامل لجميع الأدوات بدون أي حدود أو إعلانات.</p>
            </div>

            <ul className="space-y-3.5 text-xs text-[#e2e3e9] mb-8">
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span className="text-[#ffffff] font-medium">إخفاء جميع الإعلانات بالكامل لتجربة فائقة السرعة</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>فتح جميع قوالب السيرة الذاتية (ATS و EuroPass المعتمد)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>حفظ وتعديل نسخ متعددة من السيرة الذاتية وإزالة العلامة المائية</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>دمج ملفات PDF غير محدود بحجم يصل حتى 100 ميجابايت</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>توقيع مستندات إلكترونية غير محدود يومياً</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>تفريغ الصور غير محدود وبدقة فائقة (Ultra-HD)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>صانع الـ QR: دمج الشعار المخصص (Logo) وتخصيص الألوان</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>تحويل الصور إلى PDF بعدد غير محدود وبأعلى جودة طباعة</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            disabled={loading || isPro}
            className="w-full py-3 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold rounded-full transition-all disabled:opacity-50 active:scale-95 shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#cc9166]" />
            <span>
              {isPro
                ? 'أنت مشترك بالفعل في باقة Pro النشطة'
                : loading
                ? 'جاري تفعيل الاشتراك على حسابك...'
                : 'ترقية الحساب الآن مقابل $3.99 فقط'}
            </span>
          </button>
        </div>

      </div>

      {/* Comprehensive Feature Comparison Table */}
      <div className="max-w-4xl mx-auto bg-[#040406] rounded-[14px] border border-[#1c1d22] p-6 sm:p-8">
        <h2 className="text-xl font-serif text-[#ffffff] mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#cc9166]" />
          <span>مقارنة تفصيلية بين صلاحيات الأدوات</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1c1d22] text-[#9194a1] font-mono">
                <th className="py-3 px-4 text-start font-medium">الأداة / الميزة</th>
                <th className="py-3 px-4 text-start font-medium text-[#9194a1]">الباقة المجانية ($0)</th>
                <th className="py-3 px-4 text-start font-medium text-[#cc9166]">باقة Pro ($3.99/شهر)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1d22]">
              {toolComparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#121317]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#ffffff]">
                    {row.tool}
                  </td>
                  <td className="py-3.5 px-4 text-[#9194a1] leading-relaxed">
                    {row.free}
                  </td>
                  <td className="py-3.5 px-4 text-[#cc9166] font-medium leading-relaxed">
                    {row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust footers */}
      <div className="mt-16 text-center text-xs text-[#5e616e] flex flex-wrap items-center justify-center gap-8 font-mono">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#777a88]" />
          أمان ومصادقة مشفرة عبر Supabase
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#777a88]" />
          تفعيل فوري لكافة الميزات لحظة الترقية
        </span>
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#777a88]" />
          إلغاء الاشتراك متاح في أي لحظة
        </span>
      </div>

    </div>
  );
}
