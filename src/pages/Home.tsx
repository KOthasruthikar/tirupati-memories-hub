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
    src="https://image2url.com/images/1766064702004-44c6eba2-ad48-45e2-aa51-767962e704da.jpg"
    alt="Tirupati Temple"
    className="w-full h-full object-cover"
  />

  {/* Animated Particles (optional) */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-gold/10 rounded-full"
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


        {/* Enhanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-5" />
        <div className="absolute inset-0 bg-gradient-to-r from-saffron/20 via-transparent to-gold/20 z-5" />

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
              <img src="https://image2url.com/images/1766062560193-a3c4ef5d-ffe6-42f8-9859-b83c0f089bab.png" alt="" className="h-16 w-auto"/>
            </motion.span>
            
           <motion.h1 
                className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-white"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
            Tirumala Trip
          </motion.h1>
            
            <motion.p 
              className="font-heading text-2xl md:text-4xl lg:text-4xl font-bold mb-8 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {siteMeta.tagline}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 btn-glow shadow-2xl">
                  <Link to="/trip-details">
                    Explore Journey <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" size="lg" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm">
                  <Link to="/gallery">
                    <Camera className="mr-2 w-5 h-5" /> View Gallery
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
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

      {/* Enhanced Stats Section */}
      <section className="py-12 bg-gradient-gold relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"
            animate={{ x: [-50, 50, -50], y: [-30, 30, -30] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"
            animate={{ x: [30, -30, 30], y: [20, -20, 20] }}
            transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="container px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group"
              >
                <motion.div 
                  className="w-14 h-14 mx-auto mb-3 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-background/30 transition-all duration-300"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                >
                  <stat.icon className="w-7 h-7 text-foreground group-hover:scale-110 transition-transform" />
                </motion.div>
                <motion.div 
                  className="text-3xl md:text-4xl font-heading font-bold text-foreground"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="py-16 md:py-24 bg-gradient-warm relative overflow-hidden">
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-saffron/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/3 w-36 h-36 bg-maroon/5 rounded-full blur-3xl" />
        
        {/* Floating Sacred Symbols */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 text-2xl text-gold/20"
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            🕉️
          </motion.div>
          <motion.div
            className="absolute bottom-32 right-16 text-xl text-saffron/20"
            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          >
            🙏
          </motion.div>
        </div>
        
        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div 
              className="divider-ornament mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-gold text-2xl">✦</span>
            </motion.div>
            <motion.h2 
              className="font-heading text-3xl md:text-5xl font-semibold text-foreground mb-6"
              whileInView={{ scale: [0.95, 1, 0.95] }}
              transition={{ duration: 2, repeat: Infinity }}
              viewport={{ once: true }}
            >
              Our <span className="text-gradient">Sacred</span> Journey
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              {siteMeta.heroDescription}
            </motion.p>
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
      {/* Moments Between the Journey */}
<section className="py-16 md:py-24 bg-background">
  <div className="container px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
        💭 Little Memories
      </span>
      <h2 className="font-heading text-3xl md:text-4xl font-semibold">
        Moments Between the Journey
      </h2>
      <p className="text-muted-foreground">
        Small moments that made the trip special
      </p>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {[
        "Laughing and playing hide & seek inside the train",
        "Sharing simple curd rice together at Vishnu Vilas",
        "Walking together silently during the night climb",
      ].map((memory, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 }}
          className="bg-card rounded-xl p-6 shadow-card border border-border/50 card-hover"
        >
          <p className="text-lg text-foreground leading-relaxed">
            {memory}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>
{/* Midnight Talks & Silence */}
<section className="py-20 bg-background relative">
  <div className="container px-4">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-10 shadow-xl"
    >
      <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-6 text-center">
        Midnight Talks & Silence
      </h2>

      <p className="text-lg text-muted-foreground text-center leading-relaxed mb-8">
        As the train moved forward, conversations slowly faded into silence.
        Some slept peacefully, some stared through the windows, and some shared
        quiet thoughts — moments that cannot be recreated.
      </p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <span className="text-4xl">🌙</span>
      </motion.div>
    </motion.div>
  </div>
</section>

{/* Alipiri Night Walk */}
<section className="py-20 bg-gradient-warm relative overflow-hidden">
  <div className="container px-4">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-10 items-center"
    >
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4">
          Alipiri at Night
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Climbing the Alipiri steps under the night sky was a calm and spiritual
          experience. The silence, temple bells, and soft chants made every step
          feel meaningful.
        </p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.03 }}
        className="rounded-2xl overflow-hidden shadow-card image-shine"
      >
        <LazyImage
          src="https://4.bp.blogspot.com/-Xs8GHIKubTE/XC-4bLl2wqI/AAAAAAABPsI/_Oxe0oipwFM2xYRmb1HephDCBJMmM2gtQCEwYBhgL/w1200-h630-p-k-no-nu/FB_IMG_1533456901672.jpg"
          alt="Alipiri steps at night"
          className="w-full h-[320px] object-cover"
        />
      </motion.div>
    </motion.div>
  </div>
</section>
          {/* After Darshan Feelings */}
<section className="py-24 bg-background relative">
  <div className="container px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center"
      >
        🕉️
      </motion.div>

      <h2 className="font-heading text-3xl md:text-5xl font-semibold mb-6">
        Peace After Darshan
      </h2>
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
        After darshan, there was a deep sense of peace within all of us.
        No words were needed — just silent smiles, folded hands, and gratitude
        for being there together.
      </p>
    </motion.div>
  </div>
</section>

{/* New Enhanced Moments Section */}
<section className="py-20 bg-gradient-warm relative overflow-hidden">
  {/* Floating Background Elements */}
  <div className="absolute inset-0 pointer-events-none">
    <motion.div
      className="absolute top-10 left-10 w-32 h-32 bg-gold/5 rounded-full blur-2xl"
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
    <motion.div
      className="absolute bottom-20 right-20 w-40 h-40 bg-saffron/5 rounded-full blur-3xl"
      animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 5, repeat: Infinity, delay: 1 }}
    />
  </div>

  <div className="container px-4 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
        ✨ Sacred Memories
      </span>
      <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4">
        Moments That <span className="text-gradient">Touched Our Hearts</span>
      </h2>
    </motion.div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[
        {
          title: "The First Glimpse",
          description: "When we first saw the temple gopuram from the train window, everyone fell silent in awe.",
          icon: "👁️",
          delay: 0
        },
        {
          title: "Sharing Prasadam",
          description: "The simple joy of sharing temple prasadam together created bonds that will last forever.",
          icon: "🍯",
          delay: 0.1
        },
        {
          title: "Morning Prayers",
          description: "Waking up to the sound of temple bells and joining in the morning aarti was magical.",
          icon: "🌅",
          delay: 0.2
        },
        {
          title: "Helping Each Other",
          description: "When someone was tired during the climb, others offered support without being asked.",
          icon: "🤝",
          delay: 0.3
        },
        {
          title: "Silent Gratitude",
          description: "Standing together in silence after darshan, feeling blessed and grateful.",
          icon: "🙏",
          delay: 0.4
        },
        {
          title: "Return Journey Smiles",
          description: "Tired but happy faces on the return journey, carrying memories in our hearts.",
          icon: "😊",
          delay: 0.5
        }
      ].map((moment, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: moment.delay }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-border/50 group"
        >
          <motion.div
            className="text-4xl mb-4 text-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          >
            {moment.icon}
          </motion.div>
          <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
            {moment.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {moment.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Animated Quote Section */}
<section className="py-24 bg-background relative">
  <div className="container px-4">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto text-center"
    >
      <motion.div
        animate={{ rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="text-6xl mb-8"
      >
        💫
      </motion.div>
      
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-6 italic"
      >
        "Some journeys change you forever. This was one of them."
      </motion.blockquote>
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="flex justify-center items-center gap-4"
      >
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-gold"></div>
        <span className="text-gold text-2xl">✦</span>
        <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-gold"></div>
      </motion.div>
    </motion.div>
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

      {/* Enhanced Navigation Cards */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-20 w-40 h-40 bg-gold/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-32 right-32 w-56 h-56 bg-saffron/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl mb-4"
            >
              🧭
            </motion.div>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold text-foreground mb-4">
              Continue Your <span className="text-gradient">Exploration</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dive deeper into our sacred journey and discover more memories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { 
                to: "/trip-details", 
                icon: MapPin, 
                title: "Trip Details", 
                desc: "Complete timeline of our sacred journey with every moment captured",
                color: "from-orange-500 via-amber-500 to-yellow-500",
                bgPattern: "🗺️"
              },
              { 
                to: "/map", 
                icon: Map, 
                title: "Trip Map", 
                desc: "Follow our route from Cherlapallu to Vijayawada with interactive map",
                color: "from-green-500 via-emerald-500 to-teal-500",
                bgPattern: "🧭"
              },
              { 
                to: "/gallery", 
                icon: Camera, 
                title: "Photo Gallery", 
                desc: "Beautiful memories captured forever in our comprehensive gallery",
                color: "from-blue-500 via-cyan-500 to-sky-500",
                bgPattern: "📸"
              },
              { 
                to: "/members", 
                icon: Users, 
                title: "Our Members", 
                desc: "Meet the wonderful pilgrims who made this journey special",
                color: "from-purple-500 via-pink-500 to-rose-500",
                bgPattern: "👥"
              },
            ].map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Link
                  to={item.to}
                  className="block relative bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-card border border-border/50 card-hover h-full overflow-hidden"
                >
                  {/* Background Pattern */}
                  <div className="absolute top-4 right-4 text-4xl opacity-10 group-hover:opacity-20 transition-opacity">
                    {item.bgPattern}
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
                      {item.desc}
                    </p>
                    
                    {/* Hover Arrow */}
                    <motion.div
                      className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="text-sm font-medium mr-2">Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
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
