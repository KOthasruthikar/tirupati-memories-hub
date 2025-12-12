import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { galleryImages, galleryCategories } from "@/data/seed";
import LazyImage from "@/components/LazyImage";
import Lightbox from "@/components/Lightbox";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter images by category
  const filteredImages = useMemo(() => {
    if (selectedCategory === "All") return galleryImages;
    return galleryImages.filter((img) => img.category === selectedCategory);
  }, [selectedCategory]);

  const lightboxImages = filteredImages.map((img) => ({
    url: img.url,
    caption: img.caption,
  }));

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

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

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {galleryCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border"
              }`}
              aria-label={`Filter by ${category}`}
            >
              {category}
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

        {/* Masonry Gallery Grid */}
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
                aria-label={`View ${image.caption}`}
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
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Overlay with Caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-primary-foreground text-sm font-medium">
                      {image.caption}
                    </p>
                    <span className="text-primary-foreground/70 text-xs">
                      {image.category}
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No photos found in this category.
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="mt-4 text-primary hover:underline"
            >
              View all photos
            </button>
          </div>
        )}
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
