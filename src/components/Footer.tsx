'use client';

import Link from 'next/link';
import { ShieldCheck, Zap, Lock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-[#08080a] text-[#9194a1] border-t border-[#1c1d22] mt-32">
      {/* Privacy & Trust Bar */}
      <div className="border-b border-[#1c1d22] py-8">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            
            <div className="p-5 rounded-[10px] bg-[#040406] border border-[#1c1d22] flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#ffffff]">
                  {lang === 'ar' ? 'معالجة محلية وآمنة 100%' : '100% In-Browser Privacy'}
                </h4>
                <p className="text-xs text-[#9194a1] mt-1 leading-relaxed">
                  {lang === 'ar'
                    ? 'ملفاتك وصورك تُعالج داخل متصفحك مباشرة ولا تُخزن على خوادمنا لحماية خصوصيتك.'
                    : 'Your files are processed directly inside your browser and never stored on remote servers.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-[10px] bg-[#040406] border border-[#1c1d22] flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#ffffff]">
                  {lang === 'ar' ? 'تنفيذ فوري وسرعة قصوى' : 'Instant High-Speed Execution'}
                </h4>
                <p className="text-xs text-[#9194a1] mt-1 leading-relaxed">
                  {lang === 'ar'
                    ? 'أدوات مصممة لإنهاء مهام الـ PDF وتفريغ الصور وصناعة الـ CV بضغطة زر واحدة.'
                    : 'Engineered for seamless zero-wait PDF merging, background cutout, and resume generation.'}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-[10px] bg-[#040406] border border-[#1c1d22] flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#ffffff]">
                  {lang === 'ar' ? 'معايير عمل احترافية' : 'ATS & Industry Standards'}
                </h4>
                <p className="text-xs text-[#9194a1] mt-1 leading-relaxed">
                  {lang === 'ar'
                    ? 'نماذج سيرة ذاتية متوافقة مع أنظمة التوظيف الحديثة في تركيا وألمانيا والخليج.'
                    : 'Resume templates crafted for modern applicant tracking systems in Europe and globally.'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-start">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-bold font-serif text-[#ffffff]">أدواتك</span>
              <span className="text-xs text-[#cc9166] font-mono">/ ADAWAT</span>
            </div>
            <p className="text-xs text-[#9194a1] leading-relaxed">
              {t('footer.brandDesc')}
            </p>
          </div>

          {/* Tools Links */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#cc9166] block mb-3 font-mono">
              {t('footer.toolsHeader')}
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/cv-builder" className="hover:text-[#ffffff] transition-colors">
                  {t('nav.cv')}
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="hover:text-[#ffffff] transition-colors">
                  {t('nav.pdf')}
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools?tab=sign" className="hover:text-[#ffffff] transition-colors">
                  {lang === 'ar' ? 'توقيع PDF إلكترونياً' : 'Sign PDF Online'}
                </Link>
              </li>
              <li>
                <Link href="/remove-bg" className="hover:text-[#ffffff] transition-colors">
                  {t('nav.bg')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#cc9166] block mb-3 font-mono">
              {t('footer.accountHeader')}
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/pricing" className="text-[#cc9166] hover:underline transition-colors">
                  {t('nav.pro')}
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-[#ffffff] transition-colors">
                  {t('nav.signin')}
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#ffffff] transition-colors">
                  {t('nav.account')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#ffffff] transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer / Mohamed Hacco — Direct link to contact without raw numbers */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#cc9166] block mb-3 font-mono">
              {t('footer.devHeader')}
            </span>
            <Link
              href="/contact"
              className="group block p-4 rounded-[10px] bg-[#040406] border border-[#1c1d22] hover:border-[#2e3038] transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[#ffffff] group-hover:text-[#cc9166] transition-colors">
                  {t('footer.devName')}
                </span>
                <ArrowLeft className="w-3.5 h-3.5 text-[#5e616e] group-hover:text-[#ffffff] group-hover:-translate-x-1 transition-all" />
              </div>
              <span className="text-[10px] text-[#5e616e] font-mono block">
                {t('footer.devDesc')}
              </span>
              <p className="text-[11px] text-[#9194a1] mt-2.5 border-t border-[#1c1d22] pt-2">
                {lang === 'ar' ? 'اضغط هنا للتواصل المباشر عبر صفحة التواصل ←' : 'Click to reach via contact page →'}
              </p>
            </Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-[#1c1d22] text-xs text-[#5e616e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} منصة أدواتك — {t('footer.devCredit')}{' '}
            <Link
              href="/contact"
              className="text-[#ffffff] hover:text-[#cc9166] transition-colors font-medium hover:underline"
            >
              محمد حجو (HACCO)
            </Link>
          </p>
          <div className="flex items-center gap-3 text-[11px] text-[#777a88] font-mono">
            <Link href="/contact" className="hover:text-[#ffffff] transition-colors">
              {t('nav.contact')}
            </Link>
            <span>/</span>
            <span>HACCO DEV</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
