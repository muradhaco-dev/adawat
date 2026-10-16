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
  Check, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  Lock,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const tools = [
    {
      id: 'cv-builder',
      title: 'صانع السيرة الذاتية المهنية (CV)',
      description: 'سيرة ذاتية متوافقة مع أنظمة ATS ومعايير التوظيف في ألمانيا وتركيا والخليج. تصدير مباشر بصيغة PDF عالية الدقة.',
      category: 'التوظيف والمهن',
      icon: FileText,
      badge: 'الأكثر طلباً',
      href: '/cv-builder',
      tags: ['سيرة ذاتية', 'CV جاهز', 'تركيا', 'ألمانيا', 'وظائف'],
      actionText: 'بدء إنشاء السيرة',
    },
    {
      id: 'pdf-merge',
      title: 'دمج وترتيب ملفات PDF',
      description: 'ادمج مستندات PDF متعددة في ملف واحد فائق السرعة داخل متصفحك مباشرة بدون إرسال ملفاتك لأي خادم.',
      category: 'المستندات',
      icon: Layers,
      badge: 'معالجة محلية',
      href: '/pdf-tools',
      tags: ['دمج PDF', 'ترتيب الصفحات', 'محلي'],
      actionText: 'دمج الملفات الآن',
    },
    {
      id: 'remove-bg',
      title: 'إزالة وتفريغ خلفية الصور',
      description: 'احصل على صور منتجات بخلفية شفافة PNG أو بيضاء نقية جاهزة للنشر على إنستغرام والمتاجر الإلكترونية بضغطة واحدة.',
      category: 'التجارة والتصميم',
      icon: ImageIcon,
      badge: 'للمتاجر',
      href: '/remove-bg',
      tags: ['إزالة الخلفية', 'إنستغرام', 'PNG شفاف'],
      actionText: 'تفريغ الصورة',
    },
    {
      id: 'pdf-sign',
      title: 'توقيع العقود والمستندات إلكترونياً',
      description: 'ارسم توقيعك بيدك على شاشة اللمس أو الماوس وثبته مباشرة على أوراقك وعقود الـ PDF وحملها فوراً.',
      category: 'المستندات',
      icon: PenTool,
      badge: 'توقيع سريع',
      href: '/pdf-tools?tab=sign',
      tags: ['توقيع PDF', 'عقود رسمية'],
      actionText: 'توقيع المستند',
    },
    {
      id: 'doc-convert',
      title: 'محول المستندات والصور إلى PDF',
      description: 'تحويل الصور والوثائق إلى ملفات PDF موحدة ومنسقة للطباعة أو الإرسال الرسمي.',
      category: 'التحويل',
      icon: FileCheck,
      badge: 'أدوات مساعدة',
      href: '/pdf-tools',
      tags: ['تحويل الملفات', 'صور إلى PDF'],
      actionText: 'استخدام المحول',
    },
  ];

  const filteredTools = tools.filter(
    (t) =>
      t.title.includes(searchTerm) ||
      t.description.includes(searchTerm) ||
      t.category.includes(searchTerm) ||
      t.tags.some((tag) => tag.includes(searchTerm))
  );

  const faqs = [
    {
      q: 'هل الأدوات مجانية بالكامل؟',
      a: 'نعم، جميع الأدوات الأساسية (صانع السيرة الذاتية، دمج وتوقيع الـ PDF، وتفريغ الصور) مجانية بدون رسوم خفية. كما توجد باقة Pro اختيارية للأفراد والمتاجر الراغبين في سعة غير محدودة وتجربة خالية تماماً من الإعلانات.',
    },
    {
      q: 'كيف تضمنون أمان المستندات والصور الحساسة؟',
      a: 'تعتمد المنصة على تقنية المعالجة من طرف العميل (Client-Side)، حيث تتم عمليات دمج وتوقيع وتعديل الملفات مباشرة داخل ذاكرة متصفحك ولا يتم رفع أي ملف إلى خوادم خارجية إطلاقاً.',
    },
    {
      q: 'هل السيرة الذاتية ملائمة لسوق العمل في أوروبا وتركيا والخليج؟',
      a: 'صممت قوالب السيرة الذاتية وفق المعايير العالمية الحديثة الخالية من التعقيدات الرسومية والتي تتجاوز أنظمة فحص السير الذاتية الآلية (ATS) بنجاح.',
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
            <span>منظومة أدوات ذكية / معالجة فائقة السرعة</span>
          </div>

          {/* Display Headline — Serif collision with extreme size */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#ffffff] tracking-tight leading-[1.1] max-w-4xl mx-auto">
            أدواتك اليومية، مصقولة بدقة وبلا وسيط
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#9194a1] max-w-2xl mx-auto leading-relaxed">
            أنشئ سيرتك الذاتية المعتمدة دولياً، ادمج ووقع ملفات الـ PDF، وفرغ صور منتجاتك بضغطة زر داخل متصفحك مباشرة وبخصوصية مطلقة.
          </p>

          {/* Search Bar & Primary Action */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="relative flex items-center rounded-full bg-[#040406] border border-[#2e3038] focus-within:border-[#ffffff] transition-colors p-1.5">
              <Search className="w-4 h-4 text-[#777a88] mr-3 ml-2 shrink-0" />
              <input
                type="text"
                placeholder="ابحث عن أداة (مثال: دمج PDF، سيرة ذاتية، إزالة خلفية...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 text-sm text-[#ffffff] placeholder-[#5e616e] bg-transparent outline-none font-sans"
              />
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-[#9194a1] hover:text-[#ffffff] px-3 py-1 font-mono"
                >
                  مسح
                </button>
              ) : (
                <span className="text-[11px] text-[#5e616e] font-mono px-3 hidden sm:inline">
                  بحث فوري
                </span>
              )}
            </div>
          </div>

          {/* Quick Pill Filter Tags */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#5e616e] font-mono text-[11px] ml-1">تصفح سريع:</span>
            <button
              onClick={() => setSearchTerm('سيرة ذاتية')}
              className="px-3 py-1 bg-[#040406] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] rounded-full border border-[#1c1d22] transition-colors font-sans"
            >
              صانع الـ CV
            </button>
            <button
              onClick={() => setSearchTerm('دمج')}
              className="px-3 py-1 bg-[#040406] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] rounded-full border border-[#1c1d22] transition-colors font-sans"
            >
              دمج الـ PDF
            </button>
            <button
              onClick={() => setSearchTerm('تفريغ')}
              className="px-3 py-1 bg-[#040406] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] rounded-full border border-[#1c1d22] transition-colors font-sans"
            >
              تفريغ الصور
            </button>
          </div>

        </div>
      </section>

      {/* Ad slot */}
      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner slot="home-top-leaderboard" />
      </div>

      {/* Tools Section */}
      <section className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 pb-4 border-b border-[#1c1d22]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-1">
              مكتبة الأدوات
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#ffffff]">
              الأدوات المتخصصة
            </h2>
          </div>
          <span className="text-xs font-mono text-[#5e616e] mt-2 sm:mt-0">
            {filteredTools.length} من أصل {tools.length} أداة متاحة
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-20 bg-[#040406] rounded-[10px] border border-[#1c1d22]">
            <p className="text-sm text-[#9194a1]">لم نعثر على أداة مطابقة لبحثك</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 text-xs text-[#cc9166] hover:underline font-mono"
            >
              عرض كافة الأدوات
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
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Stat proof points — Slash Style */}
      <section className="border-y border-[#1c1d22] bg-[#040406] py-16">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-serif text-[#ffffff] font-normal mb-2">
                100%
              </div>
              <p className="text-xs font-mono text-[#cc9166] uppercase mb-1">خصوصية وأمان محلي</p>
              <p className="text-xs text-[#9194a1]">معالجة الملفات في ذاكرة جهازك دون رفعها لخوادم</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-serif text-[#ffffff] font-normal mb-2">
                &lt; 1s
              </div>
              <p className="text-xs font-mono text-[#cc9166] uppercase mb-1">سرعة المعالجة</p>
              <p className="text-xs text-[#9194a1]">تنفيذ فوري وتحميل مباشر بدون طوابير انتظار</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-serif text-[#ffffff] font-normal mb-2">
                0$
              </div>
              <p className="text-xs font-mono text-[#cc9166] uppercase mb-1">أدوات مجانية للأبد</p>
              <p className="text-xs text-[#9194a1]">خدمات أساسية متكاملة لجميع المستخدمين</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Architecture */}
      <section className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-2">
            الأمان والكفاءة
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#ffffff]">
            بنية تحتية تركز على خصوصيتك أولاً
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
            <div className="w-8 h-8 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-medium text-[#ffffff] mb-2">معالجة Client-Side</h3>
            <p className="text-xs text-[#9194a1] leading-relaxed">
              تقنيات WebAssembly و Web-Canvas تتيح معالجة ملفات PDF والصور داخل متصفحك بدون الحاجة لتحميلها إلى أي سيرفر خارجي.
            </p>
          </div>

          <div className="p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
            <div className="w-8 h-8 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-medium text-[#ffffff] mb-2">جودة تصدير نقية</h3>
            <p className="text-xs text-[#9194a1] leading-relaxed">
              ملفات PDF مطابقة للمواصفات الرسمية وصور PNG شفافة بأعلى دقة تلبي متطلبات الطباعة ومتاجر التجارة الإلكترونية.
            </p>
          </div>

          <div className="p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
            <div className="w-8 h-8 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-medium text-[#ffffff] mb-2">متوافقة مع سوق العمل</h3>
            <p className="text-xs text-[#9194a1] leading-relaxed">
              قوالب السيرة الذاتية تراعي متطلبات التوظيف لسوق العمل في ألمانيا وتركيا ودول الخليج وتنسيق EuroPass.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs — Hairline accordions */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-2">
            الأسئلة الشائعة
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#ffffff]">
            إجابات لاستفساراتك
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = faqOpen === index;
            return (
              <div
                key={index}
                className="border border-[#1c1d22] rounded-[10px] bg-[#040406] overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full py-4 px-5 text-right flex items-center justify-between gap-4 font-medium text-sm text-[#ffffff] hover:text-[#cc9166] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#777a88] transition-transform ${
                      isOpen ? 'rotate-180 text-[#cc9166]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#9194a1] leading-relaxed border-t border-[#1c1d22] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
