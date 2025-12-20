import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles, Home, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";

interface FlowerParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  delay: number;
}

const flowerEmojis = ["🌸", "🌺", "🌼", "🏵️", "🌻", "🌷"];
const flowerColors = ["text-pink-400", "text-red-400", "text-yellow-400", "text-orange-400", "text-purple-400"];


// Divine light ray positions
const lightRayPositions = [
  { top: "10%", left: "20%", rotation: 15 },
  { top: "15%", left: "80%", rotation: -15 },
  { top: "30%", left: "10%", rotation: 25 },
  { top: "25%", left: "90%", rotation: -25 },
  { top: "50%", left: "15%", rotation: 35 },
  { top: "45%", left: "85%", rotation: -35 }
];

const Blessings = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [particles, setParticles] = useState<FlowerParticle[]>([]);
  const [showParticles, setShowParticles] = useState(false);
  const [showPlayPrompt, setShowPlayPrompt] = useState(false);
  const [showDivineLight, setShowDivineLight] = useState(false);

  const [showAura, setShowAura] = useState(false);
  const [showLightRays, setShowLightRays] = useState(false);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [showRevealButton, setShowRevealButton] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const particleIntervalRef = useRef<NodeJS.Timeout>();

  // Multiple audio sources for better compatibility
  const audioSources = [
    "/om-chants.mp3", // Local Om chanting audio file
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // Handle curtain reveal
  const handleReveal = async () => {
    setCurtainsOpen(true);
    setShowRevealButton(false);
    
    // Start audio when curtains open
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Audio play failed:", error);
      }
    }

    // Start effects after curtains open
    setTimeout(() => setShowDivineLight(true), 1000);
    setTimeout(() => setShowParticles(true), 2000);
    setTimeout(() => setShowAura(true), 3000);
    setTimeout(() => setShowLightRays(true), 4000);
  };

  // Initial setup - no auto-play, wait for user interaction
  useEffect(() => {
    // Just set up the page, no auto-play
    return () => {
      // Cleanup timers if component unmounts
    };
  }, []);

  const handleStartBlessings = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setShowPlayPrompt(false);
      } catch (error) {
        console.error("Failed to play audio:", error);
      }
    }
  };

  useEffect(() => {
    if (showParticles) {
      startParticleAnimation();
    } else {
      stopParticleAnimation();
    }

    return () => stopParticleAnimation();
  }, [showParticles]);



  const createParticle = (): FlowerParticle => ({
    id: Math.random(),
    x: Math.random() * 100,
    y: -10,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
    color: flowerColors[Math.floor(Math.random() * flowerColors.length)],
    delay: Math.random() * 2,
  });

  const startParticleAnimation = () => {
    particleIntervalRef.current = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev];
        
        // Add new particles
        if (newParticles.length < 20) {
          newParticles.push(createParticle());
        }
        
        // Remove particles that have fallen off screen
        return newParticles.filter(particle => particle.y < 110);
      });
    }, 300);
  };

  const stopParticleAnimation = () => {
    if (particleIntervalRef.current) {
      clearInterval(particleIntervalRef.current);
    }
    setParticles([]);
  };

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
          setShowPlayPrompt(false);
        }
      } catch (error) {
        console.error("Audio play error:", error);
        setIsPlaying(false);
        // Show prompt if play fails
        setShowPlayPrompt(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const resetExperience = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
    setParticles([]);
    if (showParticles) {
      startParticleAnimation();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-saffron/20 via-gold/10 to-cream relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-saffron/5 to-gold/5" />
      </div>

      {/* Divine Light Rays */}
      <AnimatePresence>
        {showLightRays && lightRayPositions.map((ray, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.3, 0], scale: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3,
              delay: index * 0.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="absolute pointer-events-none z-5"
            style={{ 
              top: ray.top, 
              left: ray.left,
              transform: `rotate(${ray.rotation}deg)`
            }}
          >
            <div className="w-1 h-32 bg-gradient-to-t from-transparent via-gold/40 to-transparent blur-sm" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Divine Aura */}
      <AnimatePresence>
        {showAura && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 pointer-events-none z-5"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-gold/20 via-saffron/10 to-transparent rounded-full blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>



      {/* Play Prompt Overlay */}
      <AnimatePresence>
        {showPlayPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card rounded-2xl p-8 shadow-2xl border border-border/50 text-center max-w-md mx-4"
            >
              <div className="text-6xl mb-4">🙏</div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Welcome to Divine Blessings
              </h2>
              <p className="text-muted-foreground mb-6">
                Click below to start your spiritual journey with sacred chants and divine blessings
              </p>
              <Button
                onClick={handleStartBlessings}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 shadow-glow"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Blessings
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Falling Flower Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              rotate: particle.rotation,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              y: "110%",
              rotate: particle.rotation + 360,
              scale: particle.scale,
              opacity: [0, 1, 1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 4 + Math.random() * 2,
              delay: particle.delay,
              ease: "linear"
            }}
            className={`absolute text-2xl ${particle.color} pointer-events-none z-10`}
            style={{ left: `${particle.x}%` }}
          >
            {flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)]}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
        {/* Home Button - Top Left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/30"
          >
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </motion.div>

        {/* Reveal Button - Top Center */}
        <AnimatePresence>
          {showRevealButton && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={handleReveal}
                size="lg"
                className="bg-gold/90 hover:bg-gold text-black font-semibold shadow-glow"
              >
                <Eye className="w-5 h-5 mr-2" />
                Reveal Darshan
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound Toggle - Top Right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={toggleMute}
            variant="outline"
            size="sm"
            className="bg-black/20 backdrop-blur-md border-white/20 text-white hover:bg-black/30"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 h-full flex flex-col justify-center">
        {/* Header - Only show after curtains open */}
        <AnimatePresence>
          {curtainsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 1 }}
              className="text-center mb-8"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                Divine Blessings
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">
                Take <span className="text-gradient">Blessings</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Seek the divine blessings of Lord Venkateswara. Close your eyes, listen to the sacred slokas, and feel the divine presence.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lord Venkateswara Image - Full Screen Temple View */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex-1 flex items-center justify-center relative"
        >
          {/* Full Screen Temple Container */}
          <div className="relative w-full h-full min-h-[70vh] flex items-center justify-center">
            
            {/* Temple Background with Glow */}
            <div className="absolute inset-0 bg-gradient-radial from-gold/20 via-saffron/10 to-transparent" />
            
            {/* Main Temple Darshan View */}
            <div className="relative w-full h-full max-w-6xl mx-auto flex items-center justify-center">
              
              {/* Left Curtain */}
              <motion.div
                initial={{ x: 0, opacity: 1 }}
                animate={{ 
                  x: curtainsOpen ? -200 : 0, 
                  opacity: curtainsOpen ? 0 : 1 
                }}
                transition={{ 
                  duration: curtainsOpen ? 2 : 0,
                  ease: "easeInOut"
                }}
                className="absolute left-0 top-0 bottom-0 w-32 md:w-48 z-10"
              >
                <div className="relative w-full h-full">
                  {/* Curtain Fabric */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-800 via-red-700 to-red-600 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-b from-gold/30 via-transparent to-gold/20" />
                  
                  {/* Curtain Folds */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent opacity-50" 
                       style={{ 
                         backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)'
                       }} />
                  
                  {/* Curtain Tie */}
                  <div className="absolute right-0 top-1/3 w-8 h-16 bg-gold/80 rounded-l-full shadow-lg" />
                  <div className="absolute right-0 top-1/3 w-6 h-12 bg-gradient-to-l from-gold to-yellow-600 rounded-l-full" />
                  
                  {/* Decorative Border */}
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-gold via-yellow-500 to-gold" />
                </div>
              </motion.div>

              {/* Right Curtain */}
              <motion.div
                initial={{ x: 0, opacity: 1 }}
                animate={{ 
                  x: curtainsOpen ? 200 : 0, 
                  opacity: curtainsOpen ? 0 : 1 
                }}
                transition={{ 
                  duration: curtainsOpen ? 2 : 0,
                  ease: "easeInOut"
                }}
                className="absolute right-0 top-0 bottom-0 w-32 md:w-48 z-10"
              >
                <div className="relative w-full h-full">
                  {/* Curtain Fabric */}
                  <div className="absolute inset-0 bg-gradient-to-l from-red-800 via-red-700 to-red-600 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-b from-gold/30 via-transparent to-gold/20" />
                  
                  {/* Curtain Folds */}
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-transparent opacity-50"
                       style={{ 
                         backgroundImage: 'repeating-linear-gradient(270deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)'
                       }} />
                  
                  {/* Curtain Tie */}
                  <div className="absolute left-0 top-1/3 w-8 h-16 bg-gold/80 rounded-r-full shadow-lg" />
                  <div className="absolute left-0 top-1/3 w-6 h-12 bg-gradient-to-r from-gold to-yellow-600 rounded-r-full" />
                  
                  {/* Decorative Border */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-gold via-yellow-500 to-gold" />
                </div>
              </motion.div>

              {/* Central Deity View */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: curtainsOpen ? 1 : 0.3, 
                  scale: curtainsOpen ? 1 : 0.9 
                }}
                transition={{ 
                  delay: curtainsOpen ? 1 : 0.8, 
                  duration: curtainsOpen ? 1.5 : 1 
                }}
                className="relative w-full h-full flex items-center justify-center px-32 md:px-48"
              >
                {/* Temple Inner Sanctum */}
                <div className="relative w-full h-full bg-gradient-to-b from-gold/10 via-saffron/5 to-gold/10 rounded-lg overflow-hidden shadow-2xl">
                  
                  {/* Divine Glow Behind Deity */}
                  <div className="absolute inset-0 bg-gradient-radial from-gold/30 via-saffron/20 to-transparent blur-2xl" />
                  
                  {/* Enhanced Divine Light */}
                  <AnimatePresence>
                    {showDivineLight && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 0.8, 0],
                          scale: [0.9, 1.1, 0.9]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-gradient-radial from-yellow-300/20 via-gold/15 to-transparent blur-xl"
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Lord Venkateswara Image */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.img 
                      src="https://photosfile.com/wp-content/uploads/2023/04/Venkateswara-Swamy-Images-12.jpg" 
                      alt="Lord Venkateswara Swamy" 
                      className="w-full h-full object-contain"
                      animate={{ 
                        filter: [
                          "brightness(1) contrast(1)",
                          "brightness(1.1) contrast(1.1)",
                          "brightness(1) contrast(1)"
                        ]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    
                    {/* Fallback Divine Symbols */}
                    <div className="absolute inset-0 hidden items-center justify-center bg-gradient-to-b from-gold/20 to-saffron/20 flex-col gap-4">
                      <div className="text-9xl md:text-[12rem]">🕉️</div>
                      <div className="text-4xl md:text-6xl">🙏</div>
                      <div className="text-lg md:text-xl text-foreground font-heading text-center px-4">
                        Lord Venkateswara Swamy
                      </div>
                    </div>
                  </div>

                  {/* Divine Light Rays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gold/5 to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-saffron/5 to-transparent pointer-events-none" />
                </div>
              </motion.div>

              {/* Top Temple Architecture */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gold via-yellow-600 to-transparent opacity-80" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gradient-to-b from-gold to-yellow-500 rounded-b-lg shadow-lg" />
              
              {/* Particle Source Point - Top Center of Deity */}
              <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 bg-gold rounded-full opacity-70 shadow-glow"
                />
              </div>

              {/* Floating Divine Symbols */}
              <AnimatePresence>
                {showAura && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [-20, -40, -20],
                        rotate: [0, 360, 0]
                      }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        delay: 1
                      }}
                      className="absolute top-1/3 left-1/4 text-2xl text-gold/60 pointer-events-none z-15"
                    >
                      🕉️
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [-20, -40, -20],
                        rotate: [0, -360, 0]
                      }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        delay: 3
                      }}
                      className="absolute top-1/3 right-1/4 text-2xl text-gold/60 pointer-events-none z-15"
                    >
                      🙏
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [-20, -40, -20]
                      }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        delay: 5
                      }}
                      className="absolute bottom-1/3 left-1/3 text-2xl text-gold/60 pointer-events-none z-15"
                    >
                      🪔
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                        y: [-20, -40, -20]
                      }}
                      transition={{ 
                        duration: 6,
                        repeat: Infinity,
                        delay: 2
                      }}
                      className="absolute bottom-1/3 right-1/3 text-2xl text-gold/60 pointer-events-none z-15"
                    >
                      🔔
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onLoadedData={() => {
            console.log("Audio loaded successfully");
          }}
          onError={(e) => {
            console.error("Audio loading error:", e);
          }}
        >
          {audioSources.map((src, index) => (
            <source key={index} src={src} type="audio/mpeg" />
          ))}
          Your browser does not support the audio element.
        </audio>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/80 backdrop-blur-md rounded-2xl p-6 shadow-card border border-border/50"
        >
          <div className="flex flex-col gap-6">
            {/* Main Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={togglePlay}
                size="lg"
                className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-glow"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </Button>
              
              <Button
                onClick={resetExperience}
                variant="outline"
                size="lg"
                className="w-12 h-12 rounded-full"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
                className="shrink-0"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              
              <div className="flex-1">
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <span className="text-sm text-muted-foreground w-10 text-right">
                {volume[0]}%
              </span>
            </div>

            {/* Particle Control */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Flower Blessings
              </span>
              <Button
                onClick={() => setShowParticles(!showParticles)}
                variant={showParticles ? "default" : "outline"}
                size="sm"
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {showParticles ? "On" : "Off"}
              </Button>
            </div>

            {/* Divine Effects Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  Divine Light
                </span>
                <Button
                  onClick={() => setShowDivineLight(!showDivineLight)}
                  variant={showDivineLight ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-2 py-1 h-7"
                >
                  {showDivineLight ? "On" : "Off"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  Sacred Mantras
                </span>
                
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  Divine Aura
                </span>
                <Button
                  onClick={() => setShowAura(!showAura)}
                  variant={showAura ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-2 py-1 h-7"
                >
                  {showAura ? "On" : "Off"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground">
                  Light Rays
                </span>
                <Button
                  onClick={() => setShowLightRays(!showLightRays)}
                  variant={showLightRays ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-2 py-1 h-7"
                >
                  {showLightRays ? "On" : "Off"}
                </Button>
              </div>
            </div>



            {/* Instructions */}
            <div className="text-center text-sm text-muted-foreground border-t border-border/50 pt-4">
              <p>🙏 Close your eyes, listen to the sacred chants, and receive divine blessings</p>
            </div>
          </div>
        </motion.div>
        {/* Floating Instructions - Only show after curtains open */}
        <AnimatePresence>
          {curtainsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 3 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
            >
              <div className="bg-black/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                <p className="text-white text-sm text-center">
                  🙏 Close your eyes, listen to the sacred chants, and receive divine blessings
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Blessings;