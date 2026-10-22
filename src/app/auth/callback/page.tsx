'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const getTarget = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const r = params.get('redirect');
        if (r && r.startsWith('/')) return r;
      }
      return '/tools';
    };

    const target = getTarget();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push(target);
      } else {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            router.push(target);
          }
        });
        return () => subscription.unsubscribe();
      }
    });

    const timeout = setTimeout(() => {
      router.push(target);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4 bg-[#08080a]">
      <div className="w-10 h-10 border-2 border-[#cc9166] border-t-transparent rounded-full animate-spin" />
      <div>
        <h3 className="text-sm font-medium text-[#ffffff]">جاري تأكيد المصادقة عبر Google...</h3>
        <p className="text-xs text-[#5e616e] mt-1 font-mono">سيتم نقلك إلى المنصة تلقائياً</p>
      </div>
    </div>
  );
}
