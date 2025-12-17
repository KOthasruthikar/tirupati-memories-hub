import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, MapPin, Users, Calendar, Mountain, Heart, Sparkles, Play, Map } from "lucide-react";
import { siteMeta, highlights, tripStats } from "@/data/seed";
import { useHomeMembers, useHomeGallery, useGalleryCount, useMembersCount } from "@/hooks/useHomeData";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/LazyImage";
import Lightbox from "@/components/Lightbox";
import PhotoCarousel from "@/components/PhotoCarousel";

const Home = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: featuredMembers = [] } = useHomeMembers(4);
  const { data: quickPhotos = [] } = useHomeGallery(4);
  const { data: totalPhotos = 0 } = useGalleryCount();
  const { data: totalMembers = 0 } = useMembersCount();
  
  const lightboxImages = quickPhotos.map((img) => ({ url: img.src, caption: img.caption || "" }));

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const stats = [
    { icon: Users, value: totalMembers || tripStats.totalMembers, label: "Pilgrims" },
    { icon: Calendar, value: tripStats.daysOfJourney, label: "Days" },
    { icon: Mountain, value: tripStats.templeVisits, label: "Temples" },
    { icon: Camera, value: `${totalPhotos || tripStats.totalPhotos}+`, label: "Photos" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <LazyImage
            src={siteMeta.heroImage}
            alt="Tirupati Temple"
            className="w-full h-full"
          />
          <div className="absolute inset-0 hero-overlay" />
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gold/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span 
              className="inline-block text-5xl mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🙏
            </motion.span>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
              {siteMeta.title}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto mb-8 drop-shadow">
              {siteMeta.tagline}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 btn-glow">
                <Link to="/trip-details">
                  Explore Journey <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/gallery">
                  <Camera className="mr-2 w-5 h-5" /> View Gallery
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary-foreground/70 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-gold relative overflow-hidden">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-foreground" />
                </div>
                <div className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-gradient-warm relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />
        
        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="divider-ornament mb-6">
              <span className="text-gold text-2xl">✦</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold text-foreground mb-6">
              Our <span className="text-gradient">Sacred</span> Journey
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {siteMeta.heroDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 text-gold-dark dark:text-gold text-sm font-medium rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              Memorable Moments
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Trip <span className="text-gradient">Highlights</span>
            </h2>
            <p className="text-muted-foreground">The moments that made this trip unforgettable</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-5 shadow-card border border-border/50 card-hover group image-shine"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">✨</span>
                  <p className="text-foreground font-medium">{highlight}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Members Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <Heart className="w-4 h-4" />
              Our Pilgrims
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Meet the <span className="text-gradient">Travelers</span>
            </h2>
            <p className="text-muted-foreground">The wonderful people who made this journey special</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {featuredMembers.map((member, index) => (
              <motion.div
                key={member.uid}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <Link to={`/members/${member.uid}`}>
                  <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                    <LazyImage
                      src={member.profile_image}
                      alt={member.name}
                      className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Button asChild variant="outline" size="lg">
              <Link to="/members">
                View All Members <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Photo Slideshow Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              <Play className="w-4 h-4" />
              Auto-Playing Slideshow
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Recent <span className="text-gradient">Memories</span>
            </h2>
            <p className="text-muted-foreground">Watch our cherished moments come to life</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <PhotoCarousel autoPlayInterval={4000} maxPhotos={8} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Button asChild variant="outline" size="lg">
              <Link to="/gallery">
                View Full Gallery <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Quick Photos Grid */}
      {quickPhotos.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Quick Glimpse
              </h2>
              <p className="text-muted-foreground">A preview of our cherished memories</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {quickPhotos.map((photo, index) => (
                <motion.button
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => openLightbox(index)}
                  className="aspect-square rounded-xl overflow-hidden shadow-card card-hover focus:outline-none focus:ring-2 focus:ring-primary/50 image-shine"
                  aria-label={`View ${photo.caption || "photo"}`}
                >
                  <LazyImage
                    src={photo.src}
                    alt={photo.caption || "Gallery photo"}
                    className="w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                </motion.button>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Button asChild variant="outline" size="lg">
                <Link to="/gallery">
                  View Full Gallery <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Navigation Cards */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Explore More
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { 
                to: "/trip-details", 
                icon: MapPin, 
                title: "Trip Details", 
                desc: "Complete timeline of our sacred journey",
                color: "from-orange-500 to-amber-500"
              },
              { 
                to: "/map", 
                icon: Map, 
                title: "Trip Map", 
                desc: "Follow our route from Cherlapallu to Vijayawada",
                color: "from-green-500 to-emerald-500"
              },
              { 
                to: "/gallery", 
                icon: Camera, 
                title: "Photo Gallery", 
                desc: "Beautiful memories captured forever",
                color: "from-blue-500 to-cyan-500"
              },
              { 
                to: "/members", 
                icon: Users, 
                title: "Our Members", 
                desc: "Meet the pilgrims of this journey",
                color: "from-purple-500 to-pink-500"
              },
            ].map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.to}
                  className="block bg-card rounded-xl p-6 shadow-card border border-border/50 card-hover group image-shine h-full"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentImageIndex((prev) => (prev + 1) % lightboxImages.length)}
        onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
      />
    </div>
  );
};

export default Home;
