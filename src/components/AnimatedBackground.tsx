'use client';

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#08080a]"
    >
      {/* 1. Subtle Ledger Grid Texture (Fades smoothly with radial mask) */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            radial-gradient(rgba(204, 145, 102, 0.18) 1px, transparent 1px),
            radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 20px 20px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 25%, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 25%, black 30%, transparent 85%)',
        }}
      />

      {/* 2. Top Gilded Accent Beam */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-[1px] opacity-40"
        style={{
          background: 'linear-gradient(90deg, transparent, #cc9166 45%, #ffd49c 50%, #cc9166 55%, transparent)',
        }}
      />

      {/* 3. Floating Orb 1: Warm Copper & Gold (Top-Right / Center) */}
      <div
        className="absolute -top-32 right-[-10%] sm:right-[10%] w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full blur-[140px] animate-ambient-1"
        style={{
          background: 'radial-gradient(circle, rgba(204, 145, 102, 0.35) 0%, rgba(174, 147, 87, 0.18) 45%, transparent 72%)',
        }}
      />

      {/* 4. Floating Orb 2: Deep Cosmic Indigo (Mid-Left) */}
      <div
        className="absolute top-[25%] left-[-15%] sm:left-[5%] w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full blur-[150px] animate-ambient-2"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(67, 56, 202, 0.12) 50%, transparent 75%)',
        }}
      />

      {/* 5. Floating Orb 3: Soft Amber Rose Glow (Bottom / Subtle Depth) */}
      <div
        className="absolute top-[60%] right-[-5%] sm:right-[20%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full blur-[160px] animate-ambient-3"
        style={{
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.2) 0%, rgba(180, 83, 9, 0.08) 55%, transparent 80%)',
        }}
      />

      {/* 6. Subtle Vignette Border Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(8, 8, 10, 0.6) 100%)',
        }}
      />
    </div>
  );
}
