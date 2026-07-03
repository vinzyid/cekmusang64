-- Add reporter details directly to reports table since they will be anonymous
ALTER TABLE public.reports 
ADD COLUMN IF NOT EXISTS reporter_name TEXT,
ADD COLUMN IF NOT EXISTS reporter_email TEXT,
ADD COLUMN IF NOT EXISTS category TEXT;

-- Drop foreign key constraint on category_id since we will use simple text categories
ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_category_id_fkey;

-- Drop old policies that require authentication for insertion
DROP POLICY IF EXISTS "Authenticated users can insert reports." ON public.reports;
DROP POLICY IF EXISTS "Authenticated users can insert evidence." ON public.evidence;
DROP POLICY IF EXISTS "Authenticated users can upload evidence" ON storage.objects;

-- Create new policies allowing public (anonymous) insertion
CREATE POLICY "Anyone can insert reports." 
ON public.reports FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can insert evidence." 
ON public.evidence FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can upload evidence"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'evidence');
