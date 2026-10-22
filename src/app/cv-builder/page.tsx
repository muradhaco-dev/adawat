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
  MapPin
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
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 pb-8 border-b border-[#1c1d22]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-3">
            <span>ATS-READY / معتمد لسوق العمل</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#ffffff] font-normal tracking-tight">
            صانع السيرة الذاتية المهنية
          </h1>
          <p className="text-xs sm:text-sm text-[#9194a1] mt-2">
            املأ بياناتك في الاستمارة وشاهد المعاينة الحية فوراً مع تصدير مباشر لملف PDF عالي الدقة.
          </p>
        </div>

        {/* Action Controls: Slash Pill Buttons */}
        <div className="flex flex-wrap items-center gap-3">
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
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium transition-all active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'جاري التصدير...' : 'تحميل PDF'}</span>
          </button>
        </div>
      </div>

      {/* Template Switcher: Slash Pill */}
      <div className="my-8 p-3 bg-[#040406] rounded-[10px] border border-[#1c1d22] flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-mono uppercase text-[#cc9166]">
          قالب التصميم:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTemplate('modern')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              template === 'modern'
                ? 'bg-[#ffffff] text-[#000000] font-semibold'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            العصري (Modern Indigo)
          </button>
          <button
            onClick={() => setTemplate('executive')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              template === 'executive'
                ? 'bg-[#ffffff] text-[#000000] font-semibold'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            التنفيذي الأوروبي (Executive Dark)
          </button>
          <button
            onClick={() => setTemplate('minimal')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              template === 'minimal'
                ? 'bg-[#ffffff] text-[#000000] font-semibold'
                : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            البسيط النظيف (Minimalist)
          </button>
        </div>
      </div>

      {/* Grid: Editor Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Editor Form (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          
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
              <label className="block text-xs font-mono text-[#9194a1] mb-1">النبذة التعريفية</label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
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
                      <label className="block text-[10px] font-mono text-[#9194a1] mb-1">اسم المؤسسة</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#9194a1] mb-1">الفترة الزمنية</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none font-mono"
                      placeholder="2021 - حتى الآن"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#9194a1] mb-1">أبرز الإنجازات والمهام</label>
                    <textarea
                      rows={2}
                      value={exp.details}
                      onChange={(e) => updateExperience(exp.id, 'details', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-[10px] text-xs text-[#ffffff] outline-none"
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
                03 / التعليم والمؤهلات
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
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
                    <div>
                      <label className="block text-[10px] font-mono text-[#9194a1] mb-1">الشهادة / التخصص</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-[#121317] border border-[#1c1d22] rounded-full text-xs text-[#ffffff] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#9194a1] mb-1">الجامعة / المعهد</label>
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
          <div className="bg-[#040406] p-4 rounded-[10px] border border-[#1c1d22]">
            <div className="flex items-center justify-between pb-3 text-xs text-[#5e616e] font-mono border-b border-[#1c1d22] mb-4">
              <span>استوديو المعاينة — قياس A4 الدولي</span>
              <span className="text-[#cc9166]">تحديث فوري</span>
            </div>

            {/* A4 Paper Canvas: Pure White for Pristine PDF Output */}
            <div
              ref={resumeRef}
              className={`bg-white shadow-2xl rounded-sm p-8 min-h-[750px] text-gray-900 border border-gray-200 transition-all ${
                template === 'executive'
                  ? 'border-t-8 border-t-slate-900'
                  : template === 'minimal'
                  ? 'border-t-8 border-t-[#cc9166]'
                  : 'border-t-8 border-t-blue-700'
              }`}
              style={{ direction: 'rtl' }}
            >
              {/* Header */}
              <div className="border-b border-gray-200 pb-5 mb-5">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {cvData.fullName || 'اسمك الكامل'}
                </h1>
                <p className={`text-sm font-bold mt-1 ${
                  template === 'executive' ? 'text-slate-800' : template === 'minimal' ? 'text-[#cc9166]' : 'text-blue-700'
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
                        <div className="text-[11px] text-blue-700 font-semibold mb-1">
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

      {/* ATS & EuroPass Standard Guide */}
      <div className="mt-12 p-6 rounded-[10px] bg-[#040406] border border-[#1c1d22]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#9194a1]">
          <div>
            <h4 className="font-mono text-[#cc9166] uppercase text-[11px] mb-1">01 / متوافق مع أنظمة ATS</h4>
            <p className="leading-relaxed">
              تعتمد القوالب على هيكلية نصية قياسية يسهل قراءتها بواسطة خوارزميات الفحص الآلي بدون عناصر بصرية معقدة تتسبب برفض ملفك.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[#cc9166] uppercase text-[11px] mb-1">02 / معايير EuroPass</h4>
            <p className="leading-relaxed">
              تنسيق الأقسام متطابق مع متطلبات التوظيف في دول الاتحاد الأوروبي (ألمانيا وهولندا وغيرها) والشركات الدولية في تركيا والخليج.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[#cc9166] uppercase text-[11px] mb-1">03 / تصدير PDF نقي</h4>
            <p className="leading-relaxed">
              توليد ملفات PDF بحجم A4 قياسي مع طباعة واضحة للنصوص ومستويات تباين ملائمة للمسح الضوئي والفرز الأوتوماتيكي.
            </p>
          </div>
        </div>
      </div>

      {/* Ad slot: Placed neatly AFTER the workspace */}
      <div className="mt-8">
        <AdBanner slot="cv-builder-bottom" />
      </div>

    </div>
  );
}
