import { Heart } from "lucide-react";
import { siteMeta } from "@/data/seed";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <span className="text-xl">🙏</span>
            <span>{siteMeta.title}</span>
          </div>
          
          <p className="text-sm text-muted-foreground max-w-md">
            {siteMeta.tagline}
          </p>

          {/* Divider */}
          <div className="w-24 h-0.5 bg-gradient-gold rounded-full my-2" />

          {/* Copyright */}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            © {currentYear} Made with 
            <Heart className="w-3 h-3 text-primary fill-primary" /> 
            for cherished memories
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
