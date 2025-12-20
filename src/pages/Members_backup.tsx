import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimation, AnimatePresence } from "framer-motion";
import { 
  User, 
  Quote, 
  ChevronRight, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Users, 
  Heart,
  Sparkles,
  MapPin,
  Calendar,
  Star,
  Mail,
  Phone,
  Zap,
  Crown,
  Flame,
  Eye,
  Diamond,
  History,
  Clock,
  XCircle,
  CheckCircle,
  Send
} from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import { useAccessRequestHistory, useResendAccessRequest } from "@/hooks/useAccessRequests";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LazyImage from "@/components/LazyImage";

const Members = () => {
  const { data: members, isLoading, error } = useMembers();
  const { member: currentUser } = useAuth();
  const { data: accessHistory } = useAccessRequestHistory(currentUser?.uid || "");
  const resendAccessRequest = useResendAccessRequest();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  
  // Advanced scroll-based transformations
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  // Mouse tracking for advanced effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setMousePosition({
          x: (e.clientX - centerX) / rect.width,
          y: (e.clientY - centerY) / rect.height,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Filter members based on search and role
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    
    return members.filter((member) => {
      const matchesSearch = searchQuery === "" || 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = selectedRole === "All" || member.role === selectedRole;
      
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, selectedRole]);

  // Get unique roles for filter
  const roles = useMemo(() => {
    if (!members) return ["All"];
    const uniqueRoles = [...new Set(members.map(member => member.role))];
    return ["All", ...uniqueRoles];
  }, [members]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Epic Loading Background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-gold via-saffron to-primary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        <div className="text-center relative z-10">
          {/* Multi-layered Loading Spinner */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-4 border-gold/20 border-r-gold rounded-full"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border-4 border-saffron/20 border-b-saffron rounded-full"
            />
            
            {/* Center Icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Users className="w-8 h-8 text-primary" />
            </motion.div>
          </div>
          
          <motion.p 
            className="text-xl text-muted-foreground font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Summoning our sacred pilgrims...
          </motion.p>
          
          {/* Loading Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load members</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen py-8 md:py-12 relative overflow-hidden">
      {/* EPIC Animated Background Universe */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Sacred Geometry */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`geometry-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              rotate: [0, 360],
              scale: [0.5, 1.5, 0.5],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            <div className="w-8 h-8 border-2 border-gold/20 rotate-45 rounded-sm" />
          </motion.div>
        ))}
        
        {/* Divine Light Rays */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute top-0 left-1/2 origin-top"
            style={{
              width: "2px",
              height: "100vh",
              background: `linear-gradient(to bottom, rgba(255, 215, 0, 0.1), transparent)`,
              transform: `rotate(${i * 45}deg)`,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scaleY: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Mystical Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-gradient-to-r from-gold via-saffron to-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-50, 50, -50],
              x: [-25, 25, -25],
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Mouse-Following Aura */}
        <motion.div
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)`,
            left: `${50 + mousePosition.x * 20}%`,
            top: `${50 + mousePosition.y * 20}%`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.3 : 0.1,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="container px-4 relative z-10">
        {/* LEGENDARY Page Header */}
        <motion.div
          style={{ scale: headerScale, opacity: headerOpacity }}
          className="text-center mb-20 relative"
        >
          {/* Epic Title Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
            className="relative mb-8"
          >
            {/* Floating Crown */}
            <motion.div
              animate={{ 
                y: [-10, 10, -10],
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-8xl mb-6 relative"
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255, 215, 0, 0.5)",
                    "0 0 40px rgba(255, 215, 0, 0.8)",
                    "0 0 20px rgba(255, 215, 0, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👑
              </motion.span>
              
              {/* Orbiting Elements */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-4 h-4"
                  animate={{
                    rotate: [0, 360],
                    x: Math.cos(i * 60 * Math.PI / 180) * 60,
                    y: Math.sin(i * 60 * Math.PI / 180) * 60,
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.2,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-gold fill-gold" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative mb-8"
          >
            <motion.span 
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/20 via-gold/20 to-saffron/20 backdrop-blur-sm text-primary text-sm font-bold rounded-full border border-primary/30 shadow-2xl"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255, 215, 0, 0.3)",
              }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(255, 215, 0, 0.2)",
                  "0 0 40px rgba(255, 215, 0, 0.4)",
                  "0 0 20px rgba(255, 215, 0, 0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="w-5 h-5" />
              </motion.div>
              Our Sacred Fellowship
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Diamond className="w-4 h-4" />
              </motion.div>
            </motion.span>
          </motion.div>
          
          {/* Mind-Blowing Title */}
          <motion.h1 
            className="font-heading text-6xl md:text-7xl lg:text-8xl font-black mb-8 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            <motion.span
              className="bg-gradient-to-r from-primary via-gold via-saffron to-primary bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Meet Our
            </motion.span>
            <br />
            <motion.span
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="bg-gradient-to-r from-gold via-saffron to-primary bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ backgroundSize: "300% 300%" }}
              >
                Pilgrims
              </motion.span>
              
              {/* Floating Effects */}
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Flame className="w-8 h-8 text-orange-500" />
              </motion.div>
            </motion.span>
          </motion.h1>
          
          {/* Epic Description */}
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              The legendary souls who transformed this spiritual odyssey into an unforgettable epic
            </motion.span>
            
            {/* Decorative Elements */}
            <motion.div
              className="absolute -left-8 top-1/2 -translate-y-1/2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-6 h-6 text-gold fill-gold" />
            </motion.div>
            <motion.div
              className="absolute -right-8 top-1/2 -translate-y-1/2"
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Star className="w-6 h-6 text-gold fill-gold" />
            </motion.div>
          </motion.p>
        </motion.div>

        {/* Enhanced Search & Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/50 mb-12 max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background/50 border-border/50"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[140px] h-12 bg-background/50 border-border/50">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-10 w-10 p-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-10 w-10 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredMembers.length}</span> of {members?.length || 0} pilgrims
            </p>
            {(searchQuery || selectedRole !== "All") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRole("All");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Members Display */}
        {viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.uid}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Link
                  to={`/members/${member.uid}`}
                  className="block relative bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-2xl" />
                  
                  <div className="relative z-10">
                    {/* Profile Image */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <motion.div
                        className="w-full h-full rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {member.profile_image && member.profile_image !== "/placeholder.jpg" ? (
                          <LazyImage
                            src={member.profile_image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                            <User className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                      </motion.div>
                      
                      {/* Status Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                        <Heart className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="text-center mb-4">
                      <h3 className="font-heading text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                        <p className="text-sm text-primary font-medium">{member.role}</p>
                        <Star className="w-3 h-3 text-gold fill-gold" />
                      </div>
                      <p className="text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded">
                        ID: {member.uid}
                      </p>
                    </div>

                    {/* Memory Quote */}
                    <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-4 mb-4">
                      <Quote className="absolute -top-2 left-3 w-5 h-5 text-primary/40" />
                      <p className="text-sm text-muted-foreground italic line-clamp-3 pl-4">
                        "{member.memory}"
                      </p>
                    </div>

                    {/* Action Hint */}
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      <span>View Profile</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ChevronRight className="w-3 h-3" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.uid}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <Link
                  to={`/members/${member.uid}`}
                  className="flex items-center gap-4 p-4 bg-card/90 backdrop-blur-sm rounded-xl border border-border/50 hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Profile Image */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all flex-shrink-0">
                    {member.profile_image && member.profile_image !== "/placeholder.jpg" ? (
                      <LazyImage
                        src={member.profile_image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <User className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 italic">
                      "{member.memory}"
                    </p>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <Users className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              No Pilgrims Found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedRole("All");
              }}
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}

        {/* Access Request History Section */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <History className="w-5 h-5 text-primary" />
                  </motion.div>
                  <h2 className="font-heading text-2xl font-semibold text-foreground">
                    Access Requests
                  </h2>
                </div>
                <Link to="/access-history">
                  <Button variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    View Complete History
                  </Button>
                </Link>
              </div>

              {accessHistory && accessHistory.length > 0 ? (

                <div className="grid gap-4">
                  {accessHistory.slice(0, 3).map((request: any, index: number) => {
                  const handleResendRequest = async () => {
                    try {
                      await resendAccessRequest.mutateAsync({
                        requesterUid: currentUser.uid,
                        ownerUid: request.owner_uid,
                        requesterName: currentUser.name,
                      });
                      toast.success(`New request sent to ${request.owner?.name}!`);
                    } catch (error) {
                      toast.error("Failed to resend request");
                    }
                  };

                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        request.status === "approved"
                          ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                          : request.status === "denied"
                          ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                          : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                          {request.owner?.profile_image ? (
                            <LazyImage
                              src={request.owner.profile_image}
                              alt={request.owner?.name || "User"}
                              className="w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {request.owner?.name || "Unknown Member"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(request.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          {request.status === "approved" && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                              <CheckCircle className="w-4 h-4" />
                              <span>Approved</span>
                            </div>
                          )}
                          {request.status === "denied" && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm">
                              <XCircle className="w-4 h-4" />
                              <span>Denied</span>
                            </div>
                          )}
                          {request.status === "pending" && (
                            <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full text-sm">
                              <Clock className="w-4 h-4" />
                              <span>Pending</span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        {request.status === "denied" && (
                          <Button
                            onClick={handleResendRequest}
                            disabled={resendAccessRequest.isPending}
                            size="sm"
                            variant="outline"
                            className="gap-2 text-primary border-primary/50 hover:bg-primary/10"
                          >
                            <Send className="w-3 h-3" />
                            {resendAccessRequest.isPending ? "Sending..." : "Resend"}
                          </Button>
                        )}
                        
                        {request.status === "approved" && (
                          <Link
                            to={`/members/${request.owner_uid}`}
                            className="text-sm text-primary hover:underline"
                          >
                            View Profile →
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                </div>

                {accessHistory.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link to="/access-history">
                      <Button variant="ghost" className="gap-2 text-primary">
                        <History className="w-4 h-4" />
                        View {accessHistory.length - 3} More Requests
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Summary */}
                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>
                        {accessHistory.filter((r: any) => r.status === "approved").length} Approved
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>
                        {accessHistory.filter((r: any) => r.status === "pending").length} Pending
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>
                        {accessHistory.filter((r: any) => r.status === "denied").length} Denied
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No access requests yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start exploring member profiles to request access to their photos
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Enhanced Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20 py-16 px-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl relative overflow-hidden max-w-4xl mx-auto"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-gold/5" />
          
          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              🙏
            </motion.div>
            
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Blessed to Journey <span className="text-gradient">Together</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              Each pilgrim brought their own unique energy, devotion, and spirit, creating an unforgettable tapestry of faith and friendship that will be cherished forever.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-gold">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <Sparkles className="w-5 h-5 fill-gold" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Members;
