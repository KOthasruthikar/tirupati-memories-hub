import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participant_1_uid: string;
  participant_2_uid: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_uid: string;
  message_type: "text" | "voice" | "video";
  content: string | null;
  duration_seconds: number | null;
  created_at: string;
  is_read: boolean;
}

// Get or create conversation between two members
export const useGetOrCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ myUid, otherUid }: { myUid: string; otherUid: string }) => {
      // Sort UIDs to ensure consistent ordering
      const [uid1, uid2] = [myUid, otherUid].sort();

      // Try to find existing conversation
      const { data: existing, error: findError } = await supabase
        .from("conversations")
        .select("*")
        .or(`and(participant_1_uid.eq.${uid1},participant_2_uid.eq.${uid2}),and(participant_1_uid.eq.${uid2},participant_2_uid.eq.${uid1})`)
        .maybeSingle();

      if (findError) throw findError;
      if (existing) return existing as Conversation;

      // Create new conversation
      const { data: newConvo, error: createError } = await supabase
        .from("conversations")
        .insert({ participant_1_uid: uid1, participant_2_uid: uid2 })
        .select()
        .single();

      if (createError) throw createError;
      return newConvo as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// Get all conversations for a member
export const useConversations = (memberUid: string) => {
  return useQuery({
    queryKey: ["conversations", memberUid],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`participant_1_uid.eq.${memberUid},participant_2_uid.eq.${memberUid}`)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as Conversation[];
    },
    enabled: !!memberUid,
    staleTime: 30 * 1000,
  });
};

// Get messages for a conversation
export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!conversationId,
    staleTime: 10 * 1000,
  });
};

// Subscribe to realtime messages
export const useRealtimeMessages = (conversationId: string, onNewMessage: (message: Message) => void) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          onNewMessage(newMessage);
          queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, onNewMessage, queryClient]);
};

// Send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      senderUid,
      content,
      messageType = "text",
      durationSeconds,
    }: {
      conversationId: string;
      senderUid: string;
      content: string;
      messageType?: "text" | "voice" | "video";
      durationSeconds?: number;
    }) => {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_uid: senderUid,
          content,
          message_type: messageType,
          duration_seconds: durationSeconds || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// Upload chat media (voice/video)
export const useUploadChatMedia = () => {
  return useMutation({
    mutationFn: async ({ file, type }: { file: Blob; type: "voice" | "video" }) => {
      const ext = type === "voice" ? "webm" : "mp4";
      const fileName = `${type}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `${type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("chat-media")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    },
  });
};

// Mark messages as read
export const useMarkMessagesRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, readerUid }: { conversationId: string; readerUid: string }) => {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_uid", readerUid)
        .eq("is_read", false);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
    },
  });
};

// Get unread message count
export const useUnreadCount = (memberUid: string) => {
  return useQuery({
    queryKey: ["unread-count", memberUid],
    queryFn: async () => {
      // First get all conversations for this member
      const { data: convos, error: convoError } = await supabase
        .from("conversations")
        .select("id")
        .or(`participant_1_uid.eq.${memberUid},participant_2_uid.eq.${memberUid}`);

      if (convoError) throw convoError;
      if (!convos?.length) return 0;

      const convoIds = convos.map((c) => c.id);

      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("conversation_id", convoIds)
        .neq("sender_uid", memberUid)
        .eq("is_read", false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!memberUid,
    staleTime: 30 * 1000,
  });
};
