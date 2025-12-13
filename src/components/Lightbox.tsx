import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download, Trash2, Tag, Loader2, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useDeleteImage, useTagMembers, downloadImage } from "@/hooks/useGalleryActions";
import { useMembers } from "@/hooks/useMembers";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LightboxProps {
  images: { url: string; caption?: string; id?: string; ownerUid?: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }: LightboxProps) => {
  const { member } = useAuth();
  const currentImage = images[currentIndex];
  const [showTagPanel, setShowTagPanel] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const { data: members } = useMembers();
  const deleteMutation = useDeleteImage();
  const tagMutation = useTagMembers();

  // Fetch existing tags for current image
  const { data: existingTags } = useQuery({
    queryKey: ["image-tags", currentImage?.id],
    queryFn: async () => {
      if (!currentImage?.id) return [];
      const { data, error } = await supabase
        .from("member_tags")
        .select("member_uid, members(name)")
        .eq("gallery_id", currentImage.id);
      if (error) throw error;
      return data;
    },
    enabled: !!currentImage?.id && showTagPanel,
  });

  useEffect(() => {
    if (existingTags) {
      setSelectedTags(existingTags.map((t) => t.member_uid));
    }
  }, [existingTags]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case "Escape":
        if (showTagPanel) {
          setShowTagPanel(false);
        } else {
          onClose();
        }
        break;
      case "ArrowRight":
        if (!showTagPanel) onNext();
        break;
      case "ArrowLeft":
        if (!showTagPanel) onPrev();
        break;
    }
  }, [isOpen, onClose, onNext, onPrev, showTagPanel]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown, isOpen]);

  const handleDownload = async () => {
    if (!currentImage) return;
    try {
      const filename = `image_${currentIndex + 1}.jpg`;
      await downloadImage(currentImage.url, filename);
      toast.success("Image downloaded!");
    } catch {
      toast.error("Failed to download image");
    }
  };

  const handleDelete = async () => {
    if (!currentImage?.id || !member) return;
    
    if (currentImage.ownerUid !== member.uid) {
      toast.error("You can only delete your own images");
      return;
    }

    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteMutation.mutateAsync(currentImage.id);
      toast.success("Image deleted!");
      onClose();
    } catch {
      toast.error("Failed to delete image");
    }
  };

  const handleTagToggle = (uid: string) => {
    setSelectedTags((prev) =>
      prev.includes(uid) ? prev.filter((t) => t !== uid) : [...prev, uid]
    );
  };

  const handleSaveTags = async () => {
    if (!currentImage?.id) return;
    
    try {
      await tagMutation.mutateAsync({
        galleryId: currentImage.id,
        memberUids: selectedTags,
      });
      toast.success("Tags saved!");
      setShowTagPanel(false);
    } catch {
      toast.error("Failed to save tags");
    }
  };

  const canDelete = member && currentImage?.ownerUid === member.uid;

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lightbox-backdrop flex items-center justify-center"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Action Buttons - Top Right */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {/* Download */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-2 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors"
              title="Download image"
            >
              <Download size={20} />
            </button>

            {/* Tag Members */}
            {currentImage?.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTagPanel(!showTagPanel);
                }}
                className={`p-2 rounded-full transition-colors ${
                  showTagPanel
                    ? "bg-primary text-primary-foreground"
                    : "bg-background/20 text-primary-foreground hover:bg-background/40"
                }`}
                title="Tag members"
              >
                <Tag size={20} />
              </button>
            )}

            {/* Delete (only for owner) */}
            {canDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={deleteMutation.isPending}
                className="p-2 rounded-full bg-destructive/80 text-destructive-foreground hover:bg-destructive transition-colors"
                title="Delete image"
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Trash2 size={20} />
                )}
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tag Panel */}
          <AnimatePresence>
            {showTagPanel && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="absolute top-16 right-4 w-64 bg-card rounded-xl shadow-lg border border-border p-4 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="font-heading font-semibold text-foreground mb-3">Tag Members</h3>
                <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
                  {members?.map((m) => (
                    <button
                      key={m.uid}
                      onClick={() => handleTagToggle(m.uid)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedTags.includes(m.uid)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedTags.includes(m.uid)
                          ? "bg-primary border-primary"
                          : "border-border"
                      }`}>
                        {selectedTags.includes(m.uid) && (
                          <Check className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                      <span>{m.name}</span>
                      <span className="text-muted-foreground text-xs">({m.uid})</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSaveTags}
                  disabled={tagMutation.isPending}
                  className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {tagMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Tags"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Image Container */}
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage.url}
              alt={currentImage.caption || "Gallery image"}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Caption & Counter */}
            <div className="mt-4 text-center">
              {currentImage.caption && (
                <p className="text-primary-foreground text-lg mb-2">{currentImage.caption}</p>
              )}
              <p className="text-primary-foreground/60 text-sm">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
