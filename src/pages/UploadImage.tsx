import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Upload, Sparkles, Heart, Image } from "lucide-react";
import ImageUploadForm from "@/components/ImageUploadForm";

const UploadImage = () => {
  return (
    <div className="min-h-screen py-8 md:py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container px-4 max-w-2xl mx-auto relative z-10">
        {/* Enhanced Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-300 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>
        </motion.div>

        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            📷
          </motion.div>
          
          <motion.span 
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <Upload className="w-4 h-4" />
            Share Your Memories
          </motion.span>
          
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Upload <span className="text-gradient">Sacred Moments</span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                <Sparkles className="w-4 h-4 text-gold fill-gold" />
              </motion.div>
            ))}
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Share the beautiful moments from our spiritual journey to Tirumala with fellow pilgrims
          </p>
        </motion.div>

        {/* Enhanced Upload Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border border-border/50 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />
          
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-3xl" />
          
          <div className="relative z-10">
            {/* Form Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center"
              >
                <Camera className="w-8 h-8 text-primary" />
              </motion.div>
              
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                Share Your Photo
              </h2>
              <p className="text-muted-foreground">
                Upload and describe your favorite moment from the trip
              </p>
            </div>

            {/* Upload Form */}
            <ImageUploadForm />
          </div>
        </motion.div>

        {/* Inspirational Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 py-8 px-6 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-sm rounded-2xl border border-border/50 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-gold/5" />
          
          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl mb-4"
            >
              💝
            </motion.div>
            
            <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
              Every Photo Tells a <span className="text-gradient">Story</span>
            </h3>
            
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Your photos help preserve the sacred memories of our pilgrimage. Each image becomes part of our collective journey of faith and devotion.
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-4 text-gold">
              <Heart className="w-4 h-4 fill-gold" />
              <span className="text-sm font-medium">Made with love</span>
              <Heart className="w-4 h-4 fill-gold" />
            </div>
          </div>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid md:grid-cols-3 gap-4"
        >
          {[
            {
              icon: Image,
              title: "High Quality",
              description: "Upload clear, high-resolution photos for the best viewing experience"
            },
            {
              icon: Heart,
              title: "Add Context",
              description: "Include meaningful captions to help others understand the moment"
            },
            {
              icon: Sparkles,
              title: "Share Joy",
              description: "Your photos bring happiness to fellow pilgrims who shared this journey"
            }
          ].map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="text-center p-4 bg-card/40 backdrop-blur-sm rounded-xl border border-border/30"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center">
                <tip.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1 text-sm">
                {tip.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tip.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadImage;
