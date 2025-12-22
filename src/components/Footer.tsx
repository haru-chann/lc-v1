import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-12 md:mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 max-w-[280px]">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.jpeg" 
                alt="ListeningClub Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" 
              />
              <span className="font-heading font-bold text-base sm:text-lg">
                Listening To MannKiBaat
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              A space to listen, heal, and grow together.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mt-2 sm:mt-0">
            <h4 className="font-heading font-semibold mb-3 sm:mb-4 text-base">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-smooth block py-1">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-muted-foreground hover:text-primary transition-smooth block py-1">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/volunteers" className="text-sm text-muted-foreground hover:text-primary transition-smooth block py-1">
                  Volunteers
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="mt-2 sm:mt-0">
            <h4 className="font-heading font-semibold mb-3 sm:mb-4 text-base">Community</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/testimonials" className="text-sm text-muted-foreground hover:text-primary transition-smooth block py-1">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-smooth block py-1">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-smooth block py-1">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="mt-2 sm:mt-0">
            <h4 className="font-heading font-semibold mb-3 sm:mb-4 text-base">Connect With Us</h4>
            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                aria-label="Instagram"
              >
                <Instagram size={18} className="sm:scale-100" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="sm:scale-100" />
              </a>
              <a 
                href="mailto:hello@listeningclub.com" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                aria-label="Email us"
              >
                <Mail size={18} className="sm:scale-100" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            &copy; 2025 Listening To MannKiBaat. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 mt-3 sm:mt-0">
            Made with <Heart size={12} className="text-primary fill-primary" /> for mental wellness
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;