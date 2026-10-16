'use client';

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
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isDemo = !clientId || clientId.includes('demo') || clientId.includes('xxxx');

  if (isDemo) {
    return (
      <div
        className={`w-full my-8 p-4 rounded-[10px] border border-[#1c1d22] bg-[#040406] flex flex-col items-center justify-center text-center text-[#5e616e] select-none ${className}`}
      >
        <span className="text-[10px] uppercase tracking-wider font-mono text-[#cc9166] mb-1">
          مساحة إعلانية — Google AdSense
        </span>
        <p className="text-xs text-[#5e616e]">
          يظهر إعلان AdSense هنا تلقائياً عند إضافة معرف حسابك في ملف <code>.env.local</code>
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden my-8 flex justify-center ${className}`}>
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
