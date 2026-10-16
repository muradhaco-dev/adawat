import Link from 'next/link';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#08080a] text-[#9194a1] border-t border-[#1c1d22] mt-32">
      {/* Privacy & Trust Bar */}
      <div className="border-b border-[#1c1d22] py-8">
        <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
            
            <div className="p-5 rounded-[10px] bg-[#040406] border border-[#1c1d22] flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#ffffff]">معالجة محلية وآمنة 100%</h4>
                <p className="text-xs text-[#9194a1] mt-1 leading-relaxed">
                  ملفاتك وصورك تُعالج داخل متصفحك مباشرة ولا تُخزن على خوادمنا لحماية خصوصيتك.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-[10px] bg-[#040406] border border-[#1c1d22] flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#ffffff]">تنفيذ فوري وسرعة قصوى</h4>
                <p className="text-xs text-[#9194a1] mt-1 leading-relaxed">
                  أدوات مصممة لإنهاء مهام الـ PDF وتفريغ الصور وصناعة الـ CV بضغطة زر واحدة.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-[10px] bg-[#040406] border border-[#1c1d22] flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-[#ffffff]">معايير عمل احترافية</h4>
                <p className="text-xs text-[#9194a1] mt-1 leading-relaxed">
                  نماذج سيرة ذاتية متوافقة مع أنظمة التوظيف الحديثة في تركيا وألمانيا والخليج.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-right">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-bold font-serif text-[#ffffff]">أدواتك</span>
              <span className="text-xs text-[#cc9166] font-mono">/ ADAWAT</span>
            </div>
            <p className="text-xs text-[#9194a1] leading-relaxed">
              منصة الأدوات اليومية السريعة باللغة العربية. معالجة المستندات، تفريغ الصور للمتاجر، وتوليد السير الذاتية المهنية.
            </p>
          </div>

          {/* Tools Links */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#cc9166] block mb-3 font-mono">
              الأدوات
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/cv-builder" className="hover:text-[#ffffff] transition-colors">
                  صانع السيرة الذاتية (CV)
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="hover:text-[#ffffff] transition-colors">
                  دمج ملفات PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools?tab=sign" className="hover:text-[#ffffff] transition-colors">
                  توقيع PDF إلكترونياً
                </Link>
              </li>
              <li>
                <Link href="/remove-bg" className="hover:text-[#ffffff] transition-colors">
                  إزالة خلفية الصور
                </Link>
              </li>
            </ul>
          </div>

          {/* Searches */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#cc9166] block mb-3 font-mono">
              عمليات شائعة
            </span>
            <ul className="space-y-2.5 text-xs text-[#5e616e]">
              <li>CV جاهز للسوريين في تركيا وألمانيا</li>
              <li>دمج وترتيب صفحات PDF</li>
              <li>تفريغ صور المنتجات لإنستغرام</li>
              <li>نماذج سيرة ذاتية أوروبية وخليجية</li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#cc9166] block mb-3 font-mono">
              الاشتراك والحساب
            </span>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/pricing" className="text-[#cc9166] hover:underline transition-colors">
                  ترقية الحساب لـ Pro
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-[#ffffff] transition-colors">
                  تسجيل الدخول / إنشاء حساب
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#ffffff] transition-colors">
                  إدارة سيرك الذاتية
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 mt-12 border-t border-[#1c1d22] text-xs text-[#5e616e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} منصة أدواتك — جميع الحقوق محفوظة.</p>
          <p className="text-[11px] text-[#777a88] font-mono">
            VAULT SYSTEM / DARK EDITORIAL
          </p>
        </div>
      </div>
    </footer>
  );
}
