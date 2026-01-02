import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Video, X, Loader2, User, FileText, Clock, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUploadVideo } from "@/hooks/useVideoTestimonials";
import { toast } from "sonner";

const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB
const MAX_THUMB_SIZE = 5 * 1024 * 1024; // 5MB

const VideoUploadForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [uid, setUid] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [customThumbnail, setCustomThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const uploadVideo = useUploadVideo();

  // Extract video duration and generate thumbnail from random frame
  const extractVideoMetadata = useCallback((videoFile: File): Promise<{ duration: number; thumbnail: Blob }> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      
      video.onloadedmetadata = () => {
        if (!isFinite(video.duration) || video.duration <= 0) {
          URL.revokeObjectURL(video.src);
          reject(new Error("Could not determine video duration"));
          return;
        }

        const videoDuration = Math.round(video.duration);
        
        // Seek to a random position (between 10% and 50% of duration)
        const randomTime = video.duration * (0.1 + Math.random() * 0.4);
        video.currentTime = randomTime;
      };

      video.onseeked = () => {
        // Generate thumbnail from current frame
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(video.src);
              if (blob) {
                resolve({ duration: Math.round(video.duration), thumbnail: blob });
              } else {
                reject(new Error("Failed to generate thumbnail"));
              }
            },
            "image/jpeg",
            0.85
          );
        } else {
          URL.revokeObjectURL(video.src);
          reject(new Error("Could not get canvas context"));
        }
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        reject(new Error("Error loading video metadata"));
      };
      
      video.src = URL.createObjectURL(videoFile);
    });
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Extract duration and generate thumbnail
    try {
      const { duration: videoDuration, thumbnail } = await extractVideoMetadata(selectedFile);
      setDuration(videoDuration);
      setGeneratedThumbnail(thumbnail);
      
      // Only set as preview if no custom thumbnail
      if (!customThumbnail) {
        setThumbnailPreview(URL.createObjectURL(thumbnail));
      }
    } catch (error) {
      console.warn("Could not extract video metadata:", error);
      setDuration(null);
      setGeneratedThumbnail(null);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (selectedFile.size > MAX_THUMB_SIZE) {
      toast.error("Thumbnail must be less than 5MB");
      return;
    }

    setCustomThumbnail(selectedFile);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(URL.createObjectURL(selectedFile));
  };

  const clearThumbnail = () => {
    setCustomThumbnail(null);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    
    // Revert to generated thumbnail if available
    if (generatedThumbnail) {
      setThumbnailPreview(URL.createObjectURL(generatedThumbnail));
    } else {
      setThumbnailPreview(null);
    }
    
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const clearFile = () => {
    setFile(null);
    setDuration(null);
    setGeneratedThumbnail(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (!customThumbnail && thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || uid.length !== 4) return;

    // Use custom thumbnail or generated one
    const thumbnailToUpload = customThumbnail || generatedThumbnail;

    await uploadVideo.mutateAsync({
      file,
      ownerUid: uid,
      title: title || undefined,
      description: description || undefined,
      durationSeconds: duration || undefined,
      thumbnailBlob: thumbnailToUpload || undefined,
    });

    // Reset form
    setUid("");
    setTitle("");
    setDescription("");
    setCustomThumbnail(null);
    setGeneratedThumbnail(null);
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(null);
    clearFile();
    onSuccess?.();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
                <div className="absolute bottom-2 left-2 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-background/80 text-xs text-foreground">
                    {formatFileSize(file.size)}
                  </span>
                  {duration && (
                    <span className="px-3 py-1 rounded-full bg-background/80 text-xs text-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(duration)}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Thumbnail upload (optional) */}
        <div className="space-y-2">
          <Label>Thumbnail (optional)</Label>
          <p className="text-xs text-muted-foreground">
            Upload a custom thumbnail or we'll generate one from your video
          </p>
          <input
            ref={thumbInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailSelect}
            className="hidden"
          />
          
          <div className="flex gap-4 items-start">
            {thumbnailPreview && (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
                {customThumbnail && (
                  <button
                    type="button"
                    onClick={clearThumbnail}
                    className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-background/80 text-[10px] text-foreground">
                  {customThumbnail ? "Custom" : "Auto"}
                </span>
              </div>
            )}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => thumbInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Image className="w-4 h-4" />
              {customThumbnail ? "Change" : "Upload Custom"}
            </Button>
          </div>
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