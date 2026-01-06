import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Circle, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {
  useMessages,
  useRealtimeMessages,
  useSendMessage,
  useUploadChatMedia,
  useMarkMessagesRead,
  useEditMessage,
  useDeleteMessage,
  Message,
} from "@/hooks/useChat";
import { useChatPresence } from "@/hooks/useChatPresence";
import { useMember } from "@/hooks/useMembers";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const sendMessage = useSendMessage();
  const uploadMedia = useUploadChatMedia();
  const markRead = useMarkMessagesRead();
  const editMessage = useEditMessage();
  const deleteMessage = useDeleteMessage();
  
  // Presence tracking
  const { otherUserPresence, setTyping } = useChatPresence(
    conversationId,
    currentMemberUid,
    otherMemberUid
  );

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

  // Handle realtime events
  const realtimeCallbacks = useMemo(() => ({
    onInsert: (message: Message) => {
      setLocalMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    },
    onUpdate: (message: Message) => {
      setLocalMessages((prev) => 
        prev.map((m) => m.id === message.id ? message : m)
      );
    },
    onDelete: (oldMessage: Message) => {
      setLocalMessages((prev) => 
        prev.filter((m) => m.id !== oldMessage.id)
      );
    },
  }), []);

  useRealtimeMessages(conversationId, realtimeCallbacks);

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
        replyToId: replyTo?.id,
      });
      setTyping(false);
      setReplyTo(null);
    } catch {
      toast.error("Failed to send message");
    }
  };

  const handleReply = (message: Message) => {
    setReplyTo(message);
  };

  const handleEdit = async (messageId: string, newContent: string) => {
    try {
      await editMessage.mutateAsync({
        messageId,
        content: newContent,
        conversationId,
      });
      toast.success("Message edited");
    } catch {
      toast.error("Failed to edit message");
    }
  };

  const handleDelete = async () => {
    if (!deleteMessageId) return;
    try {
      await deleteMessage.mutateAsync({
        messageId: deleteMessageId,
        conversationId,
      });
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeleteMessageId(null);
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

  const handleTyping = useCallback(() => {
    setTyping(true);
  }, [setTyping]);

  const handleBackupToEmail = async () => {
    setIsBackingUp(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-chat-backup", {
        body: {
          conversationId,
          requesterUid: currentMemberUid,
        },
      });

      if (error) throw error;
      
      if (data?.success) {
        toast.success(data.message || "Chat backup sent to your email!");
      } else {
        toast.error(data?.error || "Failed to send backup");
      }
    } catch (error: any) {
      console.error("Backup error:", error);
      toast.error(error.message || "Failed to send backup");
    } finally {
      setIsBackingUp(false);
    }
  };

  const getStatusText = () => {
    if (otherUserPresence.isTyping) {
      return "typing...";
    }
    if (otherUserPresence.isOnline) {
      return "online";
    }
    if (otherUserPresence.lastSeen) {
      return `last seen ${formatDistanceToNow(new Date(otherUserPresence.lastSeen), { addSuffix: true })}`;
    }
    return "offline";
  };

  const isSending = sendMessage.isPending || uploadMedia.isPending;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
        <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="relative">
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
          {/* Online indicator dot */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
              otherUserPresence.isOnline ? "bg-green-500" : "bg-muted-foreground"
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{otherMember?.name || "Loading..."}</p>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            {otherUserPresence.isTyping ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-primary"
              >
                typing...
              </motion.span>
            ) : otherUserPresence.isOnline ? (
              <span className="text-green-500 flex items-center gap-1">
                <Circle className="w-2 h-2 fill-current" />
                online
              </span>
            ) : (
              <span>{getStatusText()}</span>
            )}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackupToEmail}
          disabled={isBackingUp}
          title="Send chat backup to email"
        >
          {isBackingUp ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
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
          localMessages.map((message) => {
            const replyToMessage = message.reply_to_id 
              ? localMessages.find((m) => m.id === message.reply_to_id) 
              : null;
            return (
              <ChatMessage
                key={message.id}
                message={message}
                isOwn={message.sender_uid === currentMemberUid}
                replyToMessage={replyToMessage}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteMessageId(id)}
              />
            );
          })
        )}
        
        {/* Typing indicator */}
        <AnimatePresence>
          {otherUserPresence.isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="bg-muted rounded-2xl px-4 py-2 rounded-bl-sm">
                <div className="flex gap-1">
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                  <motion.span
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                    className="w-2 h-2 bg-muted-foreground rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Reply preview */}
      {replyTo && (
        <div className="px-4 py-2 bg-muted/50 border-t border-border flex items-center gap-2">
          <div className="flex-1 text-sm truncate">
            <span className="text-muted-foreground">Replying to: </span>
            <span className="font-medium">
              {replyTo.message_type === "text" 
                ? replyTo.content?.slice(0, 40) 
                : replyTo.message_type === "voice" 
                  ? "🎤 Voice message"
                  : "🎥 Video"}
              {replyTo.content && replyTo.content.length > 40 && "..."}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setReplyTo(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Input */}
      <ChatInput
        onSendText={handleSendText}
        onSendVoice={handleSendVoice}
        onSendVideo={handleSendVideo}
        onTyping={handleTyping}
        isSending={isSending}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteMessageId} onOpenChange={() => setDeleteMessageId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This message will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatWindow;
