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
  ShieldCheck, 
  FileCheck,
  Sparkles,
  Sliders,
  QrCode,
  Lock
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { useLanguage } from '@/context/LanguageContext';

export default function ToolsCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { t, lang } = useLanguage();

  const tools = [
    {
      id: 'cv-builder',
      title: t('tools.cv.title'),
      description: t('tools.cv.desc'),
      category: lang === 'ar' ? 'التوظيف والمهن' : 'Careers',
      categoryKey: 'careers',
      icon: FileText,
      badge: lang === 'ar' ? 'الأكثر طلباً' : 'Popular',
      href: '/cv-builder',
      tags: ['سيرة ذاتية', 'CV', 'Resume', 'Jobs', 'ATS', 'وظيفة', 'عمل'],
      actionText: lang === 'ar' ? 'بدء إنشاء السيرة' : 'Build Resume',
    },
    {
      id: 'pdf-merge',
      title: t('tools.pdf.title'),
      description: t('tools.pdf.desc'),
      category: lang === 'ar' ? 'المستندات' : 'Documents',
      categoryKey: 'documents',
      icon: Layers,
      badge: lang === 'ar' ? 'معالجة محلية' : 'Local Engine',
      href: '/pdf-tools',
      tags: ['PDF', 'Merge', 'دمج PDF', 'ترتيب الصفحات', 'مستندات'],
      actionText: lang === 'ar' ? 'دمج الملفات الآن' : 'Merge Files',
    },
    {
      id: 'pdf-sign',
      title: t('tools.sign.title'),
      description: t('tools.sign.desc'),
      category: lang === 'ar' ? 'المستندات' : 'Documents',
      categoryKey: 'documents',
      icon: PenTool,
      badge: lang === 'ar' ? 'توقيع سريع' : 'Instant Sign',
      href: '/pdf-tools?tab=sign',
      tags: ['Sign', 'توقيع', 'عقود', 'استمارات', 'إلكتروني'],
      actionText: lang === 'ar' ? 'توقيع المستند' : 'Sign PDF',
    },
    {
      id: 'remove-bg',
      title: t('tools.bg.title'),
      description: t('tools.bg.desc'),
      category: lang === 'ar' ? 'التجارة والتصميم' : 'E-Commerce',
      categoryKey: 'design',
      icon: ImageIcon,
      badge: lang === 'ar' ? 'ذكاء اصطناعي' : 'AI Engine',
      href: '/remove-bg',
      tags: ['Background', 'PNG', 'تفريغ الصور', 'عزل خلفية', 'منتجات', 'متجر', 'AI'],
      actionText: lang === 'ar' ? 'تفريغ الصورة' : 'Remove Background',
    },
    {
      id: 'qr-code',
      title: t('tools.qr.title'),
      description: t('tools.qr.desc'),
      category: lang === 'ar' ? 'التسويق والمتاجر' : 'Marketing & QR',
      categoryKey: 'qr',
      icon: QrCode,
      badge: lang === 'ar' ? 'جديد' : 'New',
      href: '/qr-code',
      tags: ['QR', 'كود QR', 'باركود', 'روابط', 'صور', 'واتساب', 'لوجو', 'Barcode'],
      actionText: lang === 'ar' ? 'صنع كود QR' : 'Create QR Code',
    },
    {
      id: 'doc-convert',
      title: t('tools.convert.title'),
      description: t('tools.convert.desc'),
      category: lang === 'ar' ? 'التحويل' : 'Converter',
      categoryKey: 'converter',
      icon: FileCheck,
      badge: lang === 'ar' ? 'صور إلى PDF' : 'Utility',
      href: '/pdf-tools?tab=convert',
      tags: ['Convert', 'تحويل', 'صور', 'JPG', 'PNG', 'PDF'],
      actionText: lang === 'ar' ? 'تحويل الصور إلى PDF' : 'Convert Images',
    },
  ];

  const categories = [
    { key: 'all', label: lang === 'ar' ? 'كافة الأدوات' : 'All Tools' },
    { key: 'documents', label: lang === 'ar' ? 'المستندات والـ PDF' : 'PDF & Documents' },
    { key: 'careers', label: lang === 'ar' ? 'التوظيف والسيرة الذاتية' : 'Careers & CV' },
    { key: 'design', label: lang === 'ar' ? 'تفريغ الصور' : 'Background Removal' },
    { key: 'qr', label: lang === 'ar' ? 'أكواد QR والتسويق' : 'QR & Marketing' },
    { key: 'converter', label: lang === 'ar' ? 'التحويل والمساعدات' : 'Converters' },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || tool.categoryKey === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative">
      
      {/* Header */}
      <div className="text-center w-full max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>{lang === 'ar' ? 'مكتبة الأدوات الشاملة' : 'SPECIALIZED UTILITY SUITE'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          {lang === 'ar' ? 'جميع الأدوات المتاحة' : 'All Digital Tools'}
        </h1>
        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          {lang === 'ar'
            ? 'مجموعة متكاملة من الأدوات السريعة المصممة لتسهيل عملك اليومي: دمج وتوقيع المستندات، تفريغ الصور، وبناء السير الذاتية بدون تعقيد وبأعلى خصوصية.'
            : 'A refined suite of browser-native digital utilities engineered for zero-latency document workflows, background extractions, and career documents.'}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121317] border border-[#2e3038] text-[11px] font-mono text-[#cc9166]">
          <Lock className="w-3 h-3 text-[#cc9166]" />
          <span>{lang === 'ar' ? 'يتطلب استخدام أي أداة تسجيل الدخول لحفظ ملفاتك ونتائجك' : 'Sign in is required to use tools and save your progress'}</span>
        </div>

        {/* Search Bar */}
        <div className="mt-8 w-full max-w-xl mx-auto">
          <div className="relative flex items-center w-full rounded-full bg-[#040406] border border-[#2e3038] focus-within:border-[#ffffff] transition-colors p-1.5 shadow-sm">
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
                className="text-xs text-[#9194a1] hover:text-[#ffffff] px-3 py-1 font-mono shrink-0"
              >
                {lang === 'ar' ? 'مسح' : 'Clear'}
              </button>
            ) : (
              <span className="text-[11px] text-[#5e616e] font-mono px-3 hidden sm:inline shrink-0">
                {t('hero.instantSearch')}
              </span>
            )}
          </div>
        </div>

        {/* Category Pill Switcher */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 w-full">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat.key
                  ? 'bg-[#ffffff] text-[#000000] font-semibold'
                  : 'bg-[#040406] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] border border-[#1c1d22]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Section & Layout */}
      <section className="w-full mb-16 sm:mb-20 relative">
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 border-b border-[#1c1d22] w-full">
          <span className="text-xs font-mono uppercase text-[#cc9166]">
            {lang === 'ar' ? 'الأدوات المتوفرة' : 'Available Utilities'}
          </span>
          <span className="text-xs font-mono text-[#5e616e]">
            {filteredTools.length} / {tools.length}
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="w-full text-center py-16 sm:py-20 bg-[#040406] rounded-[10px] border border-[#1c1d22]">
            <p className="text-sm text-[#9194a1]">
              {lang === 'ar' ? 'لم يتم العثور على أداة مطابقة لبحثك' : 'No tools matched your criteria'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-3 text-xs text-[#cc9166] hover:underline font-mono"
            >
              {lang === 'ar' ? 'إعادة ضبط البحث والتصنيف' : 'Reset filters'}
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="group w-full relative bg-[#040406] rounded-[10px] border border-[#1c1d22] hover:border-[#2e3038] p-5 sm:p-6 flex flex-col justify-between transition-colors min-w-0"
                >
                  <div>
                    {/* Header: Category & Badge */}
                    <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#121317] border border-[#1c1d22] flex items-center justify-center text-[#e2e3e9] shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#cc9166] truncate">
                          {tool.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#9194a1] border border-[#2e3038] px-2 py-0.5 rounded-full font-mono shrink-0">
                        {tool.badge}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base sm:text-lg font-medium text-[#ffffff] mb-2 leading-snug group-hover:text-[#cc9166] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-[#9194a1] leading-relaxed mb-6">
                      {tool.description}
                    </p>
                  </div>

                  {/* Action Link: Pill Shape */}
                  <Link
                    href={tool.href}
                    className="w-full relative flex items-center justify-between py-2.5 px-4 bg-[#121317] hover:bg-[#ffffff] text-[#e2e3e9] hover:text-[#000000] text-xs font-medium rounded-full border border-[#1c1d22] hover:border-[#ffffff] transition-all group-hover:border-[#2e3038] shrink-0"
                  >
                    <span>{tool.actionText}</span>
                    <ArrowLeft className={`w-3.5 h-3.5 shrink-0 ${lang === 'en' ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Local Privacy Trust Strip */}
      <div className="w-full p-5 sm:p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22] flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 relative">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-medium text-[#ffffff]">
              {lang === 'ar' ? 'معالجة محلية 100% داخل المتصفح' : '100% Client-Side Local Execution'}
            </h4>
            <p className="text-[11px] text-[#9194a1] mt-0.5">
              {lang === 'ar'
                ? 'ملفاتك وصورك لا تغادر جهازك نهائياً وتُعالج بالكامل في الذاكرة المؤقتة لمتصفحك.'
                : 'Files and images remain solely on your device and are never transmitted to cloud servers.'}
            </p>
          </div>
        </div>

        <Link
          href="/privacy"
          className="text-xs font-mono text-[#cc9166] hover:underline shrink-0"
        >
          {lang === 'ar' ? 'قراءة سياسة الخصوصية ←' : 'Read Privacy Policy →'}
        </Link>
      </div>

      {/* Ad slot: Bottom */}
      <div className="w-full mt-8 relative">
        <AdBanner slot="tools-catalog-bottom" />
      </div>

    </div>
  );
}
