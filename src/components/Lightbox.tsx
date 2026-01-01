import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ChevronLeft, ChevronRight, Download, Trash2, Tag, Loader2, Check, UserX,
  Heart, Share2, Info, ZoomIn, ZoomOut, RotateCw, Maximize2, Eye, Clock,
  Camera, Sparkles, Star
} from "lucide-react";
import { useDeleteImage, useTagMembers, downloadImage } from "@/hooks/useGalleryActions";
import { useMembers } from "@/hooks/useMembers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface LightboxProps {
  images: { url: string; caption?: string; id?: string; ownerUid?: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }: LightboxProps) => {
  const currentImage = images[currentIndex];
  const [showTagPanel, setShowTagPanel] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const queryClient = useQueryClient();
  const { data: members } = useMembers();
  const deleteMutation = useDeleteImage();
  const tagMutation = useTagMembers();

  // Fetch existing tags for current image (always fetch when image has id)
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
    enabled: !!currentImage?.id && isOpen,
  });

  useEffect(() => {
    if (existingTags) {
      setSelectedTags(existingTags.map((t) => t.member_uid));
    }
  }, [existingTags]);

  // Reset states when image changes and calculate proper initial zoom
  useEffect(() => {
    setShowTagPanel(false);
    setShowDeleteDialog(false);
    setShowInfoPanel(false);
    setZoom(1); // Always start at 1x zoom to show image at natural aspect ratio
    setRotation(0);
    setIsFullscreen(false);
  }, [currentIndex]);

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timer);
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen, showControls]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case "Escape":
        if (showDeleteDialog) {
          setShowDeleteDialog(false);
        } else if (showTagPanel) {
          setShowTagPanel(false);
        } else if (showInfoPanel) {
          setShowInfoPanel(false);
        } else {
          onClose();
        }
        break;
      case "ArrowRight":
        if (!showTagPanel && !showDeleteDialog && !showInfoPanel) onNext();
        break;
      case "ArrowLeft":
        if (!showTagPanel && !showDeleteDialog && !showInfoPanel) onPrev();
        break;
      case "i":
      case "I":
        if (!showTagPanel && !showDeleteDialog) {
          setShowInfoPanel(!showInfoPanel);
        }
        break;
      case "f":
      case "F":
        setIsFullscreen(!isFullscreen);
        break;
      case "r":
      case "R":
        setRotation(prev => (prev + 90) % 360);
        break;
      case "+":
      case "=":
        setZoom(prev => Math.min(prev + 0.25, 3));
        break;
      case "-":
        setZoom(prev => Math.max(prev - 0.25, 0.5));
        break;
    }
  }, [isOpen, onClose, onNext, onPrev, showTagPanel, showDeleteDialog, showInfoPanel, isFullscreen]);

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
      const filename = `tirupati_memory_${currentIndex + 1}.jpg`;
      await downloadImage(currentImage.url, filename);
      toast.success("📸 Sacred memory downloaded successfully!", {
        description: "The blessed image has been saved to your device",
        duration: 3000,
      });
    } catch {
      toast.error("❌ Failed to download the sacred memory", {
        description: "Please try again or check your connection",
        duration: 3000,
      });
    }
  };

  const handleShare = async () => {
    if (!currentImage) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Sacred Memory from Tirupati Pilgrimage',
          text: currentImage.caption || 'A blessed moment from our spiritual journey',
          url: currentImage.url,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(currentImage.url);
        toast.success("🔗 Sacred memory link copied to clipboard!", {
          description: "Share this blessed moment with fellow pilgrims",
          duration: 3000,
        });
      }
    } catch {
      toast.error("❌ Unable to share the sacred memory", {
        description: "Please try again",
        duration: 3000,
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "💔 Removed from favorites" : "❤️ Added to favorites!", {
      description: isLiked ? "Sacred memory removed from your favorites" : "This blessed moment has been saved to your favorites",
      duration: 2000,
    });
  };

  const resetImageTransform = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDelete = async () => {
    if (!currentImage?.id) return;
    
    try {
      await deleteMutation.mutateAsync(currentImage.id);
      toast.success("🙏 Sacred memory has been respectfully removed from our pilgrimage gallery", {
        description: "The image has been permanently deleted",
        duration: 4000,
      });
      setShowDeleteDialog(false);
      onClose();
    } catch {
      toast.error("❌ Unable to remove the sacred memory", {
        description: "Please try again or contact support",
        duration: 4000,
      });
      setShowDeleteDialog(false);
    }
  };

  const handleRemoveTag = async (memberUid: string) => {
    if (!currentImage?.id) return;
    
    const newTags = selectedTags.filter(t => t !== memberUid);
    
    try {
      await tagMutation.mutateAsync({
        galleryId: currentImage.id,
        memberUids: newTags,
      });
      setSelectedTags(newTags);
      queryClient.invalidateQueries({ queryKey: ["member-tagged-images"] });
      toast.success("🏷️ Pilgrim tag removed successfully", {
        description: "The member has been untagged from this sacred memory",
        duration: 3000,
      });
    } catch {
      toast.error("❌ Failed to remove pilgrim tag", {
        description: "Please try again",
        duration: 3000,
      });
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
      queryClient.invalidateQueries({ queryKey: ["member-tagged-images"] });
      toast.success("🏷️ Pilgrim tags saved successfully!", {
        description: `${selectedTags.length} pilgrims have been tagged in this sacred memory`,
        duration: 3000,
      });
      setShowTagPanel(false);
    } catch {
      toast.error("❌ Failed to save pilgrim tags", {
        description: "Please try again",
        duration: 3000,
      });
    }
  };

  // Get tagged member names for display
  const taggedMemberNames = existingTags?.map(t => {
    const memberData = t.members as { name: string } | null;
    return { uid: t.member_uid, name: memberData?.name || t.member_uid };
  }) || [];

  return (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Enhanced Image lightbox"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Floating sacred symbols */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`symbol-${i}`}
                className="absolute text-gold/10 text-4xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  rotate: [0, 360],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 15 + i * 2,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "easeInOut",
                }}
              >
                {['🕉️', '🙏', '✨', '🌸', '🪔'][i % 5]}
              </motion.div>
            ))}
          </div>

          {/* Enhanced Top Controls Bar */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="absolute top-0 left-0 right-0 z-20 p-6"
              >
                <div className="flex items-center justify-between">
                  {/* Left side - Image info */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-full border border-white/20 shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Camera className="w-4 h-4 text-gold" />
                      <span className="text-white text-sm font-medium">
                        {currentIndex + 1} / {images.length}
                      </span>
                    </motion.div>

                    {currentImage.caption && (
                      <motion.div
                        className="px-4 py-2 bg-black/60 rounded-full border border-white/20 shadow-lg max-w-md"
                        whileHover={{ scale: 1.02 }}
                      >
                        <p className="text-white text-sm truncate">{currentImage.caption}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Right side - Action buttons */}
                  <div className="flex items-center gap-2">
                    {/* Like Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike();
                      }}
                      className={`p-3 rounded-full border shadow-lg transition-all ${
                        isLiked 
                          ? "bg-red-500/80 border-red-400/50 text-red-100" 
                          : "bg-black/60 border-white/20 text-white hover:bg-black/80"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={isLiked ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </motion.button>

                    {/* Share Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare();
                      }}
                      className="p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 shadow-lg transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Share sacred memory"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>

                    {/* Info Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInfoPanel(!showInfoPanel);
                      }}
                      className={`p-3 rounded-full border shadow-lg transition-all ${
                        showInfoPanel
                          ? "bg-primary/80 border-primary/50 text-white"
                          : "bg-black/60 border-white/20 text-white hover:bg-black/80"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Image information"
                    >
                      <Info className="w-5 h-5" />
                    </motion.button>

                    {/* Download Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload();
                      }}
                      className="p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 shadow-lg transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Download sacred memory"
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>

                    {/* Tag Members Button */}
                    {currentImage?.id && (
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTagPanel(!showTagPanel);
                        }}
                        className={`p-3 rounded-full border shadow-lg transition-all ${
                          showTagPanel
                            ? "bg-primary/80 border-primary/50 text-white"
                            : "bg-black/60 border-white/20 text-white hover:bg-black/80"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Tag pilgrims"
                      >
                        <Tag className="w-5 h-5" />
                      </motion.button>
                    )}

                    {/* Delete Button */}
                    {currentImage?.id && (
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteDialog(true);
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-3 rounded-full bg-red-500/80 border border-red-400/50 text-red-100 hover:bg-red-500 shadow-lg transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Remove sacred memory"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    )}

                    {/* Close Button */}
                    <motion.button
                      onClick={onClose}
                      className="p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 shadow-lg transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Close lightbox"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Bottom Controls Bar */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute bottom-0 left-0 right-0 z-20 p-6"
              >
                <div className="flex items-center justify-center gap-4">
                  {/* Zoom Controls */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/60 rounded-full border border-white/20 shadow-lg">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoom(prev => Math.max(prev - 0.25, 0.5));
                      }}
                      className="p-2 rounded-full hover:bg-white/10 text-white transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Zoom out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </motion.button>
                    
                    <span className="text-white text-sm font-medium min-w-[60px] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoom(prev => Math.min(prev + 0.25, 3));
                      }}
                      className="p-2 rounded-full hover:bg-white/10 text-white transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title="Zoom in"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Rotation Control */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRotation(prev => (prev + 90) % 360);
                    }}
                    className="p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 shadow-lg transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Rotate image"
                  >
                    <RotateCw className="w-5 h-5" />
                  </motion.button>

                  {/* Reset Transform */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetImageTransform();
                    }}
                    className="px-4 py-2 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 shadow-lg transition-all text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Reset view"
                  >
                    Reset
                  </motion.button>

                  {/* Fullscreen Toggle */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFullscreen(!isFullscreen);
                    }}
                    className={`p-3 rounded-full border shadow-lg transition-all ${
                      isFullscreen
                        ? "bg-primary/80 border-primary/50 text-white"
                        : "bg-black/60 border-white/20 text-white hover:bg-black/80"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Toggle fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Info Panel */}
          <AnimatePresence>
            {showInfoPanel && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="absolute top-20 right-6 w-80 bg-black/80 rounded-3xl shadow-2xl border border-white/20 p-6 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-full bg-primary/80">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-white text-lg">Sacred Memory Details</h3>
                </div>
                
                <div className="space-y-4">
                  {currentImage.caption && (
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span className="text-gold text-sm font-medium">Caption</span>
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed">{currentImage.caption}</p>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 text-sm font-medium">View Details</span>
                    </div>
                    <div className="space-y-2 text-sm text-white/80">
                      <div className="flex justify-between">
                        <span>Position:</span>
                        <span>{currentIndex + 1} of {images.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zoom:</span>
                        <span>{Math.round(zoom * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rotation:</span>
                        <span>{rotation}°</span>
                      </div>
                    </div>
                  </div>

                  {taggedMemberNames.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Tagged Pilgrims</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {taggedMemberNames.map((tag) => (
                          <span
                            key={tag.uid}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/80 text-white rounded-full text-xs font-medium border border-primary/50"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 text-sm font-medium">Quick Actions</span>
                    </div>
                    <div className="text-xs text-white/60 space-y-1">
                      <p>• Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/80">←</kbd> <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/80">→</kbd> to navigate</p>
                      <p>• Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/80">F</kbd> for fullscreen</p>
                      <p>• Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/80">R</kbd> to rotate</p>
                      <p>• Press <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/80">+</kbd> <kbd className="px-1 py-0.5 bg-white/10 rounded text-white/80">-</kbd> to zoom</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Tag Panel */}
          <AnimatePresence>
            {showTagPanel && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="absolute top-20 right-6 w-80 bg-black/80 rounded-3xl shadow-2xl border border-white/20 p-6 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-full bg-primary/80">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-white text-lg">Tag Fellow Pilgrims</h3>
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-2 mb-6 custom-scrollbar">
                  {members?.map((m) => (
                    <motion.button
                      key={m.uid}
                      onClick={() => handleTagToggle(m.uid)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all border ${
                        selectedTags.includes(m.uid)
                          ? "bg-primary/80 text-white border-primary/50"
                          : "hover:bg-white/10 text-white border-white/20 hover:border-white/40"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedTags.includes(m.uid)
                          ? "bg-white border-white"
                          : "border-white/30"
                      }`}>
                        {selectedTags.includes(m.uid) && (
                          <Check className="w-3 h-3 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-medium">{m.name}</span>
                        <span className="text-white/60 text-xs ml-2">({m.uid})</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                <motion.button
                  onClick={handleSaveTags}
                  disabled={tagMutation.isPending}
                  className="w-full py-3 bg-primary/80 text-white rounded-2xl text-sm font-medium hover:bg-primary disabled:opacity-50 transition-all flex items-center justify-center gap-2 border border-primary/50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {tagMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      Save Sacred Tags
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Enhanced Navigation Buttons */}
          {images.length > 1 && (
            <>
              <AnimatePresence>
                {showControls && (
                  <motion.button
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrev();
                    }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 shadow-lg transition-all z-10"
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Previous sacred memory"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </motion.button>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showControls && (
                  <motion.button
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNext();
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 shadow-lg transition-all z-10"
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Next sacred memory"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </motion.button>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Enhanced Image Container */}
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`relative flex items-center justify-center ${
              isFullscreen ? "w-full h-full" : "max-w-[90vw] max-h-[85vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              src={currentImage.url}
              alt={currentImage.caption || "Sacred memory"}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/[0.1]"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: "transform 0.3s ease-out",
                transformOrigin: "center center",
              }}
              drag
              dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
              whileHover={{ scale: zoom * 1.02 }}
            />
            
            {/* Image overlay effects */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            
            {/* Floating particles around image */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-gold/40 rounded-full blur-sm"
                style={{
                  left: `${10 + i * 10}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.4, 0.8, 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </motion.div>

          {/* Enhanced Tagged Members Display */}
          {taggedMemberNames.length > 0 && !showTagPanel && !showInfoPanel && (
            <AnimatePresence>
              {showControls && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10"
                >
                  <div className="flex flex-wrap items-center justify-center gap-2 px-6 py-3 bg-black/60 rounded-full border border-white/20 shadow-lg">
                    <Tag className="w-4 h-4 text-gold" />
                    {taggedMemberNames.map((tag, index) => (
                      <motion.span
                        key={tag.uid}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/80 text-white rounded-full text-xs font-medium border border-primary/50"
                      >
                        {tag.name}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveTag(tag.uid);
                          }}
                          className="hover:bg-primary/30 rounded-full p-0.5 transition-colors"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          title={`Remove ${tag.name} tag`}
                        >
                          <UserX className="w-3 h-3" />
                        </motion.button>
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Enhanced Delete Confirmation Dialog */}
          <ConfirmationDialog
            isOpen={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            onConfirm={handleDelete}
            title="Remove Sacred Memory?"
            description="This beautiful moment will be permanently removed from our pilgrimage gallery. This action cannot be undone and the memory will be lost forever."
            confirmText="Remove Forever"
            cancelText="Keep Memory"
            variant="destructive"
            isLoading={deleteMutation.isPending}
            imageCaption={currentImage.caption}
            imagePreview={currentImage.url}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
