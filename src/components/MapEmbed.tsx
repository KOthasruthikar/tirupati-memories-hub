import { MapPin, ExternalLink, Navigation, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { mapConfig, routeStops } from "@/data/seed";

const MapEmbed = () => {
  return (
    <div className="space-y-6">
      {/* Map Card */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              {mapConfig.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mapConfig.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{mapConfig.totalDistance}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{mapConfig.totalDuration}</span>
          </div>
        </div>

        {/* Map Iframe */}
        <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border">
          <iframe
            src={mapConfig.embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Trip route map"
            className="absolute inset-0"
          />
        </div>

        {/* Open in Google Maps Link */}
        <a
          href="https://maps.google.com/maps/dir/Chennai/Tiruchanoor/Tirupati/Tirumala"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Open in Google Maps
        </a>
      </div>

      {/* Route Stops Timeline */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
        <h4 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" />
          Route Stops
        </h4>
        
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />
          
          <div className="space-y-4">
            {routeStops.map((stop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4 pl-2"
              >
                {/* Icon Circle */}
                <div className="relative z-10 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-lg shrink-0">
                  {stop.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                      {stop.day}
                    </span>
                  </div>
                  <h5 className="font-heading font-semibold text-foreground">
                    {stop.name}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {stop.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapEmbed;
