import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Train, Navigation, Clock, Route, Play, Pause, Sparkles, Calendar, ArrowRight } from "lucide-react";
import { mapConfig, routeStops } from "@/data/seed";
import { Button } from "@/components/ui/button";

const TripMap: React.FC = () => {
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [selectedStop, setSelectedStop] = useState<number | null>(null);
  const [currentAutoStop, setCurrentAutoStop] = useState(0);

  // Group stops by day
  const stopsByDay = routeStops.reduce((acc, stop, index) => {
    const day = stop.day;
    if (!acc[day]) acc[day] = [];
    acc[day].push({ ...stop, index });
    return acc;
  }, {} as Record<string, Array<typeof routeStops[0] & { index: number }>>);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentAutoStop((prev) => (prev + 1) % routeStops.length);
        setSelectedStop((prev) => (prev === null ? 0 : (prev + 1) % routeStops.length));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    if (!isAutoPlaying) {
      setSelectedStop(0);
      setCurrentAutoStop(0);
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-gold/20 rounded-full"
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
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Floating route icons */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`icon-${i}`}
            className="absolute text-2xl opacity-10"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {["🗺️", "🚌", "⛰️", "🛕", "🚉", "🏠", "🌊", "👣"][i]}
          </motion.div>
        ))}

        {/* Gradient orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-primary/5 to-gold/5 blur-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [-50, 50, -50],
              y: [-30, 30, -30],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container px-4 max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
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
            🗺️
          </motion.div>
          
          <motion.span 
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6 backdrop-blur-sm"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <Route className="w-4 h-4" />
            Sacred Journey Route
          </motion.span>
          
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Pilgrimage <span className="text-gradient">Map</span>
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
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Follow our complete sacred pilgrimage from Hyderabad to Tirumala and back, visiting all the divine destinations
          </p>
        </motion.div>

        {/* Stats & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-card rounded-xl p-4 text-center border border-border/50 shadow-card">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{routeStops.length}</div>
            <div className="text-sm text-muted-foreground">Stops</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border/50 shadow-card">
            <Train className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{mapConfig.totalDistance}</div>
            <div className="text-sm text-muted-foreground">Distance</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border/50 shadow-card">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{mapConfig.totalDuration}</div>
            <div className="text-sm text-muted-foreground">Duration</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border/50 shadow-card">
            <Button
              onClick={toggleAutoPlay}
              variant={isAutoPlaying ? "default" : "outline"}
              size="sm"
              className="w-full"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Tour
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Auto Tour
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Enhanced Map Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 mb-8"
        >
          {/* Alternative: Static Map Image as backup */}
          <div className="hidden">
            <img 
              src="https://maps.googleapis.com/maps/api/staticmap?size=800x400&path=color:0xff6b35|weight:5|Charlapalli,Hyderabad|Tirupati|Tirumala|Vijayawada|Hyderabad&markers=color:red|Charlapalli,Hyderabad&markers=color:red|Tirupati&markers=color:red|Tirumala&markers=color:red|Vijayawada&key=YOUR_API_KEY"
              alt="Trip Route Map"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Map Header */}
          <div className="bg-gradient-to-r from-primary/10 to-gold/10 p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">
                    Interactive Route Map
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete pilgrimage journey with all sacred stops
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-green-500"
                />
                <span className="text-sm text-muted-foreground">Live Route</span>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative">
            <div className="aspect-video w-full">
              <iframe
                src={mapConfig.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Trip Route Map"
                className="w-full h-full rounded-lg"
              />
            </div>
            
            {/* Floating overlay elements */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Sacred Route Active</span>
              </div>
            </div>
          </div>

          {/* Map Footer */}
          <div className="p-4 bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Navigation className="w-4 h-4" />
                <span className="text-sm">
                  Charlapally → Tirupati → Tirumala → Vijayawada → Hyderabad
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://www.google.com/maps/dir/Cherlapalli,+Hyderabad,+Telangana/Tirupati,+Andhra+Pradesh/Tirumala,+Andhra+Pradesh/Vijayawada,+Andhra+Pradesh", "_blank")}
                  className="flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Google Maps
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText("https://www.google.com/maps/dir/Cherlapalli,+Hyderabad,+Telangana/Tirupati,+Andhra+Pradesh/Tirumala,+Andhra+Pradesh/Vijayawada,+Andhra+Pradesh");
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Share Route
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Route Timeline - Day-wise Grouping */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-semibold text-foreground flex items-center gap-2">
              <Route className="w-6 h-6 text-primary" />
              Route Stops
            </h2>
            {selectedStop !== null && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full"
              >
                <ArrowRight className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Stop {selectedStop + 1} of {routeStops.length}
                </span>
              </motion.div>
            )}
          </div>

          <div className="space-y-8">
            {Object.entries(stopsByDay).map(([day, stops]) => (
              <div key={day} className="relative">
                {/* Day Header */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 mb-4"
                >
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {day}
                  </h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                </motion.div>

                {/* Stops for this day */}
                <div className="relative pl-4">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-gold to-primary/30" />

                  <div className="space-y-4">
                    {stops.map((stop) => {
                      const isSelected = selectedStop === stop.index;
                      const isAutoHighlighted = isAutoPlaying && currentAutoStop === stop.index;
                      
                      return (
                        <motion.div
                          key={stop.index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: stop.index * 0.03 }}
                          className="relative flex items-start gap-4 pl-2"
                          onClick={() => setSelectedStop(stop.index)}
                        >
                          {/* Icon circle */}
                          <motion.div
                            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-md cursor-pointer transition-all ${
                              isSelected || isAutoHighlighted
                                ? "bg-primary border-2 border-primary scale-110"
                                : "bg-card border-2 border-primary"
                            }`}
                            animate={
                              isAutoHighlighted
                                ? {
                                    scale: [1, 1.2, 1],
                                    boxShadow: [
                                      "0 0 0 0 rgba(var(--primary), 0.7)",
                                      "0 0 0 10px rgba(var(--primary), 0)",
                                      "0 0 0 0 rgba(var(--primary), 0)",
                                    ],
                                  }
                                : {}
                            }
                            transition={{ duration: 1.5, repeat: isAutoHighlighted ? Infinity : 0 }}
                          >
                            {stop.icon}
                          </motion.div>

                          {/* Content */}
                          <motion.div
                            className={`flex-1 rounded-xl p-4 cursor-pointer transition-all ${
                              isSelected || isAutoHighlighted
                                ? "bg-primary/10 border-2 border-primary shadow-lg"
                                : "bg-muted/30 border border-transparent hover:bg-muted/50"
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="font-heading font-semibold text-foreground mb-1">
                                  {stop.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {stop.description}
                                </p>
                              </div>
                              {(isSelected || isAutoHighlighted) && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="flex-shrink-0"
                                >
                                  <Sparkles className="w-5 h-5 text-primary fill-primary" />
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TripMap;
