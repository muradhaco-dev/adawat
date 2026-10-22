import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'أدواتك ADAWAT — منصة الأدوات الذكية والمجانية';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#08080a',
          color: '#ffffff',
          position: 'relative',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(204, 145, 102, 0.25) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.3,
          }}
        />

        {/* Top copper accent glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: '2px',
            background:
              'linear-gradient(90deg, transparent, #cc9166 50%, transparent)',
          }}
        />

        {/* Glow circle */}
        <div
          style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            borderRadius: '9999px',
            background:
              'radial-gradient(circle, rgba(204, 145, 102, 0.22) 0%, transparent 70%)',
            top: '15%',
            left: '30%',
            filter: 'blur(60px)',
          }}
        />

        {/* Brand Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            border: '1px solid #2e3038',
            backgroundColor: '#040406',
            color: '#cc9166',
            fontSize: 16,
            fontWeight: 600,
            marginBottom: '24px',
            letterSpacing: '1px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '9999px',
              backgroundColor: '#cc9166',
            }}
          />
          <span>أدواتك / ADAWAT</span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '16px',
            color: '#ffffff',
            maxWidth: '900px',
          }}
        >
          أدوات PDF، السيرة الذاتية، وتفريغ الصور
        </div>

        {/* Subhead */}
        <div
          style={{
            fontSize: 22,
            color: '#9194a1',
            textAlign: 'center',
            maxWidth: '800px',
            marginBottom: '40px',
            lineHeight: 1.5,
          }}
        >
          معالجة محلية داخل متصفحك 100% وبدون رفع للملفات • تصدير فوري ومجاني
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            gap: '14px',
          }}
        >
          <div
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              backgroundColor: '#121317',
              border: '1px solid #1c1d22',
              color: '#e2e3e9',
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            📄 صانع CV متوافق مع ATS
          </div>
          <div
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              backgroundColor: '#121317',
              border: '1px solid #1c1d22',
              color: '#e2e3e9',
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            📑 دمج وتوقيع PDF
          </div>
          <div
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              backgroundColor: '#121317',
              border: '1px solid #1c1d22',
              color: '#e2e3e9',
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            ✨ إزالة خلفية الصور PNG
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
