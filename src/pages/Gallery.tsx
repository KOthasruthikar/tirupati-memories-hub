import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Camera, Filter, Grid3X3, List, Search, Heart, Eye, Sparkles } from "lucide-react";
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
  const [selectedMemberUid, setSelectedMemberUid] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"masonry" | "grid">("masonry");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: galleryImages, isLoading: galleryLoading } = useGallery();
  const { data: members } = useMembers();

  const isLoading = galleryLoading;

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-20 h-20 border-4 border-primary/30 border-t-primary border-r-primary rounded-full mx-auto mb-6 relative"
          >
            <Camera className="w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xl font-medium text-muted-foreground"
          >
            Loading sacred memories...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Glassmorphism Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main glassmorphism backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-primary/[0.01] to-gold/[0.02] backdrop-blur-[0.5px]" />
        
        {/* Glassmorphism floating panels */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`glass-${i}`}
            className="absolute rounded-3xl bg-white/[0.03] backdrop-blur-md border border-white/[0.05] shadow-2xl"
            style={{
              width: `${150 + i * 30}px`,
              height: `${100 + i * 20}px`,
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-gold/30 to-primary/30 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-100, window.innerHeight],
              x: [0, Math.sin(i) * 100],
              rotate: [0, 360],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}

        {/* Floating gradient orbs with glassmorphism */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-[300px] h-[300px] rounded-full blur-3xl opacity-10 bg-white/[0.02] backdrop-blur-sm border border-white/[0.02]"
            style={{
              background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)'}, transparent)`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container px-4 relative z-10">
        {/* Enhanced Page Header with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16 relative"
        >
          {/* Glassmorphism backdrop for header */}
          <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-2xl -m-8 -z-10" />
          
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              scale: { duration: 4, repeat: Infinity },
              rotate: { duration: 6, repeat: Infinity },
              y: { duration: 3, repeat: Infinity }
            }}
            className="text-7xl mb-6 inline-block filter drop-shadow-2xl"
          >
            <span className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">📸</span>
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8 rounded-full shadow-lg backdrop-blur-sm"
          />

          <motion.span 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.08] backdrop-blur-xl text-primary text-sm font-medium rounded-full mb-6 border border-white/[0.15] shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 fill-primary animate-pulse" />
            Sacred Memories Collection
            <Sparkles className="w-4 h-4 fill-primary animate-pulse" />
          </motion.span>
          
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight drop-shadow-2xl">
            Divine <span className="text-gradient bg-gradient-to-r from-primary via-gold to-primary animate-gradient-x">Moments</span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light drop-shadow-sm"
          >
            A visual journey through our sacred pilgrimage to Tirumala
          </motion.p>
        </motion.div>

        {/* Enhanced Search & Filter Section with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.05] backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/[0.1] mb-12 max-w-6xl mx-auto relative overflow-hidden"
        >
          {/* Inner glassmorphism glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-gold/[0.03] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
              {/* Search with glassmorphism */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search photos by caption or photographer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.05] backdrop-blur-xl border-white/[0.1] shadow-inner hover:bg-white/[0.08] transition-all"
                />
              </div>

              {/* Member Filter with glassmorphism */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <Select value={selectedMemberUid} onValueChange={setSelectedMemberUid}>
                  <SelectTrigger className="w-[200px] h-12 bg-white/[0.05] backdrop-blur-xl border-white/[0.1] hover:bg-white/[0.08] transition-all">
                    <SelectValue placeholder="All Members" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-2xl border-white/[0.1]">
                    <SelectItem value="All">All Members</SelectItem>
                    {members?.map((member) => (
                      <SelectItem key={member.uid} value={member.uid}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center shadow-lg">
                            <span className="text-xs font-bold text-white">
                              {member.name?.charAt(0)}
                            </span>
                          </div>
                          <span>{member.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle with glassmorphism */}
              <div className="flex items-center gap-1 p-1 bg-white/[0.05] backdrop-blur-xl rounded-xl border border-white/[0.08] shadow-lg">
                <Button
                  variant={viewMode === "masonry" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("masonry")}
                  className="h-10 w-10 p-0 hover:bg-white/[0.1] transition-all"
                  title="Masonry View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10 p-0 hover:bg-white/[0.1] transition-all"
                  title="Grid View"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results Summary with glassmorphism divider */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-bold text-foreground">{filteredImages.length}</span> of{" "}
                  <span className="font-medium">{galleryImages?.length || 0}</span> photos
                </p>
              </div>
              
              {(searchQuery || selectedMemberUid !== "All") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMemberUid("All");
                  }}
                  className="text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all"
                >
                  Clear Filters
                </Button>
              )}
            </div>
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
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  delay: index * 0.05, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100 
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                className={viewMode === "masonry" ? "masonry-item" : ""}
              >
                <button
                  onClick={() => openLightbox(index)}
                  className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/[0.1] group focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all duration-300 hover:shadow-3xl active:scale-95 bg-white/[0.02] backdrop-blur-sm"
                >
                  {/* Enhanced Photographer Badge with Glassmorphism */}
                  <Link
                    to={`/members/${image.owner_uid}`}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 bg-white/[0.08] backdrop-blur-2xl rounded-full border border-white/[0.15] shadow-2xl hover:bg-white/[0.12] hover:scale-105 transition-all duration-300 hover:shadow-3xl group/badge"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center shadow-lg backdrop-blur-sm"
                    >
                      <span className="text-xs font-bold text-white drop-shadow-sm">
                        {image.members?.name?.charAt(0) || "?"}
                      </span>
                    </motion.div>
                    <span className="text-xs font-semibold text-foreground drop-shadow-sm">
                      {image.members?.name || "Unknown"}
                    </span>
                  </Link>

                  {/* Like Button with Glassmorphism */}
                  <motion.button
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group/like hover:bg-white/[0.12]"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="w-5 h-5 text-muted-foreground group-hover/like:text-red-500 transition-colors drop-shadow-sm" />
                  </motion.button>

                  {/* Image Container */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      paddingBottom: viewMode === "masonry" 
                        ? `${index % 4 === 0 ? "120%" : index % 4 === 1 ? "100%" : index % 4 === 2 ? "80%" : "140%"}`
                        : "100%",
                    }}
                  >
                    <div className="absolute inset-0">
                      <LazyImage
                        src={image.src}
                        alt={image.caption || "Gallery image"}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </div>
                  </div>

                  {/* Enhanced Caption Overlay with Glassmorphism */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="bg-black/20 backdrop-blur-2xl rounded-2xl p-4 border border-white/[0.1] shadow-2xl">
                      {image.caption ? (
                        <p className="text-sm font-semibold text-white mb-2 line-clamp-2 drop-shadow-lg">
                          {image.caption}
                        </p>
                      ) : (
                        <p className="text-sm text-white/70 italic mb-2 drop-shadow-sm">
                          No caption provided
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-white/80">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 drop-shadow-sm">
                            <Eye className="w-3 h-3" />
                            Click to view
                          </span>
                        </div>
                        <motion.span 
                          className="flex items-center gap-1 text-white/90 font-medium drop-shadow-sm"
                          whileHover={{ gap: 4 }}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-4 ring-primary/30 transition-all duration-500" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Enhanced Empty State with Glassmorphism */
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 relative"
          >
            {/* Glassmorphism backdrop for empty state */}
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.05] shadow-2xl -m-8" />
            
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
                className="w-40 h-40 mx-auto mb-8 rounded-full bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] flex items-center justify-center shadow-2xl"
              >
                <Camera className="w-20 h-20 text-muted-foreground drop-shadow-lg" />
              </motion.div>
              
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-heading text-3xl font-bold text-foreground mb-4 drop-shadow-sm"
              >
                No Photos Found
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground text-lg mb-8 max-w-md mx-auto drop-shadow-sm"
              >
                {searchQuery || selectedMemberUid !== "All" 
                  ? "No photos match your current filters. Try adjusting your search criteria."
                  : "The gallery is empty. Be the first to share your sacred memories!"
                }
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {(searchQuery || selectedMemberUid !== "All") && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedMemberUid("All");
                      }}
                      variant="outline"
                      className="gap-2 bg-white/[0.05] backdrop-blur-xl border-white/[0.1] hover:bg-white/[0.08] transition-all"
                    >
                      Clear Filters
                    </Button>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild className="gap-2 bg-white/[0.08] backdrop-blur-xl border-white/[0.1] hover:bg-white/[0.12] transition-all shadow-lg">
                    <Link to="/upload">
                      <Plus className="w-4 h-4" />
                      Upload Your First Photo
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Enhanced Floating Upload Button with Glassmorphism */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <Link
          to="/upload"
          className="flex items-center justify-center w-16 h-16 bg-white/[0.08] backdrop-blur-2xl border border-white/[0.15] text-primary rounded-full shadow-2xl hover:shadow-primary/30 transition-all duration-300 group/upload relative hover:bg-white/[0.12]"
          title="Upload photos"
        >
          {/* Glassmorphism rotating border */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-transparent backdrop-blur-sm"
          />
          
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-gold/10 blur-xl" />
          
          <motion.div
            whileHover={{ scale: 1.1, rotate: 90 }}
            transition={{ type: "spring" }}
            className="relative z-10"
          >
            <Plus className="w-8 h-8 drop-shadow-lg" />
          </motion.div>
          
          {/* Enhanced pulse effect with glassmorphism */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
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