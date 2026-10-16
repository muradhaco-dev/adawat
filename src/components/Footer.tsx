import Link from 'next/link';
import { Sparkles, ShieldCheck, Zap, Heart, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-24">
      {/* Privacy & Trust Bar */}
      <div className="border-b border-gray-800 bg-gray-950/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">معالجة فورية وآمنة 100%</h4>
                <p className="text-xs text-gray-400">ملفاتك وصورك تعالج مباشرة داخل متصفحك ولا نخزن بياناتك</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">سرعة فائقة بدون انتظار</h4>
                <p className="text-xs text-gray-400">تحويل وتعديل بضغطة زر وتنزيل مباشر بجودة عالية</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">متوافق مع المعايير الدولية</h4>
                <p className="text-xs text-gray-400">نماذج السيرة الذاتية متوافقة مع متطلبات العمل في تركيا وأوروبا والخليج</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white">أدواتك</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              المنصة العربية المتكاملة للأدوات اليومية المجانية. نوفر أدوات معالجة الـ PDF، إزالة خلفيات الصور، وإنشاء السير الذاتية الاحترافية للباحثين عن عمل في الوطن العربي وحول العالم.
            </p>
          </div>

          {/* Tools Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">الأدوات الأكثر استخداماً</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cv-builder" className="hover:text-white transition-colors">
                  صانع السيرة الذاتية (CV جاهز)
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="hover:text-white transition-colors">
                  دمج ملفات PDF أونلاين
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="hover:text-white transition-colors">
                  توقيع ملفات PDF إلكترونياً
                </Link>
              </li>
              <li>
                <Link href="/remove-bg" className="hover:text-white transition-colors">
                  إزالة خلفية الصور للمتاجر
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular searches for SEO */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">عمليات البحث الشائعة</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>سيرة ذاتية بالعربي للسوريين في تركيا</li>
              <li>نماذج CV معتمدة في ألمانيا وأوروبا</li>
              <li>ضغط وتصغير حجم ملفات PDF</li>
              <li>قص وتفريغ الصور بدون برنامج فوتوشوب</li>
            </ul>
          </div>

          {/* Account & Support */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3">الاشتراكات والحساب</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pricing" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  خطة Pro الاحترافية
                </Link>
              </li>
              <li>
                <Link href="/auth" className="hover:text-white transition-colors">
                  تسجيل الدخول / إنشاء حساب
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} منصة أدواتك - جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1 justify-center">
            صنع بكل <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> لدعم المستخدمين في العالم العربي والمهجر
          </p>
        </div>
      </div>
    </footer>
  );
}
