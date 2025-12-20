import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import TimelineItem from "./TimelineItem";
import { TimelineEvent } from "@/data/seed";

interface TimelineProps {
  events: TimelineEvent[];
  onImageClick: (images: string[], index: number) => void;
}

const Timeline = ({ events, onImageClick }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to timeline line height
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Create floating particles animation
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    duration: 3 + Math.random() * 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-gold/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Enhanced Timeline Line with Scroll Animation */}
      <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-border/30">
        <motion.div
          className="w-full bg-gradient-to-b from-primary via-gold to-saffron shadow-lg"
          style={{ height: lineHeight }}
          initial={{ height: "0%" }}
        />
        
        {/* Animated glow effect */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary/30 rounded-full blur-sm"
          style={{ y: useTransform(lineHeight, (latest) => `${parseFloat(latest)}%`) }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Timeline Events with Staggered Animations */}
      <div className="space-y-8">
        {events.map((event, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <motion.div
              key={event.id}
              initial={{ 
                opacity: 0, 
                x: isEven ? -50 : 50,
                rotateY: isEven ? -15 : 15,
                scale: 0.9
              }}
              whileInView={{ 
                opacity: 1, 
                x: 0,
                rotateY: 0,
                scale: 1
              }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="relative"
            >
              {/* Connecting Line Animation */}
              <motion.div
                className="absolute left-4 md:left-6 top-6 w-8 h-px bg-gradient-to-r from-primary/50 to-transparent"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: 32, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
              />
              
              <TimelineItem 
                event={event} 
                index={index}
                onImageClick={onImageClick}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Timeline End Marker */}
      <motion.div
        className="absolute left-3 md:left-5 bottom-0 flex items-center justify-center"
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ 
          delay: events.length * 0.1,
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary via-gold to-saffron shadow-lg border-2 border-background">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed right-8 top-1/2 -translate-y-1/2 w-1 h-32 bg-border/20 rounded-full overflow-hidden z-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="w-full bg-gradient-to-b from-primary to-gold"
          style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
        />
      </motion.div>
    </div>
  );
};

export default Timeline;
