'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Sliders, 
  ShoppingBag,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  RotateCcw,
  Palette,
  Eye,
  Info,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/AdBanner';
import AuthGuard from '@/components/AuthGuard';
import { useSubscription } from '@/context/SubscriptionContext';
import { useLanguage } from '@/context/LanguageContext';
import { Crown } from 'lucide-react';

export default function RemoveBgPage() {
  const { lang } = useLanguage();
  const { isPro, checkCanUse, openPaywall, recordUsage, dailyUsage } = useSubscription();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Customization
  const [bgType, setBgType] = useState<'transparent' | 'white' | 'color' | 'custom'>('transparent');
  const [customColor, setCustomColor] = useState('#cc9166');
  const [viewMode, setViewMode] = useState<'processed' | 'original'>('processed');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalBlobRef = useRef<Blob | File | null>(null);
  const rawCutoutDataUrlRef = useRef<string | null>(null);

  // Sample presets for quick testing
  const samplePresets = [
    {
      id: 1,
      title: lang === 'ar' ? 'منتج تجاري (حذاء رياضي)' : 'Commercial Product (Sneakers)',
      category: lang === 'ar' ? 'التجارة الإلكترونية' : 'E-Commerce',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#cbd5e1"/>
        <g transform="translate(60, 60)">
          <path d="M40 120 Q60 70 120 70 L180 80 Q220 90 250 130 Q260 150 240 160 L50 160 Q30 160 30 140 Z" fill="#cc9166" stroke="#b47b52" stroke-width="4"/>
          <path d="M40 145 L250 145 Q260 160 240 170 L35 170 Q25 170 30 155 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/>
          <path d="M100 80 L140 130" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
          <path d="M120 80 L160 130" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
          <circle cx="80" cy="115" r="16" fill="#121317"/>
        </g>
      </svg>`,
    },
    {
      id: 2,
      title: lang === 'ar' ? 'زجاجة عطر فاخرة' : 'Luxury Perfume Bottle',
      category: lang === 'ar' ? 'مستحضرات وتجميل' : 'Cosmetics',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#94a3b8"/>
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
      title: lang === 'ar' ? 'ساعة يد ذكية' : 'Smart Watch',
      category: lang === 'ar' ? 'إلكترونيات وإكسسوار' : 'Electronics',
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#e2e8f0"/>
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

  // Process Background Color Overlays on Top of Raw Cutout
  const applyBackgroundStyle = (
    cutoutDataUrl: string, 
    bgMode: 'transparent' | 'white' | 'color' | 'custom', 
    colorValue: string
  ) => {
    if (bgMode === 'transparent') {
      setProcessedSrc(cutoutDataUrl);
      return;
    }

    const img = new Image();
    img.src = cutoutDataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fill Background
      if (bgMode === 'white') {
        ctx.fillStyle = '#ffffff';
      } else if (bgMode === 'color') {
        ctx.fillStyle = '#08080a';
      } else {
        ctx.fillStyle = colorValue;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Cutout Image on top
      ctx.drawImage(img, 0, 0);
      setProcessedSrc(canvas.toDataURL('image/png'));
    };
  };

  // High-Precision AI Removal powered by official remove.bg API
  const runAiBackgroundRemoval = async (source: Blob | File) => {
    // Check daily limit for Free users (Max 2 images per day)
    if (!isPro) {
      const check = checkCanUse('bg_remove');
      if (!check.allowed) {
        openPaywall({
          title: 'استنفاد الحد اليومي لتفريغ الصور',
          message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود وبدقة Ultra-HD فائقة النقاء.',
          featureName: 'تفريغ صور غير محدود بدقة Ultra-HD',
        });
        return;
      }
    }

    try {
      setErrorMessage(null);
      setProcessing(true);
      setProgressPercent(15);
      setProgressMsg(isPro ? 'جاري رفع الصورة لمعالجة HD فائقة الدقة...' : 'جاري رفع الصورة إلى محرك remove.bg...');

      const formData = new FormData();
      formData.append('image_file', source);
      // Free users get standard preview/SD, Pro users get full auto HD
      formData.append('size', isPro ? 'auto' : 'preview');

      setProgressPercent(45);
      setProgressMsg('يقوم الذكاء الاصطناعي في remove.bg بتفريغ وعزل الأطراف...');

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errText = 'فشل في الاتصال بمحرك إزالة الخلفية';
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errText = errorData.message;
          }
        } catch {
          if (response.status === 402) {
            errText = 'تم استنفاد رصيد API المتاح في remove.bg (402 Insufficient credits). يرجى شحن الرصيد أو تجديد المفتاح.';
          } else if (response.status === 403) {
            errText = 'مفتاح API غير صالح أو تم حظره من قبل remove.bg (403 Forbidden).';
          } else {
            errText = `حدث خطأ من الخادم (رمز الحالة: ${response.status})`;
          }
        }
        throw new Error(errText);
      }

      setProgressPercent(80);
      setProgressMsg('جاري استلام الصورة المفرغة وتجهيز جودة PNG...');

      const blobResult = await response.blob();
      const reader = new FileReader();
      reader.onload = async () => {
        const cutoutDataUrl = reader.result as string;
        rawCutoutDataUrlRef.current = cutoutDataUrl;
        applyBackgroundStyle(cutoutDataUrl, bgType, customColor);
        setProcessing(false);
        setProgressPercent(100);
        setProgressMsg('اكتملت إزالة الخلفية بنجاح!');

        // Record daily usage for Free tier
        if (!isPro) {
          await recordUsage('bg_remove');
        }
      };
      reader.readAsDataURL(blobResult);

    } catch (err: any) {
      console.error('remove.bg processing error:', err);
      setProcessing(false);
      setErrorMessage(err.message || 'تعذر عزل الخلفية. يرجى التأكد من جودة الصورة أو التحقق من رصيد المفتاح.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      originalBlobRef.current = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageSrc(result);
        runAiBackgroundRemoval(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
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
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            originalBlobRef.current = pngBlob;
            setImageSrc(canvas.toDataURL('image/png'));
            runAiBackgroundRemoval(pngBlob);
          }
        }, 'image/png');
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleDownload = () => {
    if (!processedSrc) return;
    const link = document.createElement('a');
    link.href = processedSrc;
    link.download = `منتج_مفرغ_بدقة_عالية_${Date.now()}.png`;
    link.click();

    confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <AuthGuard toolName={lang === 'ar' ? 'إزالة وتفريغ خلفية الصور' : 'AI Background Remover'}>
      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>{lang === 'ar' ? 'محرك الذكاء الاصطناعي الرسمي (remove.bg API v1.0)' : 'Official AI Engine (remove.bg API v1.0)'}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          {lang === 'ar' ? 'إزالة وتفريغ خلفية الصور باحترافية' : 'Professional AI Background Remover'}
        </h1>
        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          {lang === 'ar'
            ? 'عزل فائق الدقة للأشخاص، المنتجات التجارية، والسيارات بواسطة واجهة برمجة remove.bg الرسمية بأعلى جودة وتفريغ مليمتر للأطراف.'
            : 'Ultra-accurate cutout for portraits, e-commerce products, and objects powered by the official remove.bg engine.'}
        </p>
      </div>

      {/* Global Error Alert Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-8 p-4 rounded-[10px] bg-red-950/40 border border-red-500/40 text-red-200 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-red-200">{lang === 'ar' ? 'تنبيه في معالجة الصورة' : 'Processing Alert'}</h4>
            <p className="text-xs text-red-300/90 mt-1 leading-relaxed">{errorMessage}</p>
            {originalBlobRef.current && (
              <button
                onClick={() => runAiBackgroundRemoval(originalBlobRef.current!)}
                className="mt-3 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-100 text-xs font-mono rounded-full inline-flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{lang === 'ar' ? 'إعادة المحاولة عبر السيرفر' : 'Retry via Server'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
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
            <h3 className="text-lg font-medium text-[#ffffff] mb-1">
              {lang === 'ar' ? 'اسحب صورة المنتج أو الصورة الشخصية هنا' : 'Drag product or portrait image here'}
            </h3>
            <p className="text-xs text-[#5e616e] max-w-md mx-auto font-mono mb-5">
              {lang === 'ar' ? 'يدعم JPG, PNG, WEBP بدقة كاملة عبر محرك remove.bg' : 'Supports JPG, PNG, WEBP with full resolution via remove.bg'}
            </p>
            <span className="inline-block px-5 py-2 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold rounded-full transition-colors shadow-md">
              {lang === 'ar' ? 'اختيار صورة من جهازك' : 'Choose Image from Device'}
            </span>
          </div>

          {/* Engine Status Bar */}
          <div className="p-4 rounded-[10px] bg-[#040406] border border-[#1c1d22] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#cc9166]" />
              <span className="text-xs font-mono text-[#ffffff]">{lang === 'ar' ? 'المحرك النشط:' : 'Active Engine:'}</span>
              <span className="text-xs font-mono text-[#cc9166]">
                {isPro ? 'remove.bg Cloud API (Ultra-HD Pro)' : 'remove.bg Cloud API (SD Standard)'}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              {isPro ? (
                <span className="flex items-center gap-1.5 text-[#cc9166] bg-[#cc9166]/10 px-3 py-1 rounded-full border border-[#cc9166]/30">
                  <Crown className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'باقة Pro: استخدام غير محدود فائق الدقة' : 'Pro Plan: Unlimited Ultra-HD'}</span>
                </span>
              ) : (
                <span className="text-[#9194a1] bg-[#121317] px-3 py-1 rounded-full border border-[#1c1d22]">
                  {lang === 'ar'
                    ? `المجاني: متبقي لك اليوم (${Math.max(0, 2 - (dailyUsage.bgCount || 0))} من 2)`
                    : `Free Plan: ${Math.max(0, 2 - (dailyUsage.bgCount || 0))} of 2 remaining today`}
                </span>
              )}
            </div>
          </div>

          {/* Social Proof & Live Samples Section */}
          <div className="p-8 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1c1d22] gap-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'نماذج حيّة للتجربة السريعة' : 'Live Demo Samples'}</span>
                </span>
                <h3 className="text-lg font-serif text-[#ffffff] mt-1">
                  {lang === 'ar' ? 'اضغط على أي نموذج لتجربة العزل فائق الدقة فوراً' : 'Click any sample to test high-res removal instantly'}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#5e616e]">
                <ShieldCheck className="w-4 h-4 text-[#cc9166]" />
                <span>{lang === 'ar' ? 'معالجة محلية داخل المتصفح' : 'Fast browser processing'}</span>
              </div>
            </div>

            {/* Presets Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
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
                      <span>{lang === 'ar' ? 'اضغط لتفريغ النموذج فوراً ←' : 'Click to cutout sample →'}</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Controls Bar: Slash pill style */}
          <div className="bg-[#040406] p-4 rounded-[10px] border border-[#1c1d22] flex flex-wrap items-center justify-between gap-4">
            
            {/* View switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#5e616e]">{lang === 'ar' ? 'العرض:' : 'View:'}</span>
              <div className="bg-[#121317] p-1 rounded-full border border-[#1c1d22] flex items-center">
                <button
                  onClick={() => setViewMode('processed')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    viewMode === 'processed'
                      ? 'bg-[#ffffff] text-[#000000] font-semibold'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  {lang === 'ar' ? 'النتيجة (مفرغة)' : 'Cutout (Result)'}
                </button>
                <button
                  onClick={() => setViewMode('original')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    viewMode === 'original'
                      ? 'bg-[#ffffff] text-[#000000] font-semibold'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  {lang === 'ar' ? 'الأصلية (قبل)' : 'Original (Before)'}
                </button>
              </div>
            </div>

            {/* Background type */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#5e616e]">{lang === 'ar' ? 'الخلفية البديلة:' : 'Background:'}</span>
              <div className="bg-[#121317] p-1 rounded-full border border-[#1c1d22] flex items-center gap-1">
                <button
                  onClick={() => {
                    setBgType('transparent');
                    if (rawCutoutDataUrlRef.current) applyBackgroundStyle(rawCutoutDataUrlRef.current, 'transparent', customColor);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    bgType === 'transparent'
                      ? 'bg-[#ffffff] text-[#000000] font-semibold'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  {lang === 'ar' ? 'شفافة (PNG)' : 'Transparent (PNG)'}
                </button>
                <button
                  onClick={() => {
                    setBgType('white');
                    if (rawCutoutDataUrlRef.current) applyBackgroundStyle(rawCutoutDataUrlRef.current, 'white', customColor);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    bgType === 'white'
                      ? 'bg-[#ffffff] text-[#000000] font-semibold'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  {lang === 'ar' ? 'أبيض نقي' : 'Pure White'}
                </button>
                <button
                  onClick={() => {
                    setBgType('custom');
                    if (rawCutoutDataUrlRef.current) applyBackgroundStyle(rawCutoutDataUrlRef.current, 'custom', customColor);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    bgType === 'custom'
                      ? 'bg-[#ffffff] text-[#000000] font-semibold'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  <Palette className="w-3 h-3 text-[#cc9166]" />
                  <span>{lang === 'ar' ? 'لون مخصص' : 'Custom'}</span>
                </button>
              </div>

              {bgType === 'custom' && (
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    const c = e.target.value;
                    setCustomColor(c);
                    if (rawCutoutDataUrlRef.current) applyBackgroundStyle(rawCutoutDataUrlRef.current, 'custom', c);
                  }}
                  className="w-7 h-7 rounded-full bg-transparent border-0 cursor-pointer"
                  title={lang === 'ar' ? 'اختر لون الخلفية' : 'Choose background color'}
                />
              )}
            </div>

            {/* Re-process / New Upload */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-[#9194a1] hover:text-[#ffffff] cursor-pointer bg-[#121317] hover:bg-[#1c1d22] px-3.5 py-1.5 rounded-full border border-[#1c1d22] transition-colors">
                {lang === 'ar' ? 'رفع صورة أخرى' : 'Upload Another Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-[#040406] rounded-[10px] border border-[#1c1d22] p-6">
            <div className="min-h-[440px] flex items-center justify-center rounded-[6px] overflow-hidden relative border border-[#1c1d22]">
              
              {/* Checkerboard Pattern for Transparency */}
              {bgType === 'transparent' && (
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
              )}

              {/* Progress Indicator */}
              {processing && (
                <div className="absolute inset-0 bg-[#08080a]/95 z-30 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 border-2 border-[#cc9166] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm font-medium text-[#ffffff] mb-2">{progressMsg}</p>
                  
                  {/* Progress bar */}
                  <div className="w-full max-w-xs bg-[#121317] h-2 rounded-full overflow-hidden border border-[#2e3038] mb-2">
                    <div 
                      className="bg-[#cc9166] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#cc9166]">{progressPercent}%</span>
                  <span className="text-[11px] text-[#5e616e] mt-2 font-mono">
                    {lang === 'ar' ? 'معالجة فائقة الدقة عبر محرك remove.bg الرسمي' : 'High-precision processing via official remove.bg engine'}
                  </span>
                </div>
              )}

              {/* Display Image */}
              <div className="relative z-10 max-h-[480px] flex items-center justify-center p-4">
                {viewMode === 'processed' && processedSrc ? (
                  <img
                    src={processedSrc}
                    alt="Processed result"
                    className="max-h-[460px] max-w-full object-contain rounded-[6px]"
                  />
                ) : (
                  <img
                    src={imageSrc}
                    alt="Original image"
                    className="max-h-[460px] max-w-full object-contain rounded-[6px]"
                  />
                )}
              </div>
            </div>

            {/* Bottom Bar: Slash White Pill */}
            <div className="mt-6 pt-4 border-t border-[#1c1d22] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#5e616e] font-mono">
                <Check className="w-3.5 h-3.5 text-[#cc9166]" />
                <span>{lang === 'ar' ? 'جاهز للتحميل بجودة PNG فائقة الدقة والأبعاد الأصلية' : 'Ready to download in high-res PNG with original dimensions'}</span>
              </div>

              <button
                onClick={handleDownload}
                disabled={!processedSrc || processing}
                className="w-full sm:w-auto px-7 py-2.5 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تحميل الصورة المفرغة (PNG)' : 'Download Cutout (PNG)'}</span>
              </button>
            </div>
          </div>

          {/* Pro tip */}
          <div className="p-5 bg-[#040406] rounded-[10px] border border-[#1c1d22] text-xs text-[#9194a1] flex items-start gap-3">
            <span className="text-[#cc9166] font-mono font-bold shrink-0">TIP /</span>
            <p className="leading-relaxed text-[#5e616e]">
              {lang === 'ar'
                ? 'لأصحاب المتاجر الإلكترونية والبائعين: استخدم خيار "أبيض نقي" للحصول على صور متوافقة فوراً مع اشتراطات منصات Amazon وShopify وNoon.'
                : 'For e-commerce sellers: Use the "Pure White" option for instant compliance with Amazon, Shopify, and Noon guidelines.'}
            </p>
          </div>

        </div>
      )}

      {/* Ad slot: Bottom */}
      <div className="max-w-4xl mx-auto mt-12">
        <AdBanner slot="remove-bg-bottom" />
      </div>

    </div>
    </AuthGuard>
  );
}
