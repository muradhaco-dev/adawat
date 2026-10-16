'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Languages, 
  Wrench,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AdBanner from '@/components/AdBanner';
import { supabase } from '@/lib/supabase/client';

export default function CVBuilderPage() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<'modern' | 'executive' | 'minimal'>('modern');
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Resume State
  const [cvData, setCvData] = useState({
    fullName: 'أحمد محمد الخالد',
    jobTitle: 'مهندس برمجيات ومطور واجهات أمامية',
    email: 'ahmad.alkhaled@example.com',
    phone: '+90 534 000 0000',
    location: 'إسطنبول، تركيا (مستعد للانتقال لألمانيا أو العمل عن بعد)',
    summary: 'مطور برمجيات ذو خبرة تمتد لأكثر من 5 سنوات في بناء تطبيقات الويب السريعة والحديثة. متخصص في تقنيات React و Next.js و TypeScript. متقن للتواصل والعمل ضمن فرق متعددة الثقافات ومتحمس لتطوير حلول برمجية تلبي أعلى معايير الجودة العالمية.',
    skills: ['JavaScript / TypeScript', 'React & Next.js', 'Tailwind CSS', 'Git & GitHub', 'حل المشكلات', 'إدارة المشاريع Agile'],
    experiences: [
      {
        id: '1',
        title: 'مطور واجهات أول (Senior Frontend Developer)',
        company: 'شركة التقنية الذكية للحلول الرقمية',
        period: '2022 - حتى الآن',
        details: 'قيادة فريق تطوير الواجهات الأمامية لمنصة التجارة الإلكترونية، وتحسين سرعة تحميل الصفحات بنسبة 45%، بالإضافة إلى بناء لوحات تحكم متطورة للمستخدمين.',
      },
      {
        id: '2',
        title: 'مطور ويب (Web Developer)',
        company: 'وكالة الحلول البرمجية المتكاملة',
        period: '2019 - 2022',
        details: 'تصميم وتنفيذ أكثر من 20 موقعاً وتطبيقاً متجاوباً مع مختلف الأجهزة، والتعاون المباشر مع مدراء المنتجات لتحسين تجربة المستخدم.',
      },
    ],
    education: [
      {
        id: '1',
        degree: 'بكالوريوس في هندسة البرمجيات وتكنولوجيا المعلومات',
        institution: 'جامعة إسطنبول التقنية',
        year: '2015 - 2019',
      },
    ],
    languages: [
      { name: 'العربية', level: 'اللغة الأم' },
      { name: 'التركية', level: 'طلاقة واحترافية (C1)' },
      { name: 'الإنجليزية', level: 'متقدم مهني (B2/C1)' },
      { name: 'الألمانية', level: 'مبتدئ / قيد التعلم (A2)' },
    ],
  });

  const [newSkill, setNewSkill] = useState('');

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
  const addSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSkill.trim()) return;
    if (!cvData.skills.includes(newSkill.trim())) {
      setCvData({ ...cvData, skills: [...cvData.skills, newSkill.trim()] });
    }
    setNewSkill('');
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
      languages: [...cvData.languages, { name: '', level: 'متوسط' }],
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

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    try {
      setDownloading(true);

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cvData.fullName.replace(/\s+/g, '_')}_CV.pdf`);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      alert('حدث خطأ أثناء تحميل السيرة الذاتية، يرجى المحاولة مجدداً');
    } finally {
      setDownloading(false);
    }
  };

  // Save to Supabase (if logged in)
  const handleSaveToSupabase = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert('يرجى تسجيل الدخول أولاً لحفظ السيرة الذاتية في حسابك والرجوع إليها لاحقاً');
        return;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>متوافق مع أنظمة التوظيف ATS ومعايير العمل في تركيا وألمانيا والخليج</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            صانع السيرة الذاتية الاحترافية بالعربي
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            املأ بياناتك في النموذج على اليمين وشاهد المعاينة الحية فوراً، ثم حمّل ملف PDF جاهزاً للتقديم
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSaveToSupabase}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm shadow-sm transition-all active:scale-95"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">تم الحفظ بحسابك!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-gray-500" />
                <span>{saving ? 'جاري الحفظ...' : 'حفظ في حسابي'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-200 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'جاري تصدير PDF...' : 'تحميل السيرة الذاتية PDF'}</span>
          </button>
        </div>
      </div>

      {/* Ad slot */}
      <AdBanner slot="cv-builder-top" />

      {/* Template Switcher */}
      <div className="my-6 p-3 bg-white rounded-2xl border border-gray-200 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
          اختر تصميم القالب:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTemplate('modern')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              template === 'modern'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            العصري (Modern Indigo)
          </button>
          <button
            onClick={() => setTemplate('executive')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              template === 'executive'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            التنفيذي الأوروبي (Executive Dark)
          </button>
          <button
            onClick={() => setTemplate('minimal')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              template === 'minimal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            البسيط النظيف (Minimalist)
          </button>
        </div>
      </div>

      {/* Grid: Editor Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Editor Form (7 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Section 1: Personal Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">1</span>
              المعلومات الشخصية وبيانات الاتصال
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={cvData.fullName}
                  onChange={(e) => setCvData({ ...cvData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="محمد العبدالله"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">المسمى الوظيفي المستهدف</label>
                <input
                  type="text"
                  value={cvData.jobTitle}
                  onChange={(e) => setCvData({ ...cvData, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="محاسب مالي / مطور برمجيات"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={cvData.email}
                  onChange={(e) => setCvData({ ...cvData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف / واتساب</label>
                <input
                  type="text"
                  value={cvData.phone}
                  onChange={(e) => setCvData({ ...cvData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-left"
                  placeholder="+90 5XX XXX XXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">مكان الإقامة / المدينة والدولة</label>
              <input
                type="text"
                value={cvData.location}
                onChange={(e) => setCvData({ ...cvData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="إسطنبول، تركيا / برلين، ألمانيا"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">نبذة تعريفية (الملخص المهني)</label>
              <textarea
                rows={3}
                value={cvData.summary}
                onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none leading-relaxed"
                placeholder="اكتب فقرة ملخصة وجذابة عن شغفك وخبراتك..."
              />
            </div>
          </div>

          {/* Section 2: Experience */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">2</span>
                الخبرات المهنية وسجل العمل
              </h2>
              <button
                onClick={addExperience}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> إضافة خبرة
              </button>
            </div>

            <div className="space-y-4">
              {cvData.experiences.map((exp, idx) => (
                <div key={exp.id} className="p-4 rounded-xl border border-gray-100 bg-slate-50/50 space-y-3 relative">
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="absolute top-3 left-3 text-gray-400 hover:text-red-600 p-1 rounded-md"
                    title="حذف هذه الخبرة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">المسمى الوظيفي</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">اسم الشركة / المؤسسة</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">الفترة الزمنية (من - إلى)</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                      placeholder="2021 - 2023 أو 2022 - حتى الآن"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">أبرز المهام والإنجازات</label>
                    <textarea
                      rows={2}
                      value={exp.details}
                      onChange={(e) => updateExperience(exp.id, 'details', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Education */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">3</span>
                التعليم والشهادات الأكاديمية
              </h2>
              <button
                onClick={addEducation}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> إضافة مؤهل
              </button>
            </div>

            <div className="space-y-4">
              {cvData.education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-xl border border-gray-100 bg-slate-50/50 space-y-3 relative">
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="absolute top-3 left-3 text-gray-400 hover:text-red-600 p-1 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">الشهادة / التخصص</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 mb-1">الجامعة / المعهد</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">سنة التخرج</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                      placeholder="2018 - 2022"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Skills & Languages */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100 mb-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold">4</span>
                المهارات والكفاءات
              </h2>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="أضف مهارة واضغط إضافة..."
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => addSkill()}
                  className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700"
                >
                  إضافة
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {cvData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                <h3 className="text-xs font-bold text-gray-700">اللغات</h3>
                <button
                  type="button"
                  onClick={addLanguage}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700"
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
                      className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                    />
                    <input
                      type="text"
                      value={lang.level}
                      onChange={(e) => updateLanguage(idx, 'level', e.target.value)}
                      placeholder="المستوى (مثال: C1 أو ممتاز)"
                      className="w-36 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeLanguage(idx)}
                      className="text-gray-400 hover:text-red-500 p-1"
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
          <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 shadow-inner">
            <div className="flex items-center justify-between pb-3 text-xs text-gray-500 font-bold border-b border-gray-200 mb-3">
              <span>معاينة حية للصفحة (A4 جاهز للتنزيل)</span>
              <span className="text-blue-600">تحديث تلقائي</span>
            </div>

            {/* A4 Paper Canvas */}
            <div
              ref={resumeRef}
              className={`bg-white shadow-xl rounded-lg p-8 min-h-[750px] text-gray-900 border border-gray-100 transition-all ${
                template === 'executive'
                  ? 'border-t-8 border-t-slate-800'
                  : template === 'minimal'
                  ? 'border-t-8 border-t-emerald-600'
                  : 'border-t-8 border-t-blue-600'
              }`}
              style={{ direction: 'rtl' }}
            >
              {/* Header */}
              <div className="border-b border-gray-200 pb-5 mb-5">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {cvData.fullName || 'اسمك الكامل'}
                </h1>
                <p className={`text-sm font-bold mt-1 ${
                  template === 'executive' ? 'text-slate-700' : template === 'minimal' ? 'text-emerald-700' : 'text-blue-600'
                }`}>
                  {cvData.jobTitle || 'المسمى الوظيفي'}
                </p>

                {/* Contact row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-3 pt-3 border-t border-gray-100">
                  {cvData.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{cvData.email}</span>
                    </div>
                  )}
                  {cvData.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span dir="ltr">{cvData.phone}</span>
                    </div>
                  )}
                  {cvData.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{cvData.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary */}
              {cvData.summary && (
                <div className="mb-5">
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">
                    النبذة التعريفية
                  </h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {cvData.summary}
                  </p>
                </div>
              )}

              {/* Work Experience */}
              {cvData.experiences.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3">
                    الخبرات المهنية
                  </h3>
                  <div className="space-y-4">
                    {cvData.experiences.map((exp) => (
                      <div key={exp.id} className="text-xs">
                        <div className="flex items-center justify-between font-bold text-gray-900">
                          <span>{exp.title || 'المسمى الوظيفي'}</span>
                          <span className="text-[11px] text-gray-500 font-normal">{exp.period}</span>
                        </div>
                        <div className="text-[11px] text-blue-600 font-semibold mb-1">
                          {exp.company}
                        </div>
                        <p className="text-gray-600 text-[11px] leading-relaxed">
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
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">
                    التعليم والشهادات
                  </h3>
                  <div className="space-y-2">
                    {cvData.education.map((edu) => (
                      <div key={edu.id} className="text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-900 block">{edu.degree}</span>
                          <span className="text-gray-500 text-[11px]">{edu.institution}</span>
                        </div>
                        <span className="text-[11px] text-gray-400">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {cvData.skills.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">
                    المهارات والكفاءات
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cvData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-semibold bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {cvData.languages.length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2">
                    اللغات
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {cvData.languages.map((l, i) => (
                      <div key={i} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded">
                        <span className="font-bold text-gray-800">{l.name}</span>
                        <span className="text-gray-500">{l.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
