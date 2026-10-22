'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Cpu, 
  Cookie, 
  CheckCircle2, 
  ArrowLeft,
  Mail,
  FileText,
  UserCheck,
  Sparkles,
  ServerOff,
  Scale
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('local-processing');

  const sections = [
    {
      id: 'local-processing',
      num: '01',
      title: lang === 'ar' ? 'المعالجة المحلية الكاملة (Client-Side Architecture)' : 'In-Browser Local Processing',
      badge: lang === 'ar' ? 'المبدأ الأساسي' : 'Core Architecture',
      content: lang === 'ar' ? [
        'تعمل جميع أدوات المنصة (دمج وترتيب ملفات PDF، التوقيع الإلكتروني على العقود، عزل خلفيات الصور بالذكاء الاصطناعي، وتوليد رموز الاستجابة السريعة QR) وفق معمارية المعالجة المحلية الخالصة (Client-Side Processing).',
        'عند قيامك برفع أو اختيار أي ملف أو صورة أو مستند، تتم قراءته وتحويله ومعالجته بالكامل داخل الذاكرة المؤقتة (RAM) لمتصفحك الشخصي عبر تقنيات حديثة مثل WebAssembly ومكتبات Web Canvas.',
        'ملفاتك وصورك لا يتم إرسالها أو نقلها أو رفعها إلى أي خوادم سحابية خارجية نهائياً. بمجرد إغلاق صفحة الأداة أو تحديث المتصفح، تُحذف جميع البيانات المعالجة تلقائياً من ذاكرة جهازك.',
      ] : [
        'All platform utilities (PDF merging and manipulation, electronic contract signing, AI background isolation, and QR code generation) run on a local-first client-side architecture.',
        'When you select or upload documents, images, or assets, they are read and transformed entirely inside your device RAM through modern WebAssembly and Canvas APIs.',
        'Binary data and original files never leave your device. Once you finish downloading or close your browser tab, all temporary memory objects are instantly wiped.',
      ]
    },
    {
      id: 'auth-data',
      num: '02',
      title: lang === 'ar' ? 'بيانات الحساب وتسجيل الدخول الإلزامي' : 'User Accounts & Authentication Data',
      badge: lang === 'ar' ? 'بيانات الحساب' : 'Account Security',
      content: lang === 'ar' ? [
        'تتطلب المنصة تسجيل الدخول أو إنشاء حساب مجاني قبل استخدام الأدوات، وذلك لأسباب أمنية بحتة تضمن حفظ مسودات السيرة الذاتية (CV) الخاصة بك، وتنظيم صلاحيات استخدام الأدوات، ومنع هجمات الاستغلال الآلي (Anti-Abuse).',
        'البيانات التي نجمعها عند تسجيل الدخول تقتصر على: الاسم الكامل، البريد الإلكتروني، وتاريخ إنشاء الحساب.',
        'في حال استخدام الدخول السريع عبر Google OAuth، لا نطلب أي صلاحيات إضافية تتجاوز التحقق من هويتك وبريدك الأساسي.',
        'لا نطلب ولا نقوم بتخزين أي بيانات بطاقات ائتمانية أو معلومات دفع مصرفية على خوادمنا.',
      ] : [
        'Account registration is required prior to using the suite to protect access, maintain your saved resume drafts, and safeguard against automated bot abuse.',
        'The only user details collected upon registration are your full name, email address, and account creation timestamp.',
        'When utilizing Google OAuth one-click authentication, we only request standard identity confirmation and basic email profile access.',
        'We never store, capture, or process payment card details or private banking credentials on our infrastructure.',
      ]
    },
    {
      id: 'ai-privacy',
      num: '03',
      title: lang === 'ar' ? 'خصوصية أدوات الذكاء الاصطناعي وصانع الـ CV' : 'AI Utilities & Resume Privacy',
      badge: lang === 'ar' ? 'الذكاء الاصطناعي' : 'AI Ethics',
      content: lang === 'ar' ? [
        'تعتمد أدوات الذكاء الاصطناعي في المنصة (عزل الخلفيات وصانع السيرة الذاتية الذكي) على نماذج معالجة محلية داخل المتصفح، مما يعني أن معلوماتك الشخصية وخبراتك لا تُستخدم لتدريب نماذج ذكاء اصطناعي عامة.',
        'عند صياغة سيرتك الذاتية وتوليد الإنجازات والمهارات، يتم بناء وتنسيق البيانات لحظياً في حسابك فقط، ولن يطّلع عليها أي طرف ثالث.',
        'يحق لك حفظ مسودات سيرتك الذاتية في قاعدة بيانات مشفرة تحت معرف حسابك في Supabase، كما يحق لك تعديلها أو حذفها نهائياً بضغطة زر واحدة في أي وقت من لوحة حسابك.',
      ] : [
        'AI features on the platform (deep background cutout and the AI CV resume builder) operate locally without leaking your confidential career details into public training corpuses.',
        'When formulating career achievements or skills, synthesis occurs in your isolated session and remains visible solely to you.',
        'You have full control to save your resume drafts to your private encrypted Supabase database row, and you can modify or permanently delete them with a single click at any time.',
      ]
    },
    {
      id: 'cookies-ads',
      num: '04',
      title: lang === 'ar' ? 'ملفات تعريف الارتباط (Cookies) وإعلانات Google' : 'Cookies & Advertising Policy',
      badge: lang === 'ar' ? 'الشفافية' : 'Transparency',
      content: lang === 'ar' ? [
        'نستخدم ملفات تعريف الارتباط الأساسية (Essential Cookies) فقط لغرض الحفاظ على جلسة تسجيل الدخول وتفضيل اللغة المختارة (العربية أو الإنجليزية).',
        'قد يعرض الموقع مساحات إعلانية عبر شبكة إعلانات Google المعتمدة للمستخدمين في الباقة المجانية، للمساهمة في تغطية تكاليف الخوادم وتوفير الأدوات مجاناً للجميع.',
        'تلتزم الإعلانات بسياسات الخصوصية الدولية ويمكنك تخصيص أو تعطيل الإعلانات الموجهة عبر إعدادات حساب Google الخاص بك أو تفضيلات المتصفح.',
        'مشتركو باقة Pro يتمتعون بتجربة خالية تماماً من أي إعلانات أو ملفات تتبع إعلانية.',
      ] : [
        'We employ minimal first-party cookies strictly to remember your active authenticated session and language preference (Arabic or English).',
        'To sustain free access to core tools, non-intrusive advertisements served through Google may be rendered to users on the free tier.',
        'Google ads adhere to international privacy standards. You can configure or disable personalized ad profiles in your Google Account settings.',
        'Pro subscribers enjoy a 100% ad-free experience with zero promotional script evaluation.',
      ]
    },
    {
      id: 'user-rights',
      num: '05',
      title: lang === 'ar' ? 'حقوق المستخدم والتحكم الكامل في البيانات (GDPR)' : 'User Rights & GDPR Compliance',
      badge: lang === 'ar' ? 'حقوقك القانونية' : 'Legal Rights',
      content: lang === 'ar' ? [
        'حق الوصول والاطلاع: يمكنك في أي لحظة الاطلاع على جميع البيانات المرتبطة بحسابك من خلال صفحة "حسابي".',
        'حق التعديل والتصحيح: يمكنك تعديل اسمك وكلمة مرورك وسيرتك الذاتية المحفوظة في أي وقت.',
        'حق الحذف والنسيان (Right to be Forgotten): يمكنك حذف أي سيرة ذاتية مسجلة فوراً، أو مراسلتنا لإغلاق حسابك ومسح كافة سجلاتك نهائياً.',
        'عدم البيع أو المشاركة: نلتزم بشكل قاطع وصارم بعدم بيع، تأجير، أو مشاركة بياناتك الشخصية مع أي شركات تسويق أو أطراف وسيطة تحت أي ظرف.',
      ] : [
        'Right to Access: You can inspect all data stored under your account profile at any time through your Account page.',
        'Right to Rectification: You can update your identity, credentials, and saved resume drafts instantly.',
        'Right to Erasure: You have the right to permanently delete saved resumes, or request full account termination and database purge.',
        'Zero Data Sale Guarantee: We strictly promise never to sell, rent, or lease your private personal details to third-party data brokers.',
      ]
    },
    {
      id: 'security-measures',
      num: '06',
      title: lang === 'ar' ? 'معايير التشفير والأمان التقني' : 'Security Standards & Infrastructure',
      badge: lang === 'ar' ? 'الحماية والأمان' : 'Infra Security',
      content: lang === 'ar' ? [
        'يتم تشفير جميع حركات المرور والبيانات المنقولة بواسطة بروتوكول التشفير الفائق HTTPS / TLS 1.3 مع شهادات أمان معتمدة عالمياً.',
        'إدارة جلسات المصادقة وقواعد البيانات محمية بتشفير متقدم على خوادم Supabase المتوافقة مع معايير SOC2 و ISO27001 الدولية.',
        'المعالجة المحلية تعني أنه حتى في حال حدوث أي انقطاع في الاتصال، فإن ملفاتك المفتوحة لا تتعرض لأي خطر تسريب لأنها لا تُرسل للخارج أصلاً.',
      ] : [
        'All client-server web communications are strictly fortified via HTTPS / TLS 1.3 protocol with validated certificates.',
        'User credentials and authentication states are guarded by Supabase infrastructure compliant with SOC2 and ISO27001 standards.',
        'Local processing architecture guarantees that even during network disruptions, your opened files are immune to intercept leaks as they never traverse the network.',
      ]
    },
  ];

  return (
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>{lang === 'ar' ? 'الشفافية والأمان والخصوصية 100%' : '100% TRANSPARENCY & PRIVACY'}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          {lang === 'ar' ? 'وثيقة سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy'}
        </h1>
        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          {lang === 'ar'
            ? 'نحن نؤمن بأن مستنداتك وملفاتك وسيرتك الذاتية تخصك وحدك. توضح هذه الوثيقة بوضوح تام كيف تحمي منصة "أدواتك" خصوصيتك عبر مبدأ المعالجة المحلية الخالصة.'
            : 'We believe your documents, files, and professional resumes belong strictly to you. This policy clarifies how ADAWAT protects your privacy through local-first processing.'}
        </p>
        <div className="flex items-center justify-center gap-3 mt-4 text-[11px] font-mono text-[#5e616e]">
          <span>{lang === 'ar' ? 'الإصدار المعتمد 2.4' : 'Version 2.4'}</span>
          <span>•</span>
          <span>{lang === 'ar' ? 'آخر تحديث: أكتوبر 2026' : 'Last Updated: October 2026'}</span>
        </div>
      </div>

      {/* Trust Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
        <div className="p-6 rounded-[12px] bg-[#040406] border border-[#1c1d22]">
          <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
            <ServerOff className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-medium text-[#ffffff] mb-2">
            {lang === 'ar' ? 'صفر رفع إلى السيرفر' : 'Zero Cloud Upload'}
          </h3>
          <p className="text-xs text-[#9194a1] leading-relaxed">
            {lang === 'ar'
              ? 'ملفات الـ PDF وصور المنتجات تُعالج محلياً في ذاكرة متصفحك ولا تُرسل لأي خادم خارجي.'
              : 'PDF documents and product photos are processed locally inside browser RAM and never transferred across the wire.'}
          </p>
        </div>

        <div className="p-6 rounded-[12px] bg-[#040406] border border-[#1c1d22]">
          <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-medium text-[#ffffff] mb-2">
            {lang === 'ar' ? 'تشفير تام وشامل' : 'End-to-End Encryption'}
          </h3>
          <p className="text-xs text-[#9194a1] leading-relaxed">
            {lang === 'ar'
              ? 'الاتصال مؤمن ببروتوكول TLS 1.3 مع حماية مشفرة لبيانات الحساب وقواعد البيانات.'
              : 'Every session is shielded by TLS 1.3 protocols, paired with encrypted account stores.'}
          </p>
        </div>

        <div className="p-6 rounded-[12px] bg-[#040406] border border-[#1c1d22]">
          <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-medium text-[#ffffff] mb-2">
            {lang === 'ar' ? 'حقوق تحكم كاملة' : 'Complete Data Control'}
          </h3>
          <p className="text-xs text-[#9194a1] leading-relaxed">
            {lang === 'ar'
              ? 'أنت المتحكم الوحيد بسيرتك الذاتية وبياناتك، مع حق التعديل أو الحذف الفوري بضغطة زر.'
              : 'You retain sole ownership of your resumes and details, with one-click deletion and export.'}
          </p>
        </div>
      </div>

      {/* Main Content Layout with Sidebar Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
        
        {/* Table of Contents Sticky Nav (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-2 bg-[#040406] p-4 rounded-[12px] border border-[#1c1d22]">
          <span className="text-[11px] font-mono uppercase text-[#cc9166] px-3 py-1 block">
            {lang === 'ar' ? 'فهرس بنود السياسة' : 'POLICY SECTIONS'}
          </span>
          <nav className="space-y-1">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-start flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                  activeSection === sec.id
                    ? 'bg-[#121317] text-[#ffffff] font-medium border border-[#2e3038]'
                    : 'text-[#9194a1] hover:text-[#ffffff] hover:bg-[#121317]'
                }`}
              >
                <span className="text-[10px] font-mono text-[#cc9166]">{sec.num}</span>
                <span className="truncate">{sec.title}</span>
              </a>
            ))}
          </nav>

          <div className="pt-3 mt-3 border-t border-[#1c1d22] px-2 text-[11px] text-[#5e616e]">
            {lang === 'ar' ? 'إشراف وتطوير المبرمج محمد حجو (HACCO)' : 'Engineered by Mohamed Hacco (HACCO)'}
          </div>
        </div>

        {/* Detailed Policy Articles (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {sections.map((sec) => (
            <div
              key={sec.id}
              id={sec.id}
              className="bg-[#040406] p-6 sm:p-8 rounded-[12px] border border-[#1c1d22] hover:border-[#2e3038] transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#cc9166] px-2 py-0.5 rounded bg-[#121317] border border-[#2e3038]">
                    {sec.num}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#9194a1]">
                    {sec.badge}
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif text-[#ffffff] mb-4">
                {sec.title}
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-[#9194a1] leading-relaxed">
                {sec.content.map((p, idx) => (
                  <p key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cc9166] shrink-0 mt-2" />
                    <span>{p}</span>
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* Contact & DPO Card */}
          <div className="p-8 rounded-[12px] bg-[#040406] border border-[#cc9166]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-mono uppercase text-[#cc9166] block mb-1">
                {lang === 'ar' ? 'مسؤول حماية البيانات والإدارة' : 'DATA PROTECTION OFFICER'}
              </span>
              <h3 className="text-lg font-medium text-[#ffffff]">
                {lang === 'ar' ? 'هل لديك أي استفسار أو طلب حذف لبياناتك؟' : 'Have privacy questions or erasure requests?'}
              </h3>
              <p className="text-xs text-[#9194a1] mt-1">
                {lang === 'ar'
                  ? 'يمكنك التواصل المباشر مع المبرمج محمد حجو عبر صفحة اتصل بنا لمعالجة أي طلب فوري.'
                  : 'Contact lead developer Mohamed Hacco directly via our contact portal for expedited handling.'}
              </p>
            </div>

            <Link
              href="/contact"
              className="px-6 py-3 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold rounded-full transition-all flex items-center gap-2 shrink-0 active:scale-95 shadow-md"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مراسلة الإدارة الآن' : 'Contact Support'}</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
