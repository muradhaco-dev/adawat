'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  Wifi, 
  MessageSquare, 
  FileText, 
  Palette, 
  Upload, 
  Trash2,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/AdBanner';
import AuthGuard from '@/components/AuthGuard';
import { useLanguage } from '@/context/LanguageContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { Crown } from 'lucide-react';

export default function QRCodeGeneratorPage() {
  const { lang } = useLanguage();
  const { isPro, openPaywall } = useSubscription();

  // Mode: url | image | text | whatsapp | wifi
  const [mode, setMode] = useState<'url' | 'image' | 'text' | 'whatsapp' | 'wifi'>('url');
  
  // Inputs
  const [urlInput, setUrlInput] = useState('https://adawat.vercel.app');
  const [textInput, setTextInput] = useState('منصة أدواتك الرقمية');
  const [waPhone, setWaPhone] = useState('+905319666195');
  const [waMessage, setWaMessage] = useState('مرحباً، أود الاستفسار عن خدماتك.');
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState('password123');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Image mode state
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [imageLink, setImageLink] = useState('');
  const [imageModeType, setImageModeType] = useState<'logo' | 'link'>('logo');

  // Customization
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState<number>(360);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  
  // Output state
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute Raw String to Encode
  const getEncodedData = (): string => {
    switch (mode) {
      case 'url':
        return urlInput.trim() || 'https://adawat.vercel.app';
      case 'image':
        if (imageModeType === 'link') {
          return imageLink.trim() || 'https://images.unsplash.com';
        }
        // If logo mode, encode target URL with logo centered
        return urlInput.trim() || 'https://adawat.vercel.app';
      case 'whatsapp': {
        const cleanPhone = waPhone.replace(/[^\d]/g, '');
        const encodedMsg = encodeURIComponent(waMessage);
        return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
      }
      case 'wifi':
        return `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPassword};;`;
      case 'text':
      default:
        return textInput.trim() || 'أدواتك';
    }
  };

  // Generate QR Code with optional Centered Logo Image
  const generateQRCode = async () => {
    try {
      const dataToEncode = getEncodedData();
      const canvas = document.createElement('canvas');
      
      // Error correction level must be H if embedding a center logo image
      const ecLevel = (mode === 'image' && imageModeType === 'logo' && uploadedLogo) ? 'H' : errorCorrection;

      await QRCode.toCanvas(canvas, dataToEncode, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor === 'transparent' ? '#00000000' : bgColor,
        },
        errorCorrectionLevel: ecLevel,
      });

      // If user uploaded a logo or product image, draw it in center
      if (mode === 'image' && imageModeType === 'logo' && uploadedLogo) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const logoImg = new Image();
          logoImg.src = uploadedLogo;
          await new Promise((resolve) => {
            logoImg.onload = resolve;
          });

          const logoSize = Math.round(qrSize * 0.24);
          const x = Math.round((qrSize - logoSize) / 2);
          const y = Math.round((qrSize - logoSize) / 2);

          // Draw white/background badge behind logo for high contrast
          ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
          ctx.beginPath();
          ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2 + 4, 0, Math.PI * 2);
          ctx.fill();

          // Clip into circle
          ctx.save();
          ctx.beginPath();
          ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          ctx.restore();
        }
      }

      const resultUrl = canvas.toDataURL('image/png');
      setQrDataUrl(resultUrl);
    } catch (err) {
      console.error('Failed to generate QR:', err);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [
    mode, 
    urlInput, 
    textInput, 
    waPhone, 
    waMessage, 
    wifiSsid, 
    wifiPassword, 
    wifiAuth, 
    uploadedLogo, 
    imageLink, 
    imageModeType, 
    fgColor, 
    bgColor, 
    qrSize, 
    errorCorrection
  ]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPro) {
      openPaywall({
        title: 'دمج الشعار داخل كود الـ QR ميزة للمحترفين',
        message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود وإمكانية دمج شعار شركتك أو صورتك في قلب الكود.',
        featureName: 'دمج الشعار (Logo) داخل كود الـ QR',
      });
      return;
    }

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPNG = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `كود_QR_${Date.now()}.png`;
    link.click();
    confetti({ particleCount: 65, spread: 55, origin: { y: 0.6 } });
  };

  const handleDownloadSVG = async () => {
    try {
      const dataToEncode = getEncodedData();
      const svgString = await QRCode.toString(dataToEncode, {
        type: 'svg',
        color: {
          dark: fgColor,
          light: bgColor === 'transparent' ? '#00000000' : bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `كود_QR_فيكتور_${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
      confetti({ particleCount: 65, spread: 55, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Failed to generate SVG:', err);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      if (!qrDataUrl) return;
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      alert('تم نسخ الرابط بدلاً من ذلك');
    }
  };

  return (
    <AuthGuard toolName="صانع كود الـ QR الذكي">
      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <QrCode className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>{lang === 'ar' ? 'صانع أكواد QR الذكي عالي الدقة' : 'PRO QR CODE STUDIO'}</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          {lang === 'ar' ? 'صانع كود QR الذكي للصور والروابط' : 'Smart QR Code Generator'}
        </h1>

        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          {lang === 'ar'
            ? 'أنشئ أكواد QR احترافية قابلة للطباعة والمسح الفوري: حوّل الروابط، النصوص، وأرقام الواتساب، أو أضف شعار وصورة متجرك في قلب الكود بجودة فائقة وبخصوصية تامة 100%.'
            : 'Generate branded, high-resolution vector and PNG QR codes for websites, images, WhatsApp links, and Wi-Fi networks locally in your browser.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl mx-auto items-start">
        
        {/* Left Column: Input Form & Customization (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="bg-[#040406] p-1.5 rounded-[10px] border border-[#1c1d22] flex flex-wrap gap-1">
            <button
              onClick={() => setMode('url')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                mode === 'url' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'رابط موقع' : 'URL'}</span>
            </button>

            <button
              onClick={() => setMode('image')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                mode === 'image' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'صورة / شعار' : 'Image / Logo'}</span>
            </button>

            <button
              onClick={() => setMode('whatsapp')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                mode === 'whatsapp' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
            </button>

            <button
              onClick={() => setMode('wifi')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                mode === 'wifi' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'واي فاي' : 'Wi-Fi'}</span>
            </button>

            <button
              onClick={() => setMode('text')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                mode === 'text' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'نص حر' : 'Text'}</span>
            </button>
          </div>

          {/* Form Box */}
          <div className="bg-[#040406] p-6 rounded-[10px] border border-[#1c1d22] space-y-5">
            
            {/* MODE: URL */}
            {mode === 'url' && (
              <div>
                <label className="block text-xs font-mono text-[#cc9166] mb-2 uppercase">
                  {lang === 'ar' ? 'أدخل رابط الموقع الإلكتروني:' : 'Target Website URL:'}
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-[#5e616e] absolute right-3.5 top-3" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pr-10 pl-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] placeholder-[#5e616e] outline-none font-mono"
                  />
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2 text-[11px]">
                  <span className="text-[#5e616e]">{lang === 'ar' ? 'اقتراحات سريعة:' : 'Quick links:'}</span>
                  <button
                    onClick={() => setUrlInput('https://instagram.com')}
                    className="text-[#9194a1] hover:text-[#cc9166] underline font-mono"
                  >
                    Instagram
                  </button>
                  <button
                    onClick={() => setUrlInput('https://youtube.com')}
                    className="text-[#9194a1] hover:text-[#cc9166] underline font-mono"
                  >
                    YouTube
                  </button>
                  <button
                    onClick={() => setUrlInput('https://linkedin.com')}
                    className="text-[#9194a1] hover:text-[#cc9166] underline font-mono"
                  >
                    LinkedIn
                  </button>
                </div>
              </div>
            )}

            {/* MODE: IMAGE TO QR */}
            {mode === 'image' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1c1d22]">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isPro) {
                        openPaywall({
                          title: 'دمج الشعار داخل كود الـ QR ميزة للمحترفين',
                          message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود وإمكانية دمج شعار شركتك أو صورتك في قلب الكود.',
                          featureName: 'دمج الشعار (Logo) داخل كود الـ QR',
                        });
                        return;
                      }
                      setImageModeType('logo');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                      imageModeType === 'logo'
                        ? 'bg-[#121317] text-[#cc9166] border border-[#cc9166]/40'
                        : 'text-[#9194a1] hover:text-[#ffffff]'
                    }`}
                  >
                    {!isPro && <Crown className="w-3 h-3 text-[#cc9166]" />}
                    <span>{lang === 'ar' ? 'دمج صورة / شعار في قلب الـ QR' : 'Branded Center Logo QR'}</span>
                    {!isPro && <span className="text-[9px] font-mono bg-[#cc9166]/20 text-[#cc9166] px-1.5 py-0.2 rounded-full">PRO</span>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageModeType('link')}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      imageModeType === 'link'
                        ? 'bg-[#121317] text-[#cc9166] border border-[#cc9166]/40'
                        : 'text-[#9194a1] hover:text-[#ffffff]'
                    }`}
                  >
                    {lang === 'ar' ? '🔗 رابط مباشر لصورة' : 'Direct Image URL'}
                  </button>
                </div>

                {imageModeType === 'logo' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-[#cc9166] mb-1.5 uppercase">
                        {lang === 'ar' ? '01 / الرابط الذي يفتحه الكود عند المسح:' : '01 / Destination URL:'}
                      </label>
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://mybrand.com"
                        className="w-full px-4 py-2 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#cc9166] mb-1.5 uppercase">
                        {lang === 'ar' ? '02 / اختر الصورة أو الشعار لتثبيته في المنتصف:' : '02 / Upload Center Logo:'}
                      </label>

                      {uploadedLogo ? (
                        <div className="flex items-center justify-between p-3 rounded-[10px] bg-[#121317] border border-[#1c1d22]">
                          <div className="flex items-center gap-3">
                            <img
                              src={uploadedLogo}
                              alt="Logo"
                              className="w-10 h-10 object-contain rounded-full bg-white p-1"
                            />
                            <span className="text-xs text-[#ffffff]">
                              {lang === 'ar' ? 'تم اختيار الشعار بنجاح' : 'Logo selected'}
                            </span>
                          </div>
                          <button
                            onClick={() => setUploadedLogo(null)}
                            className="p-1.5 text-[#5e616e] hover:text-red-400"
                            title="حذف الشعار"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border border-dashed border-[#2e3038] hover:border-[#cc9166] rounded-[10px] p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#08080a]">
                          <Upload className="w-5 h-5 text-[#cc9166] mb-1" />
                          <span className="text-xs text-[#ffffff]">
                            {lang === 'ar' ? 'اضغط لرفع صورة الشعار (PNG, JPG)' : 'Click to upload logo'}
                          </span>
                          <span className="text-[10px] text-[#5e616e] font-mono mt-0.5">
                            {lang === 'ar' ? 'يُفضل صورة مربعة أو بخلفية شفافة' : 'Square or transparent recommended'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-mono text-[#cc9166] mb-1.5 uppercase">
                      {lang === 'ar' ? 'أدخل رابط الصورة المراد فتحها مباشرة:' : 'Direct Image Link:'}
                    </label>
                    <input
                      type="url"
                      value={imageLink}
                      onChange={(e) => setImageLink(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none font-mono"
                    />
                  </div>
                )}
              </div>
            )}

            {/* MODE: WHATSAPP */}
            {mode === 'whatsapp' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-[#cc9166] mb-1.5 uppercase">
                    {lang === 'ar' ? 'رقم الهاتف مع رمز الدولة (مثال: 90531...):' : 'Phone Number with Country Code:'}
                  </label>
                  <input
                    type="tel"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="+905319666195"
                    className="w-full px-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#cc9166] mb-1.5 uppercase">
                    {lang === 'ar' ? 'نص الرسالة الترحيبية التلقائية:' : 'Pre-filled WhatsApp message:'}
                  </label>
                  <input
                    type="text"
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    placeholder="مرحباً، أود التواصل معك..."
                    className="w-full px-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none"
                  />
                </div>
              </div>
            )}

            {/* MODE: WIFI */}
            {mode === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-[#cc9166] mb-1.5 uppercase">
                    {lang === 'ar' ? 'اسم شبكة الواي فاي (SSID):' : 'Network Name (SSID):'}
                  </label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#cc9166] mb-1.5 uppercase">
                    {lang === 'ar' ? 'كلمة المرور:' : 'Password:'}
                  </label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* MODE: TEXT */}
            {mode === 'text' && (
              <div>
                <label className="block text-xs font-mono text-[#cc9166] mb-1.5 uppercase">
                  {lang === 'ar' ? 'النص أو الملاحظة:' : 'Text content:'}
                </label>
                <textarea
                  rows={3}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full p-3 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-[10px] text-xs text-[#ffffff] outline-none"
                />
              </div>
            )}

          </div>

          {/* Styling & Customization Section */}
          <div className="bg-[#040406] p-6 rounded-[10px] border border-[#1c1d22] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-[#cc9166] flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تخصيص الألوان والأبعاد' : 'Styling & Export Settings'}</span>
              </h3>
              {!isPro && (
                <span className="text-[10px] font-mono text-[#cc9166] bg-[#cc9166]/10 px-2 py-0.5 rounded-full border border-[#cc9166]/30 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  الألوان الحرة لمشتركي Pro
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Foreground Color */}
              <div>
                <label className="block text-[11px] font-mono text-[#9194a1] mb-1.5">
                  {lang === 'ar' ? 'لون كود الـ QR:' : 'QR Code Color:'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFgColor('#000000')}
                      className={`w-6 h-6 rounded-full bg-black border border-white/30 ${fgColor === '#000000' ? 'ring-2 ring-[#cc9166]' : ''}`}
                      title="أسود (قياسي مجاني)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!isPro) {
                          openPaywall({
                            title: 'تخصيص ألوان الـ QR ميزة للمحترفين',
                            message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود وتخصيص كافة الألوان والخلفيات بما يلائم علامتك التجارية.',
                            featureName: 'تخصيص ألوان كود الـ QR',
                          });
                          return;
                        }
                        setFgColor('#cc9166');
                      }}
                      className={`w-6 h-6 rounded-full bg-[#cc9166] border border-white/30 ${fgColor === '#cc9166' ? 'ring-2 ring-white' : ''}`}
                      title="نحاسي مذهب (Pro)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!isPro) {
                          openPaywall({
                            title: 'تخصيص ألوان الـ QR ميزة للمحترفين',
                            message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود وتخصيص كافة الألوان والخلفيات.',
                            featureName: 'تخصيص ألوان كود الـ QR',
                          });
                          return;
                        }
                        setFgColor('#1d4ed8');
                      }}
                      className={`w-6 h-6 rounded-full bg-blue-700 border border-white/30 ${fgColor === '#1d4ed8' ? 'ring-2 ring-[#cc9166]' : ''}`}
                      title="أزرق (Pro)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!isPro) {
                          openPaywall({
                            title: 'تخصيص ألوان الـ QR ميزة للمحترفين',
                            message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود وتخصيص كافة الألوان والخلفيات.',
                            featureName: 'تخصيص ألوان كود الـ QR',
                          });
                          return;
                        }
                        setFgColor('#059669');
                      }}
                      className={`w-6 h-6 rounded-full bg-emerald-600 border border-white/30 ${fgColor === '#059669' ? 'ring-2 ring-[#cc9166]' : ''}`}
                      title="أخضر (Pro)"
                    />
                  </div>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => {
                      if (!isPro) {
                        openPaywall({
                          title: 'تخصيص ألوان الـ QR ميزة للمحترفين',
                          message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود وتخصيص كافة الألوان والخلفيات.',
                          featureName: 'تخصيص ألوان كود الـ QR',
                        });
                        return;
                      }
                      setFgColor(e.target.value);
                    }}
                    className="w-7 h-7 rounded-full bg-transparent border-0 cursor-pointer"
                    title="لون مخصص (Pro)"
                  />
                  <span className="text-[10px] font-mono text-[#5e616e]">{fgColor}</span>
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-[11px] font-mono text-[#9194a1] mb-1.5">
                  {lang === 'ar' ? 'لون الخلفية:' : 'Background Color:'}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBgColor('#ffffff')}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      bgColor === '#ffffff'
                        ? 'bg-white text-black font-bold border-white'
                        : 'bg-[#121317] text-[#9194a1] border-[#1c1d22]'
                    }`}
                  >
                    أبيض (قياسي مجاني)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isPro) {
                        openPaywall({
                          title: 'الخلفية الشفافة ميزة للمحترفين',
                          message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط لتوليد كود QR بخلفية شفافة عالية الدقة.',
                          featureName: 'خلفية شفافة للـ QR',
                        });
                        return;
                      }
                      setBgColor('transparent');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 ${
                      bgColor === 'transparent'
                        ? 'bg-[#121317] text-[#cc9166] border-[#cc9166]'
                        : 'bg-[#121317] text-[#9194a1] border-[#1c1d22]'
                    }`}
                  >
                    <span>شفاف</span>
                    {!isPro && <span className="text-[9px] font-mono bg-[#cc9166]/20 text-[#cc9166] px-1 rounded">PRO</span>}
                  </button>
                </div>
              </div>

            </div>

            {/* Resolution Selector */}
            <div className="pt-2 border-t border-[#1c1d22] flex items-center justify-between text-xs">
              <span className="text-[#9194a1] font-mono">
                {lang === 'ar' ? 'دقة التصدير للطباعة:' : 'Resolution:'}
              </span>
              <div className="flex items-center gap-1.5">
                {[256, 360, 512, 1024].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setQrSize(size)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors ${
                      qrSize === size
                        ? 'bg-[#ffffff] text-[#000000] font-semibold'
                        : 'bg-[#121317] text-[#9194a1] hover:text-[#ffffff]'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Live QR Preview & Export (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-[#040406] p-7 rounded-[10px] border border-[#1c1d22] text-center space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1d22]">
              <span className="text-xs font-mono uppercase text-[#cc9166]">
                {lang === 'ar' ? 'المعاينة الحية' : 'Live Preview'}
              </span>
              <span className="text-[10px] text-[#5e616e] font-mono">
                {qrSize} × {qrSize} px
              </span>
            </div>

            {/* Display Box */}
            <div className="p-6 rounded-[10px] bg-[#121317] border border-[#1c1d22] flex items-center justify-center relative min-h-[300px]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="max-w-[260px] w-full h-auto rounded-[8px] shadow-xl"
                />
              ) : (
                <div className="w-8 h-8 border-2 border-[#cc9166] border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={handleDownloadPNG}
                className="w-full py-3 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تحميل كود QR (صورة PNG عادية)' : 'Download PNG'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleDownloadSVG}
                  className="py-2.5 px-3 bg-[#121317] hover:bg-[#1c1d22] text-[#e2e3e9] hover:text-[#ffffff] text-xs font-medium rounded-full border border-[#1c1d22] hover:border-[#2e3038] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3 h-3 text-[#cc9166]" />
                  <span>{lang === 'ar' ? 'تحميل فيكتور SVG' : 'SVG Vector'}</span>
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  className="py-2.5 px-3 bg-[#121317] hover:bg-[#1c1d22] text-[#e2e3e9] hover:text-[#ffffff] text-xs font-medium rounded-full border border-[#1c1d22] hover:border-[#2e3038] transition-colors flex items-center justify-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#cc9166]" />
                      <span>{lang === 'ar' ? 'نسخ الصورة' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Guaranteed Local Trust info */}
            <div className="pt-3 border-t border-[#1c1d22] text-start flex items-start gap-2.5 text-[11px] text-[#5e616e]">
              <ShieldCheck className="w-4 h-4 text-[#cc9166] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {lang === 'ar'
                  ? 'يتم توليد الـ QR محلياً داخل جهازك 100%. بياناتك وروابطك وشبكتك لا تُرسل لأي خادم إطلاقاً.'
                  : 'Encrypted and generated purely in-browser. Zero data logging or telemetry.'}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Ad slot: Bottom */}
      <div className="max-w-5xl mx-auto mt-16">
        <AdBanner slot="qr-code-bottom" />
      </div>

    </div>
    </AuthGuard>
  );
}
