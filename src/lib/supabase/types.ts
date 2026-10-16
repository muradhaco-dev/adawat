export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'past_due';
  subscription_expires_at?: string;
  daily_operations_count: number;
  last_operation_date: string;
  created_at: string;
}

export interface ResumeData {
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  personalInfo?: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    avatarUrl?: string;
  };
  experiences?: Array<{
    id: string;
    title?: string;
    jobTitle?: string;
    company: string;
    period?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    details?: string;
    description?: string;
  }>;
  education?: Array<{
    id: string;
    degree: string;
    institution: string;
    year?: string;
    graduationYear?: string;
    details?: string;
  }>;
  skills?: string[];
  languages?: Array<{
    name?: string;
    language?: string;
    level: string;
  }>;
  [key: string]: any;
}

export interface SavedResume {
  id: string;
  user_id: string;
  title: string;
  data: ResumeData;
  template_id: string;
  created_at: string;
  updated_at: string;
}
