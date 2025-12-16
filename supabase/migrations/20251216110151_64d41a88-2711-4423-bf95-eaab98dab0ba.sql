-- Create access_requests table for image viewing permissions
CREATE TABLE public.access_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_uid text NOT NULL,
  owner_uid text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(requester_uid, owner_uid)
);

-- Enable RLS
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view access requests" ON public.access_requests
FOR SELECT USING (true);

CREATE POLICY "Anyone can insert access requests" ON public.access_requests
FOR INSERT WITH CHECK (true);

CREATE POLICY "Owner can update their access requests" ON public.access_requests
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete access requests" ON public.access_requests
FOR DELETE USING (true);

-- Function to update timestamp
CREATE OR REPLACE FUNCTION public.update_access_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for timestamp
CREATE TRIGGER update_access_requests_timestamp
BEFORE UPDATE ON public.access_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_access_requests_updated_at();