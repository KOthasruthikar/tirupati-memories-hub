import { motion } from "framer-motion";
import { MapPin, Train, Navigation, Clock, Route } from "lucide-react";

interface RouteStop {
  name: string;
  description: string;
  transport: string;
  icon: string;
}

const routeStops: RouteStop[] = [
  {
    name: "Cherlapallu",
    description: "Starting point - Train journey begins",
    transport: "Train",
    icon: "🏠",
  },
  {
    name: "Tirupathy",
    description: "Arrival by train",
    transport: "Train",
    icon: "🚂",
  },
  {
    name: "Vishnu Vilasham",
    description: "Dharshan tickets collection",
    transport: "Auto/Bus",
    icon: "🎫",
  },
  {
    name: "Tirupathy",
    description: "Base camp for Tirumala",
    transport: "Local",
    icon: "🏨",
  },
  {
    name: "Tirumala",
    description: "Sacred hill temple",
    transport: "Bus/Walk",
    icon: "⛰️",
  },
  {
    name: "CRO Office",
    description: "Central Reception Office",
    transport: "Walk",
    icon: "🏢",
  },
  {
    name: "Srivari Padhallu",
    description: "Lord's Holy Footprints",
    transport: "Walk",
    icon: "🙏",
  },
  {
    name: "Shilathoranam",
    description: "Natural rock arch formation",
    transport: "Walk",
    icon: "🪨",
  },
  {
    name: "Kapilathoranam",
    description: "Historic stone arch",
    transport: "Walk",
    icon: "🏛️",
  },
  {
    name: "Japali",
    description: "Japali Anjaneya Swamy Temple",
    transport: "Walk",
    icon: "🛕",
  },
  {
    name: "Akasha Ganga",
    description: "Sacred waterfall",
    transport: "Walk",
    icon: "💧",
  },
  {
    name: "Papavinashanam",
    description: "Holy waterfall for cleansing sins",
    transport: "Walk",
    icon: "🌊",
  },
  {
    name: "Vijayawada",
    description: "Final destination - Return journey",
    transport: "Bus/Train",
    icon: "🏁",
  },
];

const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m76!1m12!1m3!1d1960093.5385252216!2d78.56631006936477!3d15.293729788339424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m61!3e0!4m5!1s0x3a4a75d9a531c6a7%3A0x8f40ed5e85cb7be0!2sCherlapalli%2C%20Hyderabad%2C%20Telangana!3m2!1d17.4539!2d78.5584!4m5!1s0x3bb55a6c1e51b3ef%3A0x2f56f7743b2c2a69!2sTirupati%2C%20Andhra%20Pradesh!3m2!1d13.6288!2d79.4192!4m5!1s0x3bb4a28d70e25009%3A0x4e4d4a9fdee0adf3!2sTirumala%2C%20Andhra%20Pradesh!3m2!1d13.6833!2d79.3500!4m5!1s0x3bb4a28d70e25009%3A0x4e4d4a9fdee0adf3!2sAkasaganga%2C%20Tirumala!3m2!1d13.6833!2d79.3500!4m5!1s0x3bb4a73a5b5e5555%3A0x3c6c6c6c6c6c6c6c!2sPapavinasanam%2C%20Tirumala!3m2!1d13.6750!2d79.3417!4m5!1s0x3a35e0c1cebcf0f7%3A0x7c0a0f35a67a9e85!2sVijayawada%2C%20Andhra%20Pradesh!3m2!1d16.5062!2d80.6480!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin";

const TripMap = () => {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container px-4 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            <Route className="w-4 h-4" />
            Our Journey Route
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Trip <span className="text-gradient">Map</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Follow our sacred pilgrimage from Cherlapallu to Vijayawada, passing through the divine hills of Tirumala
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-card rounded-xl p-4 text-center border border-border/50 shadow-card">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{routeStops.length}</div>
            <div className="text-sm text-muted-foreground">Stops</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border/50 shadow-card">
            <Train className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">~500 km</div>
            <div className="text-sm text-muted-foreground">Distance</div>
          </div>
          <div className="bg-card rounded-xl p-4 text-center border border-border/50 shadow-card">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">3 Days</div>
            <div className="text-sm text-muted-foreground">Duration</div>
          </div>
        </motion.div>

        {/* Map Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50 mb-8"
        >
          <div className="aspect-video w-full">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Trip Route Map"
            />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Navigation className="w-4 h-4" />
              <span className="text-sm">Cherlapallu → Tirupathy → Tirumala → Vijayawada</span>
            </div>
            <a
              href="https://www.google.com/maps/dir/Cherlapalli,+Hyderabad,+Telangana/Tirupati,+Andhra+Pradesh/Tirumala,+Andhra+Pradesh/Vijayawada,+Andhra+Pradesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm font-medium"
            >
              Open in Google Maps
            </a>
          </div>
        </motion.div>

        {/* Route Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border/50"
        >
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Route Stops
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-gold to-primary/30" />

            <div className="space-y-6">
              {routeStops.map((stop, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex items-start gap-4 pl-2"
                >
                  {/* Icon circle */}
                  <div className="relative z-10 w-9 h-9 rounded-full bg-card border-2 border-primary flex items-center justify-center text-lg shadow-md">
                    {stop.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-muted/30 rounded-xl p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-heading font-semibold text-foreground">
                          {stop.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stop.description}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full whitespace-nowrap">
                        {stop.transport}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TripMap;
