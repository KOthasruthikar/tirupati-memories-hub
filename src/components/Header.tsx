import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteMeta } from "@/data/seed";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/trip-details", label: "Trip Details" },
  { path: "/gallery", label: "Gallery" },
  { path: "/members", label: "Members" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { member } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 font-heading text-xl font-semibold text-foreground transition-colors hover:text-primary group"
        >
          <span className="text-2xl group-hover:animate-pulse">🙏</span>
          <span className="hidden sm:inline bg-gradient-gold bg-clip-text text-transparent">{siteMeta.title}</span>
          <span className="sm:hidden bg-gradient-gold bg-clip-text text-transparent">Tirupati Trip</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    initial={false}
                  />
                )}
              </Link>
            );
          })}

          {/* Auth Button */}
          {member ? (
            <Link
              to="/profile"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                location.pathname === "/profile"
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="text-xs font-bold text-foreground">{member.name.charAt(0)}</span>
              </div>
              <span className="max-w-24 truncate">{member.name}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all ${
                location.pathname === "/login"
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile Auth Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
              >
                {member ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === "/profile"
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <User className="w-5 h-5" />
                    My Profile
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === "/login"
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
