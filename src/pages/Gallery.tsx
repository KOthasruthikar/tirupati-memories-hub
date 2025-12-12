import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useGallery } from "@/hooks/useGallery";
import { useMembers } from "@/hooks/useMembers";
import LazyImage from "@/components/LazyImage";
import Lightbox from "@/components/Lightbox";
import ImageUploadForm from "@/components/ImageUploadForm";

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
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Photo Gallery
          </h1>
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

                  {/* Overlay with Caption & Owner */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {image.caption && (
                        <p className="text-primary-foreground text-sm font-medium mb-1">
                          {image.caption}
                        </p>
                      )}
                      <Link
                        to={`/members/${image.owner_uid}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-primary-foreground/80 text-xs hover:text-primary-foreground"
                      >
                        <span className="px-2 py-0.5 bg-primary/80 rounded text-primary-foreground">
                          UID: {image.owner_uid}
                        </span>
                        <span>by {image.members?.name || "Unknown"}</span>
                      </Link>
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

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-md mx-auto"
        >
          <ImageUploadForm />
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

export default Gallery;
