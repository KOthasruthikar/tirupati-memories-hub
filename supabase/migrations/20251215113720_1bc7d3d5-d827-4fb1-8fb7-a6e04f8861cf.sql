-- Enable pgcrypto extension in extensions schema (standard location)
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Update member_set_password to use proper schema reference
CREATE OR REPLACE FUNCTION public.member_set_password(p_uid text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
BEGIN
  UPDATE members 
  SET password_hash = extensions.crypt(p_password, extensions.gen_salt('bf'))
  WHERE uid = p_uid;
  
  IF FOUND THEN
    RETURN json_build_object('success', true);
  ELSE
    RETURN json_build_object('success', false, 'error', 'Member not found');
  END IF;
END;
$$;

-- Update member_login to use proper schema reference
CREATE OR REPLACE FUNCTION public.member_login(p_uid text, p_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
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
  
  IF v_member.password_hash = extensions.crypt(p_password, v_member.password_hash) THEN
    RETURN json_build_object('success', true, 'member', row_to_json(v_member));
  ELSE
    RETURN json_build_object('success', false, 'error', 'Invalid password');
  END IF;
END;
$$;