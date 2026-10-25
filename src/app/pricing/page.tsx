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
import { useLanguage } from '@/context/LanguageContext';

export default function PricingPage() {
  const { lang, t } = useLanguage();
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
        setMessage(
          lang === 'ar'
            ? 'تهانينا! تم تفعيل اشتراكك في باقة Pro بنجاح على حسابك في Supabase 🎉'
            : 'Congratulations! Your Pro subscription is now active on your account 🎉'
        );
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } else {
        alert(lang === 'ar' ? 'تعذر إكمال الترقية، يرجى المحاولة مجدداً' : 'Could not complete upgrade, please try again');
      }
    } catch (err: any) {
      alert((lang === 'ar' ? 'حدث خطأ: ' : 'Error: ') + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const toolComparison = [
    {
      tool: lang === 'ar' ? 'صانع السيرة الذاتية (CV)' : 'CV & Resume Builder',
      free: lang === 'ar' ? 'قوالب أساسية فقط، حفظ نسخة واحدة، وجود علامة مائية' : 'Basic templates, 1 saved resume, watermark',
      pro: lang === 'ar' ? 'فتح جميع القوالب (ATS و EuroPass)، حفظ نسخ متعددة، إزالة العلامة المائية' : 'All templates (ATS & EuroPass), unlimited versions, no watermark',
    },
    {
      tool: lang === 'ar' ? 'دمج وترتيب ملفات PDF' : 'PDF Merge & Organize',
      free: lang === 'ar' ? 'حد أقصى 5 ملفات بالعملية (إجمالي 15 ميجابايت)' : 'Up to 5 files per merge (15 MB max)',
      pro: lang === 'ar' ? 'عدد غير محدود من الملفات، وحجم يصل إلى 100 ميجابايت' : 'Unlimited files, up to 100 MB per batch',
    },
    {
      tool: lang === 'ar' ? 'توقيع المستندات إلكترونياً' : 'E-Signature Studio',
      free: lang === 'ar' ? 'حد أقصى توقيع مستندين (2) يومياً' : 'Up to 2 signed documents per day',
      pro: lang === 'ar' ? 'عدد غير محدود من التوقيعات اليومية' : 'Unlimited document signatures daily',
    },
    {
      tool: lang === 'ar' ? 'إزالة وتفريغ خلفية الصور (AI)' : 'AI Background Remover',
      free: lang === 'ar' ? 'حد أقصى صورتين (2) يومياً بجودة عادية (SD)' : '2 cutouts per day in standard quality',
      pro: lang === 'ar' ? 'استخدام غير محدود بجودة فائقة (Ultra-HD)' : 'Unlimited cutouts in Ultra-HD clarity',
    },
    {
      tool: lang === 'ar' ? 'صانع كود الـ QR الذكي' : 'Smart QR Studio',
      free: lang === 'ar' ? 'كود قياسي باللونين الأبيض والأسود فقط' : 'Standard B&W QR code generation',
      pro: lang === 'ar' ? 'دمج الشعار (Logo) المخصص وتخصيص كافة الألوان' : 'Branded custom logo injection & palette styling',
    },
    {
      tool: lang === 'ar' ? 'محول الصور إلى PDF' : 'Image to PDF Converter',
      free: lang === 'ar' ? 'حد أقصى 10 صور في الملف الواحد' : 'Up to 10 images per PDF',
      pro: lang === 'ar' ? 'تجميع عدد غير محدود من الصور بدقة عالية' : 'Unlimited images converted to high-DPI PDF',
    },
    {
      tool: lang === 'ar' ? 'الإعلانات وتجربة التصفح' : 'Ad Experience',
      free: lang === 'ar' ? 'مساحات إعلانية داعمة للمنصة أسفل الأدوات' : 'Non-intrusive ads supporting server costs',
      pro: lang === 'ar' ? 'تجربة نظيفة وخالية تماماً من الإعلانات 100%' : '100% Ad-free pristine workflow',
    },
  ];

  return (
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <Crown className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>{lang === 'ar' ? 'خطط الاستخدام والترقية الرسمية' : 'OFFICIAL SUBSCRIPTION TIERS'}</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          {lang === 'ar' ? 'كفاءة غير مقيدة، بسعر بسيط' : 'Unrestricted power, simple pricing'}
        </h1>

        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          {lang === 'ar'
            ? 'اختر الباقة المناسبة لاحتياجاتك اليومية. استمتع بالأدوات الأساسية مجاناً، أو ارتقِ إلى باقة Pro بسعر $3.99 شهرياً لفتح كامل القدرات بلا قيود وبدون أي إعلانات.'
            : 'Select the tier engineered for your needs. Use essential tools for free forever, or upgrade to Pro at $3.99/mo for unlimited capacities and zero ads.'}
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
            {lang === 'ar' ? 'اشتراك شهري ($3.99)' : 'Monthly ($3.99)'}
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-[#121317] text-[#ffffff] border border-[#2e3038]'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            <span>{lang === 'ar' ? 'اشتراك سنوي' : 'Annual Plan'}</span>
            <span className="text-[10px] text-[#cc9166] font-mono">
              {lang === 'ar' ? 'وفر شهرين' : 'Save 2 months'}
            </span>
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
                  {lang === 'ar' ? 'الباقة الأساسية' : 'CORE TIER'}
                </span>
                <h3 className="text-xl font-medium text-[#ffffff]">
                  {lang === 'ar' ? 'الباقة المجانية' : 'Free Tier'}
                </h3>
              </div>
              <span className="text-xs font-mono text-[#5e616e] border border-[#1c1d22] px-2.5 py-0.5 rounded-full">
                {lang === 'ar' ? '0$ للأبد' : '$0 Forever'}
              </span>
            </div>

            <div className="my-6 pb-6 border-b border-[#1c1d22]">
              <span className="text-4xl font-serif text-[#ffffff]">$0</span>
              <span className="text-xs text-[#5e616e] mx-2 font-mono">
                {lang === 'ar' ? '/ مجاناً للأبد' : '/ forever free'}
              </span>
              <p className="text-xs text-[#5e616e] mt-2">
                {lang === 'ar' ? 'لكافة المستخدمين المسجلين مع قيود استخدام يومية خفيفة.' : 'For all registered users with daily fair-use limits.'}
              </p>
            </div>

            <ul className="space-y-3.5 text-xs text-[#9194a1] mb-8">
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'دمج ملفات PDF حتى 5 ملفات (15 ميجابايت كحد أقصى)' : 'Merge up to 5 PDF files (15 MB batch max)'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'توقيع إلكتروني لمستندين (2) يومياً' : 'E-sign up to 2 documents daily'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'تفريغ صورتين (2) يومياً بجودة عادية (SD)' : '2 background cutouts daily in standard quality'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'صانع السيرة الذاتية (قالب أساسي + حفظ نسخة واحدة للتحميل)' : 'Resume builder (standard template + 1 saved resume)'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'صانع كود الـ QR القياسي (باللونين الأبيض والأسود فقط)' : 'Standard black & white QR code generator'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#e2e3e9] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'تحويل الصور إلى PDF حتى 10 صور لكل ملف' : 'Convert up to 10 images into single PDF'}</span>
              </li>
              <li className="flex items-start gap-2.5 text-[#5e616e]">
                <span className="w-3.5 h-3.5 text-center shrink-0 font-mono mt-0.5">—</span>
                <span>{lang === 'ar' ? 'تتضمن مساحات إعلانية في أسفل مساحة العمل لدعم الخوادم' : 'Includes non-blocking bottom banner ads to support hosting'}</span>
              </li>
            </ul>
          </div>

          <Link
            href="/tools"
            className="w-full py-2.5 bg-transparent hover:bg-[#121317] text-[#ffffff] text-xs font-medium rounded-full border border-[#2e3038] hover:border-[#777a88] text-center transition-colors block"
          >
            {isPro 
              ? (lang === 'ar' ? 'متابعة التصفح' : 'Browse Tools')
              : (lang === 'ar' ? 'خطتك الحالية (ابدأ مجاناً)' : 'Current Plan (Get Started Free)')}
          </Link>
        </div>

        {/* PRO PLAN — Slash Gilded/Copper emphasis */}
        <div className="bg-[#040406] rounded-[14px] border border-[#cc9166] p-8 relative flex flex-col justify-between shadow-2xl">
          <div className="absolute -top-3 left-6 text-[10px] font-mono text-[#000000] bg-[#cc9166] px-3.5 py-1 rounded-full font-bold shadow-md flex items-center gap-1">
            <Crown className="w-3 h-3 text-[#000000]" />
            <span>{lang === 'ar' ? 'باقة PRO الموصى بها' : 'RECOMMENDED'}</span>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-1">
                  {lang === 'ar' ? 'الباقة المتقدمة الشاملة' : 'UNLIMITED SUITE'}
                </span>
                <h3 className="text-xl font-medium text-[#ffffff]">
                  {lang === 'ar' ? 'باقة Pro الاحترافية' : 'Pro Plan'}
                </h3>
              </div>
            </div>

            <div className="my-6 pb-6 border-b border-[#1c1d22]">
              <span className="text-4xl font-serif text-[#ffffff]">
                {billingCycle === 'monthly' ? '$3.99' : '$34.99'}
              </span>
              <span className="text-xs text-[#cc9166] mx-2 font-mono">
                {billingCycle === 'monthly' 
                  ? (lang === 'ar' ? '/ شهرياً' : '/ month') 
                  : (lang === 'ar' ? '/ سنوياً (فقط $2.91/شهر)' : '/ year ($2.91/mo)')}
              </span>
              <p className="text-xs text-[#9194a1] mt-2">
                {lang === 'ar' ? 'وصول فوري وشامل لجميع الأدوات بدون أي حدود أو إعلانات.' : 'Instant, full-throttle access to every utility without limits or ads.'}
              </p>
            </div>

            <ul className="space-y-3.5 text-xs text-[#e2e3e9] mb-8">
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span className="text-[#ffffff] font-medium">{lang === 'ar' ? 'إخفاء جميع الإعلانات بالكامل لتجربة فائقة السرعة' : '100% Ad-free pristine user interface'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'فتح جميع قوالب السيرة الذاتية (ATS و EuroPass المعتمد)' : 'Unlock all premium resume templates (ATS & EuroPass)'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'حفظ وتعديل نسخ متعددة من السيرة الذاتية وإزالة العلامة المائية' : 'Save and manage multiple resumes with zero watermarks'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'دمج ملفات PDF غير محدود بحجم يصل حتى 100 ميجابايت' : 'Unlimited PDF merging with file sizes up to 100 MB'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'توقيع مستندات إلكترونية غير محدود يومياً' : 'Unlimited daily electronic document signatures'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'تفريغ الصور غير محدود وبدقة فائقة (Ultra-HD)' : 'Unlimited AI background extractions in Ultra-HD'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'صانع الـ QR: دمج الشعار المخصص (Logo) وتخصيص الألوان' : 'Branded QR studio: custom logo placement & color styling'}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'تحويل الصور إلى PDF بعدد غير محدود وبأعلى جودة طباعة' : 'Unlimited photo conversions into print-ready PDF files'}</span>
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
                ? (lang === 'ar' ? 'أنت مشترك بالفعل في باقة Pro النشطة' : 'Your Pro subscription is active')
                : loading
                ? (lang === 'ar' ? 'جاري تفعيل الاشتراك على حسابك...' : 'Activating subscription...')
                : (lang === 'ar' ? 'ترقية الحساب الآن مقابل $3.99 فقط' : 'Upgrade to Pro for $3.99')}
            </span>
          </button>
        </div>

      </div>

      {/* Comprehensive Feature Comparison Table */}
      <div className="max-w-4xl mx-auto bg-[#040406] rounded-[14px] border border-[#1c1d22] p-6 sm:p-8">
        <h2 className="text-xl font-serif text-[#ffffff] mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#cc9166]" />
          <span>{lang === 'ar' ? 'مقارنة تفصيلية بين صلاحيات الأدوات' : 'Detailed Feature Matrix'}</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1c1d22] text-[#9194a1] font-mono">
                <th className="py-3 px-4 text-start font-medium">{lang === 'ar' ? 'الأداة / الميزة' : 'Tool / Feature'}</th>
                <th className="py-3 px-4 text-start font-medium text-[#9194a1]">{lang === 'ar' ? 'الباقة المجانية ($0)' : 'Free Plan ($0)'}</th>
                <th className="py-3 px-4 text-start font-medium text-[#cc9166]">{lang === 'ar' ? 'باقة Pro ($3.99/شهر)' : 'Pro Plan ($3.99/mo)'}</th>
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
          {lang === 'ar' ? 'أمان ومصادقة مشفرة عبر Supabase' : 'Encrypted Auth via Supabase'}
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#777a88]" />
          {lang === 'ar' ? 'تفعيل فوري لكافة الميزات لحظة الترقية' : 'Instant Activation on Checkout'}
        </span>
        <span className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-[#777a88]" />
          {lang === 'ar' ? 'إلغاء الاشتراك متاح في أي لحظة' : 'Cancel anytime with one click'}
        </span>
      </div>

    </div>
  );
}
