import { Heart, MapPin, Camera, Users, Calendar, Sparkles, Mail, Phone, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { siteMeta } from "@/data/seed";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/trip-details", label: "Trip Details", icon: "📋" },
    { path: "/map", label: "Trip Map", icon: "🗺️" },
    { path: "/gallery", label: "Gallery", icon: "📸" },
    { path: "/members", label: "Members", icon: "👥" },
    { path: "/testimonials", label: "Testimonials", icon: "🎬" },
    { path: "/chat", label: "Chat", icon: "💬" },
    { path: "/blessings", label: "Blessings", icon: "🙏" },
  ];

  const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Facebook, label: "Facebook", href: "#" },
    { 
      icon: MessageCircle, 
      label: "WhatsApp Group", 
      href: "https://chat.whatsapp.com/invite/tirupati-pilgrims-group",
      onClick: () => {
        const message = encodeURIComponent("🙏 Namaste! I would like to join the Tirupati Pilgrims WhatsApp group to connect with fellow devotees and share our sacred journey experiences.");
        const whatsappUrl = `https://wa.me/?text=${message}`;
        window.open(whatsappUrl, '_blank');
      }
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-card via-card/80 to-muted/30 overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating particles with enhanced effects */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`footer-particle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: i % 3 === 0 ? 'rgba(251, 191, 36, 0.3)' : i % 3 === 1 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(217, 119, 6, 0.3)',
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-10, 10, -10],
              opacity: [0.1, 0.8, 0.1],
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 360, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Floating sacred symbols */}
        {['🕉️', '🙏', '🪔', '🌸', '⭐', '✨', '🌙', '🔱'].map((symbol, i) => (
          <motion.div
            key={`symbol-${i}`}
            className="absolute text-3xl opacity-5 select-none"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.3, 0.8],
              opacity: [0.02, 0.1, 0.02],
              y: [-20, 20, -20],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            {symbol}
          </motion.div>
        ))}

        {/* Enhanced gradient orbs with multiple layers */}
        <motion.div
          className="absolute -left-32 -bottom-32 w-96 h-96 rounded-full bg-gradient-to-r from-primary/8 via-gold/6 to-amber/4 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-gradient-to-l from-gold/8 via-primary/6 to-orange/4 blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.6, 0.2, 0.6],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -top-20 w-80 h-80 rounded-full bg-gradient-to-b from-amber/4 via-gold/3 to-transparent blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated wave patterns */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-32 opacity-10"
          style={{
            background: 'linear-gradient(45deg, transparent 30%, rgba(251, 191, 36, 0.1) 50%, transparent 70%)',
          }}
          animate={{
            x: [-100, 100, -100],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-24 opacity-5"
          style={{
            background: 'linear-gradient(-45deg, transparent 30%, rgba(245, 158, 11, 0.1) 50%, transparent 70%)',
          }}
          animate={{
            x: [100, -100, 100],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative z-10">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-12 md:py-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Enhanced Brand Section */}
            <motion.div 
              variants={itemVariants} 
              className="space-y-6 relative"
            >
              {/* Glowing background effect */}
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-gold/5 to-amber/5 rounded-2xl blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <Link to="/" className="relative flex items-center gap-4 group">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-gold/20 to-amber/20 rounded-full blur-md"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.img
                    src="https://image2url.com/images/1766062560193-a3c4ef5d-ffe6-42f8-9859-b83c0f089bab.png"
                    alt="Tirupati Trip Logo"
                    className="relative h-16 w-16 object-contain"
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
                <div className="space-y-2">
                  <motion.h3 
                    className="font-heading text-2xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-700 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    {siteMeta.title}
                  </motion.h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.3, 1], 
                          opacity: [0.4, 1, 0.4],
                          rotate: [0, 180, 360],
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      >
                        <Sparkles className="w-3 h-3 text-gold fill-gold" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Link>
              
              <motion.p 
                className="text-sm text-muted-foreground leading-relaxed relative"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {siteMeta.tagline}
              </motion.p>

              <motion.div 
                className="flex items-center gap-3 text-sm text-muted-foreground group cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <MapPin className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="group-hover:text-primary transition-colors">
                  Tirupati, Andhra Pradesh
                </span>
              </motion.div>

              {/* Decorative elements */}
              <div className="flex items-center gap-2 pt-2">
                {['🕉️', '🙏', '🪔'].map((symbol, i) => (
                  <motion.span
                    key={i}
                    className="text-lg opacity-30"
                    animate={{
                      y: [-2, 2, -2],
                      rotate: [-5, 5, -5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    {symbol}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Quick Links */}
            <motion.div variants={itemVariants} className="space-y-6 relative">
              {/* Section background glow */}
              <motion.div
                className="absolute -inset-3 bg-gradient-to-br from-primary/3 to-gold/3 rounded-xl blur-lg"
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <h4 className="relative font-heading text-xl font-semibold text-foreground flex items-center gap-3">
                <motion.div
                  className="relative"
                  animate={{ 
                    rotate: [0, 15, 0, -15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className="absolute -inset-1 bg-gold/20 rounded-full blur-sm"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <span className="relative text-xl">🔗</span>
                </motion.div>
                <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Quick Links
                </span>
              </h4>
              
              <ul className="relative space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Link
                      to={link.path}
                      className="relative flex items-center gap-3 p-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 group"
                    >
                      <motion.div
                        className="relative"
                        whileHover={{ 
                          scale: 1.3, 
                          rotate: 15,
                        }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <motion.div
                          className="absolute -inset-1 bg-primary/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        <span className="relative text-lg">{link.icon}</span>
                      </motion.div>
                      <span className="group-hover:translate-x-2 transition-transform duration-300 font-medium">
                        {link.label}
                      </span>
                      <motion.div
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <span className="text-primary">→</span>
                      </motion.div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Enhanced Trip Highlights */}
            <motion.div variants={itemVariants} className="space-y-6 relative">
              {/* Animated background */}
              <motion.div
                className="absolute -inset-3 bg-gradient-to-tl from-gold/3 to-amber/3 rounded-xl blur-lg"
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <h4 className="relative font-heading text-xl font-semibold text-foreground flex items-center gap-3">
                <motion.div
                  className="relative"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-gold/30 to-amber/30 rounded-full blur-md"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <span className="relative text-xl">✨</span>
                </motion.div>
                <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Trip Highlights
                </span>
              </h4>
              
              <ul className="relative space-y-4">
                {[
                  { icon: Calendar, label: "5 Days Journey", color: "from-blue-500 to-cyan-500" },
                  { icon: Users, label: "8 Members", color: "from-purple-500 to-pink-500" },
                  { icon: Camera, label: "1000+ Photos", color: "from-green-500 to-emerald-500" },
                  { icon: MapPin, label: "17 Sacred Stops", color: "from-orange-500 to-red-500" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="relative flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/30 group cursor-pointer overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Animated background on hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    <motion.div
                      className="relative z-10"
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: 1.2,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="w-5 h-5 text-primary" />
                    </motion.div>
                    <span className="relative z-10 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                    
                    {/* Sparkle effect on hover */}
                    <motion.div
                      className="absolute right-3 opacity-0 group-hover:opacity-100"
                      initial={{ scale: 0, rotate: -180 }}
                      whileHover={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Sparkles className="w-4 h-4 text-gold fill-gold" />
                    </motion.div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Social */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  🌟
                </motion.span>
                Connect With Us
              </h4>
              
              <div className="space-y-3">
                <motion.a
                  href="mailto:info@tirupatittrip.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <Mail className="w-4 h-4" />
                  <span>info@tirupatittrip.com</span>
                </motion.a>
                <motion.a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </motion.a>
              </div>

              {/* Social Links */}
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-3">Follow our journey</p>
                <div className="flex items-center gap-3">
                  {socialLinks.map((social, index) => (
                    <motion.button
                      key={social.label}
                      onClick={social.onClick || (() => window.open(social.href, '_blank'))}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        social.label === "WhatsApp Group" 
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white" 
                          : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      aria-label={social.label}
                      title={social.label === "WhatsApp Group" ? "Join our Tirupati Pilgrims WhatsApp Group" : social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        />

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="py-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            © {currentYear} {siteMeta.title}. All rights reserved.
          </p>

          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span>Made with</span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            >
              <Heart className="w-4 h-4 text-primary fill-primary" />
            </motion.div>
            <span>for cherished memories</span>
          </motion.div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Floating Sacred Symbols */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
        <motion.div
          className="flex items-center gap-6 text-3xl opacity-15"
          animate={{
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {['🕉️', '🙏', '🪔', '🌸', '⭐'].map((symbol, i) => (
            <motion.span
              key={i}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            >
              {symbol}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Animated border effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{
          x: ["-100%", "100%", "-100%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Corner decorative elements */}
      <motion.div
        className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/20 rounded-tl-lg"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/20 rounded-tr-lg"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1.5,
        }}
      />
    </footer>
  );
};

export default Footer;
