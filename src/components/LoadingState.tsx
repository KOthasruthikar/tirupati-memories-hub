import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingState = ({ message = "Loading...", size = "md" }: LoadingStateProps) => {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-sm" },
    md: { icon: "w-10 h-10", text: "text-base" },
    lg: { icon: "w-16 h-16", text: "text-lg" },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 gap-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={`${sizes[size].icon} text-primary`} />
      </motion.div>
      <p className={`${sizes[size].text} text-muted-foreground`}>{message}</p>
    </motion.div>
  );
};

export default LoadingState;
