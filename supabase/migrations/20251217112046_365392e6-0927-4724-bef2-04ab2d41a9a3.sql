-- Add email and phone columns to members table
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS recovery_code TEXT,
ADD COLUMN IF NOT EXISTS recovery_code_expires_at TIMESTAMP WITH TIME ZONE;

-- Create function to generate and store recovery code
CREATE OR REPLACE FUNCTION public.member_generate_recovery_code(p_uid text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_code TEXT;
  v_email TEXT;
  v_member_name TEXT;
BEGIN
  -- Generate a 6-digit code
  v_code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  
  -- Check if member exists and has email
  SELECT email, name INTO v_email, v_member_name FROM members WHERE uid = p_uid;
  
  IF v_email IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'No recovery email set for this account');
  END IF;
  
  -- Store the code with 15 minute expiry
  UPDATE members 
  SET recovery_code = v_code,
      recovery_code_expires_at = now() + interval '15 minutes'
  WHERE uid = p_uid;
  
  IF FOUND THEN
    RETURN json_build_object('success', true, 'code', v_code, 'email', v_email, 'name', v_member_name);
  ELSE
    RETURN json_build_object('success', false, 'error', 'Member not found');
  END IF;
END;
$$;

-- Create function to verify recovery code and reset password
CREATE OR REPLACE FUNCTION public.member_reset_password_with_code(p_uid text, p_code text, p_new_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  v_stored_code TEXT;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get stored code and expiry
  SELECT recovery_code, recovery_code_expires_at INTO v_stored_code, v_expires_at 
  FROM members WHERE uid = p_uid;
  
  IF v_stored_code IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'No recovery code found. Please request a new one.');
  END IF;
  
  IF v_expires_at < now() THEN
    -- Clear expired code
    UPDATE members SET recovery_code = NULL, recovery_code_expires_at = NULL WHERE uid = p_uid;
    RETURN json_build_object('success', false, 'error', 'Recovery code has expired. Please request a new one.');
  END IF;
  
  IF v_stored_code != p_code THEN
    RETURN json_build_object('success', false, 'error', 'Invalid recovery code');
  END IF;
  
  -- Update password and clear recovery code
  UPDATE members 
  SET password_hash = extensions.crypt(p_new_password, extensions.gen_salt('bf')),
      recovery_code = NULL,
      recovery_code_expires_at = NULL
  WHERE uid = p_uid;
  
  RETURN json_build_object('success', true);
END;
$$;