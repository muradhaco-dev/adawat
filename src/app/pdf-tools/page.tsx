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
  ShieldCheck, 
  RotateCcw,
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

  // SIGN STATE
  const [signFile, setSignFile] = useState<File | null>(null);
  const [signing, setSigning] = useState(false);
  const [signColor, setSignColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Top Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>معالجة مشفرة داخل متصفحك مباشرة</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          أدوات الـ PDF المتقدمة
        </h1>
        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          ادمج ملفات PDF متعددة في ملف واحد، أو وقّع مستنداتك وعقودك إلكترونياً وحمّلها فوراً وبأقصى درجات الخصوصية.
        </p>
      </div>

      {/* Tabs: Slash Pill Switcher */}
      <div className="flex justify-center mb-10">
        <div className="bg-[#040406] p-1 rounded-full flex items-center border border-[#1c1d22]">
          <button
            onClick={() => setActiveTab('merge')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === 'merge'
                ? 'bg-[#ffffff] text-[#000000] font-semibold'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            دمج ملفات PDF
          </button>
          <button
            onClick={() => setActiveTab('sign')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === 'sign'
                ? 'bg-[#ffffff] text-[#000000] font-semibold'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            توقيع ملف PDF
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AdBanner slot="pdf-tools-top" />
      </div>

      {/* TAB 1: MERGE PDF */}
      {activeTab === 'merge' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload Area */}
          <div className="relative border border-dashed border-[#2e3038] hover:border-[#cc9166] rounded-[10px] p-10 sm:p-14 text-center bg-[#040406] transition-colors">
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleMergeFilesUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166] flex items-center justify-center mx-auto mb-4">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-medium text-[#ffffff] mb-1">
              اسحب وأفلت ملفات الـ PDF هنا، أو اضغط للاختيار
            </h3>
            <p className="text-xs text-[#5e616e] max-w-md mx-auto">
              يمكنك اختيار ملفين أو أكثر معاً، وترتيب تسلسلها بحرية قبل التصدير.
            </p>
          </div>

          {/* Files List */}
          {mergeFiles.length > 0 && (
            <div className="bg-[#040406] rounded-[10px] border border-[#1c1d22] p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1c1d22] mb-4">
                <h3 className="text-xs font-mono uppercase text-[#e2e3e9] flex items-center gap-2">
                  <span>الملفات المحددة ({mergeFiles.length})</span>
                </h3>
                <button
                  onClick={() => setMergeFiles([])}
                  className="text-xs text-[#777a88] hover:text-[#ffffff] font-mono"
                >
                  مسح الكل
                </button>
              </div>

              <div className="space-y-2">
                {mergeFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-[10px] border border-[#1c1d22] bg-[#121317]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#1c1d22] text-[#cc9166] font-mono text-[11px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-[#ffffff] max-w-xs sm:max-w-md truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-[#5e616e] font-mono">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveFile(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-[#5e616e] hover:text-[#ffffff] disabled:opacity-20"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveFile(idx, 'down')}
                        disabled={idx === mergeFiles.length - 1}
                        className="p-1.5 text-[#5e616e] hover:text-[#ffffff] disabled:opacity-20"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeMergeFile(idx)}
                        className="p-1.5 text-[#5e616e] hover:text-red-400 mr-2"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Merge Button: Slash White Pill */}
              <div className="mt-6 pt-4 border-t border-[#1c1d22] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[#5e616e] font-mono">
                  معالجة محلية فورية في المتصفح
                </span>
                <button
                  onClick={executeMerge}
                  disabled={merging || mergeFiles.length < 2}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{merging ? 'جاري الدمج...' : 'دمج وتنزيل ملف PDF'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SIGN PDF */}
      {activeTab === 'sign' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Upload PDF */}
          <div className="bg-[#040406] p-6 rounded-[10px] border border-[#1c1d22]">
            <h3 className="text-xs font-mono uppercase text-[#cc9166] mb-3 flex items-center gap-2">
              <span>01 / اختر ملف PDF المراد توقيعه</span>
            </h3>

            {signFile ? (
              <div className="flex items-center justify-between p-4 bg-[#121317] rounded-[10px] border border-[#1c1d22]">
                <div className="flex items-center gap-3">
                  <FileCheck className="w-6 h-6 text-[#cc9166]" />
                  <div>
                    <p className="text-xs font-medium text-[#ffffff]">{signFile.name}</p>
                    <p className="text-[10px] text-[#5e616e] font-mono">{(signFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => setSignFile(null)}
                  className="text-xs text-[#777a88] hover:text-[#ffffff] font-mono"
                >
                  تغيير الملف
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-[#2e3038] hover:border-[#cc9166] rounded-[10px] p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#08080a]">
                <Upload className="w-6 h-6 text-[#5e616e] mb-2" />
                <span className="text-xs font-medium text-[#ffffff]">اضغط لرفع ملف الـ PDF</span>
                <span className="text-[11px] text-[#5e616e] mt-1 font-mono">عقود رسمية، استمارات، وثائق</span>
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
          <div className="bg-[#040406] p-6 rounded-[10px] border border-[#1c1d22] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1d22]">
              <h3 className="text-xs font-mono uppercase text-[#cc9166]">
                <span>02 / ارسم توقيعك في الصندوق</span>
              </h3>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <button
                    onClick={() => setSignColor('#000000')}
                    className={`w-4 h-4 rounded-full bg-black border border-white/40 ${signColor === '#000000' ? 'ring-2 ring-[#cc9166]' : ''}`}
                    title="أسود"
                  />
                  <button
                    onClick={() => setSignColor('#1d4ed8')}
                    className={`w-4 h-4 rounded-full bg-blue-700 border border-white/40 ${signColor === '#1d4ed8' ? 'ring-2 ring-[#cc9166]' : ''}`}
                    title="أزرق"
                  />
                  <button
                    onClick={() => setSignColor('#b91c1c')}
                    className={`w-4 h-4 rounded-full bg-red-700 border border-white/40 ${signColor === '#b91c1c' ? 'ring-2 ring-[#cc9166]' : ''}`}
                    title="أحمر"
                  />
                </div>

                <button
                  onClick={clearCanvas}
                  className="flex items-center gap-1 text-xs text-[#777a88] hover:text-[#ffffff] font-mono bg-[#121317] hover:bg-[#1c1d22] px-3 py-1 rounded-full border border-[#1c1d22]"
                >
                  <RotateCcw className="w-3 h-3" />
                  مسح
                </button>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="border border-[#1c1d22] rounded-[10px] bg-[#121317] flex justify-center p-3">
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
                className="bg-white rounded-[6px] cursor-crosshair touch-none w-full max-w-[500px]"
              />
            </div>
            <p className="text-[11px] text-[#5e616e] text-center font-mono">
              يدعم الرسم بالماوس أو مباشرة بالإصبع على شاشات اللمس والهواتف
            </p>

            {/* Execute Button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={executeSignPDF}
                disabled={!signFile || signing}
                className="px-6 py-2.5 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium rounded-full transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{signing ? 'جاري التثبيت...' : 'تثبيت التوقيع وتحميل الـ PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <AdBanner slot="pdf-tools-bottom" />
      </div>

    </div>
  );
}
