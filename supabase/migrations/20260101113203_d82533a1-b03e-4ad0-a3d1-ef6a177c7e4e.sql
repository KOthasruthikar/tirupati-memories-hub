-- Create video testimonials table
CREATE TABLE public.video_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_uid TEXT NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view videos
CREATE POLICY "Videos are publicly readable"
ON public.video_testimonials
FOR SELECT
USING (true);

-- Anyone can insert videos (with their UID)
CREATE POLICY "Anyone can upload videos"
ON public.video_testimonials
FOR INSERT
WITH CHECK (true);

-- Owner can delete their videos (verified via app logic with password)
CREATE POLICY "Anyone can delete videos"
ON public.video_testimonials
FOR DELETE
USING (true);

-- Create storage bucket for videos (150MB max)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('member-videos', 'member-videos', true, 157286400);

-- Storage policies for video bucket
CREATE POLICY "Anyone can view videos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'member-videos');

CREATE POLICY "Anyone can upload videos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'member-videos');

CREATE POLICY "Anyone can delete videos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'member-videos');