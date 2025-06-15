
-- Add columns to the existing profiles table to store additional profile information
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_image TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS joined_date DATE DEFAULT CURRENT_DATE;

-- Drop the policy if it exists and recreate it
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create the policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
