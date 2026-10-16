'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Sparkles, 
  Sliders, 
  Image as ImageIcon, 
  RotateCcw,
  ShoppingBag,
  Check,
  Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/AdBanner';

export default function RemoveBgPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [tolerance, setTolerance] = useState(30);
  const [bgType, setBgType] = useState<'transparent' | 'white' | 'color'>('transparent');
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [viewMode, setViewMode] = useState<'processed' | 'original'>('processed');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSrc(result);
        processBackgroundRemoval(result, tolerance, bgType, customColor);
      };
      reader.readAsDataURL(file);
    }
  };

  // Algorithm for smart background removal
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

      // Sample background color from corners (top-left, top-right, bottom-left, bottom-right)
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

      // Color distance helper
      const colorDist = (r: number, g: number, b: number) => {
        return Math.sqrt(
          Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
        );
      };

      const maxDist = tol * 4.4; // mapped threshold

      // Convert hex to rgb
      const hexToRgb = (hex: string) => {
        const num = parseInt(hex.replace('#', ''), 16);
        return {
          r: (num >> 16) & 255,
          g: (num >> 8) & 255,
          b: num & 255,
        };
      };
      const customRgb = hexToRgb(colorHex);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = colorDist(r, g, b);

        if (dist < maxDist) {
          if (bgMode === 'transparent') {
            // Smooth edge alpha feathering
            const alphaFactor = dist / maxDist;
            data[i + 3] = Math.round(alphaFactor * 60);
          } else if (bgMode === 'white') {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = 255;
          } else {
            data[i] = customRgb.r;
            data[i + 1] = customRgb.g;
            data[i + 2] = customRgb.b;
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

  const reprocess = (
    newTol = tolerance,
    newBg = bgType,
    newColor = customColor
  ) => {
    if (imageSrc) {
      processBackgroundRemoval(imageSrc, newTol, newBg, newColor);
    }
  };

  const handleDownload = () => {
    if (!processedSrc) return;
    const link = document.createElement('a');
    link.href = processedSrc;
    link.download = `منتج_بدون_خلفية_${Date.now()}.png`;
    link.click();

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-3">
          <ShoppingBag className="w-4 h-4 text-purple-600" />
          <span>الأداة المفضلة لتجار إنستغرام ومتاجر سلة وزد وشوبيفاي</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          إزالة وتفريغ خلفية الصور أونلاين
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
          ارفع صورة منتجك أو صورتك الشخصية وتخلص من الخلفية بنقرة واحدة مع تنزيل فوري بصيغة PNG الشفافة.
        </p>
      </div>

      <AdBanner slot="remove-bg-top" />

      {/* Main Upload / Workspace Area */}
      {!imageSrc ? (
        <div className="relative border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-3xl p-10 sm:p-16 text-center bg-purple-50/30 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            اسحب صورة المنتج أو اضغط هنا لرفعها
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            يدعم صور JPG, PNG, WEBP. حجم الملف غير محدود ومعالجة سريعة.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            
            {/* View switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">العرض:</span>
              <button
                onClick={() => setViewMode('processed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'processed'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                المفرغة (النتيجة)
              </button>
              <button
                onClick={() => setViewMode('original')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'original'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                الصورة الأصلية
              </button>
            </div>

            {/* Background type switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">نوع الخلفية:</span>
              <button
                onClick={() => {
                  setBgType('transparent');
                  reprocess(tolerance, 'transparent', customColor);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  bgType === 'transparent'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                شفافة (PNG)
              </button>
              <button
                onClick={() => {
                  setBgType('white');
                  reprocess(tolerance, 'white', customColor);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  bgType === 'white'
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white text-gray-700'
                }`}
              >
                أبيض نقي (للمتاجر)
              </button>
            </div>

            {/* Tolerance slider */}
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4 text-gray-400" />
              <label className="text-xs font-bold text-gray-600">حساسية التفريغ:</label>
              <input
                type="range"
                min="10"
                max="70"
                value={tolerance}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTolerance(val);
                  reprocess(val, bgType, customColor);
                }}
                className="w-24 accent-purple-600 cursor-pointer"
              />
              <span className="text-xs text-gray-500 w-6">{tolerance}</span>
            </div>

            {/* New upload button */}
            <label className="text-xs font-bold text-gray-600 hover:text-purple-600 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 transition-colors">
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
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <div className="min-h-[420px] flex items-center justify-center rounded-2xl overflow-hidden relative border border-gray-100">
              
              {/* Checkerboard Pattern for Transparency */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                  backgroundColor: '#ffffff',
                }}
              />

              {processing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm font-bold text-purple-900">جاري إزالة وتفريغ الخلفية بدقة...</p>
                </div>
              )}

              {/* Current Displayed Image */}
              <div className="relative z-10 max-h-[500px] flex items-center justify-center p-4">
                {viewMode === 'processed' && processedSrc ? (
                  <img
                    src={processedSrc}
                    alt="الصورة بدون خلفية"
                    className="max-h-[480px] max-w-full object-contain drop-shadow-md rounded-lg"
                  />
                ) : (
                  <img
                    src={imageSrc}
                    alt="الصورة الأصلية"
                    className="max-h-[480px] max-w-full object-contain rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Bottom Download Bar */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>جاهزة للتنزيل بجودة PNG شفافة كاملة الأبعاد</span>
              </div>

              <button
                onClick={handleDownload}
                disabled={!processedSrc || processing}
                className="w-full sm:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الصورة بدون خلفية (PNG)</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Pro tip for sellers */}
      <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold mb-1">نصيحة ذهبية لأصحاب المتاجر الإلكترونية وحسابات إنستغرام:</h4>
          <p className="text-amber-800 leading-relaxed">
            للحصول على أعلى دقة تفريغ بدون فقدان تفاصيل منتجك، التقط صور المنتجات تحت إضاءة جيدة وأمام خلفية بيضاء أو موحدة اللون. يمكنك أيضاً تجربة خيار &quot;أبيض نقي&quot; ليصبح منتجك جاهزاً مباشرة للنشر على منصات مثل أمازون وسلة وزد بدون أي تعديل إضافي.
          </p>
        </div>
      </div>

      <AdBanner slot="remove-bg-bottom" />

    </div>
  );
}
