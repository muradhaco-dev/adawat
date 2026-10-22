'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Sliders, 
  ShoppingBag,
  Check,
  Sparkles,
  ArrowRightLeft,
  ShieldCheck,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/AdBanner';

export default function RemoveBgPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(30);
  const [bgType, setBgType] = useState<'transparent' | 'white' | 'color'>('transparent');
  const [viewMode, setViewMode] = useState<'processed' | 'original'>('processed');
  const [activeSample, setActiveSample] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Generate clean SVG samples for testing without uploading
  const samplePresets = [
    {
      id: 1,
      title: 'منتج تجاري (حذاء رياضي)',
      category: 'التجارة الإلكترونية',
      // SVG product drawing on light background
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f1f5f9"/>
        <g transform="translate(60, 60)">
          <path d="M40 120 Q60 70 120 70 L180 80 Q220 90 250 130 Q260 150 240 160 L50 160 Q30 160 30 140 Z" fill="#cc9166" stroke="#b47b52" stroke-width="4"/>
          <path d="M40 145 L250 145 Q260 160 240 170 L35 170 Q25 170 30 155 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
          <path d="M100 80 L140 130" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
          <path d="M120 80 L160 130" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
          <circle cx="80" cy="115" r="16" fill="#121317"/>
        </g>
      </svg>`,
    },
    {
      id: 2,
      title: 'زجاجة عطر فاخرة',
      category: 'مستحضرات وتجميل',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#e2e8f0"/>
        <g transform="translate(140, 40)">
          <rect x="40" y="20" width="40" height="30" rx="4" fill="#cc9166"/>
          <rect x="50" y="5" width="20" height="15" rx="3" fill="#ffd49c"/>
          <path d="M10 60 L110 60 L100 200 L20 200 Z" fill="#1c1d22" stroke="#cc9166" stroke-width="3"/>
          <rect x="30" y="100" width="60" height="50" rx="4" fill="#cc9166" opacity="0.9"/>
          <line x1="40" y1="125" x2="80" y2="125" stroke="#ffffff" stroke-width="2"/>
        </g>
      </svg>`,
    },
    {
      id: 3,
      title: 'أيقونة ساعة يد ذكية',
      category: 'إلكترونيات وإكسسوار',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f8fafc"/>
        <g transform="translate(130, 30)">
          <rect x="45" y="10" width="50" height="60" rx="10" fill="#475569"/>
          <rect x="45" y="170" width="50" height="60" rx="10" fill="#475569"/>
          <rect x="25" y="60" width="90" height="120" rx="24" fill="#0f172a" stroke="#cc9166" stroke-width="4"/>
          <circle cx="70" cy="120" r="30" fill="none" stroke="#38bdf8" stroke-width="5" stroke-dasharray="120 40"/>
          <text x="70" y="125" fill="#ffffff" font-size="14" font-family="monospace" text-anchor="middle">10:45</text>
        </g>
      </svg>`,
    },
  ];

  const handleSelectPreset = (preset: typeof samplePresets[0], idx: number) => {
    setActiveSample(idx);
    const blob = new Blob([preset.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL('image/png');
        setImageSrc(pngUrl);
        processBackgroundRemoval(pngUrl, tolerance, bgType, '#ffffff');
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSrc(result);
        setActiveSample(null);
        processBackgroundRemoval(result, tolerance, bgType, '#ffffff');
      };
      reader.readAsDataURL(file);
    }
  };

  const processBackgroundRemoval = (
    src: string,
    tol: number,
    bgMode: 'transparent' | 'white' | 'color',
    colorHex: string
  ) => {
    setProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    originalImageRef.current = img;

    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample edge corners
      const sampleIndices = [0, (img.width - 1) * 4, (img.width * (img.height - 1)) * 4];
      let bgR = 0, bgG = 0, bgB = 0;
      sampleIndices.forEach((idx) => {
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      });
      bgR = Math.round(bgR / sampleIndices.length);
      bgG = Math.round(bgG / sampleIndices.length);
      bgB = Math.round(bgB / sampleIndices.length);

      const colorDist = (r: number, g: number, b: number) => {
        return Math.sqrt(
          Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
        );
      };

      const maxDist = tol * 4.4;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = colorDist(r, g, b);

        if (dist < maxDist) {
          if (bgMode === 'transparent') {
            const alphaFactor = dist / maxDist;
            data[i + 3] = Math.round(alphaFactor * 40);
          } else if (bgMode === 'white') {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const resultDataUrl = canvas.toDataURL('image/png');
      setProcessedSrc(resultDataUrl);
      setProcessing(false);
    };
  };

  const reprocess = (newTol = tolerance, newBg = bgType) => {
    if (imageSrc) {
      processBackgroundRemoval(imageSrc, newTol, newBg, '#ffffff');
    }
  };

  const handleDownload = () => {
    if (!processedSrc) return;
    const link = document.createElement('a');
    link.href = processedSrc;
    link.download = `منتج_مفرغ_${Date.now()}.png`;
    link.click();

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <ShoppingBag className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>تفريغ صور المنتجات والتجارة الإلكترونية</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          إزالة خلفية الصور أونلاين
        </h1>
        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          ارفع صورة منتجك أو صورتك الشخصية وتخلص من الخلفية بدقة بنقرة واحدة، مع تنزيل فوري بصيغة PNG الشفافة فائقة النقاء وبخصوصية محلية 100%.
        </p>
      </div>

      {/* Main Upload / Workspace Area */}
      {!imageSrc ? (
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Upload Dropzone */}
          <div className="relative border border-dashed border-[#2e3038] hover:border-[#cc9166] rounded-[10px] p-12 sm:p-20 text-center bg-[#040406] transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-14 h-14 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-base font-medium text-[#ffffff] mb-1">
              اسحب صورة المنتج أو اضغط هنا لرفعها
            </h3>
            <p className="text-xs text-[#5e616e] max-w-md mx-auto font-mono mb-4">
              يدعم صور JPG, PNG, WEBP بدقة كاملة وبدون خوادم خارجية
            </p>
            <span className="inline-block px-4 py-1.5 bg-[#ffffff] text-[#000000] text-xs font-medium rounded-full hover:bg-[#e2e3e9] transition-colors">
              اختيار صورة من جهازك
            </span>
          </div>

          {/* Social Proof & Live Samples Section */}
          <div className="p-8 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1c1d22] gap-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>نماذج حيّة للتجربة السريعة</span>
                </span>
                <h3 className="text-lg font-serif text-[#ffffff] mt-1">
                  جرّب الأداة بنقرة واحدة على أحد النماذج الجاهزة
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#5e616e]">
                <ShieldCheck className="w-4 h-4 text-[#cc9166]" />
                <span>معالجة محلية داخل المتصفح</span>
              </div>
            </div>

            {/* Presets Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {samplePresets.map((preset, idx) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset, idx)}
                  className="group p-4 rounded-[10px] bg-[#121317] border border-[#1c1d22] hover:border-[#cc9166] transition-all text-start flex flex-col justify-between"
                >
                  <div className="w-full h-32 rounded-[6px] overflow-hidden bg-[#08080a] flex items-center justify-center mb-3 border border-[#1c1d22] group-hover:border-[#2e3038]">
                    <div 
                      className="w-full h-full flex items-center justify-center p-2"
                      dangerouslySetInnerHTML={{ __html: preset.svg }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#cc9166] block">
                      {preset.category}
                    </span>
                    <h4 className="text-xs font-medium text-[#ffffff] mt-0.5 group-hover:text-[#cc9166] transition-colors">
                      {preset.title}
                    </h4>
                    <span className="text-[11px] text-[#5e616e] mt-2 inline-flex items-center gap-1">
                      <span>اضغط لتفريغ النموذج فوراً ←</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Features strip */}
            <div className="mt-8 pt-6 border-t border-[#1c1d22] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#9194a1]">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#cc9166] shrink-0" />
                <span>عزل احترافي للخلفيات المتباينة</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#cc9166] shrink-0" />
                <span>تصدير PNG شفاف أو أبيض نقي للمتاجر</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#cc9166] shrink-0" />
                <span>خصوصية تامة بدون رفع لصورك الشخصية</span>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Controls Bar: Slash pill style */}
          <div className="bg-[#040406] p-4 rounded-[10px] border border-[#1c1d22] flex flex-wrap items-center justify-between gap-4">
            
            {/* View switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#5e616e]">العرض:</span>
              <div className="bg-[#121317] p-1 rounded-full border border-[#1c1d22] flex items-center">
                <button
                  onClick={() => setViewMode('processed')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    viewMode === 'processed'
                      ? 'bg-[#ffffff] text-[#000000] font-semibold'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  النتيجة (مفرغة)
                </button>
                <button
                  onClick={() => setViewMode('original')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    viewMode === 'original'
                      ? 'bg-[#ffffff] text-[#000000] font-semibold'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  الأصلية (قبل)
                </button>
              </div>
            </div>

            {/* Background type */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#5e616e]">الخلفية:</span>
              <div className="bg-[#121317] p-1 rounded-full border border-[#1c1d22] flex items-center">
                <button
                  onClick={() => {
                    setBgType('transparent');
                    reprocess(tolerance, 'transparent');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    bgType === 'transparent'
                      ? 'bg-[#ffffff] text-[#000000] font-semibold'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  شفافة (PNG)
                </button>
                <button
                  onClick={() => {
                    setBgType('white');
                    reprocess(tolerance, 'white');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    bgType === 'white'
                      ? 'bg-[#ffffff] text-[#000000] font-semibold'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  أبيض نقي
                </button>
              </div>
            </div>

            {/* Tolerance slider */}
            <div className="flex items-center gap-3">
              <Sliders className="w-3.5 h-3.5 text-[#5e616e]" />
              <label className="text-xs font-mono text-[#9194a1]">الحساسية:</label>
              <input
                type="range"
                min="10"
                max="70"
                value={tolerance}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTolerance(val);
                  reprocess(val, bgType);
                }}
                className="w-20 accent-[#cc9166] cursor-pointer"
              />
              <span className="text-xs text-[#5e616e] font-mono">{tolerance}</span>
            </div>

            {/* New upload button */}
            <label className="text-xs font-mono text-[#9194a1] hover:text-[#ffffff] cursor-pointer bg-[#121317] hover:bg-[#1c1d22] px-3.5 py-1.5 rounded-full border border-[#1c1d22] transition-colors">
              رفع صورة أخرى
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview Box */}
          <div className="bg-[#040406] rounded-[10px] border border-[#1c1d22] p-6">
            <div className="min-h-[420px] flex items-center justify-center rounded-[6px] overflow-hidden relative border border-[#1c1d22]">
              
              {/* Checkerboard Pattern for Transparency */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #121317 25%, transparent 25%), linear-gradient(-45deg, #121317 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #121317 75%), linear-gradient(-45deg, transparent 75%, #121317 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  backgroundColor: '#08080a',
                }}
              />

              {processing && (
                <div className="absolute inset-0 bg-[#08080a]/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#cc9166] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs font-mono text-[#e2e3e9]">جاري تفريغ وعزل الخلفية...</p>
                </div>
              )}

              {/* Display Image */}
              <div className="relative z-10 max-h-[480px] flex items-center justify-center p-4">
                {viewMode === 'processed' && processedSrc ? (
                  <img
                    src={processedSrc}
                    alt="الصورة بدون خلفية"
                    className="max-h-[460px] max-w-full object-contain rounded-[6px]"
                  />
                ) : (
                  <img
                    src={imageSrc}
                    alt="الصورة الأصلية"
                    className="max-h-[460px] max-w-full object-contain rounded-[6px]"
                  />
                )}
              </div>
            </div>

            {/* Bottom Bar: Slash White Pill */}
            <div className="mt-6 pt-4 border-t border-[#1c1d22] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#5e616e] font-mono">
                <Check className="w-3.5 h-3.5 text-[#cc9166]" />
                <span>جاهز للتحميل بجودة PNG كاملة الأبعاد</span>
              </div>

              <button
                onClick={handleDownload}
                disabled={!processedSrc || processing}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل الصورة بدون خلفية (PNG)</span>
              </button>
            </div>
          </div>

          {/* Pro tip */}
          <div className="p-5 bg-[#040406] rounded-[10px] border border-[#1c1d22] text-xs text-[#9194a1] flex items-start gap-3">
            <span className="text-[#cc9166] font-mono font-bold shrink-0">TIP /</span>
            <p className="leading-relaxed text-[#5e616e]">
              لأصحاب المتاجر: التقط صور المنتجات أمام خلفية موحدة (بيضاء أو بلون مغاير) للحصول على تفريغ احترافي وحواف ناعمة تلقائياً.
            </p>
          </div>

        </div>
      )}

      {/* Ad slot: Placed neatly AFTER the tool, never blocking the main interface */}
      <div className="max-w-4xl mx-auto mt-12">
        <AdBanner slot="remove-bg-bottom" />
      </div>

    </div>
  );
}
