-- ===============================================================
-- مخطط قاعدة بيانات منصة "أدواتك" (Adawatk) على Supabase
-- قم بنسخ هذا الكود ولصقه في قسم SQL Editor في لوحة تحكم Supabase
-- ثم اضغط Run
-- ===============================================================

-- 1. جدول الحسابات الشخصية والاشتراكات (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due')),
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  daily_operations_count INT DEFAULT 0,
  last_operation_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. جدول حفظ السير الذاتية المنشأة للمستخدم (Resumes)
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'سيرتي الذاتية',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  template_id TEXT DEFAULT 'modern',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. تفعيل أمان مستوى الصفوف (Row Level Security - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- 4. سياسات الأمان لجدول Profiles
CREATE POLICY "يمكن للمستخدمين قراءة ملفاتهم الشخصية فقط"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "يمكن للمستخدمين تحديث ملفاتهم الشخصية فقط"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 5. سياسات الأمان لجدول Resumes
CREATE POLICY "يمكن للمستخدمين استعراض سيرهم الذاتية فقط"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "يمكن للمستخدمين إنشاء سير ذاتية جديدة"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "يمكن للمستخدمين تعديل سيرهم الذاتية"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "يمكن للمستخدمين حذف سيرهم الذاتية"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

-- 6. تريجر (Trigger) لإنشاء بروفايل تلقائياً عند تسجيل أي مستخدم جديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
