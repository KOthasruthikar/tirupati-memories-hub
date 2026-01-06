import { motion } from "framer-motion";
import { Play, Pause, MoreVertical, Pencil, Trash2, Reply, X, Check } from "lucide-react";
import { useState, useRef } from "react";
import { Message } from "@/hooks/useChat";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  replyToMessage?: Message | null;
  onReply?: (message: Message) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
}

const ChatMessage = ({ 
  message, 
  isOwn, 
  replyToMessage, 
  onReply, 
  onEdit, 
  onDelete 
}: ChatMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content || "");
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content || "");
    setIsEditing(false);
  };

  const canEditOrDelete = isOwn && message.message_type === "text";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}
    >
      <div className="relative max-w-[75%]">
        {/* Reply preview */}
        {replyToMessage && (
          <div 
            className={`text-xs px-3 py-1.5 mb-1 rounded-t-lg border-l-2 ${
              isOwn 
                ? "bg-primary/20 border-primary-foreground/40" 
                : "bg-muted/50 border-muted-foreground/40"
            }`}
          >
            <p className="font-medium opacity-70 truncate">
              {replyToMessage.message_type === "text" 
                ? replyToMessage.content?.slice(0, 50) 
                : replyToMessage.message_type === "voice" 
                  ? "🎤 Voice message"
                  : "🎥 Video"}
              {replyToMessage.content && replyToMessage.content.length > 50 && "..."}
            </p>
          </div>
        )}
        
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-muted text-foreground rounded-bl-sm"
          }`}
        >
          {/* Editing mode */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] bg-background/20 border-none text-inherit resize-none"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={handleCancelEdit}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={handleEdit}
                >
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <>
              {message.message_type === "text" && (
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              )}

              {message.message_type === "voice" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleAudio}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isOwn ? "bg-primary-foreground/20" : "bg-foreground/10"
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <audio
                    ref={audioRef}
                    src={message.content || ""}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                  <span className="text-xs opacity-70">
                    {message.duration_seconds ? formatDuration(message.duration_seconds) : "Voice"}
                  </span>
                </div>
              )}

              {message.message_type === "video" && (
                <div className="rounded-lg overflow-hidden max-w-[250px]">
                  <video
                    ref={videoRef}
                    src={message.content || ""}
                    controls
                    className="w-full"
                    preload="metadata"
                  />
                  {message.duration_seconds && (
                    <span className="text-xs opacity-70 mt-1 block">
                      {formatDuration(message.duration_seconds)}
                    </span>
                  )}
                </div>
              )}
            </>
          )}

          <p className={`text-[10px] mt-1 ${isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
            {format(new Date(message.created_at), "h:mm a")}
          </p>
        </div>

        {/* Action menu */}
        {!isEditing && (
          <div className={`absolute top-0 ${isOwn ? "left-0 -translate-x-full pr-1" : "right-0 translate-x-full pl-1"} opacity-0 group-hover:opacity-100 transition-opacity`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwn ? "end" : "start"}>
                <DropdownMenuItem onClick={() => onReply?.(message)}>
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </DropdownMenuItem>
                {canEditOrDelete && (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete?.(message.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;