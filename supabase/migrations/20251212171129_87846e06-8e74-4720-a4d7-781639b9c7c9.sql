-- Create members table with 4-digit UID
CREATE TABLE public.members (
  uid TEXT PRIMARY KEY CHECK (uid ~ '^[0-9]{4}$'),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  memory TEXT NOT NULL,
  bio TEXT NOT NULL,
  profile_image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery table for images
CREATE TABLE public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL,
  caption TEXT,
  owner_uid TEXT NOT NULL REFERENCES public.members(uid) ON DELETE CASCADE,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Members are publicly readable
CREATE POLICY "Members are publicly readable"
ON public.members FOR SELECT
USING (true);

-- Gallery images are publicly readable
CREATE POLICY "Gallery images are publicly readable"
ON public.gallery FOR SELECT
USING (true);

-- Anyone can insert gallery images (for now - no auth required per spec)
CREATE POLICY "Anyone can insert gallery images"
ON public.gallery FOR INSERT
WITH CHECK (true);

-- Insert 8 sample members with 4-digit UIDs
INSERT INTO public.members (uid, name, role, memory, bio, profile_image) VALUES
('1001', 'Rajesh Kumar', 'Group Leader', 'Leading everyone through the darshan queue was unforgettable', 'Rajesh has organized 15 pilgrimages over the past decade. His dedication to Lord Venkateswara is an inspiration to all. He ensures every trip runs smoothly and everyone has a blessed experience.', '/placeholder.svg'),
('1002', 'Priya Sharma', 'Photographer', 'Capturing the sunrise at Tirumala was magical', 'Priya is a professional photographer who documents spiritual journeys. Her lens captures not just images but the devotion and emotions of every pilgrim.', '/placeholder.svg'),
('1003', 'Venkat Rao', 'Elder Advisor', 'Reciting slokas at the temple brought tears to my eyes', 'Venkat ji has been visiting Tirumala for 40 years. His knowledge of temple rituals and Telugu bhajans adds depth to every pilgrimage he joins.', '/placeholder.svg'),
('1004', 'Lakshmi Devi', 'Food Coordinator', 'Preparing prasadam for everyone was my seva', 'Lakshmi aunty ensures no one goes hungry during the journey. Her homemade laddus and pulihora are legendary among our pilgrimage groups.', '/placeholder.svg'),
('1005', 'Arjun Reddy', 'Youth Representative', 'Climbing the hill on foot was a test of faith', 'Arjun represents the younger generation of devotees. He walked the entire 3500 steps barefoot and helps organize youth activities during trips.', '/placeholder.svg'),
('1006', 'Saraswati Iyer', 'Bhajan Singer', 'Singing at dawn near the temple was divine', 'Saraswati leads the bhajan sessions during every trip. Her melodious voice has been praised by fellow pilgrims and temple priests alike.', '/placeholder.svg'),
('1007', 'Mohan Das', 'Travel Coordinator', 'Arranging everyone comfortable journey was rewarding', 'Mohan handles all logistics - buses, accommodations, and schedules. His meticulous planning ensures hassle-free pilgrimages for everyone.', '/placeholder.svg'),
('1008', 'Anitha Krishnan', 'First-time Pilgrim', 'My first darshan changed my life forever', 'Anitha joined her first Tirupati pilgrimage this year. The experience moved her deeply and she has already signed up for the next trip.', '/placeholder.svg');

-- Create storage bucket for member images
INSERT INTO storage.buckets (id, name, public) VALUES ('member-images', 'member-images', true);

-- Storage policies for member images
CREATE POLICY "Member images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'member-images');

CREATE POLICY "Anyone can upload member images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'member-images');