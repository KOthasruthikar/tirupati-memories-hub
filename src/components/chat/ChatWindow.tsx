import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {
  useMessages,
  useRealtimeMessages,
  useSendMessage,
  useUploadChatMedia,
  useMarkMessagesRead,
  Message,
} from "@/hooks/useChat";
import { useMember } from "@/hooks/useMembers";
import { toast } from "sonner";

interface ChatWindowProps {
  conversationId: string;
  currentMemberUid: string;
  otherMemberUid: string;
  onBack: () => void;
}

const ChatWindow = ({ conversationId, currentMemberUid, otherMemberUid, onBack }: ChatWindowProps) => {
  const { data: messages, isLoading } = useMessages(conversationId);
  const { data: otherMember } = useMember(otherMemberUid);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const sendMessage = useSendMessage();
  const uploadMedia = useUploadChatMedia();
  const markRead = useMarkMessagesRead();

  // Sync local messages with fetched messages
  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (conversationId && currentMemberUid) {
      markRead.mutate({ conversationId, readerUid: currentMemberUid });
    }
  }, [conversationId, currentMemberUid]);

  // Handle new realtime messages
  const handleNewMessage = useCallback((message: Message) => {
    setLocalMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  useRealtimeMessages(conversationId, handleNewMessage);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleSendText = async (text: string) => {
    try {
      await sendMessage.mutateAsync({
        conversationId,
        senderUid: currentMemberUid,
        content: text,
        messageType: "text",
      });
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleSendVoice = async (blob: Blob, duration: number) => {
    try {
      const url = await uploadMedia.mutateAsync({ file: blob, type: "voice" });
      await sendMessage.mutateAsync({
        conversationId,
        senderUid: currentMemberUid,
        content: url,
        messageType: "voice",
        durationSeconds: duration,
      });
    } catch {
      toast.error("Failed to send voice message");
    }
  };

  const handleSendVideo = async (file: File, duration: number) => {
    try {
      const url = await uploadMedia.mutateAsync({ file, type: "video" });
      await sendMessage.mutateAsync({
        conversationId,
        senderUid: currentMemberUid,
        content: url,
        messageType: "video",
        durationSeconds: duration,
      });
      toast.success("Video sent!");
    } catch {
      toast.error("Failed to send video");
    }
  };

  const handleBackupToEmail = () => {
    if (!otherMember?.email) {
      toast.error("No email set for backup");
      return;
    }
    // This would trigger an edge function to email the chat history
    toast.info("Email backup feature coming soon");
  };

  const isSending = sendMessage.isPending || uploadMedia.isPending;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
          {otherMember?.profile_image ? (
            <img
              src={otherMember.profile_image}
              alt={otherMember.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-semibold text-muted-foreground">
              {otherMember?.name?.charAt(0) || "?"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{otherMember?.name || "Loading..."}</p>
          <p className="text-xs text-muted-foreground truncate">{otherMember?.role}</p>
        </div>

        <Button variant="ghost" size="icon" onClick={handleBackupToEmail} title="Backup to email">
          <Download className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : localMessages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-12"
          >
            <p className="text-sm">No messages yet</p>
            <p className="text-xs mt-1">Say hello! 👋</p>
          </motion.div>
        ) : (
          localMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwn={message.sender_uid === currentMemberUid}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSendText={handleSendText}
        onSendVoice={handleSendVoice}
        onSendVideo={handleSendVideo}
        isSending={isSending}
      />
    </div>
  );
};

export default ChatWindow;
