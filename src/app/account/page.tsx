'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User, 
  Crown, 
  FileText, 
  Trash2, 
  Download, 
  Plus, 
  Sparkles,
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

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (profileData) setProfile(profileData);

      // Fetch user's saved resumes
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
    if (!confirm('هل أنت متأكد من رغبتك بحذف هذه السيرة الذاتية؟')) return;
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
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPro = profile?.subscription_tier === 'pro';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Account Info Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900">
                  {profile?.full_name || user?.email?.split('@')[0]}
                </h1>
                {isPro ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300">
                    <Crown className="w-3 h-3 text-amber-600" /> PRO
                  </span>
                ) : (
                  <span className="text-[11px] font-bold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">
                    حساب مجاني
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isPro && (
              <Link
                href="/pricing"
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-950 font-black text-xs rounded-xl shadow-sm transition-all"
              >
                ترقية لـ Pro ⭐
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-gray-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              تسجيل الخروج
            </button>
          </div>

        </div>
      </div>

      {/* Saved Resumes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">سيرك الذاتية المحفوظة في Supabase</h2>
            <p className="text-xs text-gray-500">
              يمكنك استعراض وتحديث أي سيرة ذاتية قمت بإنشائها سابقاً
            </p>
          </div>
          <Link
            href="/cv-builder"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            إنشاء CV جديد
          </Link>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-800">لا توجد سير ذاتية محفوظة بعد</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              توجه إلى صانع السيرة الذاتية، املأ بياناتك واضغط &quot;حفظ في حسابي&quot; لتظهر هنا تلقائياً.
            </p>
            <Link
              href="/cv-builder"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700"
            >
              ابدأ إنشاء سيرتك الأولى الآن
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-blue-400 transition-colors shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{resume.title}</h4>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(resume.created_at).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 my-2">
                    {resume.data?.summary || 'لا يوجد ملخص'}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
                    قالب: {resume.template_id}
                  </span>
                  <Link
                    href={`/cv-builder`}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    تعديل في المنشئ ←
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
