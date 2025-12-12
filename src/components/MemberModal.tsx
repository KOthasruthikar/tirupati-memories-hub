import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Quote } from "lucide-react";
import { Member } from "@/data/seed";
import LazyImage from "./LazyImage";

interface MemberModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

const MemberModal = ({ member, isOpen, onClose }: MemberModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-modal-title"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10"
              aria-label="Close modal"
            >
              <X size={20} className="text-muted-foreground" />
            </button>

            {/* Header with Photo */}
            <div className="relative h-32 bg-gradient-hero">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-card shadow-lg">
                  <LazyImage
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-16 pb-6 px-6">
              {/* Name & Role */}
              <div className="text-center mb-4">
                <h2 id="member-modal-title" className="font-heading text-2xl font-semibold text-foreground">
                  {member.name}
                </h2>
                <p className="text-primary font-medium">{member.role}</p>
              </div>

              {/* Memory Quote */}
              <div className="relative bg-muted/50 rounded-lg p-4 mb-4">
                <Quote className="absolute -top-2 left-3 w-6 h-6 text-primary/40" />
                <p className="text-muted-foreground italic pl-5">
                  "{member.memory}"
                </p>
              </div>

              {/* Bio */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Mini Gallery */}
              {member.miniGallery && member.miniGallery.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Photos</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {member.miniGallery.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <LazyImage
                          src={photo}
                          alt={`${member.name} - Photo ${index + 1}`}
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemberModal;
