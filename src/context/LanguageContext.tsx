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
    'stats.privacy.sub': 'معالجة الملفات في ذاكرة جهازك دون رفعها لخوادم',
    'stats.speed': '< 1s',
    'stats.speed.label': 'سرعة المعالجة',
    'stats.speed.sub': 'تنفيذ فوري وتحميل مباشر بدون طوابير انتظار',
    'stats.free': '0$',
    'stats.free.label': 'أدوات مجانية للأبد',
    'stats.free.sub': 'خدمات أساسية متكاملة لجميع المستخدمين',

    // Footer
    'footer.brandDesc': 'منصة الأدوات اليومية السريعة. معالجة المستندات، تفريغ الصور للمتاجر، وتوليد السير الذاتية المهنية.',
    'footer.toolsHeader': 'الأدوات',
    'footer.accountHeader': 'الاشتراك والحساب',
    'footer.devHeader': 'المطور والإدارة',
    'footer.devName': 'المبرمج محمد حجو (HACCO)',
    'footer.devDesc': 'تطوير وبرمجة وتصميم المنصة',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.devCredit': 'تطوير وبرمجة:',

    // Floating Pill
    'floating.dev': 'المبرمج محمد حجو (HACCO)',

    // Auth & Verification
    'auth.verify.title': 'تحقق من بريدك الإلكتروني',
    'auth.verify.desc': 'أرسلنا رسالة تحتوي على رابط لتأكيد وتفعيل حسابك إلى:',
    'auth.verify.instruction': 'يرجى فتح بريدك والضغط على الرابط لتأكيد الحساب والبدء في استخدام أدواتك.',
    'auth.verify.spam': 'إذا لم تجد الرسالة في صندوق الوارد، يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam / Junk) أو الرسائل الترويجية.',
    'auth.verify.openGmail': 'فتح بريد Gmail الآن ↗',
    'auth.verify.resend': 'إعادة إرسال رسالة التأكيد',
    'auth.verify.resendSuccess': 'تم إرسال رابط تأكيد جديد إلى بريدك بنجاح!',
    'auth.verify.backToSignin': 'العودة لتسجيل الدخول',
    'auth.error.unconfirmed': 'لم يتم تفعيل هذا الحساب بعد! يرجى فتح رسائل بريدك والضغط على رابط التفعيل.',
    'auth.error.disposable': 'عذراً، غير مسموح باستخدام البريد الإلكتروني المؤقت أو الوهمي. يرجى استخدام بريد حقيقي (مثل Gmail أو Outlook).',
    'auth.error.alreadyRegistered': 'هذا البريد مسجل مسبقاً! يرجى تسجيل الدخول بدلاً من ذلك.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
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
    'stats.privacy.label': 'Local Privacy & Security',
    'stats.privacy.sub': 'In-browser memory processing without third-party servers',
    'stats.speed': '< 1s',
    'stats.speed.label': 'Execution Latency',
    'stats.speed.sub': 'Instant local execution without queue waiting times',
    'stats.free': '$0',
    'stats.free.label': 'Free Forever Core Suite',
    'stats.free.sub': 'Essential everyday utilities for all users',

    // Footer
    'footer.brandDesc': 'Fast everyday digital utilities. Document manipulation, product photo isolation, and professional resume building.',
    'footer.toolsHeader': 'Utilities',
    'footer.accountHeader': 'Account & Plans',
    'footer.devHeader': 'Developer & Admin',
    'footer.devName': 'Mohamed Hacco (HACCO)',
    'footer.devDesc': 'Platform engineering & architecture',
    'footer.rights': 'All rights reserved.',
    'footer.devCredit': 'Developed by:',

    // Floating Pill
    'floating.dev': 'Developer: Mohamed Hacco (HACCO)',

    // Auth & Verification
    'auth.verify.title': 'Verify your email address',
    'auth.verify.desc': 'We sent a confirmation link to your email:',
    'auth.verify.instruction': 'Please open your inbox and click the verification link to activate your account and access tools.',
    'auth.verify.spam': 'If you do not see the email, please check your Spam, Junk, or Promotions folder.',
    'auth.verify.openGmail': 'Open Gmail ↗',
    'auth.verify.resend': 'Resend confirmation email',
    'auth.verify.resendSuccess': 'A new confirmation link was sent to your email!',
    'auth.verify.backToSignin': 'Back to sign in',
    'auth.error.unconfirmed': 'This account has not been verified yet! Please check your inbox and click the activation link.',
    'auth.error.disposable': 'Disposable or temporary email addresses are not permitted. Please use a valid email (e.g. Gmail or Outlook).',
    'auth.error.alreadyRegistered': 'This email is already registered! Please sign in instead.',
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
