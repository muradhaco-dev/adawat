'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Crown, 
  FileText, 
  Trash2, 
  Plus, 
  Calendar,
  LogOut
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { SavedResume } from '@/lib/supabase/types';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        window.location.href = '/auth';
        return;
      }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (profileData) setProfile(profileData);

      const { data: resumesData } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (resumesData) setResumes(resumesData as SavedResume[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm('هل ترغب بتأكيد حذف هذه السيرة الذاتية؟')) return;
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', id);
      if (error) throw error;
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert('حدث خطأ أثناء الحذف: ' + err.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#cc9166] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPro = profile?.subscription_tier === 'pro';

  return (
    <div className="max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Account Info Header Card */}
      <div className="bg-[#040406] rounded-[10px] border border-[#1c1d22] p-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#121317] border border-[#2e3038] flex items-center justify-center text-[#e2e3e9]">
              <User className="w-7 h-7 text-[#9194a1]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-serif font-medium text-[#ffffff]">
                  {profile?.full_name || user?.email?.split('@')[0]}
                </h1>
                {isPro ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#cc9166] border border-[#cc9166]/50 px-2.5 py-0.5 rounded-full">
                    <Crown className="w-3 h-3 text-[#cc9166]" /> PRO
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#9194a1] border border-[#1c1d22] px-2.5 py-0.5 rounded-full">
                    حساب مجاني
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5e616e] mt-1 font-mono">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isPro && (
              <Link
                href="/pricing"
                className="px-4 py-2 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium rounded-full transition-colors"
              >
                ترقية لـ Pro
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#9194a1] hover:text-[#ffffff] bg-[#121317] hover:bg-[#1c1d22] rounded-full border border-[#1c1d22] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              تسجيل الخروج
            </button>
          </div>

        </div>
      </div>

      {/* Saved Resumes Section */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between pb-4 border-b border-[#1c1d22]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#cc9166] block mb-1">
              سجل السير الذاتية
            </span>
            <h2 className="text-xl font-serif text-[#ffffff]">السير الذاتية المحفوظة في Supabase</h2>
          </div>
          <Link
            href="/cv-builder"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#ffffff] hover:bg-[#e2e3e9] text-[#000000] text-xs font-medium rounded-full transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            إنشاء سيرة جديدة
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-20 bg-[#040406] rounded-[10px] border border-[#1c1d22]">
            <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#2e3038] text-[#9194a1] flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-[#ffffff]">لا توجد سير ذاتية محفوظة بعد</h3>
            <p className="text-xs text-[#5e616e] mt-1 max-w-sm mx-auto">
              توجه لصانع السيرة الذاتية واملأ بياناتك واضغط &quot;حفظ في حسابي&quot; لمزامنتها هنا فوراً.
            </p>
            <Link
              href="/cv-builder"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-transparent hover:bg-[#121317] text-[#ffffff] text-xs font-medium rounded-full border border-[#2e3038] hover:border-[#777a88] transition-colors"
            >
              إنشاء سيرتك الأولى
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-[#040406] p-6 rounded-[10px] border border-[#1c1d22] hover:border-[#2e3038] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-[#121317] border border-[#2e3038] text-[#cc9166]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-[#ffffff]">{resume.title}</h4>
                        <span className="text-[10px] font-mono text-[#5e616e] flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(resume.created_at).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-1.5 text-[#5e616e] hover:text-[#ffffff] rounded-full"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-[#9194a1] line-clamp-2 my-2 leading-relaxed">
                    {resume.data?.summary || 'لا يوجد ملخص'}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1c1d22] flex items-center justify-between mt-3 text-xs">
                  <span className="text-[10px] font-mono text-[#5e616e] border border-[#1c1d22] px-2 py-0.5 rounded-full">
                    {resume.template_id}
                  </span>
                  <Link
                    href="/cv-builder"
                    className="text-xs text-[#cc9166] hover:underline font-mono"
                  >
                    فتح في المحرر ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
