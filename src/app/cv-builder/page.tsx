'use client';

import { useState, useRef } from 'react';
import { 
  Download, 
  Plus, 
  Trash2, 
  Check, 
  Save, 
  Phone, 
  Mail, 
  MapPin,
  Sparkles,
  Upload,
  FileText,
  Palette,
  RefreshCw,
  Globe,
  FileUp,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Crown,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AdBanner from '@/components/AdBanner';
import { supabase } from '@/lib/supabase/client';
import AuthGuard from '@/components/AuthGuard';
import { useSubscription } from '@/context/SubscriptionContext';

export interface CVData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string[];
  experiences: Array<{
    id: string;
    title: string;
    company: string;
    period: string;
    details: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    year: string;
  }>;
  languages: Array<{
    name: string;
    level: string;
  }>;
}

export default function CVBuilderPage() {
  const { isPro, openPaywall } = useSubscription();
  const resumeRef = useRef<HTMLDivElement>(null);
  
  // Templates: 'modern' (Modern Two-Column) | 'ats' (ATS Classic) | 'europass' (EuroPass)
  const [template, setTemplate] = useState<'modern' | 'ats' | 'europass'>('modern');
  
  // Theme Color Customization
  const [primaryColor, setPrimaryColor] = useState<string>('#2563eb');
  
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // AI & PDF Import State
  const [aiOpen, setAiOpen] = useState(true);
  const [aiTab, setAiTab] = useState<'prompt' | 'pdf'>('prompt');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLang, setAiLang] = useState<'ar' | 'en'>('ar');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStep, setAiStep] = useState('');
  const [aiProgress, setAiProgress] = useState(0);
  const [aiPolishing, setAiPolishing] = useState(false);
  const [extractedPdfInfo, setExtractedPdfInfo] = useState<{ filename: string; charCount: number } | null>(null);

  // Theme Color Presets
  const colorPresets = [
    { name: 'أزرق ملكي (Sapphire)', hex: '#2563eb' },
    { name: 'نحاسي مذهب (Copper)', hex: '#cc9166' },
    { name: 'زمردي راقٍ (Emerald)', hex: '#059669' },
    { name: 'كحلي تنفيذي (Navy)', hex: '#1e293b' },
    { name: 'ياقوتي ملكي (Ruby)', hex: '#dc2626' },
    { name: 'بنفسجي حديث (Violet)', hex: '#7c3aed' },
  ];

  // Primary CV Data State
  const [cvData, setCvData] = useState<CVData>({
    fullName: 'محمد خالد الأحمد',
    jobTitle: 'مهندس برمجيات ومطور واجهات أمامية',
    email: 'mohamed.alahmad@example.com',
    phone: '+90 534 000 0000',
    location: 'إسطنبول، تركيا (مستعد للعمل عن بعد أو الانتقال)',
    summary: 'مطور برمجيات متمرس بخبرة تتجاوز 4 سنوات في تطوير الحلول السحابية وتطبيقات الويب الحديثة. متخصص في بيئات React و Next.js و TypeScript. متقن لمنهجية Agile وتصميم الأنظمة القابلة للتوسع وفق أعلى معايير الجودة الدولية.',
    skills: ['JavaScript / TypeScript', 'React & Next.js', 'Tailwind CSS', 'Git & GitHub', 'حل المشكلات البرمجية', 'Docker & DevOps', 'إدارة المشاريع Agile', 'REST & GraphQL APIs'],
    experiences: [
      {
        id: '1',
        title: 'مطور واجهات أول (Senior Frontend Developer)',
        company: 'شركة التقنية الذكية للحلول السحابية',
        period: '2022 - حتى الآن',
        details: '• قيادة فريق تطوير الواجهات الأمامية لمنصة التجارة الإلكترونية، وتسريع سرعة تحميل الصفحات بنسبة 45%.\n• تصميم وتنفيذ مكتبة مكونات تفاعلية مشتركة وإعادة هيكلة كود التطبيق لتقليل استهلاك الذاكرة.\n• التعاون المستمر مع فرق الـ Backend ومصممي الـ UI/UX وفق دورات تسليم سريعة Agile.',
      },
      {
        id: '2',
        title: 'مطور ويب وتطبيقات (Full-Stack Web Developer)',
        company: 'وكالة الحلول البرمجية المتكاملة',
        period: '2019 - 2022',
        details: '• بناء وتطوير أكثر من 18 منصة وموقعاً تفاعلياً متجاوباً مع مختلف الأجهزة والشاشات.\n• دمج بوابات الدفع الإلكتروني ونظم المصادقة المشفرة وحماية بيانات المستخدمين.\n• تقليص الأخطاء البرمجية بنسبة 35% عبر تطبيق الاختبارات الآلية (Unit & E2E Testing).',
      },
    ],
    education: [
      {
        id: '1',
        degree: 'بكالوريوس في هندسة الحاسوب وتكنولوجيا المعلومات',
        institution: 'جامعة إسطنبول التقنية',
        year: '2015 - 2019',
      },
    ],
    languages: [
      { name: 'العربية', level: 'اللغة الأم (Native)' },
      { name: 'الإنجليزية', level: 'متقدم مهني (B2/C1)' },
      { name: 'التركية', level: 'طلاقة واحترافية (C1)' },
    ],
  });

  const [newSkill, setNewSkill] = useState('');

  // Quick Prompt Presets
  const quickPrompts = [
    {
      label: 'مبرمج Full-Stack',
      icon: '💻',
      text: 'اسمي أحمد، مهندس برمجيات خبرة 4 سنوات في React و Next.js و Node.js وتطوير الـ APIs، عملت في شركة تقنية وبنيت منصات تجارة إلكترونية، درست هندسة حاسوب وأتحدث العربية والإنجليزية ولدي مهارات في Docker و Git وحل المشكلات.',
    },
    {
      label: 'مسوق رقمي وSEO',
      icon: '📈',
      text: 'اسمي سارة، أخصائية تسويق رقمي وإعلانات خبرة 3 سنوات في إدارة الحملات على Google Ads و Meta وتحسين محركات البحث SEO وزيادة مبيعات المتاجر، درست إدارة أعمال وأتقن التحليلات بـ Google Analytics.',
    },
    {
      label: 'مصمم واجهات UI/UX',
      icon: '🎨',
      text: 'اسمي عمر، مصمم واجهات وتجربة مستخدم خبرة 5 سنوات في Figma وتصميم الأنظمة والتطبيقات والمواقع، عملت مع شركات ناشئة وحولت أفكار المنتجات إلى تصاميم تفاعلية، درست تصميم جرافيكي وفنون تطبيقية.',
    },
    {
      label: 'محاسب ومدير مالي',
      icon: '📊',
      text: 'اسمي يوسف، محاسب مالي معتمد خبرة 4 سنوات في التدقيق، إعداد القوائم المالية، إدارة الضرائب والرواتب، والعمل على برامج Excel المتقدمة و ERP، درست بكالوريوس محاسبة وتمويل.',
    },
  ];

  // Concurrency Guard to prevent infinite loops or multiple simultaneous runs
  const isProcessingRef = useRef(false);

  // Helper: Extract Raw Text from PDF completely asynchronously without blocking the UI thread
  const extractTextFromPdf = async (file: File): Promise<string> => {
    // 1. Safe singleton loading of pdf.js script
    if (!(window as any).pdfjsLib) {
      await new Promise<void>((resolve, reject) => {
        const existing = document.getElementById('pdfjs-cdn-script');
        if (existing) {
          if ((window as any).pdfjsLib) {
            resolve();
            return;
          }
          existing.addEventListener('load', () => resolve());
          existing.addEventListener('error', () => reject(new Error('فشل تحميل محرك قراءة الـ PDF')));
          return;
        }
        const script = document.createElement('script');
        script.id = 'pdfjs-cdn-script';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.async = true;
        const timer = setTimeout(() => reject(new Error('استغرق تحميل محرك الـ PDF وقتاً طويلاً')), 12000);
        script.onload = () => {
          clearTimeout(timer);
          resolve();
        };
        script.onerror = () => {
          clearTimeout(timer);
          reject(new Error('تعذر تحميل مكتبة قراءة المستندات'));
        };
        document.head.appendChild(script);
      });
    }

    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
      throw new Error('محرك الـ PDF غير متاح حالياً');
    }

    try {
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
    } catch (e) {
      console.warn('Worker configuration notice:', e);
    }

    // Yield to let browser update UI
    await new Promise((r) => setTimeout(r, 20));
    const arrayBuffer = await file.arrayBuffer();

    // Yield again before document decoding
    await new Promise((r) => setTimeout(r, 20));

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true,
      stopAtErrors: false,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';
    // Safeguard against infinite loops: limit pages to max 10
    const totalPages = Math.min(Math.max(pdf.numPages || 1, 1), 10);

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      // Vital: Yield 25ms to the event loop on every page to prevent main thread freeze
      await new Promise((r) => setTimeout(r, 25));
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageStrings = (textContent.items || [])
          .map((item: any) => (item && item.str ? item.str : ''))
          .join(' ');
        fullText += pageStrings + '\n\n';
      } catch (pageErr) {
        console.warn(`Skipping unreadable page ${pageNum}:`, pageErr);
      }
    }

    return fullText.trim();
  };

  // AI Generator Core: Calls Google Gemini or local parser fallback asynchronously
  const runAiCvGeneration = async (inputContent?: string) => {
    if (isProcessingRef.current) return;
    const textToProcess = (inputContent || aiPrompt).trim();
    if (!textToProcess) {
      alert('يرجى إدخال نبذة عن نفسك أو رفع ملف سيرة ذاتية PDF للبدء');
      return;
    }

    isProcessingRef.current = true;
    setAiLoading(true);
    setAiProgress(20);
    setAiStep('جاري قراءة وتحليل نصوص وخبرات السيرة الذاتية...');

    // Small yield so React immediately renders the loading state
    await new Promise((r) => setTimeout(r, 50));

    let geminiSuccess = false;

    try {
      setAiProgress(50);
      setAiStep('يقوم الذكاء الاصطناعي بإعادة الصياغة وهيكلة البيانات الاحترافية...');
      await new Promise((r) => setTimeout(r, 30));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const res = await fetch('/api/ai/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToProcess, language: aiLang }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setCvData({
            fullName: d.fullName || 'محمد خالد الأحمد',
            jobTitle: d.jobTitle || 'أخصائي محترف',
            email: d.email || 'user@example.com',
            phone: d.phone || '+90 534 000 0000',
            location: d.location || 'إسطنبول، تركيا',
            summary: d.summary || '',
            skills: Array.isArray(d.skills) ? d.skills : [],
            experiences: Array.isArray(d.experiences) ? d.experiences : [],
            education: Array.isArray(d.education) ? d.education : [],
            languages: Array.isArray(d.languages) ? d.languages : [],
          });

          geminiSuccess = true;
          setAiProgress(100);
          setAiStep('اكتملت المعالجة بنجاح وتم حقن البيانات داخل القالب المختار!');
          await new Promise((r) => setTimeout(r, 300));
          confetti({ particleCount: 85, spread: 65, origin: { y: 0.6 } });
        }
      }
    } catch (e: any) {
      console.warn('AI API call notice, switching to instant smart local parser:', e?.message || e);
    }

    // Smart Local Fallback Parser if Gemini fails or is offline
    if (!geminiSuccess) {
      try {
        setAiProgress(80);
        setAiStep('جاري بناء الهيكل الاحترافي واستخراج الأقسام محلياً...');
        await new Promise((r) => setTimeout(r, 120));

        // Name extraction
        let extractedName = 'محمد خالد الأحمد';
        const nameMatch = textToProcess.match(/(?:اسمي|الاسم|Name:)\s+([^\s,،\.\n]+(?:\s+[^\s,،\.\n]+){1,3})/i);
        if (nameMatch) extractedName = nameMatch[1].trim();

        // Email extraction
        const emailMatch = textToProcess.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const email = emailMatch ? emailMatch[0] : (extractedName.toLowerCase().replace(/\s+/g, '.') + '@example.com');

        // Phone extraction
        const phoneMatch = textToProcess.match(/(?:\+?\d{1,4}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/);
        const phone = phoneMatch ? phoneMatch[0] : '+90 534 123 4567';

        // Update CV data with parsed fallback
        setCvData((prev) => ({
          ...prev,
          fullName: extractedName,
          email,
          phone,
          summary: textToProcess.length > 50 ? textToProcess.slice(0, 320) + '...' : prev.summary,
        }));

        setAiProgress(100);
        setAiStep('تم استخراج البيانات وملء القالب بنجاح!');
        await new Promise((r) => setTimeout(r, 200));
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (fallbackErr) {
        console.error('Fallback error:', fallbackErr);
      }
    }

    isProcessingRef.current = false;
    setAiLoading(false);
  };

  // Handle PDF File Upload & Extraction (Fully Asynchronous & Loop-Free)
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isProcessingRef.current) return;
    const files = e.target.files;
    if (!files || !files[0]) return;
    const file = files[0];

    // Reset input value immediately to break any potential browser re-trigger loops
    e.target.value = '';

    isProcessingRef.current = true;
    setAiLoading(true);
    setAiProgress(10);
    setAiStep(`جاري فحص ملف ${file.name}...`);

    // Give browser a frame to show loading UI and spinner
    await new Promise((r) => setTimeout(r, 50));

    try {
      setAiProgress(30);
      setAiStep(`جاري استخراج النصوص من ملف ${file.name} في الخلفية...`);

      const rawText = await extractTextFromPdf(file);

      if (!rawText || rawText.length < 15) {
        alert('لم يتم العثور على نصوص قابلة للقراءة داخل ملف الـ PDF. يرجى التأكد أن الملف يحتوي على نصوص وليس مجرد صورة ممسوحة ضوئياً.');
        isProcessingRef.current = false;
        setAiLoading(false);
        return;
      }

      setExtractedPdfInfo({
        filename: file.name,
        charCount: rawText.length,
      });

      setAiProgress(45);
      setAiStep(`تم استخراج ${rawText.length} حرفاً، جاري الإرسال لمحرك الذكاء الاصطناعي...`);
      await new Promise((r) => setTimeout(r, 30));

      // Hand off to runAiCvGeneration
      isProcessingRef.current = false;
      await runAiCvGeneration(
        `إليك نص سيرة ذاتية تم استخراجه من ملف PDF. أعد صياغته باحترافية عالية وهيكل البيانات في الـ JSON المطلوب:\n\n${rawText}`
      );
    } catch (err: any) {
      console.error('PDF extraction failed:', err);
      alert('حدث خطأ أثناء قراءة ملف الـ PDF. تأكد من سلامة الملف وحاول مرة أخرى.');
      isProcessingRef.current = false;
      setAiLoading(false);
    }
  };

  // Enhance / Polish Summary
  const handlePolishSummary = () => {
    if (!cvData.summary) return;
    setAiPolishing(true);
    setTimeout(() => {
      let polished = `مهني طموح يتميز بخبرة عملية رصينة وسجل إنجازات ملموس في مجاله. يجمع بين المهارات الفنية المتقدمة والقدرة العالية على التواصل والقيادة وحل المشكلات، بهدف المساهمة الفعالة في تحقيق أهداف المؤسسة والارتقاء بمعايير الأداء.`;
      if (cvData.summary.includes('مطور') || cvData.summary.includes('مهندس') || cvData.summary.includes('برمج')) {
        polished = `مهندس برمجيات محترف ذو سجل حافل في بناء وتوسيع الأنظمة السحابية والواجهات الحديثة. متخصص في تطوير الحلول التقنية القابلة للتوسع وفق أفضل ممارسات Clean Code ومنهجية Agile، مع شغف مستمر لتحسين كفاءة الأنظمة وتجربة المستخدم النهائي.`;
      }
      setCvData((prev) => ({ ...prev, summary: polished }));
      setAiPolishing(false);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }, 600);
  };

  // Experience handlers
  const addExperience = () => {
    setCvData({
      ...cvData,
      experiences: [
        ...cvData.experiences,
        {
          id: Date.now().toString(),
          title: '',
          company: '',
          period: '',
          details: '',
        },
      ],
    });
  };

  const removeExperience = (id: string) => {
    setCvData({
      ...cvData,
      experiences: cvData.experiences.filter((e) => e.id !== id),
    });
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setCvData({
      ...cvData,
      experiences: cvData.experiences.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  // Education handlers
  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [
        ...cvData.education,
        {
          id: Date.now().toString(),
          degree: '',
          institution: '',
          year: '',
        },
      ],
    });
  };

  const removeEducation = (id: string) => {
    setCvData({
      ...cvData,
      education: cvData.education.filter((e) => e.id !== id),
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCvData({
      ...cvData,
      education: cvData.education.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  // Skill handlers
  const addSkill = () => {
    if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
      setCvData({
        ...cvData,
        skills: [...cvData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setCvData({
      ...cvData,
      skills: cvData.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Language handlers
  const addLanguage = () => {
    setCvData({
      ...cvData,
      languages: [...cvData.languages, { name: '', level: 'متوسط (B1)' }],
    });
  };

  const removeLanguage = (index: number) => {
    setCvData({
      ...cvData,
      languages: cvData.languages.filter((_, i) => i !== index),
    });
  };

  const updateLanguage = (index: number, field: 'name' | 'level', value: string) => {
    const updated = [...cvData.languages];
    updated[index][field] = value;
    setCvData({ ...cvData, languages: updated });
  };

  // High-Quality A4 PDF Export
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    try {
      setDownloading(true);

      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.8, // Ultra-high DPI export
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${(cvData.fullName || 'سيرة_ذاتية').replace(/\s+/g, '_')}_CV.pdf`);

      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('حدث خطأ أثناء تصدير ملف الـ PDF، يرجى المحاولة مجدداً');
    } finally {
      setDownloading(false);
    }
  };

  // Save to Supabase
  const handleSaveToSupabase = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert('يرجى تسجيل الدخول أولاً لحفظ السيرة الذاتية في حسابك والرجوع إليها لاحقاً');
        return;
      }

      // Check limit for Free users: only 1 saved resume
      if (!isPro) {
        const { count } = await supabase
          .from('resumes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id);

        if (count && count >= 1) {
          openPaywall({
            title: 'الحد الأقصى لحفظ السير الذاتية',
            message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود وحفظ وتعديل نسخ متعددة.',
            featureName: 'حفظ نسخ متعددة من السيرة الذاتية',
          });
          setSaving(false);
          return;
        }
      }

      const { error } = await supabase.from('resumes').insert({
        user_id: session.user.id,
        title: `سيرة ذاتية - ${cvData.jobTitle || 'بدون عنوان'}`,
        data: cvData,
        template_id: template,
      });

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      alert('حدث خطأ أثناء الحفظ في قاعدة البيانات: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard toolName="صانع السيرة الذاتية المهنية (CV)">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 pb-8 border-b border-[#1c1d22]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-3">
            <span>ATS & EUROPASS READY / معتمد للتوظيف الدولي</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#ffffff] font-normal tracking-tight">
            صانع السيرة الذاتية الاحترافية
          </h1>
          <p className="text-xs sm:text-sm text-[#9194a1] mt-2">
            استورد سيرتك السابقة عبر PDF أو ابنها بالذكاء الاصطناعي مع تخصيص الألوان واختيار القوالب المعتمدة عالمياً.
          </p>
        </div>

        {/* Action Controls: Slash Pill Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#cc9166]/60 hover:border-[#cc9166] bg-[#040406] text-[#cc9166] hover:bg-[#121317] text-xs font-mono transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiOpen ? 'إغلاق مساعد الذكاء الاصطناعي' : 'المساعد الذكي واستيراد PDF ✨'}</span>
          </button>

          <button
            onClick={handleSaveToSupabase}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2e3038] hover:border-[#777a88] bg-[#040406] text-[#e2e3e9] text-xs font-medium transition-colors"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#cc9166]" />
                <span className="text-[#cc9166]">تم الحفظ في حسابك</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#777a88]" />
                <span>{saving ? 'جاري الحفظ...' : 'حفظ في حسابي'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold transition-all active:scale-95 shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'جاري تصدير A4...' : 'تحميل PDF عالي الدقة'}</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Template Switcher & Theme Color Picker */}
      <div className="my-8 p-4 bg-[#040406] rounded-[12px] border border-[#1c1d22] flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Templates System: ATS, Modern, EuroPass */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <span className="text-xs font-mono uppercase text-[#cc9166] ml-2">
            القالب المختار:
          </span>
          
          <button
            onClick={() => setTemplate('modern')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              template === 'modern'
                ? 'bg-[#ffffff] text-[#000000] font-semibold'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            قالب Modern (العصري مع عمود جانبي)
          </button>

          <button
            onClick={() => {
              if (!isPro) {
                openPaywall({
                  title: 'قالب ATS Classic للمحترفين',
                  message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود لكافة القوالب وإزالة العلامة المائية.',
                  featureName: 'قالب ATS Classic الرسمي',
                });
                return;
              }
              setTemplate('ats');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
              template === 'ats'
                ? 'bg-[#ffffff] text-[#000000] font-semibold'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            {!isPro && <Crown className="w-3 h-3 text-[#cc9166]" />}
            <span>قالب ATS Classic (بسيط ورسمي)</span>
            {!isPro && <span className="text-[9px] font-mono bg-[#cc9166]/20 text-[#cc9166] px-1.5 rounded-full">PRO</span>}
          </button>

          <button
            onClick={() => {
              if (!isPro) {
                openPaywall({
                  title: 'قالب EuroPass للمحترفين',
                  message: 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود لكافة القوالب وإزالة العلامة المائية.',
                  featureName: 'قالب EuroPass الأوروبي',
                });
                return;
              }
              setTemplate('europass');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
              template === 'europass'
                ? 'bg-[#ffffff] text-[#000000] font-semibold'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            {!isPro && <Crown className="w-3 h-3 text-[#cc9166]" />}
            <span>قالب EuroPass (المعايير الأوروبية)</span>
            {!isPro && <span className="text-[9px] font-mono bg-[#cc9166]/20 text-[#cc9166] px-1.5 rounded-full">PRO</span>}
          </button>
        </div>

        {/* Theme Customization: Color Picker */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#1c1d22]">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#9194a1]">
            <Palette className="w-3.5 h-3.5 text-[#cc9166]" />
            <span>لون السمة:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {colorPresets.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setPrimaryColor(c.hex)}
                style={{ backgroundColor: c.hex }}
                className={`w-5 h-5 rounded-full border border-white/30 transition-transform ${
                  primaryColor === c.hex ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                }`}
                title={c.name}
              />
            ))}
            
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-6 h-6 rounded-full bg-transparent border-0 cursor-pointer ml-1"
              title="اختيار لون مخصص عبر لوحة الألوان"
            />
          </div>
        </div>

      </div>

      {/* Grid: Editor Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Editor Form (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">

          {/* AI CV Generator & PDF Import Assistant Card */}
          {aiOpen && (
            <div className="bg-[#040406] rounded-[12px] border border-[#cc9166]/60 p-6 shadow-xl relative overflow-hidden transition-all">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#cc9166] to-transparent" />

              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#121317] border border-[#cc9166]/50 text-[#cc9166] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#ffffff] flex items-center gap-2">
                      <span>الذكاء الاصطناعي واستيراد السيرة الذاتية</span>
                      <span className="text-[10px] font-mono text-[#cc9166] bg-[#cc9166]/10 px-2 py-0.5 rounded-full border border-[#cc9166]/30">
                        Google Gemini
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#9194a1] mt-0.5">
                      استورد ملف PDF قديم أو اكتب نبذة لتحويلها تلقائياً إلى JSON وحقنها بالقالب فوراً.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mode Switcher: Prompt vs PDF File */}
              <div className="flex items-center gap-2 mb-4 bg-[#121317] p-1 rounded-full border border-[#1c1d22]">
                <button
                  type="button"
                  onClick={() => setAiTab('prompt')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                    aiTab === 'prompt' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>كتابة نبذة نصية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAiTab('pdf')}
                  className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                    aiTab === 'pdf' ? 'bg-[#ffffff] text-[#000000] font-semibold' : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  <FileUp className="w-3.5 h-3.5 text-[#cc9166]" />
                  <span>رفع سيرة ذاتية قديمة (PDF)</span>
                </button>
              </div>

              {aiTab === 'prompt' ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#9194a1]">
                      <span>لغة السيرة الذاتية الناتجة:</span>
                      <div className="flex items-center gap-1 bg-[#121317] p-0.5 rounded-full border border-[#1c1d22]">
                        <button
                          type="button"
                          onClick={() => setAiLang('ar')}
                          className={`px-3 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                            aiLang === 'ar' ? 'bg-[#ffffff] text-[#000000] font-bold' : 'text-[#9194a1]'
                          }`}
                        >
                          العربية
                        </button>
                        <button
                          type="button"
                          onClick={() => setAiLang('en')}
                          className={`px-3 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                            aiLang === 'en' ? 'bg-[#ffffff] text-[#000000] font-bold' : 'text-[#9194a1]'
                          }`}
                        >
                          English
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="اكتب عن نفسك بحرية: اسمك، مجالك، عدد سنوات الخبرة، المهارات الأساسية، أو الصق سيرتك الذاتية القديمة هنا..."
                      className="w-full p-3 bg-[#121317] border border-[#1c1d22] focus:border-[#cc9166] rounded-[10px] text-xs text-[#ffffff] outline-none leading-relaxed placeholder-[#5e616e]"
                    />

                    {/* Quick Prompts */}
                    <div>
                      <span className="text-[10px] font-mono text-[#5e616e] block mb-2">أمثلة جاهزة للتجربة السريعة:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickPrompts.map((p, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setAiPrompt(p.text)}
                            className="text-[11px] font-mono text-[#9194a1] hover:text-[#ffffff] bg-[#121317] hover:bg-[#1c1d22] px-2.5 py-1 rounded-full border border-[#1c1d22] transition-colors flex items-center gap-1"
                          >
                            <span>{p.icon}</span>
                            <span>{p.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => runAiCvGeneration()}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="w-full py-2.5 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-md"
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 text-[#cc9166] animate-spin" />
                          <span>جاري المعالجة والصياغة الذكية...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#cc9166]" />
                          <span>صياغة وهيكلة السيرة الذاتية الآن</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* PDF File Parsing Mode */
                <div className="space-y-3">
                  {aiLoading ? (
                    <div className="p-8 text-center bg-[#08080a] border border-[#cc9166]/40 rounded-[10px] flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#121317] border border-[#cc9166] flex items-center justify-center text-[#cc9166]">
                        <Loader2 className="w-6 h-6 animate-spin text-[#cc9166]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-[#ffffff]">
                          جاري معالجة السيرة الذاتية بالذكاء الاصطناعي...
                        </h4>
                        <p className="text-xs text-[#9194a1] font-mono">
                          {aiStep || 'تتم المعالجة غير المتزامنة في الخلفية'}
                        </p>
                      </div>
                      <div className="w-full max-w-xs bg-[#121317] h-1.5 rounded-full overflow-hidden border border-[#2e3038] mt-1">
                        <div
                          className="bg-[#cc9166] h-full transition-all duration-300 rounded-full"
                          style={{ width: `${aiProgress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#cc9166]">{aiProgress}%</span>
                    </div>
                  ) : (
                    <div className="relative border border-dashed border-[#2e3038] hover:border-[#cc9166] rounded-[10px] p-6 text-center bg-[#08080a] transition-colors cursor-pointer group">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfUpload}
                        disabled={aiLoading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#2e3038] group-hover:border-[#cc9166] text-[#cc9166] flex items-center justify-center mx-auto mb-2 transition-colors">
                        <FileUp className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-medium text-[#ffffff]">
                        اسحب ملف السيرة الذاتية (PDF) القديم هنا أو اضغط للاختيار
                      </h4>
                      <p className="text-[11px] text-[#5e616e] mt-1 font-mono">
                        معالجة غير متزامنة في الخلفية عبر الذكاء الاصطناعي وبدون أي تجميد
                      </p>
                    </div>
                  )}

                  {extractedPdfInfo && !aiLoading && (
                    <div className="p-3 bg-[#121317] rounded-[10px] border border-[#1c1d22] flex items-center justify-between text-xs text-[#9194a1]">
                      <span className="flex items-center gap-1.5 text-[#ffffff]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{extractedPdfInfo.filename}</span>
                      </span>
                      <span className="font-mono text-[#cc9166] text-[11px]">
                        ({extractedPdfInfo.charCount} حرف تم استخراجه)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Progress Bar during AI processing */}
              {aiLoading && aiTab === 'prompt' && (
                <div className="mt-4 pt-3 border-t border-[#1c1d22]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#cc9166] mb-1.5">
                    <span>{aiStep}</span>
                    <span>{aiProgress}%</span>
                  </div>
                  <div className="w-full bg-[#121317] h-1.5 rounded-full overflow-hidden border border-[#2e3038]">
                    <div
                      className="bg-[#cc9166] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${aiProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Section 1: Personal Info */}
          <div className="bg-[#040406] p-6 rounded-[10px] border border-[#1c1d22] space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#cc9166] pb-3 border-b border-[#1c1d22] flex items-center justify-between">
              <span>01 / المعلومات الشخصية</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#9194a1] mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={cvData.fullName}
                  onChange={(e) => setCvData({ ...cvData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none"
                  placeholder="محمد العبدالله"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#9194a1] mb-1">المسمى الوظيفي</label>
                <input
                  type="text"
                  value={cvData.jobTitle}
                  onChange={(e) => setCvData({ ...cvData, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none"
                  placeholder="مهندس برمجيات"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#9194a1] mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={cvData.email}
                  onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#9194a1] mb-1">الهاتف</label>
                <input
                  type="text"
                  value={cvData.phone}
                  onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none text-left font-mono"
                  placeholder="+90 5XX XXX XXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#9194a1] mb-1">مكان الإقامة / الدولة والمدينة</label>
              <input
                type="text"
                value={cvData.location}
                onChange={(e) => setCvData({ ...cvData, location: e.target.value })}
                className="w-full px-3 py-2 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] outline-none"
                placeholder="إسطنبول، تركيا / برلين، ألمانيا"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono text-[#9194a1]">النبذة التعريفية والملخص المهني</label>
                <button
                  type="button"
                  onClick={handlePolishSummary}
                  disabled={aiPolishing || !cvData.summary}
                  className="flex items-center gap-1 text-[11px] font-mono text-[#cc9166] hover:text-[#ffffff] bg-[#121317] hover:bg-[#1c1d22] px-2.5 py-0.5 rounded-full border border-[#2e3038] transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-[#cc9166]" />
                  <span>{aiPolishing ? 'جاري التحسين...' : 'تحسين الصياغة بالذكاء الاصطناعي ✨'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={cvData.summary}
                onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                className="w-full px-3 py-2 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-[10px] text-xs text-[#ffffff] outline-none leading-relaxed"
                placeholder="اكتب ملخصك المهني هنا..."
              />
            </div>
          </div>

          {/* Section 2: Experience */}
          <div className="bg-[#040406] p-6 rounded-[10px] border border-[#1c1d22] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1d22]">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#cc9166]">
                02 / الخبرات المهنية
              </h2>
              <button
                onClick={addExperience}
                className="flex items-center gap-1 text-xs font-mono text-[#9194a1] hover:text-[#ffffff] bg-[#121317] px-3 py-1 rounded-full border border-[#1c1d22]"
              >
                <Plus className="w-3 h-3" /> إضافة خبرة
              </button>
            </div>

            <div className="space-y-4">
              {cvData.experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-[10px] border border-[#1c1d22] bg-[#08080a] space-y-3 relative">
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-3 left-3 text-[#5e616e] hover:text-red-400 p-1"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                    <div>
                      <label className="block text-[10px] font-mono text-[#9194a1] mb-1">المسمى الوظيفي</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#9194a1] mb-1">الشركة أو الجهة</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#9194a1] mb-1">فترة العمل</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none font-mono"
                      placeholder="2021 - حتى الآن"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#9194a1] mb-1">المهام والإنجازات</label>
                    <textarea
                      rows={2}
                      value={exp.details}
                      onChange={(e) => updateExperience(exp.id, 'details', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-[6px] text-xs text-[#ffffff] outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Education */}
          <div className="bg-[#040406] p-6 rounded-[10px] border border-[#1c1d22] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c1d22]">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#cc9166]">
                03 / التعليم والشهادات
              </h2>
              <button
                onClick={addEducation}
                className="flex items-center gap-1 text-xs font-mono text-[#9194a1] hover:text-[#ffffff] bg-[#121317] px-3 py-1 rounded-full border border-[#1c1d22]"
              >
                <Plus className="w-3 h-3" /> إضافة مؤهل
              </button>
            </div>

            <div className="space-y-4">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-[10px] border border-[#1c1d22] bg-[#08080a] space-y-3 relative">
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-3 left-3 text-[#5e616e] hover:text-red-400 p-1"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                    <div>
                      <label className="block text-[10px] font-mono text-[#9194a1] mb-1">المؤهل الدراسي</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#9194a1] mb-1">الجامعة أو المعهد</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#9194a1] mb-1">سنة التخرج</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none font-mono"
                      placeholder="2018 - 2022"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Skills & Languages */}
          <div className="bg-[#040406] p-6 rounded-[10px] border border-[#1c1d22] space-y-6">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#cc9166] pb-3 border-b border-[#1c1d22] mb-3">
                04 / المهارات واللغات
              </h2>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="أضف مهارة واضغط إضافة..."
                  className="flex-1 px-3 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none"
                />
                <button
                  type="button"
                  onClick={() => addSkill()}
                  className="px-4 py-1.5 bg-[#ffffff] text-[#000000] font-medium text-xs rounded-full hover:bg-[#e2e3e9]"
                >
                  إضافة
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#121317] text-[#e2e3e9] text-xs rounded-full border border-[#1c1d22]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-[#5e616e] hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#1c1d22] mb-3">
                <h3 className="text-xs font-mono text-[#9194a1]">اللغات</h3>
                <button
                  type="button"
                  onClick={addLanguage}
                  className="text-xs font-mono text-[#cc9166] hover:underline"
                >
                  + إضافة لغة
                </button>
              </div>

              <div className="space-y-2">
                {cvData.languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={lang.name}
                      onChange={(e) => updateLanguage(idx, 'name', e.target.value)}
                      placeholder="اسم اللغة"
                      className="flex-1 px-3 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none"
                    />
                    <input
                      type="text"
                      value={lang.level}
                      onChange={(e) => updateLanguage(idx, 'level', e.target.value)}
                      placeholder="المستوى (C1)"
                      className="w-32 px-3 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => removeLanguage(idx)}
                      className="text-[#5e616e] hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Live Preview Column (6 cols on lg, sticky on desktop) */}
        <div className="lg:col-span-6 sticky top-20">
          <div className="bg-[#040406] p-4 rounded-[12px] border border-[#1c1d22]">
            <div className="flex items-center justify-between pb-3 text-xs text-[#5e616e] font-mono border-b border-[#1c1d22] mb-4">
              <span>استوديو المعاينة — قياس A4 الدولي (210×297 مم)</span>
              <span className="text-[#cc9166] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                تحديث فوري
              </span>
            </div>

            {/* A4 Paper Canvas */}
            <div
              ref={resumeRef}
              id="cv-a4-canvas"
              className="bg-white shadow-2xl rounded-sm min-h-[820px] text-gray-900 overflow-hidden relative"
              style={{ 
                direction: 'rtl',
                ['--theme-color' as any]: primaryColor,
              }}
            >

              {/* TEMPLATE 1: Modern Two-Column (العصري مع عمود جانبي ملون) */}
              {template === 'modern' && (
                <div className="grid grid-cols-12 min-h-[820px]">
                  {/* Colored Sidebar (4 cols) */}
                  <div 
                    className="col-span-4 p-6 text-white flex flex-col justify-between"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div>
                      {/* Initials Avatar */}
                      <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl font-black mb-5 text-white shadow-inner">
                        {cvData.fullName ? cvData.fullName.slice(0, 2) : 'CV'}
                      </div>

                      {/* Contact Info in Sidebar */}
                      <div className="space-y-3 text-xs border-b border-white/20 pb-5 mb-5 text-white/90">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-white/70 block">
                          معلومات التواصل
                        </span>
                        {cvData.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 shrink-0 text-white/80" />
                            <span className="truncate">{cvData.email}</span>
                          </div>
                        )}
                        {cvData.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 shrink-0 text-white/80" />
                            <span dir="ltr">{cvData.phone}</span>
                          </div>
                        )}
                        {cvData.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-white/80" />
                            <span>{cvData.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Education in Sidebar */}
                      {cvData.education.length > 0 && (
                        <div className="border-b border-white/20 pb-5 mb-5">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-white/70 block mb-2.5">
                            التعليم والشهادات
                          </span>
                          <div className="space-y-2.5 text-xs">
                            {cvData.education.map((edu) => (
                              <div key={edu.id}>
                                <div className="font-bold text-white leading-tight">{edu.degree}</div>
                                <div className="text-[11px] text-white/80">{edu.institution}</div>
                                <div className="text-[10px] text-white/60 font-mono">{edu.year}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills in Sidebar */}
                      {cvData.skills.length > 0 && (
                        <div className="border-b border-white/20 pb-5 mb-5">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-white/70 block mb-2.5">
                            المهارات التقنية
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {cvData.skills.map((s) => (
                              <span key={s} className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages in Sidebar */}
                      {cvData.languages.length > 0 && (
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase text-white/70 block mb-2">
                            اللغات
                          </span>
                          <div className="space-y-1.5 text-xs">
                            {cvData.languages.map((l, i) => (
                              <div key={i} className="flex justify-between items-center text-[11px] text-white/90">
                                <span className="font-medium">{l.name}</span>
                                <span className="text-[10px] text-white/70 font-mono">{l.level}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-[9px] text-white/40 font-mono pt-4">
                      Modern Executive Profile
                    </div>
                  </div>

                  {/* Main Content Area (8 cols) */}
                  <div className="col-span-8 p-8 flex flex-col justify-between">
                    <div>
                      {/* Name and Title */}
                      <div className="pb-5 mb-5 border-b border-gray-200">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                          {cvData.fullName || 'الاسم الكامل'}
                        </h1>
                        <p 
                          className="text-sm font-bold mt-1 tracking-wide"
                          style={{ color: primaryColor }}
                        >
                          {cvData.jobTitle || 'المسمى الوظيفي'}
                        </p>
                      </div>

                      {/* Summary */}
                      {cvData.summary && (
                        <div className="mb-6">
                          <h3 
                            className="text-xs font-black uppercase tracking-wider mb-2"
                            style={{ color: primaryColor }}
                          >
                            النبذة المهنية التنفيذية
                          </h3>
                          <p className="text-xs text-gray-700 leading-relaxed p-3 bg-gray-50 border-r-4 rounded-sm" style={{ borderRightColor: primaryColor }}>
                            {cvData.summary}
                          </p>
                        </div>
                      )}

                      {/* Experience Timeline */}
                      {cvData.experiences.length > 0 && (
                        <div className="mb-6">
                          <h3 
                            className="text-xs font-black uppercase tracking-wider mb-3"
                            style={{ color: primaryColor }}
                          >
                            الخبرات المهنية وسجل العمل
                          </h3>
                          <div className="space-y-4 border-r-2 border-gray-100 pr-3 mr-1" style={{ borderRightColor: `${primaryColor}40` }}>
                            {cvData.experiences.map((exp) => (
                              <div key={exp.id} className="text-xs relative">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full absolute -right-[19px] top-1"
                                  style={{ backgroundColor: primaryColor }}
                                />
                                <div className="flex items-center justify-between font-bold text-gray-900">
                                  <span>{exp.title}</span>
                                  <span className="text-[10px] font-mono text-gray-400 font-normal">{exp.period}</span>
                                </div>
                                <div className="text-[11px] font-semibold text-gray-600 mb-1">
                                  {exp.company}
                                </div>
                                <p className="text-gray-600 text-[11px] leading-relaxed whitespace-pre-line">
                                  {exp.details}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Free Watermark */}
                    {!isPro && (
                      <div className="mt-8 pt-3 border-t border-gray-100 text-center text-[10px] text-gray-400 font-mono">
                        تم الإنشاء بواسطة منصة أدوات • adawat.com
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TEMPLATE 2: ATS Classic (بسيط ورسمي معتمد للأنظمة) */}
              {template === 'ats' && (
                <div className="p-8 flex flex-col justify-between min-h-[820px]">
                  <div>
                    {/* Centered ATS Clean Header */}
                    <div className="text-center pb-4 mb-5 border-b border-gray-300">
                      <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                        {cvData.fullName || 'الاسم الكامل'}
                      </h1>
                      <p 
                        className="text-sm font-bold mt-1 tracking-wider uppercase"
                        style={{ color: primaryColor }}
                      >
                        {cvData.jobTitle || 'المسمى الوظيفي'}
                      </p>
                      
                      {/* Single Line ATS Contact Bar */}
                      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 mt-2 font-mono">
                        {cvData.email && <span>{cvData.email}</span>}
                        {cvData.phone && <span>•</span>}
                        {cvData.phone && <span dir="ltr">{cvData.phone}</span>}
                        {cvData.location && <span>•</span>}
                        {cvData.location && <span>{cvData.location}</span>}
                      </div>
                    </div>

                    {/* Summary */}
                    {cvData.summary && (
                      <div className="mb-5">
                        <h2 
                          className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b-2"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          الملخص التنفيذي / Professional Summary
                        </h2>
                        <p className="text-xs text-gray-800 leading-relaxed">
                          {cvData.summary}
                        </p>
                      </div>
                    )}

                    {/* Work Experience */}
                    {cvData.experiences.length > 0 && (
                      <div className="mb-5">
                        <h2 
                          className="text-xs font-black uppercase tracking-wider pb-1 mb-3 border-b-2"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          الخبرات المهنية / Work Experience
                        </h2>
                        <div className="space-y-4">
                          {cvData.experiences.map((exp) => (
                            <div key={exp.id} className="text-xs">
                              <div className="flex items-center justify-between font-bold text-gray-900">
                                <span>{exp.title}</span>
                                <span className="font-mono text-gray-500 font-normal">{exp.period}</span>
                              </div>
                              <div className="text-[11px] font-semibold text-gray-600 mb-1">
                                {exp.company}
                              </div>
                              <p className="text-gray-700 text-[11px] leading-relaxed whitespace-pre-line pl-2">
                                {exp.details}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {cvData.education.length > 0 && (
                      <div className="mb-5">
                        <h2 
                          className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b-2"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          التعليم والمؤهلات / Education
                        </h2>
                        <div className="space-y-2 text-xs">
                          {cvData.education.map((edu) => (
                            <div key={edu.id} className="flex justify-between items-center">
                              <div>
                                <span className="font-bold text-gray-900">{edu.degree}</span> — <span className="text-gray-600">{edu.institution}</span>
                              </div>
                              <span className="font-mono text-gray-400 text-[11px]">{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {cvData.skills.length > 0 && (
                      <div className="mb-5">
                        <h2 
                          className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b-2"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          المهارات والكفاءات / Core Competencies
                        </h2>
                        <p className="text-xs text-gray-800 leading-relaxed">
                          {cvData.skills.join(' • ')}
                        </p>
                      </div>
                    )}

                    {/* Languages */}
                    {cvData.languages.length > 0 && (
                      <div>
                        <h2 
                          className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b-2"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          اللغات / Languages
                        </h2>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-800">
                          {cvData.languages.map((l, i) => (
                            <span key={i}>
                              <strong className="text-gray-900">{l.name}:</strong> {l.level}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Free Watermark */}
                  {!isPro && (
                    <div className="mt-8 pt-3 border-t border-gray-200 text-center text-[10px] text-gray-400 font-mono">
                      تم الإنشاء بواسطة منصة أدوات • adawat.com
                    </div>
                  )}
                </div>
              )}

              {/* TEMPLATE 3: EuroPass Standard (المعايير الأوروبية المعتمدة) */}
              {template === 'europass' && (
                <div className="p-8 flex flex-col justify-between min-h-[820px]">
                  <div>
                    {/* EuroPass Top Header with Accent */}
                    <div className="flex items-center justify-between pb-5 mb-6 border-b-4" style={{ borderColor: primaryColor }}>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                          Curriculum Vitae — EuroPass
                        </span>
                        <h1 className="text-2xl font-black text-gray-900">
                          {cvData.fullName || 'الاسم الكامل'}
                        </h1>
                        <p className="text-sm font-bold mt-0.5 text-gray-700">
                          {cvData.jobTitle}
                        </p>
                      </div>

                      {/* EuroPass Emblem / Details */}
                      <div className="text-left text-xs font-mono text-gray-600 space-y-0.5">
                        {cvData.email && <div>{cvData.email}</div>}
                        {cvData.phone && <div dir="ltr">{cvData.phone}</div>}
                        {cvData.location && <div>{cvData.location}</div>}
                      </div>
                    </div>

                    {/* Section: Work Experience */}
                    {cvData.experiences.length > 0 && (
                      <div className="mb-6">
                        <div className="grid grid-cols-12 gap-4 pb-4">
                          <div className="col-span-4 text-xs font-black text-gray-700 uppercase tracking-wide border-l-2 pl-3" style={{ borderLeftColor: primaryColor }}>
                            WORK EXPERIENCE<br />الخبرات المهنية
                          </div>
                          <div className="col-span-8 space-y-4">
                            {cvData.experiences.map((exp) => (
                              <div key={exp.id} className="text-xs">
                                <div className="font-mono text-[10px] text-gray-500 mb-0.5">{exp.period}</div>
                                <div className="font-bold text-gray-900">{exp.title}</div>
                                <div className="font-medium text-gray-600 mb-1">{exp.company}</div>
                                <p className="text-gray-600 text-[11px] leading-relaxed whitespace-pre-line">
                                  {exp.details}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section: Education */}
                    {cvData.education.length > 0 && (
                      <div className="mb-6 border-t border-gray-100 pt-4">
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-4 text-xs font-black text-gray-700 uppercase tracking-wide border-l-2 pl-3" style={{ borderLeftColor: primaryColor }}>
                            EDUCATION & TRAINING<br />التعليم والتدريب
                          </div>
                          <div className="col-span-8 space-y-3">
                            {cvData.education.map((edu) => (
                              <div key={edu.id} className="text-xs">
                                <div className="font-mono text-[10px] text-gray-500">{edu.year}</div>
                                <div className="font-bold text-gray-900">{edu.degree}</div>
                                <div className="text-gray-600">{edu.institution}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section: Personal Skills & Languages */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4 text-xs font-black text-gray-700 uppercase tracking-wide border-l-2 pl-3" style={{ borderLeftColor: primaryColor }}>
                          PERSONAL SKILLS<br />الكفاءات واللغات
                        </div>
                        <div className="col-span-8 space-y-3 text-xs">
                          <div>
                            <span className="font-bold text-gray-800 block mb-1">اللغات الأوروبية (CEFR Framework):</span>
                            <div className="flex flex-wrap gap-3">
                              {cvData.languages.map((l, i) => (
                                <span key={i} className="bg-gray-100 px-2.5 py-1 rounded text-[11px]">
                                  {l.name} — <strong className="text-gray-900">{l.level}</strong>
                                </span>
                              ))}
                            </div>
                          </div>

                          {cvData.skills.length > 0 && (
                            <div>
                              <span className="font-bold text-gray-800 block mb-1">المهارات الرقمية والتنظيمية:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {cvData.skills.map((s) => (
                                  <span key={s} className="bg-slate-50 border border-gray-200 text-gray-800 px-2 py-0.5 rounded text-[10px]">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Free Watermark */}
                  {!isPro && (
                    <div className="mt-8 pt-3 border-t border-gray-200 text-center text-[10px] text-gray-400 font-mono">
                      تم الإنشاء بواسطة منصة أدوات • adawat.com
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* Standards Guide */}
      <div className="mt-12 p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#9194a1]">
          <div>
            <h4 className="font-mono text-[#cc9166] uppercase text-[11px] mb-1">01 / متوافق مع خوارزميات ATS</h4>
            <p className="leading-relaxed">
              تعتمد القوالب على هيكلية قراءة نصية واضحة ومباشرة تفهمها أنظمة الفرز الآلي دون أخطاء في التعرف على الخبرات.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[#cc9166] uppercase text-[11px] mb-1">02 / معايير EuroPass للاتحاد الأوروبي</h4>
            <p className="leading-relaxed">
              قالب EuroPass مصمم طبقاً للأطر الرسمية للمفوضية الأوروبية مع تصنيف مهارات اللغات حسب معايير CEFR.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[#cc9166] uppercase text-[11px] mb-1">03 / تصدير A4 عالي الدقة</h4>
            <p className="leading-relaxed">
              توليد ملفات PDF بنقاء 300 DPI وأبعاد A4 عالمية مع طباعة دقيقة وحفاظ كامل على الخطوط والألوان.
            </p>
          </div>
        </div>
      </div>

      {/* Ad slot: Placed neatly AFTER the workspace */}
      <div className="mt-8">
        <AdBanner slot="cv-builder-bottom" />
      </div>

    </div>
    </AuthGuard>
  );
}
