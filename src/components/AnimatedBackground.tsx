'use client';

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#08080a]"
    >
      {/* 1. Subtle Clean Ledger Grid Texture - 100% Static & Lightweight */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            radial-gradient(rgba(204, 145, 102, 0.25) 1px, transparent 1px),
            radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px, 24px 24px',
        }}
      />

      {/* 2. Top Gilded Accent Beam - Static Pure CSS */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 max-w-5xl h-[1px] opacity-60"
        style={{
          background: 'linear-gradient(90deg, transparent, #cc9166 40%, #ffe0b2 50%, #cc9166 60%, transparent)',
        }}
      />

      {/* 3. Subtle Static Ambient Vignette - Zero GPU Compositing / No Infinite Animation */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 10%, rgba(204, 145, 102, 0.05) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
