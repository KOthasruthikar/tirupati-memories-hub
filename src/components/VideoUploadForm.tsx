import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Video, X, Loader2, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUploadVideo } from "@/hooks/useVideoTestimonials";
import { toast } from "sonner";

const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB

const VideoUploadForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [uid, setUid] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadVideo = useUploadVideo();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("Video must be less than 150MB");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const clearFile = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || uid.length !== 4) return;

    await uploadVideo.mutateAsync({
      file,
      ownerUid: uid,
      title: title || undefined,
      description: description || undefined,
    });

    // Reset form
    setUid("");
    setTitle("");
    setDescription("");
    clearFile();
    onSuccess?.();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-card border border-border"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
        <Video className="w-5 h-5 text-primary" />
        Upload Your Testimonial
      </h3>

      <div className="space-y-4">
        {/* Member UID */}
        <div className="space-y-2">
          <Label htmlFor="video-uid">Member ID *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="video-uid"
              type="text"
              placeholder="Enter your 4-digit ID"
              value={uid}
              onChange={(e) => setUid(e.target.value.replace(/\D/g, ""))}
              className="pl-10"
              maxLength={4}
              required
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="video-title">Title (optional)</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="video-title"
              type="text"
              placeholder="Give your video a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-10"
              maxLength={100}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="video-description">Description (optional)</Label>
          <Textarea
            id="video-description"
            placeholder="Share your experience..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </div>

        {/* File upload */}
        <div className="space-y-2">
          <Label>Video File * (max 150MB)</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.button
                key="upload-zone"
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-8 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-center group"
              >
                <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  Click to select a video
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, MOV, WebM up to 150MB
                </p>
              </motion.button>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-xl overflow-hidden bg-muted"
              >
                <video
                  src={preview!}
                  className="w-full aspect-video object-cover"
                  controls
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-3 py-1 rounded-full bg-background/80 text-xs text-foreground">
                  {formatFileSize(file.size)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!file || uid.length !== 4 || uploadVideo.isPending}
        >
          {uploadVideo.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default VideoUploadForm;
