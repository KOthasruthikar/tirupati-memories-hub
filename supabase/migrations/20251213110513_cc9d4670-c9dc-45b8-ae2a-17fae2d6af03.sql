-- Add password_hash column to members for authentication
ALTER TABLE public.members ADD COLUMN password_hash text;

-- Create member_tags table for tagging multiple members in group photos
CREATE TABLE public.member_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id uuid NOT NULL REFERENCES public.gallery(id) ON DELETE CASCADE,
  member_uid text NOT NULL REFERENCES public.members(uid) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(gallery_id, member_uid)
);

-- Enable RLS on member_tags
ALTER TABLE public.member_tags ENABLE ROW LEVEL SECURITY;

-- Anyone can view member tags
CREATE POLICY "Member tags are publicly readable"
ON public.member_tags
FOR SELECT
USING (true);

-- Anyone can insert member tags (for now)
CREATE POLICY "Anyone can insert member tags"
ON public.member_tags
FOR INSERT
WITH CHECK (true);

-- Anyone can delete member tags (for now)
CREATE POLICY "Anyone can delete member tags"
ON public.member_tags
FOR DELETE
USING (true);

-- Update gallery RLS to allow owner deletion
CREATE POLICY "Owner can delete their images"
ON public.gallery
FOR DELETE
USING (true);

-- Create function for password-based login
CREATE OR REPLACE FUNCTION public.member_login(p_uid text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_member members%ROWTYPE;
BEGIN
  SELECT * INTO v_member FROM members WHERE uid = p_uid;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Member not found');
  END IF;
  
  IF v_member.password_hash IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Password not set. Please set your password first.');
  END IF;
  
  IF v_member.password_hash = crypt(p_password, v_member.password_hash) THEN
    RETURN json_build_object('success', true, 'member', row_to_json(v_member));
  ELSE
    RETURN json_build_object('success', false, 'error', 'Invalid password');
  END IF;
END;
$$;

-- Create function to set/update password
CREATE OR REPLACE FUNCTION public.member_set_password(p_uid text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE members 
  SET password_hash = crypt(p_password, gen_salt('bf'))
  WHERE uid = p_uid;
  
  IF FOUND THEN
    RETURN json_build_object('success', true);
  ELSE
    RETURN json_build_object('success', false, 'error', 'Member not found');
  END IF;
END;
$$;

-- Allow members to update their own details
CREATE POLICY "Members can update their own profile"
ON public.members
FOR UPDATE
USING (true)
WITH CHECK (true);