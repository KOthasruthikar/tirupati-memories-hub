import { MapPin, ExternalLink } from "lucide-react";
import { mapConfig } from "@/data/seed";

const MapEmbed = () => {
  return (
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

      {/* Map Iframe */}
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-border">
        {/* 
          REPLACE: Update the embedUrl in src/data/seed.ts with your actual Google Maps embed URL
          To get an embed URL:
          1. Go to Google Maps
          2. Search for your route/location
          3. Click "Share" → "Embed a map"
          4. Copy the URL from the iframe src attribute
        */}
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
        href="https://maps.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <ExternalLink className="w-4 h-4" />
        Open in Google Maps
      </a>
    </div>
  );
};

export default MapEmbed;
