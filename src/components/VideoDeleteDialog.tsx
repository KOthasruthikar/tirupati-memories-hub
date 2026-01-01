import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Lock, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VideoTestimonial, useDeleteVideo } from "@/hooks/useVideoTestimonials";

interface VideoDeleteDialogProps {
  video: VideoTestimonial | null;
  isOpen: boolean;
  onClose: () => void;
}

const VideoDeleteDialog = ({
  video,
  isOpen,
  onClose,
}: VideoDeleteDialogProps) => {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const deleteVideo = useDeleteVideo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) return;

    await deleteVideo.mutateAsync({
      videoId: video.id,
      ownerUid: uid,
      password,
    });

    setUid("");
    setPassword("");
    onClose();
  };

  const handleClose = () => {
    setUid("");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Video
          </DialogTitle>
          <DialogDescription>
            To delete this video, please verify your identity by entering your
            member ID and password.
          </DialogDescription>
        </DialogHeader>

        {video && (
          <div className="mb-4 p-3 rounded-lg bg-muted">
            <p className="font-medium text-sm">{video.title || "Untitled Video"}</p>
            <p className="text-xs text-muted-foreground">
              Uploaded by {video.owner_name}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delete-uid">Member ID</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="delete-uid"
                type="text"
                placeholder="Enter your 4-digit ID"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="pl-10"
                maxLength={4}
                pattern="\d{4}"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="delete-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={deleteVideo.isPending || uid.length !== 4 || !password}
            >
              {deleteVideo.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Video
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDeleteDialog;
