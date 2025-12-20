import { useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Camera, Filter, Grid3X3, List, Search, Download, Heart, Eye, User, Sparkles } from "lucide-react";
import { useGallery } from "@/hooks/useGallery";
import { useMembers } from "@/hooks/useMembers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LazyImage from "@/components/LazyImage";
import Lightbox from "@/components/Lightbox";

const Gallery = () => {
  const { data: galleryImages, isLoading: galleryLoading } = useGallery();
  const { data: members } = useMembers();
  const [selectedMemberUid, setSelectedMemberUid] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"masonry" | "grid">("masonry");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter images by member and search
  const filteredImages = useMemo(() => {
    if (!galleryImages) return [];
    
    let filtered = galleryImages;
    
    // Filter by member
    if (selectedMemberUid !== "All") {
      filtered = filtered.filter((img) => img.owner_uid === selectedMemberUid);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((img) => 
        img.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.members?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [galleryImages, selectedMemberUid, searchQuery]);

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
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">Loading sacred memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gold/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container px-4 relative z-10">
        {/* Enhanced Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            📸
          </motion.div>
          
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <Camera className="w-4 h-4" />
            Sacred Memories
          </motion.span>
          
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Photo <span className="text-gradient">Gallery</span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-gold fill-gold" />
              </motion.div>
            ))}
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Relive the beautiful moments from our sacred pilgrimage to Tirumala
          </p>
        </motion.div>

        {/* Enhanced Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/50 mb-12 max-w-5xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search photos by caption or photographer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background/50 border-border/50"
              />
            </div>

            {/* Member Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={selectedMemberUid} onValueChange={setSelectedMemberUid}>
                <SelectTrigger className="w-[180px] h-12 bg-background/50 border-border/50">
                  <SelectValue placeholder="All Members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Members</SelectItem>
                  {members?.map((member) => (
                    <SelectItem key={member.uid} value={member.uid}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
              <Button
                variant={viewMode === "masonry" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("masonry")}
                className="h-10 w-10 p-0"
                title="Masonry View"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-10 w-10 p-0"
                title="Grid View"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filteredImages.length}</span> of {galleryImages?.length || 0} photos
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" />
                <span>Click to view full size</span>
              </div>
            </div>
            
            {(searchQuery || selectedMemberUid !== "All") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedMemberUid("All");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Enhanced Gallery Display */}
        {filteredImages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={viewMode === "masonry" ? "masonry-grid" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={viewMode === "masonry" ? "masonry-item" : ""}
              >
                <button
                  onClick={() => openLightbox(index)}
                  className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-border/50 group focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Enhanced Photographer Badge */}
                  <Link
                    to={`/members/${image.owner_uid}`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 left-3 z-20 flex items-center gap-2 px-3 py-2 bg-card/95 backdrop-blur-md rounded-full border border-border/50 shadow-lg hover:bg-card hover:scale-105 transition-all duration-300"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold text-white">
                        {image.members?.name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {image.members?.name || "Unknown"}
                    </span>
                  </Link>

                  {/* Like Button */}
                  <motion.button
                    className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-card/95 backdrop-blur-md border border-border/50 flex items-center justify-center shadow-lg hover:bg-card transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500 transition-colors" />
                  </motion.button>

                  {/* Image Container */}
                  <div
                    className="relative"
                    style={{
                      paddingBottom: viewMode === "masonry" 
                        ? `${index % 3 === 0 ? "120%" : index % 3 === 1 ? "100%" : "80%"}`
                        : "100%",
                    }}
                  >
                    <div className="absolute inset-0">
                      <LazyImage
                        src={image.src}
                        alt={image.caption || "Gallery image"}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Enhanced Caption Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="bg-card/95 backdrop-blur-md rounded-xl p-3 border border-border/50">
                      {image.caption ? (
                        <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                          {image.caption}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No caption
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Click to view full size</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-primary/20 transition-all duration-300" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Enhanced Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
              <Camera className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
              No Photos Found
            </h3>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              {searchQuery || selectedMemberUid !== "All" 
                ? "Try adjusting your search or filter criteria"
                : "No photos have been uploaded yet. Be the first to share your memories!"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(searchQuery || selectedMemberUid !== "All") && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMemberUid("All");
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              )}
              <Button asChild>
                <Link to="/upload" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Upload Photos
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced Floating Upload Button */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Link
          to="/upload"
          className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 group"
          title="Upload photos"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
          
          {/* Pulse Ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
        </Link>
      </motion.div>

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
