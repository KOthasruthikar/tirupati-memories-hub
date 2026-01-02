-- Add thumbnail_url column to video_testimonials
ALTER TABLE public.video_testimonials
ADD COLUMN thumbnail_url text;