'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  ArrowLeft, 
  Lock, 
  Zap, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const { t, lang } = useLanguage();

  const corePillars = [
    {
      title: lang === 'ar' ? 'صانع السيرة الذاتية ATS' : 'ATS Resume Builder',
      desc: lang === 'ar'
        ? 'قوالب سيرة ذاتية احترافية متوافقة مع أنظمة الفحص الآلي للشركات في أوروبا والخليج مع تصدير مباشر لملف PDF.'
        : 'ATS-compliant resume generator structured for European, Turkish, and GCC hiring portals with instant export.',
      badge: lang === 'ar' ? 'الأكثر طلباً' : 'Popular',
      icon: FileText,
      href: '/cv-builder',
      actionText: lang === 'ar' ? 'إنشاء سيرة ذاتية' : 'Build Resume',
    },
    {
      title: lang === 'ar' ? 'أدوات الـ PDF المتكاملة' : 'Integrated PDF Suite',
      desc: lang === 'ar'
        ? 'ادمج عدة مستندات PDF في ملف واحد، وقّع العقود بيدك، أو حوّل الصور إلى PDF داخل متصفحك مباشرة وبخصوصية مطلقة.'
        : 'Merge multiple PDF files, sign contracts electronically, and convert photos to PDF locally in your browser.',
      badge: lang === 'ar' ? 'معالجة محلية' : 'Local Engine',
      icon: Layers,
      href: '/pdf-tools',
      actionText: lang === 'ar' ? 'أدوات الـ PDF' : 'PDF Tools',
    },
    {
      title: lang === 'ar' ? 'تفريغ وعزل خلفية الصور' : 'Background Remover',
      desc: lang === 'ar'
        ? 'احصل على صور منتجات احترافية بخلفية شفافة PNG أو بيضاء نقية جاهزة لمتاجرك وإعلاناتك بنقرة واحدة.'
        : 'Extract high-resolution product cutouts on transparent PNG or crisp white backdrops in a single click.',
      badge: lang === 'ar' ? 'للمتاجر والتصميم' : 'E-Commerce',
      icon: ImageIcon,
      href: '/remove-bg',
      actionText: lang === 'ar' ? 'تفريغ الصور' : 'Remove Background',
    },
  ];

  const faqs = lang === 'ar' ? [
    {
      q: 'ما الذي تشمله الأدوات المجانية؟ وما الفرق مع باقة Pro؟',
      a: 'جميع الأدوات الأساسية مجانية بالكامل بلا قيود: صانع السيرة الذاتية، دمج وتوقيع ملفات PDF، تحويل الصور، وإزالة خلفيات الصور. باقة Pro خيار إضافي يوفر رفع ملفات بأحجام أكبر، تجربة خالية من الإعلانات، وقوالب سيرة ذاتية حصرية.',
    },
    {
      q: 'هل تُرفع ملفاتي أو صوري إلى أي خوادم خارجية؟',
      a: 'لا نهائياً. تعتمد المنصة على المعالجة من طرف العميل (Client-Side) بنسبة 100%؛ فملفات PDF والصور يتم معالجتها داخل الذاكرة المؤقتة لمتصفحك فقط ولا يتم نقل أي بايت عبر الإنترنت إلى أي سيرفر.',
    },
    {
      q: 'هل تستغرق إزالة الخلفية وقتاً طويلاً؟',
      a: 'في أول استخدام فقط قد يستغرق تجهيز النموذج المكتبي بضع ثوانٍ، وبعدها تتم عمليات المعالجة والعزل بسرعة ملحوظة داخل جهازك.',
    },
    {
      q: 'هل قوالب السيرة الذاتية ملائمة لسوق العمل في أوروبا وتركيا والخليج؟',
      a: 'نعم، تم تصميم قوالب الـ CV وفق المعايير الدولية الحديثة المتوافقة مع أنظمة ATS الآلية وقواعد EuroPass، وهي خالية من التعقيدات الرسومية التي تعيق قراءة أنظمة التوظيف.',
    },
    {
      q: 'كيف يمكنني استعراض جميع الأدوات في صفحة واحدة؟',
      a: 'يمكنك ببساطة الضغط على زر "تصفح جميع الأدوات" في الأعلى أو من شريط التنقل للوصول إلى مكتبة الأدوات الشاملة والبحث عن أي أداة تريدها.',
    },
  ] : [
    {
      q: 'What is included in the free tier vs the Pro plan?',
      a: 'All core utilities are 100% free with no hidden charges: resume generation, PDF merging, signing, image conversion, and background cutouts. The Pro plan offers larger file allowances, an ad-free experience, and exclusive template styles.',
    },
    {
      q: 'Are my files or images uploaded to any cloud server?',
      a: 'Never. The platform operates 100% client-side: all binary transformations happen directly in your browser memory via WebAssembly and Canvas APIs. No file ever touches our servers.',
    },
    {
      q: 'How fast is the background cutout feature?',
      a: 'On first launch, the local model takes a few seconds to load into your browser cache. Subsequent cutouts operate quickly with instant downloads.',
    },
    {
      q: 'Are resume templates compliant with ATS and EuroPass standards?',
      a: 'Yes. Templates follow clean semantic typography without decorative graphics that break automated applicant tracking systems across Europe, Turkey, and the GCC.',
    },
    {
      q: 'Where can I find and search all tools?',
      a: 'Click on the "Explore All Tools" button in the hero or the "Tools" link in the navigation to access the dedicated tools catalog with instant filtering.',
    },
  ];

  return (
    <div className="pb-24">
      
      {/* Hero Section — Slash Style */}
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
              href="/cv-builder"
              className="px-6 py-3.5 bg-[#040406] hover:bg-[#121317] text-[#ffffff] text-sm font-medium rounded-full border border-[#2e3038] hover:border-[#cc9166] transition-colors flex items-center gap-2"
            >
              <span>{t('hero.cvAction')}</span>
              <ArrowUpRight className="w-4 h-4 text-[#cc9166]" />
            </Link>
          </div>

          {/* Quick Pill Highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#5e616e] font-mono text-[11px] ml-1">{t('hero.quickBrowse')}</span>
            <Link
              href="/tools"
              className="px-3 py-1 bg-[#040406] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] rounded-full border border-[#1c1d22] transition-colors"
            >
              ✨ {lang === 'ar' ? 'عرض كافة الأدوات الـ 5' : 'View all 5 tools'}
            </Link>
            <Link
              href="/pdf-tools"
              className="px-3 py-1 bg-[#040406] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] rounded-full border border-[#1c1d22] transition-colors"
            >
              📑 {lang === 'ar' ? 'دمج وتوقيع PDF' : 'PDF Merge & Sign'}
            </Link>
            <Link
              href="/remove-bg"
              className="px-3 py-1 bg-[#040406] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] rounded-full border border-[#1c1d22] transition-colors"
            >
              🖼️ {lang === 'ar' ? 'تفريغ الصور' : 'Remove BG'}
            </Link>
          </div>

        </div>
      </section>

      {/* Featured Core Pillars Section */}
      <section className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-12 pb-4 border-b border-[#1c1d22]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-1">
              {lang === 'ar' ? 'الخدمات الأساسية' : 'Core Services'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#ffffff]">
              {lang === 'ar' ? 'أدوات يومية مصممة للسرعة والإنتاجية' : 'Daily utilities built for speed'}
            </h2>
          </div>
          
          <Link
            href="/tools"
            className="text-xs font-mono text-[#cc9166] hover:underline mt-2 sm:mt-0 flex items-center gap-1.5"
          >
            <span>{lang === 'ar' ? 'فتح صفحة الأدوات بالكامل ←' : 'Open full tools catalog →'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="group bg-[#040406] rounded-[10px] border border-[#1c1d22] hover:border-[#2e3038] p-7 flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#1c1d22] flex items-center justify-center text-[#cc9166] group-hover:border-[#cc9166] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-[#9194a1] border border-[#2e3038] px-2.5 py-0.5 rounded-full font-mono">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium text-[#ffffff] mb-3 leading-snug group-hover:text-[#cc9166] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#9194a1] leading-relaxed mb-8">
                    {pillar.desc}
                  </p>
                </div>

                <Link
                  href={pillar.href}
                  className="w-full flex items-center justify-between py-2.5 px-4 bg-[#121317] hover:bg-[#ffffff] text-[#e2e3e9] hover:text-[#000000] text-xs font-medium rounded-full border border-[#1c1d22] hover:border-[#ffffff] transition-all"
                >
                  <span>{pillar.actionText}</span>
                  <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'en' ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Big Banner CTA to Tools Page */}
        <div className="mt-12 p-8 sm:p-10 rounded-[10px] bg-[#040406] border border-[#cc9166]/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-start">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#cc9166] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مكتبة الأدوات الكاملة' : 'Complete Toolset'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#ffffff]">
              {lang === 'ar' ? 'هل تبحث عن أداة محددة؟' : 'Looking for a specific utility?'}
            </h3>
            <p className="text-xs text-[#9194a1] mt-1">
              {lang === 'ar'
                ? 'استعرض جميع الأدوات بما في ذلك تحويل الصور إلى PDF وتوقيع العقود مع بحث فوري وتصنيف سريع.'
                : 'Browse all tools including Image-to-PDF, electronic signing, and background cutout with instant filters.'}
            </p>
          </div>

          <Link
            href="/tools"
            className="px-6 py-3 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold rounded-full transition-all flex items-center gap-2 shrink-0 active:scale-95 shadow-md"
          >
            <span>{lang === 'ar' ? 'الانتقال إلى صفحة الأدوات' : 'Explore Tools Catalog'}</span>
            <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'en' ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      </section>

      {/* Stat proof points — Slash Style */}
      <section className="border-y border-[#1c1d22] bg-[#040406] py-16">
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

      {/* Trust & Architecture */}
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
