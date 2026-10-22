'use client';

import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Cpu, 
  Cookie, 
  CheckCircle2, 
  ArrowLeft,
  Mail
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { lang } = useLanguage();

  return (
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>{lang === 'ar' ? 'الخصوصية والأمان أولاً' : 'Privacy & Security First'}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          {lang === 'ar' ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy'}
        </h1>
        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          {lang === 'ar'
            ? 'نحن نؤمن بأن بياناتك وملفاتك تخصك وحدك. صُممت منصة أدواتك لتعمل بمبدأ المعالجة المحلية الكاملة دون تخزين أو مراقبة لأي ملفات.'
            : 'We believe your files and personal data belong exclusively to you. ADAWAT is engineered on a local-first architecture without central server storage.'}
        </p>
        <span className="text-[11px] font-mono text-[#5e616e] mt-3 inline-block">
          {lang === 'ar' ? 'آخر تحديث: أكتوبر 2026' : 'Last Updated: October 2026'}
        </span>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
        <div className="p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
          <div className="w-9 h-9 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-[#ffffff] mb-2">
            {lang === 'ar' ? 'معالجة محلية 100%' : '100% In-Browser Engine'}
          </h3>
          <p className="text-xs text-[#9194a1] leading-relaxed">
            {lang === 'ar'
              ? 'تتم عمليات دمج وتوقيع ملفات PDF وتفريغ الصور داخل ذاكرة متصفحك (RAM) عبر تقنيات WebAssembly وCanvas دون رفعها إلى أي سيرفر.'
              : 'PDF merging, signing, and background cutouts occur strictly inside your device browser memory via client-side WebAssembly.'}
          </p>
        </div>

        <div className="p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
          <div className="w-9 h-9 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-[#ffffff] mb-2">
            {lang === 'ar' ? 'صفر سجلات للملفات' : 'Zero File Logging'}
          </h3>
          <p className="text-xs text-[#9194a1] leading-relaxed">
            {lang === 'ar'
              ? 'لا نملك الوصول إلى مستنداتك أو صورك، ولا يتم تخزين أي نسخة احتياطية من الملفات المعالجة على أي قاعدة بيانات.'
              : 'We have zero access to your uploaded files. No temporary or persistent copies of your processed assets are retained.'}
          </p>
        </div>

        <div className="p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
          <div className="w-9 h-9 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mb-4">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-medium text-[#ffffff] mb-2">
            {lang === 'ar' ? 'أمان التشفير والاتصال' : 'Encrypted Transit'}
          </h3>
          <p className="text-xs text-[#9194a1] leading-relaxed">
            {lang === 'ar'
              ? 'كافة الاتصالات مشفرة ببروتوكول HTTPS/TLS 1.3 القياسي، ونظام الحسابات الاختياري محمي بواسطة منصة Supabase المشفرة.'
              : 'All web traffic is encrypted under HTTPS/TLS 1.3. User authentication is managed securely by Supabase infrastructure.'}
          </p>
        </div>
      </div>

      {/* Policy Articles */}
      <div className="max-w-4xl mx-auto space-y-8 bg-[#040406] p-8 sm:p-12 rounded-[10px] border border-[#1c1d22]">
        
        {/* Section 1 */}
        <div className="space-y-3 pb-8 border-b border-[#1c1d22]">
          <span className="text-[11px] font-mono uppercase text-[#cc9166]">
            {lang === 'ar' ? 'المادة 01 / طبيعة الملفات والمستندات' : 'Article 01 / File Handling'}
          </span>
          <h2 className="text-xl font-serif text-[#ffffff]">
            {lang === 'ar' ? 'كيف نتعامل مع ملفاتك وصورك؟' : 'How We Handle Your Uploaded Documents'}
          </h2>
          <p className="text-xs text-[#9194a1] leading-relaxed">
            {lang === 'ar'
              ? 'عند استخدام أدوات دمج الـ PDF، أو التوقيع الإلكتروني، أو تفريغ الصور، يتم قراءة الملفات محلياً داخل جلسة المتصفح فقط. لا تنتقل محتويات الملفات عبر شبكة الإنترنت إلى خوادمنا إطلاقاً، وتُحذف تلقائياً من ذاكرة جهازك بمجرد إغلاق التبويب أو تنزيل النتيجة.'
              : 'When utilizing PDF merge, signature, or background cutout tools, all binary reads happen locally inside your browser session. Binary content is never transmitted across the network, and is flushed from RAM once the tab closes.'}
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3 pb-8 border-b border-[#1c1d22]">
          <span className="text-[11px] font-mono uppercase text-[#cc9166]">
            {lang === 'ar' ? 'المادة 02 / الحسابات الاختيارية وحفظ السير الذاتية' : 'Article 02 / Optional Accounts & Resumes'}
          </span>
          <h2 className="text-xl font-serif text-[#ffffff]">
            {lang === 'ar' ? 'البيانات التي نحتفظ بها في حال التسجيل' : 'Data Retained for Registered Users'}
          </h2>
          <p className="text-xs text-[#9194a1] leading-relaxed">
            {lang === 'ar'
              ? 'التسجيل في المنصة اختياري تماماً. إذا اخترت إنشاء حساب لحفظ مسودة سيرتك الذاتية (CV)، نحتفظ فقط ببريدك الإلكتروني، اسمك، ومسودة السيرة الذاتية التي تقرر حفظها بنفسك في قاعدة بيانات مشفرة لتتمكن من الرجوع إليها وتعديلها في أي وقت.'
              : 'Account creation is completely optional. If you choose to register to save your resume draft, we store only your email, name, and the structured CV text you explicitly save via our secure Supabase database.'}
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3 pb-8 border-b border-[#1c1d22]">
          <span className="text-[11px] font-mono uppercase text-[#cc9166]">
            {lang === 'ar' ? 'المادة 03 / ملفات تعريف الارتباط والإعلانات' : 'Article 03 / Cookies & Advertising'}
          </span>
          <h2 className="text-xl font-serif text-[#ffffff]">
            {lang === 'ar' ? 'ملفات تعريف الارتباط (Cookies) وشبكة Google AdSense' : 'Cookies and Google AdSense'}
          </h2>
          <p className="text-xs text-[#9194a1] leading-relaxed">
            {lang === 'ar'
              ? 'نستخدم ملفات تعريف الارتباط الضرورية فقط لتخزين تفضيل اللغة (عربي / إنجليزي) وجلسة تسجيل الدخول. كما قد يعرض الموقع إعلانات عبر شبكة Google AdSense لتغطية تكاليف الخوادم وتوفير الأدوات مجاناً للجميع، ويمكنك إدارة تفضيلات الإعلانات عبر إعدادات متصفحك أو حساب Google.'
              : 'We use necessary cookies solely to persist your language preference and active login session. We may display advertisements through Google AdSense to sustain free core tools. You can manage cookie controls via browser settings.'}
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3 pb-8 border-b border-[#1c1d22]">
          <span className="text-[11px] font-mono uppercase text-[#cc9166]">
            {lang === 'ar' ? 'المادة 04 / حقوق المستخدم والتحكم في البيانات' : 'Article 04 / User Rights & Data Control'}
          </span>
          <h2 className="text-xl font-serif text-[#ffffff]">
            {lang === 'ar' ? 'حقوقك الكاملة في الحذف والتعديل' : 'Your Rights to Modify and Delete Data'}
          </h2>
          <div className="space-y-2 text-xs text-[#9194a1]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'حق حذف أي سيرة ذاتية محفوظة من حسابك بنقرة زر واحدة.' : 'Right to delete any saved resume immediately from your dashboard.'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'حق طلب إغلاق الحساب ومسح جميع السجلات المرتبطة به.' : 'Right to terminate your account and erase all associated records.'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'عدم مشاركة أو بيع أي معلومات تخص المستخدمين لأي جهة ثالثة نهائياً.' : 'Strict policy against selling or sharing personal user data with third parties.'}</span>
            </div>
          </div>
        </div>

        {/* Section 5: Contact */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#ffffff] font-medium block">
              {lang === 'ar' ? 'هل لديك أي استفسار بخصوص خصوصية بياناتك؟' : 'Have privacy questions or data requests?'}
            </span>
            <span className="text-xs text-[#5e616e]">
              {lang === 'ar' ? 'فريق الدعم والمطور محمد حجو متاح للإجابة على استفساراتك.' : 'Developer Mohamed Hacco and our team are available to help.'}
            </span>
          </div>

          <Link
            href="/contact"
            className="px-5 py-2.5 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium rounded-full transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'التواصل مع الإدارة' : 'Contact Us'}</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
