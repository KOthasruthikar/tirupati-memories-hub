-- Create conversations table for 1-on-1 chats
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  participant_1_uid TEXT NOT NULL,
  participant_2_uid TEXT NOT NULL,
  UNIQUE(participant_1_uid, participant_2_uid)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_uid TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'voice', 'video'
  content TEXT, -- text content or media URL
  duration_seconds INTEGER, -- for voice/video messages
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Members can view their conversations"
ON public.conversations FOR SELECT
USING (true);

CREATE POLICY "Members can create conversations"
ON public.conversations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Members can update their conversations"
ON public.conversations FOR UPDATE
USING (true);

-- RLS policies for messages
CREATE POLICY "Members can view messages in their conversations"
ON public.messages FOR SELECT
USING (true);

CREATE POLICY "Members can send messages"
ON public.messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Members can update their messages"
ON public.messages FOR UPDATE
USING (true);

CREATE POLICY "Members can delete their messages"
ON public.messages FOR DELETE
USING (true);

-- Create storage bucket for chat media
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-media', 'chat-media', true);

-- Storage policies for chat media
CREATE POLICY "Anyone can upload chat media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-media');

CREATE POLICY "Chat media is publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-media');

CREATE POLICY "Anyone can delete chat media"
ON storage.objects FOR DELETE
USING (bucket_id = 'chat-media');

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- Trigger to update conversations updated_at
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  UPDATE conversations SET updated_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_timestamp();