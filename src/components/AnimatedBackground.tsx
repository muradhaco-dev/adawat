'use client';

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#08080a]"
    >
      {/* 1. Subtle Ledger Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            radial-gradient(rgba(204, 145, 102, 0.3) 1px, transparent 1px),
            radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px, 24px 24px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 90%)',
        }}
      />

      {/* 2. Top Gilded Accent Beam */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 max-w-5xl h-[1.5px] opacity-75"
        style={{
          background: 'linear-gradient(90deg, transparent, #cc9166 40%, #ffe0b2 50%, #cc9166 60%, transparent)',
        }}
      />

      {/* 3. Floating Orb 1: Warm Copper & Gold (Top-Right / Center) */}
      <div
        className="absolute -top-24 right-[-5%] sm:right-[15%] w-[450px] h-[450px] sm:w-[600px] sm:h-[600px] rounded-full blur-[85px] animate-ambient-1"
        style={{
          background: 'radial-gradient(circle, rgba(204, 145, 102, 0.5) 0%, rgba(174, 147, 87, 0.3) 45%, transparent 72%)',
        }}
      />

      {/* 4. Floating Orb 2: Deep Cosmic Violet / Indigo (Mid-Left) */}
      <div
        className="absolute top-[20%] left-[-10%] sm:left-[5%] w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] rounded-full blur-[90px] animate-ambient-2"
        style={{
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.4) 0%, rgba(79, 70, 229, 0.22) 48%, transparent 74%)',
        }}
      />

      {/* 5. Floating Orb 3: Soft Amber Rose Glow (Bottom / Subtle Depth) */}
      <div
        className="absolute top-[55%] right-[-5%] sm:right-[15%] w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full blur-[95px] animate-ambient-3"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(180, 83, 9, 0.18) 52%, transparent 76%)',
        }}
      />

      {/* 6. Subtle Vignette Border Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 45%, rgba(8, 8, 10, 0.6) 100%)',
        }}
      />
    </div>
  );
}
