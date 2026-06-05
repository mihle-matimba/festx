-- Create the waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add comment for documentation
COMMENT ON TABLE public.waitlist IS 'Stores FestX waitlist signups with user contact information';

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous inserts (for signup form)
CREATE POLICY "Allow anonymous inserts"
  ON public.waitlist
  FOR INSERT
  WITH CHECK (true);

-- Create policy to prevent anonymous reads/updates/deletes
CREATE POLICY "Prevent public reads"
  ON public.waitlist
  FOR SELECT
  USING (false);

CREATE POLICY "Prevent public updates"
  ON public.waitlist
  FOR UPDATE
  USING (false);

CREATE POLICY "Prevent public deletes"
  ON public.waitlist
  FOR DELETE
  USING (false);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);
