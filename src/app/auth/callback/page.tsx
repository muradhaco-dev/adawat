'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          if (isMounted) {
            setStatus('success');
            setTimeout(() => {
              router.push('/account');
            }, 1200);
          }
          return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session && isMounted) {
            setStatus('success');
            setTimeout(() => {
              router.push('/account');
            }, 1200);
          }
        });

        const fallbackTimer = setTimeout(() => {
          if (isMounted && status === 'loading') {
            router.push('/');
          }
        }, 4000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(fallbackTimer);
        };
      } catch (err: any) {
        console.error(err);
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.message || (lang === 'ar' ? 'فشل تأكيد البريد الإلكتروني' : 'Failed to confirm email'));
        }
      }
    };

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [router, lang, status]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4 bg-[#08080a]">
      {status === 'loading' && (
        <>
          <div className="w-10 h-10 border-2 border-[#cc9166] border-t-transparent rounded-full animate-spin" />
          <div>
            <h3 className="text-sm font-medium text-[#ffffff]">
              {lang === 'ar' ? 'جاري التحقق وتأكيد البريد الإلكتروني...' : 'Verifying email confirmation...'}
            </h3>
            <p className="text-xs text-[#5e616e] mt-1 font-mono">
              {lang === 'ar' ? 'سيتم تفعيل حسابك ونقلك إلى المنصة تلقائياً' : 'Activating your account and redirecting...'}
            </p>
          </div>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#ffffff]">
              {lang === 'ar' ? 'تم تأكيد وتفعيل الحساب بنجاح!' : 'Account verified successfully!'}
            </h3>
            <p className="text-xs text-[#5e616e] mt-1 font-mono">
              {lang === 'ar' ? 'جاري نقلك إلى لوحة التحكم...' : 'Redirecting to your dashboard...'}
            </p>
          </div>
        </>
      )}

      {status === 'error' && (
        <div className="max-w-md p-6 rounded-[10px] bg-[#040406] border border-red-900/50 text-center">
          <div className="w-10 h-10 rounded-full bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-medium text-[#ffffff] mb-1">
            {lang === 'ar' ? 'تعذر تأكيد الرابط' : 'Verification link failed'}
          </h3>
          <p className="text-xs text-[#9194a1] mb-4">
            {errorMessage || (lang === 'ar' ? 'قد يكون الرابط منتهي الصلاحية أو تم استخدامه مسبقاً.' : 'Link may be expired or already used.')}
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="px-4 py-2 bg-[#ffffff] text-[#000000] text-xs font-medium rounded-full hover:bg-[#e2e3e9] transition-colors"
          >
            {lang === 'ar' ? 'العودة لصفحة تسجيل الدخول' : 'Return to sign in'}
          </button>
        </div>
      )}
    </div>
  );
}
