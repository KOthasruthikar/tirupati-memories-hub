import { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { timelineEvents, availableTags, siteMeta } from "@/data/seed";
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

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add title
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
            Trip Details
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow our complete journey through the sacred hills of Tirumala
          </p>
        </motion.div>

        {/* Filters & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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

          {/* Results count */}
          <p className="text-sm text-muted-foreground mt-4">
            Showing {filteredEvents.length} of {timelineEvents.length} events
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
          ref={timelineRef}
        >
          {filteredEvents.length > 0 ? (
            <Timeline events={filteredEvents} onImageClick={handleImageClick} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No events found matching your search.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </motion.div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-6">
            Our Route
          </h2>
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
