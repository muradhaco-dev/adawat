'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  PenTool, 
  Upload, 
  Download, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import AdBanner from '@/components/AdBanner';

export default function PDFToolsPage() {
  const [activeTab, setActiveTab] = useState<'merge' | 'sign'>('merge');

  // MERGE STATE
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState(false);

  // SIGN STATE
  const [signFile, setSignFile] = useState<File | null>(null);
  const [signing, setSigning] = useState(false);
  const [signColor, setSignColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Read URL query params on mount for direct tab linking (?tab=sign)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'sign') {
        setActiveTab('sign');
      }
    }
  }, []);

  // Merge Handlers
  const handleMergeFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).filter((f) => f.type === 'application/pdf');
      setMergeFiles((prev) => [...prev, ...filesArray]);
      setMergeSuccess(false);
    }
  };

  const removeMergeFile = (index: number) => {
    setMergeFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...mergeFiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;

    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setMergeFiles(newFiles);
  };

  const executeMerge = async () => {
    if (mergeFiles.length < 2) {
      alert('يرجى اختيار ملفين PDF على الأقل للدمج');
      return;
    }

    try {
      setMerging(true);
      const mergedPdf = await PDFDocument.create();

      for (const file of mergeFiles) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `دمج_ملفات_${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      setMergeSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء دمج الملفات. تأكد أن الملفات غير محمية بكلمة سر.');
    } finally {
      setMerging(false);
    }
  };

  // Sign Canvas Drawing Handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = signColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [signColor, activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const executeSignPDF = async () => {
    if (!signFile) {
      alert('يرجى رفع ملف PDF أولاً');
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setSigning(true);
      const signatureDataUrl = canvas.toDataURL('image/png');
      const signatureImageBytes = await fetch(signatureDataUrl).then((res) => res.arrayBuffer());

      const pdfBytes = await signFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width } = lastPage.getSize();

      // Draw signature at bottom-left/center of last page
      lastPage.drawImage(signatureImage, {
        x: 50,
        y: 60,
        width: 150,
        height: 75,
      });

      const signedPdfBytes = await pdfDoc.save();
      const blob = new Blob([signedPdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `موقع_${signFile.name}`;
      link.click();
      URL.revokeObjectURL(url);

      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء توقيع الملف.');
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>معالجة فورية ومحلية 100% داخل المتصفح لحماية خصوصيتك</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          أدوات الـ PDF الذكية والمجانية
        </h1>
        <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
          ادمج ملفات PDF متعددة في ملف واحد، أو وقّع مستنداتك وعقودك إلكترونياً وحمّلها فوراً.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 border border-gray-200">
          <button
            onClick={() => setActiveTab('merge')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'merge'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            دمج ملفات PDF
          </button>
          <button
            onClick={() => setActiveTab('sign')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'sign'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <PenTool className="w-4 h-4" />
            توقيع ملف PDF إلكترونياً
          </button>
        </div>
      </div>

      <AdBanner slot="pdf-tools-top" />

      {/* TAB 1: MERGE PDF */}
      {activeTab === 'merge' && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-3xl p-8 sm:p-12 text-center bg-emerald-50/30 transition-colors">
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleMergeFilesUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              اسحب وأفلت ملفات الـ PDF هنا، أو اضغط للاختيار
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              يمكنك اختيار ملفين أو أكثر معاً. يمكنك إعادة ترتيبها قبل الضغط على دمج.
            </p>
          </div>

          {/* Files List */}
          {mergeFiles.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>الملفات المحددة ({mergeFiles.length})</span>
                  <span className="text-xs text-gray-400 font-normal">
                    (رتب الملفات حسب أولوية الظهور في الملف النهائي)
                  </span>
                </h3>
                <button
                  onClick={() => setMergeFiles([])}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  مسح الكل
                </button>
              </div>

              <div className="space-y-2">
                {mergeFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/80 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-gray-800 max-w-xs sm:max-w-md truncate">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveFile(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveFile(idx, 'down')}
                        disabled={idx === mergeFiles.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeMergeFile(idx)}
                        className="p-1 text-gray-400 hover:text-red-600 mr-2"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Merge Button */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-gray-500">
                  جاهز للدمج؟ اضغط على الزر ليتم تحميل الملف النهائي فوراً.
                </span>
                <button
                  onClick={executeMerge}
                  disabled={merging || mergeFiles.length < 2}
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Layers className="w-4 h-4" />
                  <span>{merging ? 'جاري الدمج والتجهيز...' : 'دمج وتنزيل ملف PDF'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SIGN PDF */}
      {activeTab === 'sign' && (
        <div className="space-y-6">
          {/* Upload PDF to Sign */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">1</span>
              اختر ملف PDF المراد توقيعه
            </h3>

            {signFile ? (
              <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{signFile.name}</p>
                    <p className="text-xs text-gray-400">{(signFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => setSignFile(null)}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  تغيير الملف
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-bold text-gray-700">اضغط لرفع ملف الـ PDF</span>
                <span className="text-xs text-gray-400 mt-1">عقود، استمارات، أو أوراق رسمية</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => e.target.files && setSignFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Signature Canvas Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">2</span>
                ارسم توقيعك في الصندوق أدناه
              </h3>
              
              <div className="flex items-center gap-2">
                {/* Pen colors */}
                <div className="flex items-center gap-1.5 mr-2">
                  <button
                    onClick={() => setSignColor('#000000')}
                    className={`w-5 h-5 rounded-full bg-black border-2 ${signColor === '#000000' ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                    title="أسود"
                  />
                  <button
                    onClick={() => setSignColor('#1d4ed8')}
                    className={`w-5 h-5 rounded-full bg-blue-700 border-2 ${signColor === '#1d4ed8' ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                    title="أزرق"
                  />
                  <button
                    onClick={() => setSignColor('#b91c1c')}
                    className={`w-5 h-5 rounded-full bg-red-700 border-2 ${signColor === '#b91c1c' ? 'ring-2 ring-blue-500 scale-110' : ''}`}
                    title="أحمر"
                  />
                </div>

                <button
                  onClick={clearCanvas}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 font-bold bg-gray-100 hover:bg-red-50 px-2.5 py-1.5 rounded-lg"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  مسح التوقيع
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="border border-gray-200 rounded-xl bg-slate-50 flex justify-center p-2">
              <canvas
                ref={canvasRef}
                width={500}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="bg-white rounded-lg border border-dashed border-gray-300 cursor-crosshair touch-none w-full max-w-[500px]"
              />
            </div>
            <p className="text-[11px] text-gray-400 text-center">
              يمكنك الرسم بالماوس أو مباشرة بإصبعك على شاشات اللمس والهواتف
            </p>

            {/* Execute Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={executeSignPDF}
                disabled={!signFile || signing}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{signing ? 'جاري تطبيق التوقيع...' : 'تثبيت التوقيع وتحميل الـ PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ad slot bottom */}
      <AdBanner slot="pdf-tools-bottom" />

    </div>
  );
}
