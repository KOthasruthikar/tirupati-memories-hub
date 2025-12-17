-- Add foreign keys for access_requests table
ALTER TABLE public.access_requests
ADD CONSTRAINT access_requests_requester_uid_fkey
FOREIGN KEY (requester_uid) REFERENCES public.members(uid) ON DELETE CASCADE;

ALTER TABLE public.access_requests
ADD CONSTRAINT access_requests_owner_uid_fkey
FOREIGN KEY (owner_uid) REFERENCES public.members(uid) ON DELETE CASCADE;