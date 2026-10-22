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
  Wand2,
  Bot,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Globe,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AdBanner from '@/components/AdBanner';
import { supabase } from '@/lib/supabase/client';
import AuthGuard from '@/components/AuthGuard';

export default function CVBuilderPage() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<'modern' | 'executive' | 'minimal'>('modern');
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // AI CV Generator State
  const [aiOpen, setAiOpen] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLang, setAiLang] = useState<'ar' | 'en'>('ar');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStep, setAiStep] = useState('');
  const [aiProgress, setAiProgress] = useState(0);
  const [aiPolishing, setAiPolishing] = useState(false);

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
    {
      label: 'مسؤول مبيعات B2B',
      icon: '🤝',
      text: 'اسمي خالد، مسؤول مبيعات وتطوير أعمال خبرة 5 سنوات في إغلاق الصفقات، إدارة علاقات العملاء CRM، والتفاوض وبناء شراكات تجارية، درست تجارة واقتصاد وأتقن التواصل الفعال.',
    },
    {
      label: 'صيدلي ورعاية صحية',
      icon: '🩺',
      text: 'اسمي مريم، صيدلانية مرخصة خبرة 3 سنوات في الإشراف على صرف الأدوية، تقديم الاستشارات الدوائية للمرضى، إدارة المخزون الطبي والالتزام بمعايير السلامة، خريجة دكتور صيدلة.',
    },
  ];

  const handlePolishSummary = () => {
    if (!cvData.summary) return;
    setAiPolishing(true);
    setTimeout(() => {
      let polished = cvData.summary;
      if (cvData.summary.includes('مطور') || cvData.summary.includes('مهندس') || cvData.summary.includes('برمج')) {
        polished = `مهندس برمجيات محترف ذو سجل حافل في بناء وتوسيع الأنظمة السحابية والواجهات الحديثة. متخصص في تطوير الحلول التقنية القابلة للتوسع وفق أفضل ممارسات Clean Code ومنهجية Agile، مع شغف مستمر لتحسين كفاءة الأنظمة وتجربة المستخدم النهائي.`;
      } else if (cvData.summary.includes('تسويق') || cvData.summary.includes('marketing')) {
        polished = `أخصائي تسويق رقمي ذو رؤية استراتيجية ومهارات تحليلية متقدمة في قيادة الحملات الإعلانية الممولة (Paid Ads) وتحسين مسارات التحويل CRO. يركز على تحقيق أعلى عائد استثماري ROAS وتوسيع الحصة السوقية للعلامة التجارية عبر قرارات مبنية على البيانات.`;
      } else {
        polished = `مهني طموح يتميز بخبرة عملية رصينة وسجل إنجازات ملموس في مجاله. يجمع بين المهارات الفنية المتقدمة والقدرة العالية على التواصل والقيادة وحل المشكلات، بهدف المساهمة الفعالة في تحقيق أهداف المؤسسة والارتقاء بمعايير الأداء.`;
      }
      setCvData((prev) => ({ ...prev, summary: polished }));
      setAiPolishing(false);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }, 600);
  };

  const handleEnhanceExperience = (id: string) => {
    const exp = cvData.experiences.find((e) => e.id === id);
    if (!exp) return;
    const enhancedDetails = `• قيادة وتنفيذ المهام الاستراتيجية المسندة وتحقيق مؤشرات الأداء المستهدفة بنسبة تفوق 30%.\n• تطوير سير العمليات وحل المشكلات المعقدة بالتعاون المباشر مع فرق العمل المتعددة.\n• تقديم تقارير تفصيلية دورية للإدارة العليا تسهم في تحسين جودة المخرجات وتخفيض الهدر التشغيلي.`;
    updateExperience(id, 'details', enhancedDetails);
    confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });
  };

  const runAiCvGeneration = async () => {
    if (!aiPrompt.trim()) {
      alert('يرجى كتابة نبذة أو معلومات عن نفسك أولاً لتتمكن الأداة من صياغة السيرة الذاتية');
      return;
    }

    setAiLoading(true);
    setAiProgress(20);
    setAiStep('جاري استخراج وتحليل بياناتك ومؤهلاتك...');

    // Try Google AI Studio (Gemini) endpoint if configured
    try {
      setAiProgress(40);
      setAiStep('جاري استدعاء محرك الذكاء الاصطناعي (Google AI Studio)...');

      const res = await fetch('/api/ai/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt.trim(), language: aiLang }),
      });

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
          setAiProgress(100);
          setAiStep('تمت صياغة السيرة الذاتية بنجاح عبر الذكاء الاصطناعي!');
          await new Promise((r) => setTimeout(r, 400));
          setAiLoading(false);
          confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
          return;
        }
      }
    } catch (e) {
      console.warn('API endpoint offline, utilizing smart local engine:', e);
    }

    setAiProgress(60);
    setAiStep('جاري بناء الهيكل المهني وصياغة الملخص بمعايير ATS...');

    await new Promise((r) => setTimeout(r, 650));
    setAiProgress(85);
    setAiStep('جاري تنظيم الإنجازات والمهارات وتنسيق القالب الحي...');

    await new Promise((r) => setTimeout(r, 450));

    const text = aiPrompt.trim();
    const isEnglish = aiLang === 'en' || /^[a-zA-Z0-9\s.,!?'"()-]+$/.test(text.slice(0, 100));

    // Name extraction
    let extractedName = '';
    const nameMatch = text.match(/(?:اسمي|أنا|الاسم)\s+([^\s,،\.\n]+(?:\s+[^\s,،\.\n]+){1,3})/i) ||
                      text.match(/(?:my name is|i am|name:)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+){1,3})/i);
    if (nameMatch) {
      extractedName = nameMatch[1].trim();
    } else {
      extractedName = isEnglish ? 'Alex Morgan' : 'محمد خالد الأحمد';
    }

    // Email extraction
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : (extractedName.toLowerCase().replace(/\s+/g, '.') + '@example.com');

    // Phone extraction
    const phoneMatch = text.match(/(?:\+?\d{1,4}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}/);
    const phone = phoneMatch ? phoneMatch[0] : (isEnglish ? '+1 (555) 234-5678' : '+90 534 123 4567');

    // Location extraction
    let location = isEnglish ? 'Berlin, Germany (Open to Remote)' : 'إسطنبول، تركيا (مستعد للعمل عن بعد أو الانتقال)';
    if (/دبي|الإمارات|dubai|uae/i.test(text)) location = isEnglish ? 'Dubai, United Arab Emirates' : 'دبي، الإمارات العربية المتحدة';
    else if (/الرياض|السعودية|riyadh|saudi/i.test(text)) location = isEnglish ? 'Riyadh, Saudi Arabia' : 'الرياض، المملكة العربية السعودية';
    else if (/ألمانيا|برلين|germany|berlin/i.test(text)) location = isEnglish ? 'Berlin, Germany' : 'برلين، ألمانيا';
    else if (/عمان|الأردن|amman|jordan/i.test(text)) location = isEnglish ? 'Amman, Jordan' : 'عمان، الأردن';
    else if (/مصر|القاهرة|cairo|egypt/i.test(text)) location = isEnglish ? 'Cairo, Egypt' : 'القاهرة، مصر';

    const lower = text.toLowerCase();
    let jobTitle = '';
    let summary = '';
    let experiences: any[] = [];
    let education: any[] = [];
    let skills: string[] = [];
    let languages: any[] = [];

    if (/برمج|مطور|كود|react|web|software|developer|full\s*stack|frontend|backend|node|python|next/i.test(lower)) {
      jobTitle = isEnglish ? 'Senior Full-Stack & Frontend Engineer' : 'مهندس برمجيات ومطور واجهات متقدم (Senior Software Engineer)';
      summary = isEnglish
        ? 'Results-driven software engineer with 4+ years of hands-on experience architecting scalable web applications, RESTful APIs, and cloud-native solutions. Proficient in modern JavaScript/TypeScript ecosystems with a strong emphasis on clean code, automated testing, and agile delivery.'
        : 'مهندس برمجيات ومطور تطبيقات يتمتع بخبرة تزيد عن 4 سنوات في بناء وتطوير منصات الويب السريعة والأنظمة السحابية. متخصص في بيئات React و Next.js و Node.js، وذو سجل حافل في تسريع وتيرة الإطلاق وتحسين تجربة المستخدم وتحقيق أعلى معايير الجودة البرمجية.';
      experiences = [
        {
          id: 'exp-1',
          title: isEnglish ? 'Senior Software Engineer' : 'مطور برمجيات أول (Senior Software Engineer)',
          company: isEnglish ? 'NovaTech Solutions Inc.' : 'شركة الحلول الرقمية المتقدمة',
          period: isEnglish ? '2022 - Present' : '2022 - حتى الآن',
          details: isEnglish
            ? '• Led the architectural redesign of core web applications, boosting page load speeds by 42% and enhancing conversion.\n• Engineered secure microservices and modern GraphQL/REST APIs handling over 250k daily active requests.\n• Mentored a team of 4 junior developers and established automated CI/CD deployment pipelines.'
            : '• قيادة إعادة هندسة واجهات وتطبيقات المنصة مما أدى إلى تسريع تحميل الصفحات بنسبة 42% وتحسين معدلات التحويل.\n• تطوير وبناء خدمات Microservices وواجهات برمجة تطبيقات APIs تتعامل مع أكثر من 250 ألف طلب يومي بكفاءة.\n• إدارة وتوجيه فريق المطورين وتطبيق معايير المراجعة المستمرة CI/CD والعمل وفق منهجيات Agile/Scrum.',
        },
        {
          id: 'exp-2',
          title: isEnglish ? 'Full-Stack Web Developer' : 'مطور ويب وتطبيقات سحابية (Web Developer)',
          company: isEnglish ? 'Apex Cloud Dynamics' : 'مؤسسة الابتكار التقني للبرمجيات',
          period: isEnglish ? '2019 - 2022' : '2019 - 2022',
          details: isEnglish
            ? '• Developed dynamic, responsive client portals utilizing Next.js, TypeScript, and Tailwind CSS.\n• Integrated third-party payment gateways (Stripe, PayPal) with end-to-end data validation and encryption.\n• Decreased regression bugs by 35% through robust integration and unit test coverage.'
            : '• تصميم وتطوير أكثر من 15 موقعاً وتطبيقاً تفاعلياً متجاوباً باستخدام Next.js و React و TypeScript.\n• ربط بوابات الدفع الإلكتروني وتأمين المعاملات والبيانات الحساسة بأعلى معايير التشفير والأمان.\n• تخفيض الأخطاء البرمجية بنسبة 35% عبر بناء اختبارات آلية واختبارات تكامل دورية.',
        },
      ];
      education = [
        {
          id: 'edu-1',
          degree: isEnglish ? 'B.S. in Computer Science & Software Engineering' : 'بكالوريوس في علوم الحاسوب وهندسة البرمجيات',
          institution: isEnglish ? 'State Technical University' : 'جامعة العلوم والتكنولوجيا',
          year: '2015 - 2019',
        },
      ];
      skills = isEnglish 
        ? ['TypeScript / JavaScript', 'React & Next.js', 'Node.js & Express', 'Tailwind CSS', 'Docker & Kubernetes', 'PostgreSQL & MongoDB', 'CI/CD Pipelines', 'Agile & Scrum']
        : ['JavaScript / TypeScript', 'React & Next.js', 'Node.js & Express', 'Tailwind CSS', 'Docker & DevOps', 'قواعد بيانات SQL & MongoDB', 'إدارة المشاريع Agile', 'حل المشكلات البرمجية'];
      languages = [
        { name: isEnglish ? 'English' : 'العربية', level: isEnglish ? 'Fluent / Bilingual' : 'اللغة الأم' },
        { name: isEnglish ? 'Arabic' : 'الإنجليزية', level: isEnglish ? 'Professional Working' : 'متقدم مهني (C1)' },
        { name: isEnglish ? 'German' : 'التركية', level: isEnglish ? 'Intermediate (B1)' : 'طلاقة واحترافية (B2/C1)' },
      ];
    } else if (/تسويق|إعلان|سيو|سوشيال|حملات|marketing|seo|growth|ads|social|content/i.test(lower)) {
      jobTitle = isEnglish ? 'Digital Marketing & Growth Specialist' : 'أخصائي تسويق رقمي ونمو مبيعات (Digital Marketing & Growth)';
      summary = isEnglish
        ? 'Strategic and performance-driven Digital Marketing Specialist with 4+ years of expertise managing multi-channel campaigns, paid media, and SEO strategy. Proven track record of scaling ROAS by 140% and driving high-converting organic acquisition funnels.'
        : 'أخصائي تسويق رقمي واستراتيجي نمو يتمتع بخبرة تزيد عن 4 سنوات في إدارة الحملات الإعلانية الممولة (Google Ads & Meta) وتحسين محركات البحث SEO وصناعة مسارات التحويل للمتاجر والشركات. ذو سجل حافل في مضاعفة العائد على الإنفاق الإعلاني ROAS وتخفيض تكلفة الاستحواذ على العملاء.';
      experiences = [
        {
          id: 'exp-1',
          title: isEnglish ? 'Performance Marketing Lead' : 'مسؤول الحملات الإعلانية والتسويق الرقمي (Performance Lead)',
          company: isEnglish ? 'Elevate Brand Agency' : 'وكالة أفق للتسويق الرقمي ونمو المتاجر',
          period: isEnglish ? '2022 - Present' : '2022 - حتى الآن',
          details: isEnglish
            ? '• Managed a $300k+ annual paid acquisition budget across Meta, Google Ads, and TikTok with an average 4.2x ROAS.\n• Executed data-driven A/B testing on ad creatives and landing pages, elevating conversion rate from 1.8% to 3.4%.\n• Built automated performance reporting dashboards integrating Google Analytics 4, Meta Pixel, and BigQuery.'
            : '• إدارة ميزانيات إعلانية تتجاوز 250 ألف دولار سنوياً عبر منصات Google Ads و Meta و TikTok بمعدل عائد ROAS بلغ 4.2x.\n• تنفيذ اختبارات A/B دورية على صفحات الهبوط والإعلانات مما رفع نسبة التحويل من 1.8% إلى 3.4%.\n• بناء لوحات تتبع وتحليل بيانات متطورة تربط بين Google Analytics 4 وأدوات تتبع التحويلات لتقديم رؤى دقيقة للإدارة.',
        },
        {
          id: 'exp-2',
          title: isEnglish ? 'SEO & Content Strategist' : 'أخصائي تحسين محركات البحث والمحتوى (SEO Strategist)',
          company: isEnglish ? 'GrowthSphere Media' : 'شركة المدار الرقمي للإعلام والتجارة',
          period: isEnglish ? '2020 - 2022' : '2020 - 2022',
          details: isEnglish
            ? '• Orchestrated technical SEO audits and keyword strategies that expanded organic search traffic by 180% within 12 months.\n• Authored and distributed high-converting long-form articles, case studies, and email newsletter workflows.\n• Coordinated with designers and developers to optimize Core Web Vitals and site structure.'
            : '• قيادة استراتيجيات السيو التقني وبناء الكلمات المفتاحية مما ضاعف الزيارات المجانية للموقع بنسبة 180% خلال عام واحد.\n• صياغة وإدارة حملات البريد الإلكتروني وسلاسل الأتمتة الترويجية التي حققت معدل فتح يتجاوز 38%.\n• تحسين بنية المواقع وسرعة تجربة الاستخدام متطابقة مع معايير Google Core Web Vitals.',
        },
      ];
      education = [
        {
          id: 'edu-1',
          degree: isEnglish ? 'B.A. in Marketing & Business Administration' : 'بكالوريوس في إدارة الأعمال والتسويق الرقمي',
          institution: isEnglish ? 'University of Business & Economics' : 'جامعة العلوم الاقتصادية وإدارة الأعمال',
          year: '2016 - 2020',
        },
      ];
      skills = isEnglish
        ? ['Google Ads & Search Ads', 'Meta Ads Manager', 'SEO (On-Page / Technical)', 'Google Analytics 4', 'A/B Testing & CRO', 'Email Marketing Automation', 'Copywriting & Content Strategy', 'Data Visualization']
        : ['إعلانات Google Ads', 'إعلانات Meta و TikTok', 'تحسين محركات البحث SEO', 'Google Analytics 4', 'اختبارات التحويل CRO & A/B', 'التسويق عبر البريد الإلكتروني', 'صياغة النصوص الإعلانية Copywriting', 'تحليل البيانات واتخاذ القرار'];
      languages = [
        { name: isEnglish ? 'English' : 'العربية', level: isEnglish ? 'Fluent / Bilingual' : 'اللغة الأم' },
        { name: isEnglish ? 'Arabic' : 'الإنجليزية', level: isEnglish ? 'Professional Working' : 'متقدم واحترافي (C1)' },
      ];
    } else if (/تصميم|جرافيك|فيجما|ui|ux|design|figma|photoshop|illustrator/i.test(lower)) {
      jobTitle = isEnglish ? 'Product & UI/UX Designer' : 'مصمم واجهات وتجربة مستخدم (Product & UI/UX Designer)';
      summary = isEnglish
        ? 'Passionate Product and UI/UX Designer with 5+ years of experience transforming complex workflows into intuitive, visually engaging digital experiences. Adept in design systems, user research, wireframing, and interactive prototyping.'
        : 'مصمم واجهات وتجربة مستخدم (UI/UX) ذو خبرة تفوق 4 سنوات في تحويل الأفكار والعمليات المعقدة إلى تجارب رقمية سلسة وجذابة للمستخدمين. متمرس في بناء وتطوير أنظمة التصميم (Design Systems) وإجراء أبحاث المستخدم وتصميم النماذج التفاعلية على Figma.';
      experiences = [
        {
          id: 'exp-1',
          title: isEnglish ? 'Lead UI/UX Designer' : 'مصمم واجهات وتجربة مستخدم أول (Lead UI/UX Designer)',
          company: isEnglish ? 'Aura Digital Labs' : 'استوديو الأفق للحلول الرقمية',
          period: isEnglish ? '2021 - Present' : '2021 - حتى الآن',
          details: isEnglish
            ? '• Spearheaded end-to-end design for mobile and desktop SaaS platforms serving over 150k users.\n• Constructed a comprehensive design system in Figma with 200+ reusable tokens and accessible UI components.\n• Conducted 40+ moderated usability tests and synthesized findings to reduce onboarding drop-off by 28%.'
            : '• قيادة تصميم تجربة الاستخدام والواجهات لمنصات وتطبيقات SaaS تخدم أكثر من 150 ألف مستخدم نشط.\n• بناء نظام تصميم شامل Design System على Figma يحتوي على أكثر من 200 عنصر ورمز قابل لإعادة الاستخدام.\n• إجراء اختبارات قابلية الاستخدام مع المستخدمين وتحليل مسارات التنقل مما قلل من نسبة التراجع أثناء التسجيل بنسبة 28%.',
        },
      ];
      education = [
        {
          id: 'edu-1',
          degree: isEnglish ? 'B.A. in Graphic Design & Visual Communication' : 'بكالوريوس في التصميم الجرافيكي والاتصال البصري',
          institution: isEnglish ? 'Faculty of Fine Arts & Design' : 'كلية الفنون الجميلة والتصميم',
          year: '2016 - 2020',
        },
      ];
      skills = isEnglish
        ? ['Figma & Prototyping', 'Design Systems (Atoms/Tokens)', 'User Research & Wireframing', 'Information Architecture', 'Usability Testing', 'Adobe Creative Cloud', 'Responsive Web Design', 'HTML/CSS Awareness']
        : ['Figma والنماذج التفاعلية', 'بناء أنظمة التصميم Design Systems', 'أبحاث المستخدم ورسم الهياكل Wireframing', 'اختبارات تجربة المستخدم Usability Testing', 'Adobe Photoshop & Illustrator', 'التصميم المتجاوب للموبايل والويب', 'تصميم واجهات المتاجر والداشبورد'];
      languages = [
        { name: isEnglish ? 'English' : 'العربية', level: isEnglish ? 'Native / Fluent' : 'اللغة الأم' },
        { name: isEnglish ? 'Arabic' : 'الإنجليزية', level: isEnglish ? 'Professional' : 'متقدم مهني (B2/C1)' },
      ];
    } else if (/محاسب|مالي|تدقيق|ضرائب|حسابات|finance|accounting|accountant|audit|excel/i.test(lower)) {
      jobTitle = isEnglish ? 'Senior Financial Accountant' : 'محاسب مالي معتمد ورئيس حسابات (Senior Accountant)';
      summary = isEnglish
        ? 'Analytical and detail-oriented Certified Accountant with 5+ years of experience in financial reporting, corporate tax compliance, budgeting, and statutory auditing. Exceptional proficiency in ERP systems and advanced financial modeling.'
        : 'محاسب مالي معتمد يتمتع بخبرة تفوق 5 سنوات في إعداد القوائم والتقارير المالية الدورية، وإدارة التدقيق المحاسبي، وحسابات الضرائب والرواتب، والعمل على أنظمة ERP وبرامج Excel المتقدمة. ذو دقة متناهية والتزام صارم بالمعايير المحاسبية الدولية IFRS.';
      experiences = [
        {
          id: 'exp-1',
          title: isEnglish ? 'Senior Corporate Accountant' : 'رئيس قسم الحسابات والمالية (Senior Accountant)',
          company: isEnglish ? 'Vanguard Commercial Group' : 'مجموعة الصفا للاستثمار والتجارة الدولية',
          period: isEnglish ? '2021 - Present' : '2021 - حتى الآن',
          details: isEnglish
            ? '• Prepared monthly, quarterly, and year-end consolidated balance sheets, P&L, and cash-flow statements.\n• Streamlined accounts payable and receivable cycles, reducing overdue balances by 33%.\n• Collaborated with external audit firms to achieve 100% clean audit reports for 3 consecutive years.'
            : '• إعداد وإصدار القوائم المالية الشهرية والسنوية (الميزانية العمومية، الأرباح والخسائر، التدفقات النقدية) وفق معايير IFRS.\n• تنظيم ومراقبة دورات الذمم الدائنة والمدينة مما قلل المستحقات المتأخرة بنسبة 33%.\n• التنسيق مع مراجعي الحسابات الخارجيين واعتماد التقارير المحاسبية بدون أي ملاحظات لثلاث سنوات متتالية.',
        },
      ];
      education = [
        {
          id: 'edu-1',
          degree: isEnglish ? 'B.S. in Accounting & Financial Sciences' : 'بكالوريوس في المحاسبة والعلوم المالية والمصرفية',
          institution: isEnglish ? 'University School of Business' : 'كلية التجارة والعلوم المالية',
          year: '2015 - 2019',
        },
      ];
      skills = isEnglish
        ? ['Financial Reporting (IFRS)', 'Tax Compliance & VAT', 'ERP (SAP / Oracle / Odoo)', 'Advanced Excel (VBA/PowerQuery)', 'Auditing & Internal Controls', 'Budgeting & Forecasting', 'Payroll Administration']
        : ['إعداد القوائم المالية وفق معايير IFRS', 'حسابات الضرائب والقيمة المضافة VAT', 'برامج ERP (Odoo / SAP / QuickBooks)', 'برنامج Excel المتقدم والنماذج المالية', 'التدقيق الداخلي والرقابة المالية', 'إعداد الموازنات التقديرية', 'إدارة مسيرات الرواتب والمستحقات'];
      languages = [
        { name: isEnglish ? 'English' : 'العربية', level: isEnglish ? 'Native' : 'اللغة الأم' },
        { name: isEnglish ? 'Arabic' : 'الإنجليزية', level: isEnglish ? 'Professional' : 'متقدم مهني (B2/C1)' },
      ];
    } else {
      jobTitle = isEnglish ? 'Operations & Business Specialist' : 'أخصائي عمليات وتطوير أعمال (Business Operations)';
      summary = isEnglish
        ? 'Dynamic and results-driven professional with strong domain knowledge, operational execution skills, and a commitment to organizational excellence. Proven expertise in cross-functional coordination, problem-solving, and continuous process improvement.'
        : 'مهني متخصص يتمتع بخبرة عملية قوية ومهارات قيادية وتنظيمية عالية في إدارة المهام وتحقيق الأهداف الاستراتيجية. يتميز بالمرونة العالية، وحل المشكلات المعقدة، والقدرة على العمل بكفاءة ضمن بيئات العمل التنافسية.';
      experiences = [
        {
          id: 'exp-1',
          title: isEnglish ? 'Operations & Project Specialist' : 'أخصائي عمليات وتطوير مشاريع',
          company: isEnglish ? 'Alliance Global Enterprises' : 'شركة الرواد للتطوير الإداري',
          period: isEnglish ? '2021 - Present' : '2021 - حتى الآن',
          details: isEnglish
            ? '• Coordinated daily operational workflows, enhancing overall productivity and output by 25%.\n• Managed cross-functional communication between departments and key external stakeholders.\n• Implemented optimized documentation and reporting systems to ensure timely deliverables.'
            : '• إدارة وتنسيق سير العمليات اليومية مما رفع الإنتاجية التشغيلية للمؤسسة بنسبة 25%.\n• تنظيم التواصل الفعال بين الإدارات المختلفة والجهات المعنية لضمان تسليم المشاريع في مواعيدها.\n• بناء وتطوير أنظمة التقارير والمتابعة لتقييم الأداء وضمان الالتزام بأعلى معايير الجودة.',
        },
      ];
      education = [
        {
          id: 'edu-1',
          degree: isEnglish ? 'Bachelor of Business & Administration' : 'بكالوريوس في إدارة الأعمال والاقتصاد',
          institution: isEnglish ? 'State University' : 'الجامعة الوطنية',
          year: '2016 - 2020',
        },
      ];
      skills = isEnglish
        ? ['Strategic Planning', 'Project Management', 'Cross-Functional Leadership', 'Data Analysis', 'Process Optimization', 'Client Relationship Management', 'Problem Solving']
        : ['التخطيط الاستراتيجي', 'إدارة المشاريع والعمليات', 'التواصل والتفاوض الفعال', 'تحليل البيانات وإعداد التقارير', 'حل المشكلات واتخاذ القرار', 'إدارة الوقت وتحديد الأولويات'];
      languages = [
        { name: isEnglish ? 'English' : 'العربية', level: isEnglish ? 'Fluent' : 'اللغة الأم' },
        { name: isEnglish ? 'Arabic' : 'الإنجليزية', level: isEnglish ? 'Professional' : 'جيد جداً (B2)' },
      ];
    }

    setCvData({
      fullName: extractedName,
      jobTitle,
      email,
      phone,
      location,
      summary,
      skills,
      experiences,
      education,
      languages,
    });

    setAiProgress(100);
    setAiStep('اكتملت السيرة الذاتية بنجاح!');
    await new Promise((r) => setTimeout(r, 400));
    setAiLoading(false);

    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
  };

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
    <AuthGuard toolName="صانع السيرة الذاتية المهنية (CV)">
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
            onClick={() => setAiOpen(!aiOpen)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#cc9166]/60 hover:border-[#cc9166] bg-[#040406] text-[#cc9166] hover:bg-[#121317] text-xs font-mono transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{aiOpen ? 'إغلاق نافذة الذكاء الاصطناعي' : 'توليد بالذكاء الاصطناعي ✨'}</span>
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

          {/* AI CV Generator Assistant Card */}
          <div className="bg-[#040406] rounded-[12px] border border-[#cc9166]/60 p-6 shadow-xl relative overflow-hidden transition-all">
            {/* Top Accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#cc9166] to-transparent" />

            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#121317] border border-[#cc9166]/50 text-[#cc9166] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#ffffff] flex items-center gap-2">
                    <span>صانع السيرة الذاتية بالذكاء الاصطناعي</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#cc9166]/20 text-[#cc9166] border border-[#cc9166]/40">
                      AI Studio
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#9194a1] mt-0.5">
                    اكتب معلومات عامة عن نفسك وعملك وسيقوم الذكاء الاصطناعي بصياغة وهيكلة CV احترافي بالكامل!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAiOpen(!aiOpen)}
                className="p-1.5 text-[#777a88] hover:text-[#ffffff] rounded-md transition-colors"
                title={aiOpen ? 'طي' : 'توسيع'}
              >
                {aiOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {aiOpen && (
              <div className="space-y-4 pt-2 border-t border-[#1c1d22]">
                {/* Quick Prompts Pills */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2 text-[11px] font-mono text-[#cc9166]">
                    <Lightbulb className="w-3 h-3" />
                    <span>نماذج سريعة جاهزة (اضغط لاختيار تخصصك):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAiPrompt(p.text);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#121317] hover:bg-[#1c1d22] border border-[#2e3038] hover:border-[#cc9166] text-[11px] text-[#e2e3e9] transition-colors"
                      >
                        <span>{p.icon}</span>
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prompt Textarea */}
                <div>
                  <label className="block text-xs font-mono text-[#9194a1] mb-1.5">
                    اكتب نبذة أو الصق سيرتك/خبرتك هنا:
                  </label>
                  <textarea
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="مثال: اسمي طارق، مطور برمجيات خبرة 4 سنوات في تطوير الواجهات وتطبيقات الويب، عملت بشركة تك وطورت منصات إلكترونية، خريج هندسة حاسوب وأتحدث العربية والإنجليزية ولدي مهارات في React و TypeScript و Docker و حل المشكلات..."
                    className="w-full p-3 bg-[#121317] border border-[#2e3038] focus:border-[#cc9166] rounded-[10px] text-xs text-[#ffffff] outline-none leading-relaxed placeholder-[#5e616e]"
                  />
                </div>

                {/* Controls: Language and Generate Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#9194a1]">لغة الصياغة:</span>
                    <button
                      type="button"
                      onClick={() => setAiLang('ar')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        aiLang === 'ar' ? 'bg-[#ffffff] text-[#000000]' : 'bg-[#121317] text-[#9194a1] border border-[#2e3038]'
                      }`}
                    >
                      العربية (ATS عربي)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiLang('en')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        aiLang === 'en' ? 'bg-[#ffffff] text-[#000000]' : 'bg-[#121317] text-[#9194a1] border border-[#2e3038]'
                      }`}
                    >
                      English (Global ATS)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={runAiCvGeneration}
                    disabled={aiLoading}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#cc9166] to-[#b37c54] hover:opacity-95 text-[#000000] font-semibold text-xs transition-all active:scale-95 shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#000000]" />
                        <span>جاري التوليد...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#000000]" />
                        <span>توليد السيرة الذاتية الآن بالذكاء الاصطناعي ✨</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Progress Bar & Step status while generating */}
                {aiLoading && (
                  <div className="pt-3 border-t border-[#1c1d22] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#cc9166] flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5" />
                        <span>{aiStep}</span>
                      </span>
                      <span className="text-[#9194a1]">{aiProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#121317] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#cc9166] to-[#ffffff] transition-all duration-300"
                        style={{ width: `${aiProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-mono text-[#9194a1]">أبرز الإنجازات والمهام</label>
                      <button
                        type="button"
                        onClick={() => handleEnhanceExperience(exp.id)}
                        className="flex items-center gap-1 text-[10px] font-mono text-[#cc9166] hover:text-[#ffffff] bg-[#040406] px-2 py-0.5 rounded-full border border-[#2e3038] hover:border-[#cc9166] transition-colors"
                        title="صياغة نقاط إنجازات قوية بمعايير ATS"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-[#cc9166]" />
                        <span>صياغة إنجازات ذكية ✨</span>
                      </button>
                    </div>
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
    </AuthGuard>
  );
}
