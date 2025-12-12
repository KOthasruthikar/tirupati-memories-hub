import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Quote, ChevronRight } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import LazyImage from "@/components/LazyImage";

const Members = () => {
  const { data: members, isLoading, error } = useMembers();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <div className="container px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Error Loading Members
          </h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Pilgrims
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the wonderful people who made this journey special
          </p>
        </motion.div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {members?.map((member, index) => (
            <motion.div
              key={member.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/members/${member.uid}`}
                className="block w-full text-left bg-card rounded-xl p-5 shadow-card border border-border/50 card-hover focus:outline-none focus:ring-2 focus:ring-primary/50 hover:-translate-y-1 transition-transform"
              >
                {/* UID Badge */}
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-mono rounded">
                    UID: {member.uid}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>

                {/* Photo */}
                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/20">
                  {member.profile_image && member.profile_image !== "/placeholder.svg" ? (
                    <LazyImage
                      src={member.profile_image}
                      alt={member.name}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <User className="w-10 h-10 text-muted-foreground" />
                    </div>
                  )}
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
                  Click to view profile →
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 py-12 px-6 bg-gradient-card rounded-2xl border border-border/50"
        >
          <span className="text-4xl mb-4 block">🙏</span>
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
            Thank You for Being Part of This Journey
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Each member brought their own unique energy and devotion, making this
            pilgrimage an unforgettable experience for everyone.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Members;
