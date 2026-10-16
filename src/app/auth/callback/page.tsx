'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Listen for auth state change or get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
      } else {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            router.push('/');
          }
        });
        return () => subscription.unsubscribe();
      }
    });

    // Fallback redirect after 3 seconds if state didn't trigger
    const timeout = setTimeout(() => {
      router.push('/');
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <div>
        <h3 className="text-base font-bold text-gray-800">جاري إتمام تسجيل الدخول عبر Google...</h3>
        <p className="text-xs text-gray-400 mt-1">سيتم توجيهك إلى المنصة تلقائياً خلال لحظات</p>
      </div>
    </div>
  );
}
