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
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Send
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

// Common disposable/temporary email provider domains to prevent fake signups
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 
  'yopmail.com', 'dispostable.com', 'trashmail.com', 'getnada.com', 
  'fakeinbox.com', 'throwawaymail.com', 'sharklasers.com', 'temp-mail.org', 
  'generator.email', 'mohmal.com', 'crazymailing.com', 'mytemp.email', 
  'dropmail.me', 'inboxkitten.com', 'nada.ltd', 'emailondeck.com'
];

export default function AuthPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Verification states
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);

  const isDisposableEmail = (emailStr: string): boolean => {
    const domain = emailStr.split('@')[1]?.toLowerCase().trim();
    if (!domain) return false;
    return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (lang === 'ar' ? 'حدث خطأ أثناء محاولة تسجيل الدخول عبر Google' : 'Google sign-in error occurred'));
      setLoading(false);
    }
  };

  const handleResendVerification = async (targetEmail: string) => {
    try {
      setResending(true);
      setErrorMsg(null);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: targetEmail.trim(),
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setSuccessMsg(t('auth.verify.resendSuccess'));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (lang === 'ar' ? 'تعذر إعادة إرسال الرسالة، يرجى المحاولة بعد قليل' : 'Failed to resend confirmation email'));
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setUnconfirmedEmail(null);

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }

    // Check disposable email
    if (mode === 'signup' && isDisposableEmail(cleanEmail)) {
      setErrorMsg(t('auth.error.disposable'));
      return;
    }

    try {
      setLoading(true);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';

      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
            emailRedirectTo: `${origin}/auth/callback`,
          },
        });

        if (error) {
          if (error.message.toLowerCase().includes('already registered')) {
            setErrorMsg(t('auth.error.alreadyRegistered'));
            return;
          }
          throw error;
        }

        // Supabase returns an empty identities array if user is already registered (with email confirmation enabled)
        if (data?.user && data.user.identities && data.user.identities.length === 0) {
          setErrorMsg(t('auth.error.alreadyRegistered'));
          return;
        }

        // If email confirmation is enabled in Supabase, data.session is null and confirmation email was sent!
        if (data?.user && !data?.session) {
          setPendingEmail(cleanEmail);
          setIsVerificationSent(true);
          return;
        }

        // If email confirmation is turned off in Supabase (immediate login)
        setSuccessMsg(lang === 'ar' ? 'تم إنشاء الحساب بنجاح! جاري تحويلك...' : 'Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1200);

      } else {
        // Sign In Flow
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            setUnconfirmedEmail(cleanEmail);
            setErrorMsg(t('auth.error.unconfirmed'));
            return;
          }
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            setErrorMsg(lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password');
            return;
          }
          throw error;
        }

        setSuccessMsg(lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Signed in successfully!');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || (lang === 'ar' ? 'حدث خطأ أثناء المحاولة، يرجى التأكد من البيانات' : 'An error occurred, please verify your details'));
    } finally {
      setLoading(false);
    }
  };

  // If verification email has been sent, render the verification instructions screen
  if (isVerificationSent) {
    const isGmail = pendingEmail.toLowerCase().includes('gmail.com');

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[#040406] rounded-[10px] border border-[#1c1d22] p-8 text-center">
          
          {/* Animated Glow Envelope */}
          <div className="relative mx-auto w-16 h-16 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#cc9166]/20 blur-xl animate-pulse" />
            <div className="relative w-14 h-14 rounded-full bg-[#121317] border border-[#cc9166] flex items-center justify-center text-[#cc9166]">
              <Mail className="w-7 h-7" />
            </div>
          </div>

          <h2 className="text-xl font-serif text-[#ffffff] mb-2">
            {t('auth.verify.title')}
          </h2>

          <p className="text-xs text-[#9194a1] leading-relaxed mb-4">
            {t('auth.verify.desc')}
          </p>

          {/* Highlighted Email Pill */}
          <div className="inline-block px-4 py-2 bg-[#121317] border border-[#2e3038] rounded-full text-xs font-mono text-[#cc9166] mb-6 select-all">
            {pendingEmail}
          </div>

          {/* Instructions box */}
          <div className="p-4 rounded-[10px] bg-[#08080a] border border-[#1c1d22] text-xs text-[#acafb9] text-start space-y-2 mb-6">
            <p className="leading-relaxed">
              {t('auth.verify.instruction')}
            </p>
            <p className="text-[11px] text-[#777a88] border-t border-[#1c1d22] pt-2">
              💡 {t('auth.verify.spam')}
            </p>
          </div>

          {/* Messages */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-[10px] bg-[#121317] border border-emerald-900/50 text-emerald-300 text-xs flex items-center gap-2 text-start">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-[10px] bg-[#121317] border border-red-900/50 text-red-300 text-xs flex items-center gap-2 text-start">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Primary Action: Direct link to Gmail */}
          <div className="space-y-3">
            <a
              href={isGmail ? 'https://mail.google.com' : 'https://mail.google.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
            >
              <span>{t('auth.verify.openGmail')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Resend Link Button */}
            <button
              type="button"
              onClick={() => handleResendVerification(pendingEmail)}
              disabled={resending}
              className="w-full py-2.5 px-4 bg-[#08080a] hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] text-xs font-medium rounded-full border border-[#1c1d22] hover:border-[#2e3038] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{t('auth.verify.resend')}</span>
            </button>

            {/* Back to sign in */}
            <button
              type="button"
              onClick={() => {
                setIsVerificationSent(false);
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-[#5e616e] hover:text-[#9194a1] underline mt-3 block mx-auto transition-colors"
            >
              {t('auth.verify.backToSignin')}
            </button>
          </div>

        </div>
      </div>
    );
  }

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
            {mode === 'signin' 
              ? (lang === 'ar' ? 'تسجيل الدخول إلى حسابك' : 'Sign in to your account') 
              : (lang === 'ar' ? 'إنشاء حساب جديد' : 'Create a new account')}
          </h2>
          <p className="text-xs text-[#9194a1] mt-1">
            {mode === 'signin'
              ? (lang === 'ar' ? 'الوصول إلى مستنداتك وسيرك الذاتية المحفوظة' : 'Access your saved documents and resumes')
              : (lang === 'ar' ? 'سجل بريدك الحقيقي لتصلك رسالة التأكيد وتفعيل حسابك' : 'Sign up with your genuine email to receive confirmation link')}
          </p>
        </div>

        {/* Mode Switcher: Pill shaped */}
        <div className="flex bg-[#121317] p-1 rounded-full mb-6 text-xs font-medium border border-[#1c1d22]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
              setUnconfirmedEmail(null);
            }}
            className={`flex-1 py-1.5 rounded-full transition-all ${
              mode === 'signin' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            {lang === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
              setUnconfirmedEmail(null);
            }}
            className={`flex-1 py-1.5 rounded-full transition-all ${
              mode === 'signup' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            {lang === 'ar' ? 'حساب جديد' : 'Sign up'}
          </button>
        </div>

        {/* Google Sign-in Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#08080a] hover:bg-[#121317] text-[#ffffff] text-xs font-medium rounded-full border border-[#2e3038] hover:border-[#777a88] flex items-center justify-center gap-2.5 transition-colors disabled:opacity-50 mb-5"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
          <span>{lang === 'ar' ? 'المتابعة عبر Google (بدون كلمة مرور)' : 'Continue with Google'}</span>
        </button>

        {/* Hairline Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-[#1c1d22] w-full" />
          <span className="bg-[#040406] px-3 text-[10px] font-mono uppercase tracking-wider text-[#5e616e] absolute">
            {lang === 'ar' ? 'أو عبر البريد المعتمد' : 'OR VIA EMAIL'}
          </span>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-[10px] bg-[#121317] border border-red-900/50 text-red-300 text-xs space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {unconfirmedEmail && (
              <div className="pt-2 border-t border-red-900/30 flex items-center justify-between gap-2">
                <span className="text-[11px] text-[#9194a1]">{unconfirmedEmail}</span>
                <button
                  type="button"
                  onClick={() => handleResendVerification(unconfirmedEmail)}
                  disabled={resending}
                  className="px-2.5 py-1 bg-[#cc9166] hover:bg-[#d99f77] text-[#000000] text-[11px] font-semibold rounded-full transition-colors flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>{resending ? '...' : (lang === 'ar' ? 'إعادة الإرسال' : 'Resend')}</span>
                </button>
              </div>
            )}
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
              <label className="block text-xs font-mono text-[#9194a1] mb-1.5">
                {lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#5e616e] absolute right-3.5 top-3" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={lang === 'ar' ? 'محمد حجو' : 'Mohamed Hacco'}
                  className="w-full pr-10 pl-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] placeholder-[#5e616e] outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-[#9194a1] mb-1.5">
              {lang === 'ar' ? 'البريد الإلكتروني الحقيقي (Gmail أو غيره)' : 'Genuine Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5e616e] absolute right-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                required
                className="w-full pr-10 pl-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] placeholder-[#5e616e] outline-none transition-colors font-mono"
              />
            </div>
            {mode === 'signup' && (
              <p className="text-[10px] text-[#5e616e] mt-1 mr-2">
                {lang === 'ar' ? '⚠️ ستصلك رسالة تفعيل على هذا البريد لإتمام التسجيل' : '⚠️ A confirmation link will be sent to activate your account'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-[#9194a1] mb-1.5">
              {lang === 'ar' ? 'كلمة المرور' : 'Password'}
            </label>
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
                ? (lang === 'ar' ? 'جاري المعالجة...' : 'Processing...')
                : mode === 'signin'
                ? (lang === 'ar' ? 'تسجيل الدخول' : 'Sign in')
                : (lang === 'ar' ? 'إرسال رابط التأكيد والتسجيل' : 'Send Confirmation & Sign Up')}
            </span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1c1d22] text-center text-[11px] text-[#5e616e] font-mono">
          {lang === 'ar' ? 'أمان ومصادقة مشفرة بواسطة Supabase' : 'End-to-end encrypted authentication by Supabase'}
        </div>

      </div>
    </div>
  );
}
