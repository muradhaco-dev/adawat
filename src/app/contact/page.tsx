'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  User, 
  ArrowLeft,
  Sparkles,
  Clock
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { lang, t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      lang === 'ar' ? `رسالة جديدة من موقع أدواتك - من ${name}` : `New message from ADAWAT - from ${name}`
    );
    const body = encodeURIComponent(
      lang === 'ar'
        ? `الاسم: ${name}\nالبريد: ${email}\n\nنص الرسالة:\n${message}`
        : `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:muradhaco@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#2e3038] bg-[#040406] text-[#cc9166] text-xs font-mono mb-6">
          <MessageCircle className="w-3.5 h-3.5 text-[#cc9166]" />
          <span>{lang === 'ar' ? 'الدعم والتواصل المباشر' : 'DIRECT COMMUNICATION & SUPPORT'}</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-serif text-[#ffffff] font-normal tracking-tight">
          {lang === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
        </h1>

        <p className="text-sm sm:text-base text-[#9194a1] mt-4 leading-relaxed">
          {lang === 'ar'
            ? 'لديك استفسار، اقتراح أداة جديدة، أو ترغب في تطوير مخصص؟ يسعدنا تواصلك المباشر مع فريق وإدارة الموقع.'
            : 'Have a question, feature request, or custom integration inquiry? Reach out directly to our engineering team.'}
        </p>
      </div>

      {/* Main Grid: Direct Contact Cards Left, Message Form Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        
        {/* Contact Info & Developer Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Developer Card — Slash aesthetic */}
          <div className="bg-[#040406] p-6 rounded-[10px] border border-[#1c1d22]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#cc9166] block mb-3">
              {lang === 'ar' ? 'إدارة وتطوير المنصة' : 'DEVELOPER & ARCHITECTURE'}
            </span>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#121317] border border-[#2e3038] flex items-center justify-center text-[#ffffff]">
                <User className="w-6 h-6 text-[#cc9166]" />
              </div>
              <div>
                <h3 className="text-base font-medium text-[#ffffff]">
                  {lang === 'ar' ? 'المبرمج محمد حجو' : 'Mohamed Hacco'}
                </h3>
                <p className="text-xs text-[#9194a1] font-mono">HACCO / Lead Developer</p>
              </div>
            </div>
            <p className="text-xs text-[#5e616e] leading-relaxed">
              {lang === 'ar'
                ? 'مطور برمجيات وتطبيقات ويب متكاملة. يمكنك التواصل معي مباشرة لأي استفسار تقني أو مقترحات تخص المنصة.'
                : 'Full-stack software developer. Contact me directly for technical support, feature suggestions, or business inquiries.'}
            </p>
          </div>

          {/* WhatsApp Direct Card */}
          <a
            href="https://wa.me/905319666195"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#040406] hover:bg-[#121317] p-5 rounded-[10px] border border-[#1c1d22] hover:border-[#2e3038] flex items-center justify-between transition-colors block"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#2e3038] flex items-center justify-center text-[#25D366] group-hover:border-[#25D366]/50">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#5e616e] uppercase block">
                  {lang === 'ar' ? 'محادثة فورية' : 'INSTANT CHAT'}
                </span>
                <span className="text-sm font-medium text-[#ffffff]">واتساب (WhatsApp)</span>
                <span className="text-xs text-[#9194a1] font-mono block mt-0.5" dir="ltr">
                  +90 531 966 6195
                </span>
              </div>
            </div>
            <ArrowLeft className={`w-4 h-4 text-[#5e616e] group-hover:text-[#ffffff] group-hover:-translate-x-1 transition-all ${lang === 'en' ? 'rotate-180' : ''}`} />
          </a>

          {/* Phone Call Card */}
          <a
            href="tel:+905319666195"
            className="group bg-[#040406] hover:bg-[#121317] p-5 rounded-[10px] border border-[#1c1d22] hover:border-[#2e3038] flex items-center justify-between transition-colors block"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#2e3038] flex items-center justify-center text-[#cc9166] group-hover:border-[#cc9166]/50">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#5e616e] uppercase block">
                  {lang === 'ar' ? 'اتصال هاتفي' : 'VOICE CALL'}
                </span>
                <span className="text-sm font-medium text-[#ffffff]">
                  {lang === 'ar' ? 'رقم الهاتف المباشر' : 'Direct Phone Line'}
                </span>
                <span className="text-xs text-[#9194a1] font-mono block mt-0.5" dir="ltr">
                  0090 531 966 6195
                </span>
              </div>
            </div>
            <ArrowLeft className={`w-4 h-4 text-[#5e616e] group-hover:text-[#ffffff] group-hover:-translate-x-1 transition-all ${lang === 'en' ? 'rotate-180' : ''}`} />
          </a>

          {/* Email Direct Card */}
          <a
            href="mailto:muradhaco@gmail.com"
            className="group bg-[#040406] hover:bg-[#121317] p-5 rounded-[10px] border border-[#1c1d22] hover:border-[#2e3038] flex items-center justify-between transition-colors block"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#2e3038] flex items-center justify-center text-[#ffffff] group-hover:border-white/40">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#5e616e] uppercase block">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'EMAIL SUPPORT'}
                </span>
                <span className="text-sm font-medium text-[#ffffff]">muradhaco@gmail.com</span>
                <span className="text-[11px] text-[#9194a1] block mt-0.5">
                  {lang === 'ar' ? 'رد سريع خلال 24 ساعة' : 'Average response within 24 hours'}
                </span>
              </div>
            </div>
            <ArrowLeft className={`w-4 h-4 text-[#5e616e] group-hover:text-[#ffffff] group-hover:-translate-x-1 transition-all ${lang === 'en' ? 'rotate-180' : ''}`} />
          </a>

          {/* Response time */}
          <div className="p-4 rounded-[10px] border border-[#1c1d22] bg-[#040406] flex items-center gap-2.5 text-xs text-[#5e616e] font-mono">
            <Clock className="w-4 h-4 text-[#cc9166]" />
            <span>
              {lang === 'ar' ? 'متاح يومياً: 09:00 ص — 10:00 م بتوقيت إسطنبول' : 'Daily availability: 09:00 AM — 10:00 PM UTC+3'}
            </span>
          </div>

        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#040406] rounded-[10px] border border-[#1c1d22] p-8">
          <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-1">
            {lang === 'ar' ? 'نموذج المراسلة' : 'CONTACT FORM'}
          </span>
          <h2 className="text-xl font-serif text-[#ffffff] mb-2">
            {lang === 'ar' ? 'أرسل رسالة سريعة' : 'Send a Direct Message'}
          </h2>
          <p className="text-xs text-[#9194a1] mb-6">
            {lang === 'ar'
              ? 'املأ النموذج أدناه وسيتم فتح بريدك الإلكتروني لإرسالها مباشرة إلى المبرمج.'
              : 'Fill out the form below and your client will prompt to transmit directly to our team.'}
          </p>

          {sent && (
            <div className="mb-6 p-3 rounded-[10px] bg-[#121317] border border-[#cc9166] text-[#e2e3e9] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#cc9166]" />
              <span>
                {lang === 'ar' ? 'جاري تحويلك لإرسال الرسالة عبر البريد...' : 'Redirecting to your mail client...'}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#9194a1] mb-1.5">
                {lang === 'ar' ? 'اسمك الكريم' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'ar' ? 'محمد العبدالله' : 'John Doe'}
                className="w-full px-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] placeholder-[#5e616e] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#9194a1] mb-1.5">
                {lang === 'ar' ? 'بريدك الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-full text-xs text-[#ffffff] placeholder-[#5e616e] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#9194a1] mb-1.5">
                {lang === 'ar' ? 'نص الرسالة أو الاستفسار' : 'Your Message or Proposal'}
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === 'ar' ? 'اكتب استفسارك، فكرتك أو مقترحك هنا بالتفصيل...' : 'Describe your question or requirements in detail...'}
                className="w-full px-4 py-3 bg-[#121317] border border-[#1c1d22] focus:border-[#ffffff] rounded-[10px] text-xs text-[#ffffff] placeholder-[#5e616e] outline-none leading-relaxed transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
            >
              <span>{lang === 'ar' ? 'إرسال الرسالة إلى المبرمج' : 'Send Message to Developer'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#1c1d22] flex items-center justify-between text-[11px] text-[#5e616e] font-mono">
            <span>{lang === 'ar' ? 'رد فوري ومباشر' : 'Direct Engineering Response'}</span>
            <span>HACCO DEV</span>
          </div>
        </div>

      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <AdBanner slot="contact-bottom" />
      </div>

    </div>
  );
}
