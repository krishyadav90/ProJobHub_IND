
-- Create a table for storing chat messages
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policy that allows all authenticated users to view all messages (public chat)
CREATE POLICY "Anyone can view messages" 
  ON public.messages 
  FOR SELECT 
  USING (true);

-- Create policy that allows users to insert their own messages
CREATE POLICY "Users can create messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for the messages table
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
