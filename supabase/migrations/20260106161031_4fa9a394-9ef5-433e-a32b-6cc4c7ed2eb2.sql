-- Add reply_to_id column to messages table for reply functionality
ALTER TABLE public.messages ADD COLUMN reply_to_id uuid REFERENCES public.messages(id) ON DELETE SET NULL;

-- Add index for better performance on reply lookups
CREATE INDEX idx_messages_reply_to_id ON public.messages(reply_to_id);

-- Subscribe to realtime for UPDATE and DELETE events
ALTER TABLE public.messages REPLICA IDENTITY FULL;