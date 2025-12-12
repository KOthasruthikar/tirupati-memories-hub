import { motion } from "framer-motion";
import { Clock, Tag } from "lucide-react";
import { TimelineEvent } from "@/data/seed";
import LazyImage from "./LazyImage";

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  onImageClick: (images: string[], index: number) => void;
}

const TimelineItem = ({ event, index, onImageClick }: TimelineItemProps) => {
  return (
    <div className="relative pl-12 md:pl-20">
      {/* Timeline Dot */}
      <div className="absolute left-2 md:left-6 top-2 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-glow" />

      {/* Content Card */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-card rounded-xl p-5 md:p-6 shadow-card border border-border/50 card-hover"
      >
        {/* Time Label */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-medium">{event.time}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* Images */}
        {event.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {event.images.map((image, imgIndex) => (
              <button
                key={imgIndex}
                onClick={() => onImageClick(event.images, imgIndex)}
                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                aria-label={`View image ${imgIndex + 1} of ${event.title}`}
              >
                <LazyImage
                  src={image}
                  alt={`${event.title} - Image ${imgIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors" />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TimelineItem;
