import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Download, FileText, Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { timelineEvents, availableTags, siteMeta, tripStats } from "@/data/seed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Timeline from "@/components/Timeline";
import MapEmbed from "@/components/MapEmbed";
import Lightbox from "@/components/Lightbox";
import { toast } from "@/hooks/use-toast";

const TripDetails = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ url: string; caption?: string }[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const timelineRef = useRef<HTMLDivElement>(null);

  // Filter timeline events
  const filteredEvents = useMemo(() => {
    return timelineEvents.filter((event) => {
      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.time.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        selectedTag === "All" || event.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [searchQuery, selectedTag]);

  // Handle image click in timeline
  const handleImageClick = (images: string[], index: number) => {
    setLightboxImages(images.map((url) => ({ url })));
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  // Generate PDF
  const handleDownloadPDF = async () => {
    if (!timelineRef.current) return;

    setIsGeneratingPDF(true);
    toast({
      title: "Generating PDF",
      description: "Please wait while we create your itinerary...",
    });

    try {
      const element = timelineRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#faf6f1",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.setFontSize(24);
      pdf.setTextColor(139, 69, 19);
      pdf.text(siteMeta.title, 105, 20, { align: "center" });
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Trip Itinerary", 105, 28, { align: "center" });

      position = 35;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - position;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${siteMeta.title.replace(/\s+/g, "_")}_Itinerary.pdf`);

      toast({
        title: "PDF Downloaded!",
        description: "Your trip itinerary has been saved.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const quickStats = [
    { icon: Calendar, value: `${tripStats.daysOfJourney} Days`, label: "Duration" },
    { icon: MapPin, value: tripStats.totalDistance, label: "Distance" },
    { icon: Sparkles, value: tripStats.templeVisits, label: "Temples" },
  ];

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <MapPin className="w-4 h-4" />
            Our Sacred Journey
          </motion.span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Trip <span className="text-gradient">Details</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow our complete journey through the sacred hills of Tirumala
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="flex items-center gap-3 px-5 py-3 bg-card rounded-xl shadow-card border border-border/50"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl p-4 md:p-6 shadow-card border border-border/50 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search timeline..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search timeline"
              />
            </div>

            {/* Tag Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[160px]" aria-label="Filter by tag">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Download PDF */}
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="gap-2"
            >
              {isGeneratingPDF ? (
                <>
                  <FileText className="w-5 h-5 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </Button>
          </div>

          {/* Results count & Tag Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredEvents.length} of {timelineEvents.length} events
            </p>
            {selectedTag !== "All" && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => setSelectedTag("All")}
                className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
              >
                {selectedTag} ×
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Enhanced Timeline Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg"
            >
              <Clock className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                Journey Timeline
              </h2>
              <p className="text-muted-foreground">
                Every moment of our sacred pilgrimage
              </p>
            </div>
          </div>

          <div ref={timelineRef} className="relative">
            <AnimatePresence mode="wait">
              {filteredEvents.length > 0 ? (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative"
                >
                  {/* Timeline Background Pattern */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-saffron/5 rounded-full blur-2xl" />
                  </div>
                  
                  <Timeline events={filteredEvents} onImageClick={handleImageClick} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-20 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 relative overflow-hidden"
                >
                  {/* Empty State Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  
                  <div className="relative z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center"
                    >
                      <Search className="w-10 h-10 text-muted-foreground" />
                    </motion.div>
                    
                    <h3 className="font-heading text-2xl font-semibold text-foreground mb-4">
                      No Events Found
                    </h3>
                    
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                      We couldn't find any events matching your current search criteria.
                    </p>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedTag("All");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
              Our Route
            </h2>
          </div>
          <MapEmbed />
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

export default TripDetails;
