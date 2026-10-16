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
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
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
      title: 'صانع السيرة الذاتية الاحترافية (CV)',
      description: 'أنشئ سيرة ذاتية عصرية معتمدة للتقديم على وظائف في تركيا، ألمانيا، ودول الخليج. تحميل بصيغة PDF فوراً.',
      icon: FileText,
      badge: 'الأكثر بحثاً ⭐',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      href: '/cv-builder',
      tags: ['سيرة ذاتية', 'CV جاهز', 'تركيا', 'ألمانيا', 'وظائف'],
      color: 'from-blue-600 to-indigo-600',
      actionText: 'أنشئ سيرتك الذاتية الآن',
    },
    {
      id: 'pdf-merge',
      title: 'دمج ملفات PDF أونلاين',
      description: 'ادمج عدة مستندات PDF في ملف واحد منظم بسرعة وسهولة. يدعم إعادة ترتيب الصفحات بحرية وأمان تام.',
      icon: Layers,
      badge: 'سريع وآمن ⚡',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      href: '/pdf-tools',
      tags: ['دمج PDF', 'ترتيب المستندات', 'مجاني'],
      color: 'from-emerald-600 to-teal-600',
      actionText: 'دمج ملفات الـ PDF',
    },
    {
      id: 'remove-bg',
      title: 'إزالة وتفريغ خلفية الصور',
      description: 'أداة مثالية لتجار إنستغرام والمتاجر الإلكترونية. احصل على صور منتجات بخلفية شفافة عالية الدقة بضغطة واحدة.',
      icon: ImageIcon,
      badge: 'مفضل للمتاجر 🛍️',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      href: '/remove-bg',
      tags: ['إزالة الخلفية', 'إنستغرام', 'تفريغ الصور', 'PNG'],
      color: 'from-purple-600 to-pink-600',
      actionText: 'إزالة خلفية الصورة',
    },
    {
      id: 'pdf-sign',
      title: 'توقيع مستندات PDF إلكترونياً',
      description: 'ارسم توقيعك بيدك أو ارفعه وضعه على أي مستند أو عقد PDF وحمّل الملف الموقع فوراً بدون طباعة أو سكانر.',
      icon: PenTool,
      badge: 'معتمد ✍️',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      href: '/pdf-tools?tab=sign',
      tags: ['توقيع PDF', 'عقود', 'توقيع إلكتروني'],
      color: 'from-cyan-600 to-blue-600',
      actionText: 'توقيع المستند فوراً',
    },
    {
      id: 'doc-convert',
      title: 'محول المستندات والصور إلى PDF',
      description: 'حول صورك ومستنداتك إلى ملفات PDF موحدة وجاهزة للطباعة والمشاركة الرسمية بجودة عالية.',
      icon: FileCheck,
      badge: 'أدوات إضافية',
      badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
      href: '/pdf-tools',
      tags: ['تحويل الملفات', 'صور إلى PDF', 'Word'],
      color: 'from-orange-500 to-amber-600',
      actionText: 'استخدم محول الملفات',
    },
  ];

  const filteredTools = tools.filter(
    (t) =>
      t.title.includes(searchTerm) ||
      t.description.includes(searchTerm) ||
      t.tags.some((tag) => tag.includes(searchTerm))
  );

  const faqs = [
    {
      q: 'هل الأدوات مجانية حقاً؟ أم توجد رسوم خفية؟',
      a: 'نعم! جميع الأدوات الأساسية (دمج وتوقيع PDF، صانع الـ CV، وإزالة الخلفيات) مجانية تماماً وبدون أي اشتراك إجباري. كما نوفر باقة Pro للمستخدمين والشركات الراغبين في ميزات متقدمة وحجم ملفات غير محدود.',
    },
    {
      q: 'هل السيرة الذاتية (CV) مقبولة في السفارات وسوق العمل في تركيا وألمانيا والخليج؟',
      a: 'بالتأكيد، قوالب السيرة الذاتية لدينا مصممة وفق المعايير الاحترافية الحديثة (EuroPass & Modern Clean) الخالية من الأخطاء التنسيقية والتي تقرأها أنظمة تتبع المتقدمين (ATS) بدقة.',
    },
    {
      q: 'هل ملفاتي وصوري آمنة؟ هل تحفظونها على خوادمكم؟',
      a: 'أمان وخصوصية مستخدمينا هي أولويتنا رقم 1. عمليات دمج وتوقيع الـ PDF تتم بالكامل داخل متصفحك (Client-Side) عبر لغة JavaScript، مما يعني أن ملفاتك لا تخرج من جهازك إطلاقاً!',
    },
    {
      q: 'كيف يمكنني الترقية للباقة الاحترافية Pro؟',
      a: 'يمكنك التوجه لصفحة الاشتراكات واختيار الباقة المناسبة للاستفادة من مميزات تنزيل الـ CV بتنسيقات متعددة وبجودة فائقة، والتخلص من الإعلانات تماماً.',
    },
  ];

  return (
    <div className="pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-white pt-16 pb-14 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold mb-6 shadow-sm border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>المنصة الأسرع والأكثر أماناً لإنجاز معاملاتك اليومية</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight leading-tight sm:leading-snug">
            أدواتك المجانية بالعربي..{' '}
            <span className="bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              بضغطة زر وبدون تعقيد
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            أنشئ سيرتك الذاتية الجاهزة لسوق العمل، ادمج ووقع ملفات PDF، وأزل خلفيات الصور لمتجرك مباشرة في متصفحك بخصوصية كاملة 100%.
          </p>

          {/* Live Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
              <Search className="w-5 h-5 text-gray-400 mr-4" />
              <input
                type="text"
                placeholder="ابحث عن أداة (مثال: دمج PDF، سيرة ذاتية، إزالة خلفية...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pr-3 pl-4 text-sm sm:text-base text-gray-800 placeholder-gray-400 bg-transparent outline-none font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-lg"
                >
                  مسح
                </button>
              )}
            </div>
          </div>

          {/* Quick Trending Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
            <span className="font-semibold flex items-center gap-1 text-gray-700">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> الأكثر طلباً:
            </span>
            <button
              onClick={() => setSearchTerm('سيرة ذاتية')}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-gray-200 transition-colors"
            >
              CV جاهز للعمل
            </button>
            <button
              onClick={() => setSearchTerm('دمج')}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-gray-200 transition-colors"
            >
              دمج ملفات PDF
            </button>
            <button
              onClick={() => setSearchTerm('خلفية')}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-gray-200 transition-colors"
            >
              تفريغ صور المنتجات
            </button>
          </div>

        </div>
      </section>

      {/* High-CTR Ad Slot 1 */}
      <div className="max-w-5xl mx-auto px-4">
        <AdBanner slot="home-top-leaderboard" />
      </div>

      {/* Tools Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-black text-gray-900">الأدوات المتاحة</h2>
            <p className="text-sm text-gray-500 mt-1">
              اختر الأداة المطلوبة وابدأ المعالجة فوراً مجاناً
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full mt-3 sm:mt-0 w-fit">
            عرض {filteredTools.length} من {tools.length} أداة
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 font-medium">لم يتم العثور على أداة مطابقة لبحثك</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-3 text-sm text-blue-600 hover:underline font-bold"
            >
              عرض جميع الأدوات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="group relative bg-white rounded-2xl border border-gray-200/90 hover:border-blue-400 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  <div>
                    {/* Top Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${tool.badgeColor}`}
                      >
                        {tool.badge}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {tool.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] bg-gray-50 text-gray-600 font-medium px-2 py-0.5 rounded-md border border-gray-100"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={tool.href}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-blue-600 text-gray-800 hover:text-white font-bold text-sm rounded-xl transition-all group-hover:bg-blue-600 group-hover:text-white"
                  >
                    <span>{tool.actionText}</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Mid Ad Slot 2 */}
      <div className="max-w-5xl mx-auto px-4">
        <AdBanner slot="home-mid-rectangle" />
      </div>

      {/* Value Propositions / Why Us */}
      <section className="bg-white py-16 border-y border-gray-200 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-gray-950">
              لماذا يفضل مئات الآلاف استخدام منصة أدواتك؟
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              صممنا الأدوات لتكون سريعة، بديهية، ومصممة خصيصاً للمستخدم العربي بدون تعقيدات أو برامج ثقيلة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-right">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">خصوصية وأمان 100%</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                ملفاتك وصورك الحساسة لا ترفع إلى خوادم خارجية؛ تتم معالجة ملفات PDF وتعديل الصور مباشرة عبر قوة متصفحك الشخصي.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-right">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">وفر ساعات العمل والمال</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                وداعاً لدفع مبالغ طائلة لبرامج التصميم وتطبيقات PDF المعقدة. احصل على نتيجة احترافية جاهزة للطباعة فوراً وبالمجان.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-right">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">مخصصة للمستخدم العربي</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                دعم أصيل للخطوط واللغة العربية، مع نماذج سيرة ذاتية تراعي احتياجات المغتربين والباحثين عن عمل في تركيا وألمانيا والخليج.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            الأسئلة الشائعة
          </h2>
          <p className="text-gray-500 text-sm mt-1">كل ما تود معرفته عن الأدوات والاستخدام</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = faqOpen === index;
            return (
              <div
                key={index}
                className="border border-gray-200 rounded-xl bg-white overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : index)}
                  className="w-full py-4 px-5 text-right flex items-center justify-between gap-4 font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
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
