'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Sliders, 
  ShoppingBag,
  Check
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSrc(result);
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
            data[i + 3] = Math.round(alphaFactor * 60);
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
    link.download = `منتج_شفاف_${Date.now()}.png`;
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
          ارفع صورة منتجك أو صورتك الشخصية وتخلص من الخلفية بنقرة واحدة مع تنزيل فوري بصيغة PNG الشفافة فائقة النقاء.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <AdBanner slot="remove-bg-top" />
      </div>

      {/* Main Upload / Workspace Area */}
      {!imageSrc ? (
        <div className="max-w-4xl mx-auto relative border border-dashed border-[#2e3038] hover:border-[#cc9166] rounded-[10px] p-12 sm:p-20 text-center bg-[#040406] transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-12 h-12 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mx-auto mb-4">
            <Upload className="w-5 h-5" />
          </div>
          <h3 className="text-base font-medium text-[#ffffff] mb-1">
            اسحب صورة المنتج أو اضغط هنا لرفعها
          </h3>
          <p className="text-xs text-[#5e616e] max-w-md mx-auto font-mono">
            يدعم صور JPG, PNG, WEBP بدقة كاملة
          </p>
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
                  النتيجة
                </button>
                <button
                  onClick={() => setViewMode('original')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    viewMode === 'original'
                      ? 'bg-[#ffffff] text-[#000000] font-semibold'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  الأصلية
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
              لأصحاب المتاجر: التقط صور المنتجات أمام خلفية موحدة للحصول على تفريغ احترافي وحواف فائقة النعومة مباشرة بدون برامج تصميم.
            </p>
          </div>

        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <AdBanner slot="remove-bg-bottom" />
      </div>

    </div>
  );
}
