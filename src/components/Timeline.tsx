import { useState } from "react";
import { motion } from "framer-motion";
import TimelineItem from "./TimelineItem";
import { TimelineEvent } from "@/data/seed";

interface TimelineProps {
  events: TimelineEvent[];
  onImageClick: (images: string[], index: number) => void;
}

const Timeline = ({ events, onImageClick }: TimelineProps) => {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-gold to-primary/30" />

      {/* Timeline Events */}
      <div className="space-y-8">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TimelineItem 
              event={event} 
              index={index}
              onImageClick={onImageClick}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
