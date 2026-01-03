import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Send, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onSend: (blob: Blob, duration: number) => void;
  isUploading?: boolean;
}

const VoiceRecorder = ({ onSend, isUploading }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimeRef.current = Date.now();
      
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch (error) {
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isRecording]);

  const clearRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setRecordedBlob(null);
    setAudioUrl(null);
    setDuration(0);
  };

  const handleSend = () => {
    if (recordedBlob) {
      onSend(recordedBlob, duration);
      clearRecording();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (recordedBlob && audioUrl) {
    return (
      <div className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-2">
        <audio src={audioUrl} controls className="h-8 max-w-[200px]" />
        <span className="text-xs text-muted-foreground">{formatDuration(duration)}</span>
        <Button variant="ghost" size="icon" onClick={clearRecording} className="h-8 w-8">
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
        <Button size="icon" onClick={handleSend} disabled={isUploading} className="h-8 w-8">
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      {isRecording ? (
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-2 h-2 rounded-full bg-red-500"
          />
          <span className="text-sm text-muted-foreground">{formatDuration(duration)}</span>
          <Button variant="destructive" size="icon" onClick={stopRecording} className="h-8 w-8">
            <Square className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="icon" onClick={startRecording} className="h-9 w-9">
          <Mic className="w-5 h-5" />
        </Button>
      )}
    </motion.div>
  );
};

export default VoiceRecorder;
