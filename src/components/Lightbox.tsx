import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: { url: string; caption?: string }[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }: LightboxProps) => {
  const currentImage = images[currentIndex];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case "Escape":
        onClose();
        break;
      case "ArrowRight":
        onNext();
        break;
      case "ArrowLeft":
        onPrev();
        break;
    }
  }, [isOpen, onClose, onNext, onPrev]);

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
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

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
