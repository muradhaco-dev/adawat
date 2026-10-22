'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const getRedirectUrl = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const r = params.get('redirect');
      if (r && r.startsWith('/')) return r;
    }
    return '/tools';
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const target = getRedirectUrl();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(target)}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'حدث خطأ أثناء محاولة تسجيل الدخول عبر Google');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      setLoading(true);
      const target = getRedirectUrl();

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        setSuccessMsg('تم إنشاء الحساب بنجاح! تم تسجيل دخولك.');
        setTimeout(() => {
          router.push(target);
        }, 1200);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setSuccessMsg('تم تسجيل الدخول بنجاح!');
        setTimeout(() => {
          router.push(target);
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'حدث خطأ أثناء المحاولة، يرجى التأكد من البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#040406] rounded-[10px] border border-[#1c1d22] p-8 shadow-none">
        
        {/* Brand / Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <span className="text-2xl font-bold font-serif text-[#ffffff]">أدواتك</span>
            <span className="text-xs text-[#cc9166] font-mono">/ AUTH</span>
          </Link>
          <h2 className="text-xl font-serif text-[#ffffff]">
            {mode === 'signin' ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
          </h2>
          <p className="text-xs text-[#9194a1] mt-1">
            {mode === 'signin'
              ? 'الوصول إلى مستنداتك وسيرك الذاتية المحفوظة'
              : 'ابدأ بحفظ وتعديل سيرتك الذاتية في أي وقت مجاناً'}
          </p>
        </div>

        {/* Mode Switcher: Pill shaped */}
        <div className="flex bg-[#121317] p-1 rounded-full mb-6 text-xs font-medium border border-[#1c1d22]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-full transition-all ${
              mode === 'signin' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-full transition-all ${
              mode === 'signup' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            حساب جديد
          </button>
        </div>

        {/* Google Sign-in Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#08080a] hover:bg-[#121317] text-[#ffffff] text-xs font-medium rounded-full border border-[#2e3038] hover:border-[#777a88] flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50 mb-5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>المتابعة عبر Google</span>
        </button>

        {/* Hairline Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-[#1c1d22] w-full" />
          <span className="bg-[#040406] px-3 text-[10px] font-mono uppercase tracking-wider text-[#5e616e] absolute">
            أو عبر البريد
          </span>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-[10px] bg-[#121317] border border-red-900/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-[10px] bg-[#121317] border border-emerald-900/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Fields: Slash pill inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-mono text-[#9194a1] mb-1.5">الاسم الكامل</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#5e616e] absolute right-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full pr-10 pl-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] placeholder-[#5e616e] outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-[#9194a1] mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5e616e] absolute right-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pr-10 pl-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] placeholder-[#5e616e] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#9194a1] mb-1.5">كلمة المرور</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5e616e] absolute right-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pr-10 pl-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] placeholder-[#5e616e] outline-none transition-colors"
              />
            </div>
          </div>

          {/* Primary Action Button — White pill button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-2.5 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <span>
              {loading
                ? 'جاري المعالجة...'
                : mode === 'signin'
                ? 'تسجيل الدخول'
                : 'إنشاء الحساب مجاناً'}
            </span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1c1d22] text-center text-[11px] text-[#5e616e] font-mono">
          أمان ومصادقة مشفرة بواسطة Supabase
        </div>

      </div>
    </div>
  );
}
