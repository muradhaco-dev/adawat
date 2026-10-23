'use client';

import { useSubscription } from '@/context/SubscriptionContext';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
}

export default function AdBanner({
  slot = '1234567890',
  format = 'auto',
  className = '',
}: AdBannerProps) {
  const { isPro } = useSubscription();

  // For Pro subscribers, all ads are completely hidden
  if (isPro) {
    return null;
  }

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isDemo = !clientId || clientId.includes('demo') || clientId.includes('xxxx');

  if (isDemo) {
    return (
      <div
        className={`w-full my-6 p-4 rounded-[10px] border border-[#1c1d22] bg-[#040406] flex flex-col items-center justify-center text-center text-[#5e616e] select-none ${className}`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-wider font-mono text-[#cc9166]">
            مساحة إعلانية — Google AdSense
          </span>
          <span className="text-[10px] font-mono text-[#5e616e] border border-[#1c1d22] px-1.5 rounded">
            مجاني
          </span>
        </div>
        <p className="text-xs text-[#5e616e]">
          يتم إخفاء هذا الإعلان تلقائياً عند ترقية حسابك إلى باقة <span className="text-[#cc9166] font-semibold">Pro</span> ($3.99/شهر)
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden my-6 flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
