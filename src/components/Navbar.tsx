'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Crown, 
  Menu, 
  X, 
  User, 
  LogOut,
  Globe,
  ChevronDown,
  FileText,
  Layers,
  PenTool,
  Image as ImageIcon,
  QrCode,
  FileCheck,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useSubscription } from '@/context/SubscriptionContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { lang, toggleLanguage, t } = useLanguage();
  const { isPro } = useSubscription();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setToolsDropdown(false);
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toolsList = [
    {
      href: '/cv-builder',
      title: lang === 'ar' ? 'صانع السيرة الذاتية (CV)' : 'CV & Resume Builder',
      desc: lang === 'ar' ? 'معتمد لأنظمة التوظيف ATS ومعايير EuroPass' : 'ATS-friendly resume generator',
      icon: FileText,
      badge: lang === 'ar' ? 'الأكثر طلباً' : 'Popular',
    },
    {
      href: '/pdf-tools',
      title: lang === 'ar' ? 'دمج وترتيب ملفات PDF' : 'PDF Merge & Organize',
      desc: lang === 'ar' ? 'دمج سريع للمستندات محلياً بدون خوادم' : 'Merge multiple PDF documents',
      icon: Layers,
      badge: null,
    },
    {
      href: '/pdf-tools?tab=sign',
      title: lang === 'ar' ? 'توقيع المستندات إلكترونياً' : 'Sign PDF Online',
      desc: lang === 'ar' ? 'رسم وتثبيت توقيعك على العقود والأوراق' : 'Draw and place signatures',
      icon: PenTool,
      badge: null,
    },
    {
      href: '/remove-bg',
      title: lang === 'ar' ? 'إزالة وتفريغ خلفية الصور' : 'AI Background Remover',
      desc: lang === 'ar' ? 'عزل فائق الدقة بالذكاء الاصطناعي للمتاجر' : 'AI deep neural cutout engine',
      icon: ImageIcon,
      badge: 'AI',
    },
    {
      href: '/qr-code',
      title: lang === 'ar' ? 'صانع كود الـ QR الذكي' : 'Smart QR Code Studio',
      desc: lang === 'ar' ? 'تحويل الروابط والصور لـ QR مع دمج شعارك' : 'Custom logos, links, and high-res export',
      icon: QrCode,
      badge: lang === 'ar' ? 'جديد' : 'New',
    },
    {
      href: '/pdf-tools?tab=convert',
      title: lang === 'ar' ? 'محول الصور إلى PDF' : 'Image to PDF Converter',
      desc: lang === 'ar' ? 'تجميع الصور والمستندات في ملف واحد' : 'Convert JPG/PNG to PDF document',
      icon: FileCheck,
      badge: null,
    },
  ];

  const isToolsActive = pathname === '/tools' || 
    pathname.startsWith('/cv-builder') || 
    pathname.startsWith('/pdf-tools') || 
    pathname.startsWith('/remove-bg') || 
    pathname.startsWith('/qr-code');

  return (
    <header className="sticky top-0 z-50 bg-[#08080a]/90 backdrop-blur-md border-b border-[#1c1d22]">
      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo with Slash aesthetic */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#121317] border border-[#2e3038] flex items-center justify-center text-[#cc9166] group-hover:border-[#cc9166] transition-colors">
              <span className="font-serif text-sm font-bold">
                {lang === 'ar' ? 'أ' : 'A'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-[#ffffff] font-serif">
                {lang === 'ar' ? 'أدواتك' : 'ADAWAT'}
              </span>
              <span className="text-[11px] text-[#cc9166] font-mono tracking-wider hidden sm:inline">
                {lang === 'ar' ? '/ ADAWAT' : '/ TOOLS'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {/* Home Link */}
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                pathname === '/'
                  ? 'text-[#ffffff] bg-[#121317]'
                  : 'text-[#9194a1] hover:text-[#ffffff]'
              }`}
            >
              {t('nav.home')}
            </Link>

            {/* Tools Dropdown Container */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setToolsDropdown(true)}
              onMouseLeave={() => setToolsDropdown(false)}
            >
              <button
                onClick={() => setToolsDropdown(!toolsDropdown)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isToolsActive || toolsDropdown
                    ? 'text-[#ffffff] bg-[#121317] border border-[#2e3038]'
                    : 'text-[#9194a1] hover:text-[#ffffff]'
                }`}
              >
                <span>{t('nav.tools')}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#cc9166] transition-transform duration-200 ${toolsDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {toolsDropdown && (
                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-[#040406] border border-[#1c1d22] rounded-[12px] p-2.5 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-[#1c1d22] mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#cc9166]">
                      {lang === 'ar' ? 'منظومة الأدوات السريعة' : 'DIGITAL SUITE'}
                    </span>
                    <span className="text-[10px] text-[#5e616e] font-mono">
                      6 {lang === 'ar' ? 'أدوات' : 'tools'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {toolsList.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = pathname === tool.href.split('?')[0];
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className={`flex items-start gap-3 p-2.5 rounded-[8px] transition-colors group ${
                            isActive ? 'bg-[#121317]' : 'hover:bg-[#121317]'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-[#08080a] border border-[#2e3038] text-[#cc9166] group-hover:border-[#cc9166] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-[#ffffff] group-hover:text-[#cc9166] transition-colors">
                                {tool.title}
                              </span>
                              {tool.badge && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border border-[#cc9166]/40 text-[#cc9166]">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#777a88] truncate mt-0.5">
                              {tool.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* View All Tools Footer in Dropdown */}
                  <div className="pt-2 mt-2 border-t border-[#1c1d22]">
                    <Link
                      href="/tools"
                      className="flex items-center justify-between py-2 px-3 rounded-[8px] bg-[#08080a] hover:bg-[#121317] text-xs font-mono text-[#cc9166] hover:text-[#ffffff] transition-colors"
                    >
                      <span>{lang === 'ar' ? 'استعراض صفحة الأدوات بالكامل' : 'Explore all tools catalog'}</span>
                      <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'en' ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Link */}
            <Link
              href="/pricing"
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                pathname === '/pricing'
                  ? 'text-[#ffffff] bg-[#121317]'
                  : 'text-[#9194a1] hover:text-[#ffffff]'
              }`}
            >
              {t('nav.pricing')}
            </Link>

            {/* Contact Link */}
            <Link
              href="/contact"
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                pathname === '/contact'
                  ? 'text-[#ffffff] bg-[#121317]'
                  : 'text-[#9194a1] hover:text-[#ffffff]'
              }`}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Actions: Language Switcher, Pro, Auth */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* Sleek Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#9194a1] hover:text-[#ffffff] bg-[#040406] hover:bg-[#121317] rounded-full border border-[#1c1d22] hover:border-[#2e3038] transition-colors active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Pro Button */}
            <Link
              href="/pricing"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                isPro
                  ? 'text-emerald-400 bg-emerald-950/30 border-emerald-500/40'
                  : 'text-[#cc9166] bg-[#040406] hover:bg-[#121317] border-[#cc9166]/50'
              }`}
            >
              <Crown className="w-3 h-3" />
              <span>{isPro ? (lang === 'ar' ? 'Pro مُفعّل' : 'Pro Active') : (lang === 'ar' ? 'باقة Pro ($3.99)' : 'Pro $3.99')}</span>
            </Link>

            {/* User Session */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#e2e3e9] bg-[#121317] hover:bg-[#1c1d22] rounded-full border border-[#2e3038] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#9194a1]" />
                  <span className="max-w-[110px] truncate">{user.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title={t('nav.signout')}
                  className="p-1.5 text-[#777a88] hover:text-[#ffffff] hover:bg-[#121317] rounded-full transition-colors border border-transparent hover:border-[#2e3038]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-1.5 text-xs font-medium text-[#000000] bg-[#ffffff] hover:bg-[#e2e3e9] rounded-full transition-all active:scale-95 shadow-sm"
              >
                {t('nav.signin')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[#9194a1] hover:text-[#ffffff] bg-[#040406] rounded-full border border-[#1c1d22]"
            >
              <Globe className="w-3 h-3 text-[#cc9166]" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-full text-[#9194a1] hover:text-[#ffffff] border border-[#1c1d22] bg-[#040406]"
              aria-label="القائمة"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-[#1c1d22] bg-[#040406] px-4 pt-3 pb-6 space-y-2">
          {/* Home */}
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              pathname === '/' ? 'text-[#ffffff] bg-[#121317]' : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            <span>{t('nav.home')}</span>
          </Link>

          {/* Mobile Tools Collapsible */}
          <div className="border border-[#1c1d22] rounded-lg overflow-hidden bg-[#08080a]">
            <button
              onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-medium text-[#ffffff]"
            >
              <span className="flex items-center gap-2">
                <span>{t('nav.tools')}</span>
                <span className="text-[10px] text-[#cc9166] border border-[#cc9166]/40 px-1.5 py-0.2 rounded-full font-mono">
                  6
                </span>
              </span>
              <ChevronDown className={`w-4 h-4 text-[#cc9166] transition-transform ${mobileToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {mobileToolsOpen && (
              <div className="px-2 pb-3 space-y-1 border-t border-[#1c1d22] pt-2">
                {toolsList.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-[#9194a1] hover:text-[#ffffff] hover:bg-[#121317]"
                  >
                    <span>{tool.title}</span>
                    {tool.badge && (
                      <span className="text-[9px] text-[#cc9166] font-mono px-1 rounded border border-[#cc9166]/30">
                        {tool.badge}
                      </span>
                    )}
                  </Link>
                ))}
                <Link
                  href="/tools"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-mono text-[#cc9166] hover:underline pt-2 border-t border-[#1c1d22]"
                >
                  <span>{lang === 'ar' ? 'عرض كافة الأدوات ←' : 'All tools →'}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Pricing */}
          <Link
            href="/pricing"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              pathname === '/pricing' ? 'text-[#ffffff] bg-[#121317]' : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            <span>{t('nav.pricing')}</span>
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              pathname === '/contact' ? 'text-[#ffffff] bg-[#121317]' : 'text-[#9194a1] hover:text-[#ffffff]'
            }`}
          >
            <span>{t('nav.contact')}</span>
          </Link>

          <div className="pt-3 border-t border-[#1c1d22] flex flex-col gap-2">
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#cc9166] bg-[#08080a] rounded-full border border-[#cc9166]/50"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{t('nav.pro')}</span>
            </Link>

            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#777a88] hover:text-[#ffffff] bg-[#121317] rounded-full border border-[#1c1d22]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t('nav.signout')}</span>
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#000000] bg-[#ffffff] rounded-full"
              >
                {t('nav.signin')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
