'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  PenTool, 
  Search, 
  ArrowLeft, 
  Lock, 
  Zap, 
  ShieldCheck, 
  FileCheck, 
  ChevronDown 
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const { t, lang } = useLanguage();

  const tools = [
    {
      id: 'cv-builder',
      title: t('tools.cv.title'),
      description: t('tools.cv.desc'),
      category: lang === 'ar' ? 'التوظيف والمهن' : 'Careers',
      icon: FileText,
      badge: lang === 'ar' ? 'الأكثر طلباً' : 'Popular',
      href: '/cv-builder',
      tags: ['سيرة ذاتية', 'CV', 'Resume', 'Jobs'],
      actionText: lang === 'ar' ? 'بدء إنشاء السيرة' : 'Build Resume',
    },
    {
      id: 'pdf-merge',
      title: t('tools.pdf.title'),
      description: t('tools.pdf.desc'),
      category: lang === 'ar' ? 'المستندات' : 'Documents',
      icon: Layers,
      badge: lang === 'ar' ? 'معالجة محلية' : 'Local Engine',
      href: '/pdf-tools',
      tags: ['PDF', 'Merge', 'دمج PDF'],
      actionText: lang === 'ar' ? 'دمج الملفات الآن' : 'Merge Files',
    },
    {
      id: 'remove-bg',
      title: t('tools.bg.title'),
      description: t('tools.bg.desc'),
      category: lang === 'ar' ? 'التجارة والتصميم' : 'E-Commerce',
      icon: ImageIcon,
      badge: lang === 'ar' ? 'للمتاجر' : 'Stores',
      href: '/remove-bg',
      tags: ['Background', 'PNG', 'تفريغ الصور'],
      actionText: lang === 'ar' ? 'تفريغ الصورة' : 'Remove Background',
    },
    {
      id: 'pdf-sign',
      title: t('tools.sign.title'),
      description: t('tools.sign.desc'),
      category: lang === 'ar' ? 'المستندات' : 'Documents',
      icon: PenTool,
      badge: lang === 'ar' ? 'توقيع سريع' : 'Instant Sign',
      href: '/pdf-tools?tab=sign',
      tags: ['Sign', 'توقيع'],
      actionText: lang === 'ar' ? 'توقيع المستند' : 'Sign PDF',
    },
    {
      id: 'doc-convert',
      title: t('tools.convert.title'),
      description: t('tools.convert.desc'),
      category: lang === 'ar' ? 'التحويل' : 'Converter',
      icon: FileCheck,
      badge: lang === 'ar' ? 'أدوات مساعدة' : 'Utility',
      href: '/pdf-tools',
      tags: ['Convert', 'تحويل'],
      actionText: lang === 'ar' ? 'استخدام المحول' : 'Convert Files',
    },
  ];

  const filteredTools = tools.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const faqs = lang === 'ar' ? [
    {
      q: 'ما الذي يشمله المجاني؟ وما الفرق مع Pro؟',
      a: 'جميع الأدوات الأساسية مجانية بلا حدود: صانع السيرة الذاتية، دمج وتوقيع ملفات PDF، وإزالة خلفية الصور. باقة Pro اختيارية وتوفر حصة رفع أكبر (ملفات كبيرة الحجم)، تجربة خالية من الإعلانات، ودعم متقدم.',
    },
    {
      q: 'هل تُرفع ملفاتي إلى خوادم خارجية؟',
      a: 'لا. تعتمد المنصة على المعالجة المحلية Client-Side بالكامل: دمج وتوقيع ملفات PDF ومعالجة الصور تتم داخل ذاكرة متصفحك مباشرة دون إرسال أي بيانات لأي خادم خارجي.',
    },
    {
      q: 'هل تستغرق إزالة الخلفية وقتاً طويلاً؟',
      a: 'يعتمد ذلك على أول استخدام: عند أول فتح للأداة يتم تحميل نموذج الذكاء الاصطناعي المفتوح المصدر (Transformers.js) في الخلفية مما قد يستغرق بضع ثوانٍ. بعد ذلك تعمل الأداة بسرعة ملحوظة في كل مرة.',
    },
    {
      q: 'هل السيرة الذاتية ملائمة لسوق العمل في أوروبا وتركيا والخليج؟',
      a: 'نعم. صُممت القوالب وفق معايير CV الدولية الحديثة المتوافقة مع أنظمة ATS الآلية (Applicant Tracking Systems)، وبتنسيقات قابلة للقراءة في ألمانيا وتركيا ودول الخليج. لا تتضمن صوراً أو ألواناً تعيق المسح الآلي.',
    },
    {
      q: 'هل الأسئلة الشائعة هذه تظهر في نتائج البحث؟',
      a: 'نعم. نصوص الأسئلة والأجوبة موجودة في الكود HTML بالكامل ولا تعتمد على JavaScript لظهورها، مما يجعلها قابلة للأرشفة الكاملة بواسطة محركات البحث.',
    },
  ] : [
    {
      q: 'What is free, and what does Pro include?',
      a: 'All core tools are free with no usage limits: Resume builder, PDF merge & sign, and background removal. The optional Pro plan adds larger file upload quota, an ad-free experience, and priority support.',
    },
    {
      q: 'Are my files uploaded to any external server?',
      a: 'No. The platform is fully client-side: PDF merging, signing, and image processing all happen inside your browser memory. No binary data is ever sent across the internet.',
    },
    {
      q: 'Does background removal take a long time?',
      a: 'On the very first use, the open-source AI model (Transformers.js) needs to download and initialize, which may take a few seconds. Subsequent uses are noticeably faster as the model is cached.',
    },
    {
      q: 'Are resumes compatible with ATS and EuroPass standards?',
      a: 'Yes. All resume templates follow international ATS-compatible guidelines (clean text layouts, no decorative images or unusual fonts that block automated parsing). They are aligned with EuroPass structure and tailored for European, Turkish, and GCC hiring portals.',
    },
    {
      q: 'Are these FAQ answers visible to search engines?',
      a: 'Yes. All question and answer text is rendered in static HTML and does not depend on JavaScript to appear, ensuring full crawlability and indexing by search engines.',
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

          {/* Search Bar */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative flex items-center rounded-full bg-[#040406] border border-[#2e3038] focus-within:border-[#ffffff] transition-colors p-1.5">
              <Search className="w-4 h-4 text-[#777a88] mr-3 ml-3 shrink-0" />
              <input
                type="text"
                placeholder={t('hero.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 text-sm text-[#ffffff] placeholder-[#5e616e] bg-transparent outline-none font-sans"
              />
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-[#9194a1] hover:text-[#ffffff] px-3 py-1 font-mono"
                >
                  {lang === 'ar' ? 'مسح' : 'Clear'}
                </button>
              ) : (
                <span className="text-[11px] text-[#5e616e] font-mono px-3 hidden sm:inline">
                  {t('hero.instantSearch')}
                </span>
              )}
            </div>
          </div>

          {/* Quick Pill Filter Tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#5e616e] font-mono text-[11px] ml-1">{t('hero.quickBrowse')}</span>
            <button
              onClick={() => setSearchTerm(lang === 'ar' ? 'سيرة ذاتية' : 'Resume')}
              className="px-3 py-1 bg-[#040406] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] rounded-full border border-[#1c1d22] transition-colors font-sans"
            >
              {lang === 'ar' ? 'صانع الـ CV' : 'CV Builder'}
            </button>
            <button
              onClick={() => setSearchTerm(lang === 'ar' ? 'دمج' : 'PDF')}
              className="px-3 py-1 bg-[#040406] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] rounded-full border border-[#1c1d22] transition-colors font-sans"
            >
              {lang === 'ar' ? 'دمج الـ PDF' : 'Merge PDF'}
            </button>
            <button
              onClick={() => setSearchTerm(lang === 'ar' ? 'تفريغ' : 'Background')}
              className="px-3 py-1 bg-[#040406] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] rounded-full border border-[#1c1d22] transition-colors font-sans"
            >
              {lang === 'ar' ? 'تفريغ الصور' : 'Remove BG'}
            </button>
          </div>

        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 pb-4 border-b border-[#1c1d22]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-1">
              {t('tools.eyebrow')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#ffffff]">
              {t('tools.title')}
            </h2>
          </div>
          <span className="text-xs font-mono text-[#5e616e] mt-2 sm:mt-0">
            {filteredTools.length} / {tools.length}
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-20 bg-[#040406] rounded-[10px] border border-[#1c1d22]">
            <p className="text-sm text-[#9194a1]">
              {lang === 'ar' ? 'لم نعثر على أداة مطابقة لبحثك' : 'No tools matched your query'}
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 text-xs text-[#cc9166] hover:underline font-mono"
            >
              {lang === 'ar' ? 'عرض كافة الأدوات' : 'View all tools'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="group bg-[#040406] rounded-[10px] border border-[#1c1d22] hover:border-[#2e3038] p-6 flex flex-col justify-between transition-colors"
                >
                  <div>
                    {/* Header: Category & Badge */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#121317] border border-[#1c1d22] flex items-center justify-center text-[#e2e3e9]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#cc9166]">
                          {tool.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#9194a1] border border-[#2e3038] px-2 py-0.5 rounded-full font-mono">
                        {tool.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-lg font-medium text-[#ffffff] mb-2 leading-snug">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-[#9194a1] leading-relaxed mb-6">
                      {tool.description}
                    </p>
                  </div>

                  {/* Action Link: Pill Shape */}
                  <Link
                    href={tool.href}
                    className="w-full flex items-center justify-between py-2.5 px-4 bg-[#121317] hover:bg-[#ffffff] text-[#e2e3e9] hover:text-[#000000] text-xs font-medium rounded-full border border-[#1c1d22] hover:border-[#ffffff] transition-all group-hover:border-[#2e3038]"
                  >
                    <span>{tool.actionText}</span>
                    <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'en' ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Ad slot — placed AFTER tools section, not before content */}
      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="home-mid-leaderboard" />
      </div>

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

        {/* 
          SEO NOTE: Answers are always in the DOM (hidden via max-height/opacity CSS only).
          This ensures full crawlability by search engines regardless of JS state.
        */}
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
                {/* Answer always rendered in DOM for SEO, visually hidden when collapsed */}
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

    </div>
  );
}
