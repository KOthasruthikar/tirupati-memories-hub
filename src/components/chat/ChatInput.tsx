import { useState, useRef, useCallback } from "react";
import { Send, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import VoiceRecorder from "./VoiceRecorder";
import { toast } from "sonner";

interface ChatInputProps {
  onSendText: (text: string) => void;
  onSendVoice: (blob: Blob, duration: number) => void;
  onSendVideo: (file: File, duration: number) => void;
  onTyping?: () => void;
  isSending?: boolean;
}

const ChatInput = ({ onSendText, onSendVoice, onSendVideo, onTyping, isSending }: ChatInputProps) => {
  const [text, setText] = useState("");
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSendText = () => {
    const trimmed = text.trim();
    if (trimmed && !isSending) {
      onSendText(trimmed);
      setText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onTyping?.();
  }, [onTyping]);

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video must be under 50MB");
      return;
    }

    // Extract duration
    const video = document.createElement("video");
    video.preload = "metadata";
    
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      const duration = Math.round(video.duration);
      onSendVideo(file, duration);
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      onSendVideo(file, 0);
    };
    
    video.src = URL.createObjectURL(file);
    
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <div className="border-t border-border bg-background p-3">
      <div className="flex items-end gap-2">
        <VoiceRecorder onSend={onSendVoice} isUploading={isSending} />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => videoInputRef.current?.click()}
          disabled={isSending}
          className="h-9 w-9 shrink-0"
        >
          <Video className="w-5 h-5" />
        </Button>
        <input
          type="file"
          ref={videoInputRef}
          onChange={handleVideoSelect}
          accept="video/*"
          className="hidden"
        />

        <Textarea
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[40px] max-h-[120px] resize-none"
          rows={1}
        />

        <Button
          onClick={handleSendText}
          disabled={!text.trim() || isSending}
          size="icon"
          className="h-9 w-9 shrink-0"
        >
          {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
