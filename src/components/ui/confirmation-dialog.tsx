import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "./button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  isLoading?: boolean;
  imageCaption?: string;
  imagePreview?: string;
}

export const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading = false,
  imageCaption,
  imagePreview,
}: ConfirmationDialogProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop with blur effect */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Floating particles for spiritual effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gold/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-card/95 backdrop-blur-md rounded-3xl shadow-2xl border border-border/50 p-8 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-primary/10 to-transparent rounded-tr-3xl" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Icon and animations */}
            <div className="text-center mb-6">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: variant === "destructive" ? [0, -5, 5, 0] : [0, 360],
                }}
                transition={{ 
                  duration: variant === "destructive" ? 0.5 : 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  variant === "destructive" 
                    ? "bg-destructive/10 text-destructive" 
                    : "bg-primary/10 text-primary"
                }`}
              >
                {variant === "destructive" ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-10 h-10" />
                  </motion.div>
                ) : (
                  <Sparkles className="w-10 h-10" />
                )}
              </motion.div>

              {/* Orbiting elements for extra flair */}
              {variant !== "destructive" && (
                <div className="relative">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-2 h-2"
                      animate={{
                        rotate: [0, 360],
                        x: Math.cos(i * 90 * Math.PI / 180) * 40,
                        y: Math.sin(i * 90 * Math.PI / 180) * 40,
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.2,
                      }}
                    >
                      <div className="w-2 h-2 bg-gold/40 rounded-full" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <motion.h2 
                className="font-heading text-2xl font-bold text-foreground mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h2>
              
              <motion.p 
                className="text-muted-foreground leading-relaxed mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {description}
              </motion.p>

              {/* Image Preview and Caption */}
              {(imagePreview || imageCaption) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted/30 rounded-2xl p-4 border border-border/30"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Sacred Memory Details</span>
                  </div>
                  
                  {imagePreview && (
                    <div className="mb-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg border border-border/50"
                      />
                    </div>
                  )}
                  
                  {imageCaption ? (
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground mb-1">Caption:</p>
                      <p className="text-sm text-muted-foreground italic bg-background/50 p-3 rounded-lg border border-border/30">
                        "{imageCaption}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No caption provided for this sacred memory
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex gap-3 justify-end"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="px-6"
              >
                {cancelText}
              </Button>
              
              <Button
                variant={variant}
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-6 gap-2 ${
                  variant === "destructive" 
                    ? "bg-destructive hover:bg-destructive/90" 
                    : ""
                }`}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : variant === "destructive" ? (
                  <Trash2 className="w-4 h-4" />
                ) : null}
                {confirmText}
              </Button>
            </motion.div>

            {/* Subtle glow effect */}
            <div className={`absolute inset-0 rounded-3xl pointer-events-none ${
              variant === "destructive" 
                ? "shadow-[0_0_50px_rgba(239,68,68,0.1)]" 
                : "shadow-[0_0_50px_rgba(255,215,0,0.1)]"
            }`} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};