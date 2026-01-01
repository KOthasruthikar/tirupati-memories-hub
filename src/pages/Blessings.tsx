import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles, Home, Eye, Sun, Moon, Wind, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Link } from "react-router-dom";

interface FlowerParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  emoji: string;
  delay: number;
}

const flowerEmojis = ["🌸", "🌺", "🌼", "🏵️", "🌻", "🌷", "💐", "🪷"];
const diyas = ["🪔", "🕯️", "🔥"];

const lightRayPositions = [
  { top: "10%", left: "20%", rotation: 15, height: "120px" },
  { top: "15%", left: "80%", rotation: -15, height: "100px" },
  { top: "30%", left: "10%", rotation: 25, height: "80px" },
  { top: "25%", left: "90%", rotation: -25, height: "90px" },
  { top: "50%", left: "5%", rotation: 35, height: "60px" },
  { top: "45%", left: "95%", rotation: -35, height: "70px" },
  { top: "60%", left: "15%", rotation: 20, height: "50px" },
  { top: "55%", left: "85%", rotation: -20, height: "55px" },
];

const mantras = [
  "ఓం నమో వెంకటేశాయ",
  "శ్రీ వేంకటేశ్వర స్వామి",
  "గోవిందా గోవిందా",
  "ఓం నమో నారాయణాయ",
];


const Blessings = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [particles, setParticles] = useState<FlowerParticle[]>([]);
  const [showParticles, setShowParticles] = useState(false);
  const [showDivineLight, setShowDivineLight] = useState(false);
  const [showAura, setShowAura] = useState(false);
  const [showLightRays, setShowLightRays] = useState(false);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [showRevealButton, setShowRevealButton] = useState(true);
  const [currentMantra, setCurrentMantra] = useState(0);
  const [showDiyas, setShowDiyas] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const particleIntervalRef = useRef<NodeJS.Timeout>();
  const mantraIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // Mantra rotation
  useEffect(() => {
    if (curtainsOpen) {
      mantraIntervalRef.current = setInterval(() => {
        setCurrentMantra((prev) => (prev + 1) % mantras.length);
      }, 4000);
    }
    return () => {
      if (mantraIntervalRef.current) clearInterval(mantraIntervalRef.current);
    };
  }, [curtainsOpen]);

  const handleReveal = async () => {
    setCurtainsOpen(true);
    setShowRevealButton(false);

    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Audio play failed:", error);
      }
    }

    // Staggered effects
    setTimeout(() => setShowDivineLight(true), 800);
    setTimeout(() => setShowDiyas(true), 1500);
    setTimeout(() => setShowParticles(true), 2000);
    setTimeout(() => setShowAura(true), 2500);
    setTimeout(() => setShowLightRays(true), 3000);
  };

  const createParticle = (): FlowerParticle => ({
    id: Math.random(),
    x: Math.random() * 100,
    y: -10,
    rotation: Math.random() * 360,
    scale: 0.6 + Math.random() * 0.6,
    emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
    delay: Math.random() * 1.5,
  });

  useEffect(() => {
    if (showParticles) {
      particleIntervalRef.current = setInterval(() => {
        setParticles((prev) => {
          const newParticles = [...prev];
          if (newParticles.length < 25) {
            newParticles.push(createParticle());
          }
          return newParticles.filter((p) => p.y < 120);
        });
      }, 250);
    } else {
      if (particleIntervalRef.current) clearInterval(particleIntervalRef.current);
      setParticles([]);
    }
    return () => {
      if (particleIntervalRef.current) clearInterval(particleIntervalRef.current);
    };
  }, [showParticles]);

  const togglePlay = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Audio play error:", error);
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
      if (!isPlaying) audioRef.current.play().catch(console.error);
    }
    setCurrentMantra(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 via-amber-900 to-amber-950 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Divine Light Rays */}
      <AnimatePresence>
        {showLightRays &&
          lightRayPositions.map((ray, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scaleY: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                delay: index * 0.3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute pointer-events-none z-10"
              style={{
                top: ray.top,
                left: ray.left,
                transform: `rotate(${ray.rotation}deg)`,
                transformOrigin: "top center",
              }}
            >
              <div
                className="w-2 bg-gradient-to-b from-gold/60 via-yellow-400/30 to-transparent blur-sm rounded-full"
                style={{ height: ray.height }}
              />
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Floating Divine Aura */}
      <AnimatePresence>
        {showAura && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 pointer-events-none z-5"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-gold/30 via-orange-500/15 to-transparent rounded-full blur-3xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Flower Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: "-5vh",
              rotate: particle.rotation,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              y: "105vh",
              rotate: particle.rotation + 360,
              scale: particle.scale,
              opacity: [0, 1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 5 + Math.random() * 2,
              delay: particle.delay,
              ease: "linear",
            }}
            className="absolute text-2xl pointer-events-none z-20"
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-black/30 backdrop-blur-md border-gold/30 text-gold hover:bg-black/40 hover:text-gold"
          >
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </motion.div>

        <AnimatePresence>
          {showRevealButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleReveal}
                size="lg"
                className="bg-gradient-to-r from-gold via-yellow-500 to-gold text-black font-bold shadow-lg hover:shadow-gold/50 transition-shadow animate-pulse"
              >
                <Eye className="w-5 h-5 mr-2" />
                Reveal Divine Darshan
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={toggleMute}
            variant="outline"
            size="sm"
            className="bg-black/30 backdrop-blur-md border-gold/30 text-gold hover:bg-black/40"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header */}
        <AnimatePresence>
          {curtainsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-center pt-20 pb-4"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/20 text-gold text-sm font-medium rounded-full mb-3 border border-gold/30"
              >
                <Sparkles className="w-4 h-4" />
                Divine Blessings
              </motion.span>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.9 }}
                className="font-heading text-4xl md:text-5xl font-bold text-gold mb-2 drop-shadow-lg"
              >
                Take <span className="text-yellow-300">Blessings</span>
              </motion.h1>
              
              {/* Rotating Mantras */}
              <div className="h-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentMantra}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-gold/80 text-lg font-medium"
                  >
                    {mantras[currentMantra]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Temple View with Curtains */}
        <div className="flex-1 flex items-center justify-center px-4 relative">
          <div className="relative w-full max-w-4xl mx-auto h-[60vh] md:h-[70vh]">
            {/* Temple Frame */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 border-8 border-gold/40 rounded-3xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: curtainsOpen
                  ? "0 0 60px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.1)"
                  : "none",
              }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-800 via-amber-900 to-amber-950" />

              {/* Left Curtain */}
              <motion.div
                animate={{
                  x: curtainsOpen ? "-100%" : 0,
                }}
                transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute left-0 top-0 bottom-0 w-1/2 z-30"
              >
                <div className="w-full h-full bg-gradient-to-r from-red-900 via-red-800 to-red-700 relative overflow-hidden">
                  {/* Curtain pattern */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.2) 20px, rgba(0,0,0,0.2) 25px)",
                    }}
                  />
                  {/* Gold trim */}
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-yellow-600 via-gold to-yellow-600" />
                  {/* Curtain tassel */}
                  <div className="absolute right-2 top-1/4 w-6 h-20 bg-gold rounded-full opacity-80" />
                </div>
              </motion.div>

              {/* Right Curtain */}
              <motion.div
                animate={{
                  x: curtainsOpen ? "100%" : 0,
                }}
                transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute right-0 top-0 bottom-0 w-1/2 z-30"
              >
                <div className="w-full h-full bg-gradient-to-l from-red-900 via-red-800 to-red-700 relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(270deg, transparent, transparent 20px, rgba(0,0,0,0.2) 20px, rgba(0,0,0,0.2) 25px)",
                    }}
                  />
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-l from-yellow-600 via-gold to-yellow-600" />
                  <div className="absolute left-2 top-1/4 w-6 h-20 bg-gold rounded-full opacity-80" />
                </div>
              </motion.div>

              {/* Deity Image */}
              <motion.div
                animate={{
                  opacity: curtainsOpen ? 1 : 0.2,
                  scale: curtainsOpen ? 1 : 0.95,
                }}
                transition={{ delay: 1, duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Divine glow behind */}
                <AnimatePresence>
                  {showDivineLight && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-radial from-yellow-400/40 via-gold/20 to-transparent"
                    />
                  )}
                </AnimatePresence>

                <img
                  src="https://photosfile.com/wp-content/uploads/2023/04/Venkateswara-Swamy-Images-12.jpg"
                  alt="Lord Venkateswara Swamy"
                  className="w-full h-full object-contain relative z-10"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                {/* Fallback */}
                <div className="absolute inset-0 hidden items-center justify-center flex-col gap-4 bg-gradient-to-b from-gold/20 to-amber-900/50">
                  <span className="text-[10rem]">🙏</span>
                  <span className="text-gold text-2xl font-heading">ॐ नमो वेङ्कटेशाय</span>
                </div>
              </motion.div>

              {/* Diyas at bottom */}
              <AnimatePresence>
                {showDiyas && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 z-20"
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          y: [0, -3, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 0.8 + i * 0.1,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                        className="text-3xl md:text-4xl drop-shadow-lg"
                        style={{ filter: "drop-shadow(0 0 10px rgba(255, 165, 0, 0.8))" }}
                      >
                        🪔
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Top arch decoration */}
              <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-gold via-yellow-500 to-transparent z-20" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 bg-gold rounded-b-full z-20 flex items-center justify-center">
                <span className="text-xl">🕉️</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Controls Panel */}
        <AnimatePresence>
          {curtainsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
              className="p-4 md:p-6"
            >
              <div className="max-w-lg mx-auto bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-gold/20 shadow-xl">
                {/* Main Controls */}
                <div className="flex items-center justify-center gap-4 mb-5">
                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-gold to-yellow-500 hover:from-yellow-500 hover:to-gold text-black shadow-lg"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                  </Button>
                  <Button
                    onClick={resetExperience}
                    variant="outline"
                    size="lg"
                    className="w-11 h-11 rounded-full border-gold/40 text-gold hover:bg-gold/10"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-3 mb-5">
                  <Button onClick={toggleMute} variant="ghost" size="sm" className="shrink-0 text-gold hover:bg-gold/10">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-gold/70 w-8 text-right">{volume[0]}%</span>
                </div>

                {/* Effect Toggles */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: "Flowers", state: showParticles, setter: setShowParticles, icon: Wind },
                    { label: "Divine Light", state: showDivineLight, setter: setShowDivineLight, icon: Sun },
                    { label: "Aura", state: showAura, setter: setShowAura, icon: Moon },
                    { label: "Light Rays", state: showLightRays, setter: setShowLightRays, icon: Flame },
                  ].map((effect) => (
                    <Button
                      key={effect.label}
                      onClick={() => effect.setter(!effect.state)}
                      variant={effect.state ? "default" : "outline"}
                      size="sm"
                      className={`gap-1.5 text-xs ${
                        effect.state
                          ? "bg-gold/80 text-black hover:bg-gold"
                          : "border-gold/30 text-gold hover:bg-gold/10"
                      }`}
                    >
                      <effect.icon className="w-3 h-3" />
                      {effect.label}
                    </Button>
                  ))}
                </div>

                {/* Instructions */}
                <div className="mt-4 pt-4 border-t border-gold/20 text-center">
                  <p className="text-gold/60 text-sm">
                    🙏 Close your eyes and receive divine blessings
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio */}
        <audio
          ref={audioRef}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src="/om-chants.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </div>
  );
};

export default Blessings;
