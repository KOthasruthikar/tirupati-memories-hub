import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useGallery } from "@/hooks/useGallery";
import { useMembers } from "@/hooks/useMembers";
import LazyImage from "@/components/LazyImage";
import Lightbox from "@/components/Lightbox";

const Gallery = () => {
  const { data: galleryImages, isLoading: galleryLoading } = useGallery();
  const { data: members } = useMembers();
  const [selectedMemberUid, setSelectedMemberUid] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter images by member
  const filteredImages = useMemo(() => {
    if (!galleryImages) return [];
    if (selectedMemberUid === "All") return galleryImages;
    return galleryImages.filter((img) => img.owner_uid === selectedMemberUid);
  }, [galleryImages, selectedMemberUid]);

  const lightboxImages = filteredImages.map((img) => ({
    url: img.src,
    caption: `${img.caption || "Photo"} - by ${img.members?.name || "Unknown"} (UID: ${img.owner_uid})`,
    id: img.id,
    ownerUid: img.owner_uid,
  }));

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  if (galleryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
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
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Sacred Memories
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            <span className="text-gradient">Photo</span> Gallery
          </h1>
          <div className="divider-ornament max-w-md mx-auto mb-4">
            <span className="text-gold text-2xl">✦</span>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Relive the beautiful moments from our pilgrimage to Tirumala
          </p>
        </motion.div>

        {/* Member Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          <button
            onClick={() => setSelectedMemberUid("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedMemberUid === "All"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
            }`}
          >
            All Members
          </button>
          {members?.map((member) => (
            <button
              key={member.uid}
              onClick={() => setSelectedMemberUid(member.uid)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedMemberUid === member.uid
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }`}
            >
              {member.name} ({member.uid})
            </button>
          ))}
        </motion.div>

        {/* Image Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground mb-6"
        >
          {filteredImages.length} photos
        </motion.p>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="masonry-grid"
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="masonry-item"
              >
                <button
                  onClick={() => openLightbox(index)}
                  className="relative w-full rounded-xl overflow-hidden shadow-card card-hover group focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {/* Uploader Badge - Always Visible */}
                  <Link
                    to={`/members/${image.owner_uid}`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1.5 bg-card/90 backdrop-blur-sm rounded-full border border-border/50 shadow-soft hover:bg-card transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-gold flex items-center justify-center">
                      <span className="text-xs font-bold text-foreground">
                        {image.members?.name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {image.members?.name || "Unknown"}
                    </span>
                  </Link>

                  <div
                    className="relative"
                    style={{
                      paddingBottom: `${
                        index % 3 === 0 ? "120%" : index % 3 === 1 ? "100%" : "80%"
                      }`,
                    }}
                  >
                    <div className="absolute inset-0">
                      <LazyImage
                        src={image.src}
                        alt={image.caption || "Gallery image"}
                        className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Hover Overlay with Caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {image.caption && (
                        <p className="text-primary-foreground text-sm font-medium line-clamp-2">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No photos uploaded yet
            </p>
          </div>
        )}
      </div>

      {/* Floating Upload Button */}
      <Link
        to="/upload"
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-glow hover:bg-primary/90 hover:scale-110 transition-all duration-300 btn-glow"
        title="Upload photo"
      >
        <Plus className="w-7 h-7" />
      </Link>

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

export default Gallery;
