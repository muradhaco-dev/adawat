'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  ChevronDown,
  Sparkles,
  UserCheck
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const { t, lang } = useLanguage();

  const faqs = [
    {
      q: lang === 'ar' ? 'هل أحتاج إلى تسجيل الدخول لاستخدام الأدوات؟' : 'Do I need to sign in to use the tools?',
      a: lang === 'ar'
        ? 'نعم، يتطلب استخدام الأدوات تسجيل الدخول لضمان أمان معالجة المستندات وحفظ أعمالك وسيرتك الذاتية في حسابك الشخصي.'
        : 'Yes, signing in is required to use the tools in order to ensure secure document processing and save your files and resumes to your personal workspace.',
    },
    {
      q: lang === 'ar' ? 'ما الفرق بين الأدوات المجانية وباقة Pro؟' : 'What is included in the free tier vs the Pro plan?',
      a: lang === 'ar'
        ? 'الأدوات الأساسية متاحة مجاناً مع تسجيل الحساب: إنشاء السيرة الذاتية، دمج الـ PDF وتوقيعه، صانع كود الـ QR، وعزل الخلفيات. باقة Pro تمنحك سعة ملفات غير محدودة وبدون إعلانات.'
        : 'All core utilities are accessible for free upon creating an account: resume generation, PDF merging and signing, QR code studio, and background cutouts. The Pro plan unlocks unlimited file capacities and an ad-free experience.',
    },
    {
      q: lang === 'ar' ? 'هل تُرفع ملفاتي أو صوري إلى أي خوادم خارجية؟' : 'Are my files or images uploaded to any cloud server?',
      a: lang === 'ar'
        ? 'كلا على الإطلاق. معالجة المستندات وتفريغ الصور تتم داخل ذاكرة متصفحك مباشرة عبر تقنيات WebAssembly وCanvas بدون إرسال ملفاتك لأي خادم.'
        : 'Never. Document manipulation and background cutouts happen purely client-side inside your browser memory via WebAssembly and Canvas APIs.',
    },
    {
      q: lang === 'ar' ? 'أين يمكنني الوصول إلى كافة الأدوات؟' : 'Where can I access all available tools?',
      a: lang === 'ar'
        ? 'يمكنك الوصول إلى جميع الأدوات من خلال قائمة (الأدوات) في شريط التنقل العلوي، أو بالضغط على زر (الانتقال إلى منصة الأدوات).'
        : 'You can access all utilities via the "Tools" dropdown in the top navigation or by clicking the "Explore Tools" button in the hero.',
    },
  ];

  return (
    <div className="pb-24">
      
      {/* Hero Section — Clean Slash Style (Zero Tools on Landing) */}
      <section className="relative pt-24 pb-20 border-b border-[#1c1d22]">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Eyebrow Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cc9166]" />
            <span>{t('hero.eyebrow')}</span>
          </div>

          {/* Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#ffffff] tracking-tight leading-[1.1] max-w-4xl mx-auto">
            {t('hero.title')}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#9194a1] max-w-2xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>

          {/* High-Converting CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tools"
              className="px-8 py-3.5 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-sm font-semibold rounded-full transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-white/5"
            >
              <span>{t('hero.exploreTools')}</span>
              <ArrowLeft className={`w-4 h-4 ${lang === 'en' ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              href="/auth"
              className="px-6 py-3.5 bg-[#040406] hover:bg-[#121317] text-[#ffffff] text-sm font-medium rounded-full border border-[#2e3038] hover:border-[#cc9166] transition-colors flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'تسجيل الدخول / حساب جديد' : 'Sign in / Register'}</span>
            </Link>
          </div>

          {/* Security & Speed Trust Highlights (Pills) */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#040406] border border-[#1c1d22] text-[#9194a1]">
              <Lock className="w-3.5 h-3.5 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'معالجة مشفرة 100% داخل المتصفح' : '100% In-Browser Privacy'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#040406] border border-[#1c1d22] text-[#9194a1]">
              <Zap className="w-3.5 h-3.5 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'تنفيذ فوري فائق السرعة' : 'Instant Execution Speed'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#040406] border border-[#1c1d22] text-[#9194a1]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'متوافقة مع معايير ATS و EuroPass' : 'ATS & EuroPass Compliant'}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Stat proof points — Slash Style */}
      <section className="border-b border-[#1c1d22] bg-[#040406] py-16">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-serif text-[#ffffff] font-normal mb-2">
                {t('stats.privacy')}
              </div>
              <p className="text-xs font-mono text-[#cc9166] uppercase mb-1">{t('stats.privacy.label')}</p>
              <p className="text-xs text-[#9194a1]">{t('stats.privacy.sub')}</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-serif text-[#ffffff] font-normal mb-2">
                {t('stats.speed')}
              </div>
              <p className="text-xs font-mono text-[#cc9166] uppercase mb-1">{t('stats.speed.label')}</p>
              <p className="text-xs text-[#9194a1]">{t('stats.speed.sub')}</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-serif text-[#ffffff] font-normal mb-2">
                {t('stats.free')}
              </div>
              <p className="text-xs font-mono text-[#cc9166] uppercase mb-1">{t('stats.free.label')}</p>
              <p className="text-xs text-[#9194a1]">{t('stats.free.sub')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Architecture Section */}
      <section className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-2">
            {lang === 'ar' ? 'الأمان والكفاءة' : 'Security & Architecture'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#ffffff]">
            {lang === 'ar' ? 'بنية تحتية تركز على خصوصيتك أولاً' : 'Local-first architecture designed for privacy'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
            <div className="w-8 h-8 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-medium text-[#ffffff] mb-2">
              {lang === 'ar' ? 'معالجة Client-Side' : 'Client-Side Execution'}
            </h3>
            <p className="text-xs text-[#9194a1] leading-relaxed">
              {lang === 'ar'
                ? 'تقنيات WebAssembly و Web Canvas تتيح معالجة ملفات PDF والصور داخل متصفحك بدون الحاجة لتحميلها إلى أي سيرفر خارجي.'
                : 'WebAssembly and Canvas APIs allow complete local file transformation without ever sending binary data across the wire.'}
            </p>
          </div>

          <div className="p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
            <div className="w-8 h-8 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-medium text-[#ffffff] mb-2">
              {lang === 'ar' ? 'جودة تصدير نقية' : 'Pristine Export Quality'}
            </h3>
            <p className="text-xs text-[#9194a1] leading-relaxed">
              {lang === 'ar'
                ? 'ملفات PDF مطابقة للمواصفات الرسمية وصور PNG شفافة بأعلى دقة تلبي متطلبات الطباعة ومتاجر التجارة الإلكترونية.'
                : 'PDF output and lossless PNG cutouts tailored for physical print and e-commerce catalogs.'}
            </p>
          </div>

          <div className="p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
            <div className="w-8 h-8 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-medium text-[#ffffff] mb-2">
              {lang === 'ar' ? 'متوافقة مع ATS وEuroPass' : 'ATS & EuroPass Compatible'}
            </h3>
            <p className="text-xs text-[#9194a1] leading-relaxed">
              {lang === 'ar'
                ? 'قوالب السيرة الذاتية تتبع معايير EuroPass وتتجاوز أنظمة الفحص الآلي ATS المستخدمة في بوابات التوظيف الأوروبية والخليجية والتركية.'
                : 'Resume templates follow EuroPass structure and are validated to pass ATS parsing used by corporate hiring portals across Europe, Turkey, and the GCC.'}
            </p>
          </div>
        </div>

        {/* Access Tools Hub CTA */}
        <div className="mt-14 p-8 sm:p-10 rounded-[12px] bg-[#040406] border border-[#2e3038] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-start">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#cc9166] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مكتبة الأدوات المتخصصة' : 'SPECIALIZED UTILITY SUITE'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#ffffff]">
              {lang === 'ar' ? 'جاهز للبدء في استخدام الأدوات؟' : 'Ready to start using the suite?'}
            </h3>
            <p className="text-xs text-[#9194a1] mt-1">
              {lang === 'ar'
                ? 'سجل دخولك الآن للوصول الكامل إلى صانع الـ CV، دمج وتوقيع PDF، إزالة الخلفية، وصانع الـ QR.'
                : 'Sign in now to access the full suite of CV builder, PDF tools, background remover, and QR studio.'}
            </p>
          </div>

          <Link
            href="/tools"
            className="px-6 py-3 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold rounded-full transition-all flex items-center gap-2 shrink-0 active:scale-95 shadow-md"
          >
            <span>{lang === 'ar' ? 'فتح منصة الأدوات' : 'Open Tools Hub'}</span>
            <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'en' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </section>

      {/* FAQs — Static HTML for full SEO crawlability */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-2">
            {lang === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#ffffff]">
            {lang === 'ar' ? 'إجابات لاستفساراتك' : 'Answers to your questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = faqOpen === index;
            return (
              <div
                key={index}
                className="border border-[#1c1d22] rounded-[10px] bg-[#040406] overflow-hidden"
                itemScope
                itemType="https://schema.org/Question"
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full py-4 px-5 text-start flex items-center justify-between gap-4 font-medium text-sm text-[#ffffff] hover:text-[#cc9166] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span itemProp="name">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#777a88] transition-transform shrink-0 ${
                      isOpen ? 'rotate-180 text-[#cc9166]' : ''
                    }`}
                  />
                </button>
                <div
                  itemScope
                  itemType="https://schema.org/Answer"
                  className={`px-5 text-xs text-[#9194a1] leading-relaxed border-t border-[#1c1d22] transition-all duration-200 ${
                    isOpen ? 'pb-5 pt-3 max-h-96 opacity-100' : 'max-h-0 overflow-hidden opacity-0 border-t-0'
                  }`}
                  aria-hidden={!isOpen}
                >
                  <span itemProp="text">{faq.a}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ad slot: Cleanly placed at bottom */}
      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <AdBanner slot="home-bottom-leaderboard" />
      </div>

    </div>
  );
}
