import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { useState, useRef } from "react";
import { Message } from "@/hooks/useChat";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

const ChatMessage = ({ message, isOwn }: ChatMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm"
        }`}
      >
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

        <p className={`text-[10px] mt-1 ${isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          {format(new Date(message.created_at), "h:mm a")}
        </p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
