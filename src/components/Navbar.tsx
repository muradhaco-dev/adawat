'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  Crown, 
  Menu, 
  X, 
  User, 
  Sparkles,
  LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/cv-builder', label: 'صانع الـ CV', badge: 'رائج' },
    { href: '/pdf-tools', label: 'أدوات الـ PDF' },
    { href: '/remove-bg', label: 'إزالة الخلفية' },
    { href: '/pricing', label: 'الاشتراكات' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#08080a]/90 backdrop-blur-md border-b border-[#1c1d22]">
      <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo with Slash aesthetic */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-[#121317] border border-[#2e3038] flex items-center justify-center text-[#cc9166] group-hover:border-[#cc9166] transition-colors">
              <span className="font-serif text-sm font-bold">أ</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight text-[#ffffff] font-serif">
                أدواتك
              </span>
              <span className="text-[11px] text-[#cc9166] font-mono tracking-wider hidden sm:inline">
                / ADAWAT
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#ffffff] bg-[#121317]'
                      : 'text-[#9194a1] hover:text-[#ffffff]'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] text-[#cc9166] border border-[#cc9166]/40 px-1.5 py-0.2 rounded-full font-mono">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Pill controls */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-[#cc9166] bg-[#040406] hover:bg-[#121317] rounded-full border border-[#cc9166]/50 transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-[#cc9166]" />
              <span>باقة Pro</span>
            </Link>

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
                  title="تسجيل خروج"
                  className="p-1.5 text-[#777a88] hover:text-[#ffffff] hover:bg-[#121317] rounded-full transition-colors border border-transparent hover:border-[#2e3038]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="px-5 py-2 text-sm font-medium text-[#000000] bg-[#ffffff] hover:bg-[#e2e3e9] rounded-full transition-all active:scale-95 shadow-sm"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-[#9194a1] hover:text-[#ffffff] border border-[#1c1d22] bg-[#040406]"
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
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'text-[#ffffff] bg-[#121317]'
                    : 'text-[#9194a1] hover:text-[#ffffff]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] text-[#cc9166] border border-[#cc9166]/40 px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-[#1c1d22] flex flex-col gap-2">
            <Link
              href="/pricing"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#cc9166] bg-[#08080a] rounded-full border border-[#cc9166]/50"
            >
              <Crown className="w-3.5 h-3.5" />
              ترقية لحساب Pro
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
                تسجيل الخروج
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-[#000000] bg-[#ffffff] rounded-full"
              >
                تسجيل الدخول / حساب جديد
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
