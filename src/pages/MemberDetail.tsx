import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Quote } from "lucide-react";
import { useMember, useMemberGallery, useMemberTaggedImages } from "@/hooks/useMembers";
import LazyImage from "@/components/LazyImage";
import Lightbox from "@/components/Lightbox";

const MemberDetail = () => {
  const { uid } = useParams<{ uid: string }>();
  const { data: member, isLoading, error } = useMember(uid || "");
  const { data: ownedImages } = useMemberGallery(uid || "");
  const { data: taggedImages } = useMemberTaggedImages(uid || "");
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combine owned and tagged images, removing duplicates
  const allImages = [...(ownedImages || [])];
  const ownedIds = new Set(allImages.map(img => img.id));
  taggedImages?.forEach(img => {
    if (!ownedIds.has(img.id)) {
      allImages.push(img);
    }
  });

  const lightboxImages = allImages.map((img) => ({
    url: img.src,
    caption: img.caption || "",
  }));

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen py-12">
        <div className="container px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            Member Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            No member found with UID: {uid}
          </p>
          <Link
            to="/members"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container px-4 max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/members"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </Link>

        {/* Member Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border/50 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto md:mx-0 rounded-full overflow-hidden ring-4 ring-primary/20 flex-shrink-0">
              {member.profile_image && member.profile_image !== "/placeholder.svg" ? (
                <LazyImage
                  src={member.profile_image}
                  alt={member.name}
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <User className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-mono rounded-full">
                  UID: {member.uid}
                </span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                {member.name}
              </h1>
              <p className="text-lg text-primary font-medium mb-4">{member.role}</p>
              
              {/* Memory Quote */}
              <div className="relative bg-muted/50 rounded-xl p-4 mb-4">
                <Quote className="absolute -top-2 left-4 w-6 h-6 text-primary/40" />
                <p className="text-muted-foreground italic pl-6">
                  "{member.memory}"
                </p>
              </div>

              {/* Bio */}
              <p className="text-foreground leading-relaxed">
                {member.bio}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Member's Gallery - Owned + Tagged Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
            {member.name}'s Photos ({allImages.length})
          </h2>

          {allImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square rounded-xl overflow-hidden shadow-card group focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <LazyImage
                    src={image.src}
                    alt={image.caption || "Gallery image"}
                    className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  {image.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-primary-foreground text-sm">
                          {image.caption}
                        </p>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/30 rounded-xl">
              <p className="text-muted-foreground">No photos available</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() =>
          setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length)
        }
        onPrev={() =>
          setCurrentImageIndex(
            (prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length
          )
        }
      />
    </div>
  );
};

export default MemberDetail;
