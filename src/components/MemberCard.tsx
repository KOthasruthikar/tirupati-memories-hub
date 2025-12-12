import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Member } from "@/data/seed";
import LazyImage from "./LazyImage";

interface MemberCardProps {
  member: Member;
  onClick: () => void;
}

const MemberCard = ({ member, onClick }: MemberCardProps) => {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left bg-card rounded-xl p-5 shadow-card border border-border/50 card-hover focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label={`View details for ${member.name}`}
    >
      {/* Photo */}
      <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/20">
        <LazyImage
          src={member.photo}
          alt={member.name}
          className="w-full h-full"
        />
      </div>

      {/* Name & Role */}
      <div className="text-center mb-3">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {member.name}
        </h3>
        <p className="text-sm text-primary font-medium">{member.role}</p>
      </div>

      {/* Memory Quote */}
      <div className="relative bg-muted/50 rounded-lg p-3">
        <Quote className="absolute -top-2 left-2 w-5 h-5 text-primary/40" />
        <p className="text-sm text-muted-foreground italic line-clamp-2 pl-4">
          "{member.memory}"
        </p>
      </div>

      {/* Click Hint */}
      <p className="text-xs text-center text-muted-foreground mt-3">
        Click to read more
      </p>
    </motion.button>
  );
};

export default MemberCard;
