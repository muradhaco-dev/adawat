import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, language = 'ar' } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      return NextResponse.json({ 
        success: false, 
        fallback: true, 
        message: 'No Google AI Studio key configured, using local engine' 
      });
    }

    const systemInstruction = language === 'en' 
      ? `You are an elite executive resume writer and ATS specialist. Extract all information from the user's input and generate a complete, high-impact professional CV in English.
Return strictly valid JSON matching this exact structure:
{
  "fullName": "Full Name",
  "jobTitle": "Exact Professional Title",
  "email": "user email or generated plausible professional email",
  "phone": "user phone or plausible format",
  "location": "City, Country",
  "summary": "3-4 sentences high-impact ATS-friendly executive summary using strong action verbs.",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
  "experiences": [
    {
      "id": "1",
      "title": "Job Title",
      "company": "Company Name",
      "period": "e.g. 2022 - Present",
      "details": "• Bullet point 1 with metrics and action verbs\\n• Bullet point 2 with concrete results\\n• Bullet point 3"
    }
  ],
  "education": [
    {
      "id": "1",
      "degree": "Degree Title",
      "institution": "University / College",
      "year": "e.g. 2016 - 2020"
    }
  ],
  "languages": [
    { "name": "Language 1", "level": "Native / Fluent / Advanced" },
    { "name": "Language 2", "level": "Professional Working (C1)" }
  ]
}`
      : `أنت خبير محترف ومستشار توظيف معتمد في صياغة السير الذاتية الاحترافية المتوافقة مع أنظمة الفرز الآلي ATS ومعايير EuroPass وسوق العمل في الخليج وألمانيا وتركيا.
قم بقراءة نص المستخدم واستخراج كل التفاصيل وصياغة سيرة ذاتية متكاملة وقوية باللغة العربية الفصحى الراقية.
يجب أن ترجع فقط كائن JSON صالح وبدون أي نصوص إضافية خارج الـ JSON بهذا الهيكل الدقيق:
{
  "fullName": "الاسم الكامل",
  "jobTitle": "المسمى الوظيفي الاحترافي الدقيق",
  "email": "البريد الإلكتروني المستخرج أو بريد افتراضي احترافي",
  "phone": "رقم الهاتف المستخرج أو رقم قياسي",
  "location": "المدينة، الدولة",
  "summary": "ملخص مهني تنفيذي مكثف من 3-4 جمل مليء بأفعال القوة والإنجاز ومؤشرات النجاح.",
  "skills": ["مهارة 1", "مهارة 2", "مهارة 3", "مهارة 4", "مهارة 5", "مهارة 6", "مهارة 7", "مهارة 8"],
  "experiences": [
    {
      "id": "1",
      "title": "المسمى الوظيفي",
      "company": "اسم الشركة أو المؤسسة",
      "period": "مثال: 2022 - حتى الآن",
      "details": "• إنجاز أول مدعوم بنسب أو نتائج قوية وأفعال قيادية\\n• إنجاز ثانٍ تفصيلي يوضح أثر العمل\\n• إنجاز ثالث يوضح العمل ضمن فريق أو إدارة مهام"
    }
  ],
  "education": [
    {
      "id": "1",
      "degree": "المؤهل الدراسي أو الشهادة",
      "institution": "اسم الجامعة أو المؤسسة الأكاديمية",
      "year": "مثال: 2016 - 2020"
    }
  ],
  "languages": [
    { "name": "اللغة الأولى", "level": "اللغة الأم / طلاقة كاملة" },
    { "name": "اللغة الثانية", "level": "متقدم مهني (C1)" }
  ]
}`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemInstruction}\n\nبيانات وخبرات المستخدم:\n${prompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        topP: 0.95,
        responseMimeType: 'application/json'
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API returned error, falling back:', errText);
      return NextResponse.json({ success: false, fallback: true, error: errText });
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json({ success: false, fallback: true });
    }

    // Clean JSON response
    const cleanedJsonStr = candidateText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    const cvResult = JSON.parse(cleanedJsonStr);

    return NextResponse.json({
      success: true,
      provider: 'google-gemini',
      data: cvResult
    });

  } catch (error: any) {
    console.error('API route error in AI CV:', error);
    return NextResponse.json({ success: false, fallback: true, error: error.message });
  }
}
