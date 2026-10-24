'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Crown, 
  Sparkles, 
  Check, 
  X, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  ArrowLeft 
} from 'lucide-react';
import { useSubscription } from '@/context/SubscriptionContext';

export default function PaywallModal() {
  const { paywallModal, closePaywall } = useSubscription();

  if (!paywallModal.isOpen) return null;

  const { options } = paywallModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/85">
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0" 
        onClick={closePaywall}
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-lg bg-[#040406] border border-[#cc9166]/60 rounded-[14px] p-6 sm:p-8 shadow-2xl overflow-hidden z-10 transition-all scale-100">
        {/* Decorative copper gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#cc9166] to-transparent" />

        {/* Close Button */}
        <button
          onClick={closePaywall}
          className="absolute top-4 left-4 p-1.5 text-[#777a88] hover:text-[#ffffff] rounded-full hover:bg-[#121317] transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge & Crown */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#cc9166]/50 text-[#cc9166] flex items-center justify-center shadow-inner">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#cc9166] font-bold block">
              ترقية حسابك / PRO UPGRADE
            </span>
            <span className="text-xs text-[#9194a1] font-mono">
              باقة الاحتراف والوصول الشامل
            </span>
          </div>
        </div>

        {/* Heading */}
        <h3 className="text-xl sm:text-2xl font-serif text-[#ffffff] font-normal tracking-tight mb-3">
          {options.title || 'ميزة مخصصة لمشتركي باقة Pro'}
        </h3>

        {/* Main Message Specified by User */}
        <p className="text-xs sm:text-sm text-[#e2e3e9] leading-relaxed mb-6 bg-[#121317]/80 p-3.5 rounded-[10px] border border-[#2e3038]">
          {options.message || 'لقد وصلت للحد الأقصى أو أن هذه الميزة للمحترفين. قم بالترقية إلى باقة Pro مقابل $3.99 فقط للتمتع بوصول غير محدود.'}
        </p>

        {/* Feature comparison checklist */}
        <div className="space-y-2.5 mb-7">
          <span className="text-[11px] font-mono uppercase text-[#cc9166] block">
            ما تحصل عليه فوراً في باقة Pro ($3.99 شهرياً):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#9194a1]">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
              <span>إزالة كافة الإعلانات 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
              <span>توقيع ودمج غير محدود</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
              <span>فتح قوالب ATS و EuroPass</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
              <span>حفظ سير ذاتية متعددة بلا قيود</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
              <span>تفريغ صور HD غير محدود</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#cc9166] shrink-0" />
              <span>تخصيص ألوان وشعارات الـ QR</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/pricing"
            onClick={closePaywall}
            className="w-full sm:flex-1 py-3 px-6 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 text-center"
          >
            <Sparkles className="w-4 h-4 text-[#cc9166]" />
            <span>الترقية إلى Pro مقابل $3.99 فقط</span>
          </Link>

          <button
            onClick={closePaywall}
            className="w-full sm:w-auto py-3 px-5 bg-transparent hover:bg-[#121317] text-[#9194a1] hover:text-[#ffffff] text-xs font-medium rounded-full border border-[#2e3038] transition-colors"
          >
            إغلاق ومتابعة
          </button>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-5 pt-3 border-t border-[#1c1d22] flex items-center justify-center gap-4 text-[11px] font-mono text-[#5e616e]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#cc9166]" />
            دفع آمن ومشفر
          </span>
          <span>•</span>
          <span>إلغاء الاشتراك متاح بأي وقت</span>
        </div>
      </div>
    </div>
  );
}
