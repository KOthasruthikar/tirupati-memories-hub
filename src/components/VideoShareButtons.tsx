import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, Facebook, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoShareButtonsProps {
  videoId: string;
  title?: string;
}

const VideoShareButtons = ({ videoId, title = "Check out this video" }: VideoShareButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoUrl = `${window.location.origin}/testimonials?video=${videoId}`;
  const encodedUrl = encodeURIComponent(videoUrl);
  const encodedTitle = encodeURIComponent(title);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-green-500/20 hover:text-green-500",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-blue-600/20 hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-sky-500/20 hover:text-sky-500",
    },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full"
      >
        <Share2 className="w-4 h-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px]"
          >
            <div className="space-y-2">
              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>

              <div className="border-t border-border my-2" />

              {shareLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${link.color}`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoShareButtons;
