import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, Tag, Camera, ChevronRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import { TimelineEvent } from "@/data/seed";
import LazyImage from "./LazyImage";

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  onImageClick: (images: string[], index: number) => void;
}

const TimelineItem = ({ event, index, onImageClick }: TimelineItemProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Parallax effect for the card
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const isEven = index % 2 === 0;

  return (
    <div ref={cardRef} className="relative pl-12 md:pl-16">
      {/* Enhanced Timeline Marker with Pulse Animation */}
      <motion.div 
        className="absolute left-2 md:left-4 top-6 w-5 h-5 rounded-full bg-gradient-to-br from-primary via-gold to-saffron border-3 border-background shadow-xl z-20"
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20,
          delay: index * 0.1
        }}
        whileHover={{ 
          scale: 1.4,
          rotate: 180,
          boxShadow: "0 0 20px rgba(255, 215, 0, 0.5)"
        }}
      >
        {/* Inner glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Sparkle effect */}
        <motion.div
          className="absolute -top-1 -right-1 text-xs"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Modern Card with Advanced Animations */}
      <motion.div
        style={{ y, opacity }}
        initial={{ 
          opacity: 0, 
          y: 30,
          rotateX: isEven ? -10 : 10,
          scale: 0.95
        }}
        whileInView={{ 
          opacity: 1, 
          y: 0,
          rotateX: 0,
          scale: 1
        }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }}
        whileHover={{ 
          y: -8,
          scale: 1.02,
          rotateX: 2,
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
        }}
        className="relative bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/50 overflow-hidden group cursor-pointer"
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-6 h-6 text-gold" />
          </motion.div>
        </div>

        <div className="relative z-10">
          {/* Enhanced Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Animated Time Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary/10 via-gold/10 to-primary/10 rounded-full text-xs text-foreground mb-3 border border-primary/20"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-3 h-3 text-primary" />
                </motion.div>
                <span className="font-medium">{event.time}</span>
              </motion.div>
              
              {/* Enhanced Title */}
              <motion.h3 
                className="text-xl font-heading font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300"
                whileHover={{ x: 4 }}
              >
                {event.title}
              </motion.h3>
            </div>

            {/* Enhanced Image Count Badge */}
            {event.images.length > 0 && (
              <motion.div 
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary/15 to-gold/15 rounded-full text-xs text-primary border border-primary/20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Camera className="w-3 h-3" />
                </motion.div>
                <span className="font-semibold">{event.images.length}</span>
              </motion.div>
            )}
          </div>

          {/* Enhanced Description */}
          <motion.p 
            className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3"
            initial={{ opacity: 0.8 }}
            whileHover={{ opacity: 1 }}
          >
            {event.description}
          </motion.p>

          {/* Enhanced Bottom Section */}
          <div className="flex items-center justify-between">
            {/* Animated Tags */}
            <div className="flex flex-wrap gap-2">
              {event.tags.slice(0, 2).map((tag, tagIndex) => (
                <motion.span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-secondary/60 to-secondary/40 text-secondary-foreground border border-secondary/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: tagIndex * 0.1 }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </motion.span>
              ))}
              {event.tags.length > 2 && (
                <motion.span 
                  className="text-xs text-muted-foreground px-2 py-1"
                  whileHover={{ scale: 1.1 }}
                >
                  +{event.tags.length - 2} more
                </motion.span>
              )}
            </div>

            {/* Enhanced Images Preview */}
            {event.images.length > 0 && (
              <div className="flex items-center gap-1.5">
                {event.images.slice(0, 3).map((image, imgIndex) => (
                  <motion.button
                    key={imgIndex}
                    onClick={() => onImageClick(event.images, imgIndex)}
                    className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-colors shadow-md"
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: imgIndex * 0.1 }}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: imgIndex % 2 === 0 ? 5 : -5,
                      zIndex: 10,
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`View image ${imgIndex + 1}`}
                  >
                    <LazyImage
                      src={image}
                      alt={`${event.title} - Thumbnail ${imgIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                    
                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
                
                {event.images.length > 3 && (
                  <motion.button
                    onClick={() => onImageClick(event.images, 0)}
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-muted/60 to-muted/40 border-2 border-border/50 flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    +{event.images.length - 3}
                  </motion.button>
                )}
                
                {/* Enhanced View All Arrow */}
                <motion.button
                  onClick={() => onImageClick(event.images, 0)}
                  className="ml-2 p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ x: 4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="View all images"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Corner Accent with Animation */}
        <motion.div
          className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-2xl"
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.3 }}
        />
      </motion.div>
    </div>
  );
};

export default TimelineItem;
