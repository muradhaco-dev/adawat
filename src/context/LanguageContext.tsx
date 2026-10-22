'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  lang: Language;
  dir: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.tools': 'الأدوات',
    'nav.cv': 'صانع الـ CV',
    'nav.pdf': 'أدوات الـ PDF',
    'nav.bg': 'إزالة الخلفية',
    'nav.pricing': 'الاشتراكات',
    'nav.contact': 'تواصل معنا',
    'nav.signin': 'تسجيل الدخول',
    'nav.account': 'حسابي',
    'nav.pro': 'باقة Pro',
    'nav.badge.trending': 'رائج',
    'nav.signout': 'تسجيل خروج',

    // Hero
    'hero.eyebrow': 'منظومة أدوات ذكية / معالجة فائقة السرعة',
    'hero.title': 'أدواتك اليومية، مصقولة بدقة وبلا وسيط',
    'hero.description': 'أنشئ سيرتك الذاتية المعتمدة دولياً، ادمج ووقع ملفات الـ PDF، وفرغ صور منتجاتك بضغطة زر داخل متصفحك مباشرة وبخصوصية مطلقة.',
    'hero.searchPlaceholder': 'ابحث عن أداة (مثال: دمج PDF، سيرة ذاتية، إزالة خلفية...)',
    'hero.quickBrowse': 'تصفح سريع:',
    'hero.instantSearch': 'بحث فوري',
    'hero.exploreTools': 'تصفح جميع الأدوات',
    'hero.cvAction': 'بدء صانع السيرة الذاتية',

    // Tools
    'tools.eyebrow': 'مكتبة الأدوات',
    'tools.title': 'الأدوات المتخصصة',
    'tools.cv.title': 'صانع السيرة الذاتية المهنية (CV)',
    'tools.cv.desc': 'سيرة ذاتية متوافقة مع أنظمة ATS ومعايير التوظيف في ألمانيا وتركيا والخليج. تصدير مباشر بصيغة PDF عالية الدقة.',
    'tools.pdf.title': 'دمج وترتيب ملفات PDF',
    'tools.pdf.desc': 'ادمج مستندات PDF متعددة في ملف واحد فائق السرعة داخل متصفحك مباشرة بدون إرسال ملفاتك لأي خادم.',
    'tools.bg.title': 'إزالة وتفريغ خلفية الصور',
    'tools.bg.desc': 'احصل على صور منتجات بخلفية شفافة PNG أو بيضاء نقية جاهزة للنشر على إنستغرام والمتاجر الإلكترونية بضغطة واحدة.',
    'tools.sign.title': 'توقيع العقود والمستندات إلكترونياً',
    'tools.sign.desc': 'ارسم توقيعك بيدك على شاشة اللمس أو الماوس وثبته مباشرة على أوراقك وعقود الـ PDF وحملها فوراً.',
    'tools.convert.title': 'محول المستندات والصور إلى PDF',
    'tools.convert.desc': 'تحويل الصور والوثائق إلى ملفات PDF موحدة ومنسقة للطباعة أو الإرسال الرسمي.',

    // Stats
    'stats.privacy': '100%',
    'stats.privacy.label': 'خصوصية وأمان محلي',
    'stats.privacy.sub': 'معالجة الملفات في ذاكرة متصفحك دون رفعها لأي خادم خارجي',
    'stats.speed': '< 1s',
    'stats.speed.label': 'دمج PDF والـ CV',
    'stats.speed.sub': 'دمج الملفات وإنشاء السيرة الذاتية يتمّ في أقل من ثانية — إزالة الخلفية تستغرق ثوانٍ للتحميل الأول',
    'stats.free': '0$',
    'stats.free.label': 'الأدوات الأساسية مجانية',
    'stats.free.sub': 'دمج PDF، التوقيع، وإزالة الخلفية مجانية — Pro يوفر سعة غير محدودة وبلا إعلانات',

    // Footer
    'footer.brandDesc': 'منصة الأدوات اليومية السريعة. معالجة المستندات، تفريغ الصور للمتاجر، وتوليد السير الذاتية المهنية.',
    'footer.toolsHeader': 'الأدوات',
    'footer.accountHeader': 'الاشتراك والحساب',
    'footer.devHeader': 'المطور والإدارة',
    'footer.devName': 'المبرمج محمد حجو (HACCO)',
    'footer.devDesc': 'تطوير وبرمجة وتصميم المنصة',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.devCredit': 'تطوير وبرمجة:',
    'footer.privacy': 'سياسة الخصوصية',

    // Floating Pill
    'floating.dev': 'المبرمج محمد حجو (HACCO)',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.tools': 'Tools',
    'nav.cv': 'CV Builder',
    'nav.pdf': 'PDF Tools',
    'nav.bg': 'Remove BG',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact Us',
    'nav.signin': 'Sign in',
    'nav.account': 'My Account',
    'nav.pro': 'Pro Plan',
    'nav.badge.trending': 'Popular',
    'nav.signout': 'Sign out',

    // Hero
    'hero.eyebrow': 'SMART UTILITY SUITE / ULTRA FAST EXECUTION',
    'hero.title': 'Everyday tools, refined with absolute precision',
    'hero.description': 'Build ATS-compliant resumes, merge and sign PDFs, and extract product backgrounds in one click inside your browser with complete privacy.',
    'hero.searchPlaceholder': 'Search tools (e.g. Merge PDF, Resume, Background removal...)',
    'hero.quickBrowse': 'Quick access:',
    'hero.instantSearch': 'Instant search',
    'hero.exploreTools': 'Explore All Tools',
    'hero.cvAction': 'Build ATS Resume',

    // Tools
    'tools.eyebrow': 'UTILITY SUITE',
    'tools.title': 'Specialized Tools',
    'tools.cv.title': 'Professional Resume Builder (CV)',
    'tools.cv.desc': 'ATS-compliant resume generator aligned with European, Turkish, and GCC job market standards with instant PDF export.',
    'tools.pdf.title': 'Merge & Organize PDF Files',
    'tools.pdf.desc': 'Merge multiple PDF documents into a single organized file right in your browser without uploading to any server.',
    'tools.bg.title': 'Background Remover & Isolation',
    'tools.bg.desc': 'Get clean transparent PNG or crisp white product cutouts ready for Instagram, Shopify, and Amazon in one click.',
    'tools.sign.title': 'Sign PDF Contracts Electronically',
    'tools.sign.desc': 'Draw your signature on touchscreens or with your mouse, place it on any document, and download immediately.',
    'tools.convert.title': 'Document & Image to PDF Converter',
    'tools.convert.desc': 'Convert photos, scans, and documents into unified, print-ready PDF files.',

    // Stats
    'stats.privacy': '100%',
    'stats.privacy.label': 'In-Browser Privacy',
    'stats.privacy.sub': 'All file processing happens inside your browser — nothing is uploaded to any server',
    'stats.speed': '< 1s',
    'stats.speed.label': 'PDF Merge & CV Speed',
    'stats.speed.sub': 'PDF merging and resume generation complete in under a second — BG removal takes a few seconds on first load',
    'stats.free': '$0',
    'stats.free.label': 'Core Tools Are Free',
    'stats.free.sub': 'Merge, sign, remove BG — all free. Pro adds unlimited usage and ad-free experience',

    // Footer
    'footer.brandDesc': 'Fast everyday digital utilities. Document manipulation, product photo isolation, and professional resume building.',
    'footer.toolsHeader': 'Utilities',
    'footer.accountHeader': 'Account & Plans',
    'footer.devHeader': 'Developer & Admin',
    'footer.devName': 'Mohamed Hacco (HACCO)',
    'footer.devDesc': 'Platform engineering & architecture',
    'footer.rights': 'All rights reserved.',
    'footer.devCredit': 'Developed by:',
    'footer.privacy': 'Privacy Policy',

    // Floating Pill
    'floating.dev': 'Developer: Mohamed Hacco (HACCO)',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  dir: 'rtl',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('adawat_lang') as Language | null;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLangState(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('adawat_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  };

  const dir: 'rtl' | 'ltr' = lang === 'ar' ? 'rtl' : 'ltr';

  const t = (key: string): string => {
    return translations[lang][key] || translations.ar[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
