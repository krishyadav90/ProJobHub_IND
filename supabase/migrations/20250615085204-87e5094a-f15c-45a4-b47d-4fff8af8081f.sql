
-- Create a table for storing jobs in Supabase
CREATE TABLE public.jobs (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  role TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  salary INTEGER NOT NULL,
  salary_unit TEXT DEFAULT 'hr',
  posted_at DATE NOT NULL DEFAULT CURRENT_DATE,
  location TEXT DEFAULT 'India',
  employment_type TEXT[] DEFAULT '{}',
  details TEXT,
  brand TEXT DEFAULT 'apple',
  color TEXT DEFAULT 'bg-blue-50',
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT all jobs (public read)
CREATE POLICY "Anyone can view jobs" 
  ON public.jobs 
  FOR SELECT 
  USING (true);

-- Create policy that allows users to INSERT their own jobs
CREATE POLICY "Users can create their own jobs" 
  ON public.jobs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own jobs
CREATE POLICY "Users can update their own jobs" 
  ON public.jobs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own jobs
CREATE POLICY "Users can delete their own jobs" 
  ON public.jobs 
  FOR DELETE 
  USING (auth.uid() = user_id);
