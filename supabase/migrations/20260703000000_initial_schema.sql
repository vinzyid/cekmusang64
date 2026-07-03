-- Create ENUM for report status
CREATE TYPE report_status AS ENUM ('pending', 'approved', 'rejected', 'revision');

-- Create ENUM for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create users table (extends auth.users or stands alone, let's link to auth.users if we use Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create report categories table
CREATE TABLE IF NOT EXISTS public.report_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_name TEXT NOT NULL,
  facebook_url TEXT,
  whatsapp_number TEXT,
  bank_account TEXT,
  marketplace TEXT,
  transaction_amount DECIMAL(12, 2),
  category_id UUID REFERENCES public.report_categories(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  status report_status DEFAULT 'pending' NOT NULL,
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create evidence table
CREATE TABLE IF NOT EXISTS public.evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create report logs table
CREATE TABLE IF NOT EXISTS public.report_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Public users are viewable by everyone." ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.users FOR UPDATE USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Categories are viewable by everyone." ON public.report_categories FOR SELECT USING (true);
CREATE POLICY "Only admins can insert categories." ON public.report_categories FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "Only admins can update categories." ON public.report_categories FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);
CREATE POLICY "Only admins can delete categories." ON public.report_categories FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Reports policies
-- Public users can only see approved reports
CREATE POLICY "Approved reports are viewable by everyone." ON public.reports FOR SELECT USING (status = 'approved');

-- Authenticated users can see their own reports (any status)
CREATE POLICY "Users can view own reports." ON public.reports FOR SELECT USING (auth.uid() = reporter_id);

-- Admins can see all reports
CREATE POLICY "Admins can view all reports." ON public.reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Authenticated users can insert reports
CREATE POLICY "Authenticated users can insert reports." ON public.reports FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own reports ONLY if they are in 'pending' or 'revision'
CREATE POLICY "Users can update own pending or revision reports." ON public.reports FOR UPDATE USING (
  auth.uid() = reporter_id AND status IN ('pending', 'revision')
);

-- Admins can update any report (approve, reject, add note)
CREATE POLICY "Admins can update any report." ON public.reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Admins can delete reports
CREATE POLICY "Admins can delete reports." ON public.reports FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Evidence policies
-- Public can view evidence for approved reports
CREATE POLICY "Evidence for approved reports is viewable." ON public.evidence FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports WHERE reports.id = evidence.report_id AND reports.status = 'approved')
);

-- Reporter can view evidence for their own reports
CREATE POLICY "Users can view evidence for own reports." ON public.evidence FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.reports WHERE reports.id = evidence.report_id AND reports.reporter_id = auth.uid())
);

-- Admins can view all evidence
CREATE POLICY "Admins can view all evidence." ON public.evidence FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Authenticated users can insert evidence
CREATE POLICY "Authenticated users can insert evidence." ON public.evidence FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can delete evidence
CREATE POLICY "Admins can delete evidence." ON public.evidence FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Report logs policies
-- Admins can view logs
CREATE POLICY "Admins can view report logs." ON public.report_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin')
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reports_modtime
BEFORE UPDATE ON public.reports
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'User'), new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Indexes for search optimization
CREATE INDEX idx_reports_reported_name ON public.reports(reported_name);
CREATE INDEX idx_reports_whatsapp_number ON public.reports(whatsapp_number);
CREATE INDEX idx_reports_bank_account ON public.reports(bank_account);
CREATE INDEX idx_reports_facebook_url ON public.reports(facebook_url);
CREATE INDEX idx_reports_status ON public.reports(status);

-- Create storage bucket for evidence
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access to Evidence Bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'evidence');

CREATE POLICY "Authenticated users can upload evidence"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'evidence' AND auth.role() = 'authenticated');

CREATE POLICY "Only admins can delete evidence from storage"
ON storage.objects FOR DELETE
USING (bucket_id = 'evidence' AND EXISTS (SELECT 1 FROM public.users WHERE users.id = auth.uid() AND users.role = 'admin'));
