import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Using the logo from the public directory
const logo = "/logo.jpeg";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    checkUser();
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const checkUser = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) {
      checkAdminRole(session.user.id);
    }
  };
  const checkAdminRole = async (userId: string) => {
    const {
      data
    } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
    setIsAdmin(!!data);
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out"
    });
    navigate("/");
  };
  const navLinks = [{
    path: "/",
    label: "Home"
  }, {
    path: "/founders",
    label: "Founders"
  }, {
    path: "/events",
    label: "Events"
  }, {
    path: "/services",
    label: "Services"
  }, {
    path: "/testimonials",
    label: "Testimonials"
  }, {
    path: "/memory-lane",
    label: "Gallery"
  }, {
    path: "/faq",
    label: "FAQs"
  }, {
    path: "/contact",
    label: "Contact Us"
  }];
  const isActive = (path: string) => location.pathname === path;
  return <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src={logo} 
              alt="ListeningClub Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" 
            />
            <span className="font-heading font-bold text-sm sm:text-base whitespace-nowrap">
              Listening To MannKiBaat
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-glow ${
                  isActive(link.path) 
                    ? "bg-primary text-primary-foreground shadow-[0_0_25px_rgba(255,127,107,0.4)]" 
                    : "hover:bg-secondary hover:shadow-[0_0_20px_rgba(255,243,199,0.5)] hover:scale-105"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="ml-2">
                  Admin
                </Button>
              </Link>
            )}
            <div className="ml-2 flex items-center gap-2">
              {user ? (
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm" 
                  className="shadow-soft"
                >
                  <LogOut size={16} className="mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate("/auth")} 
                  size="sm" 
                  className="shadow-soft"
                >
                  <span className="hidden sm:inline">Sign In</span>
                  <User size={16} className="sm:ml-2 sm:mr-0" />
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="lg:hidden p-3 -mr-2 rounded-lg hover:bg-secondary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Navigation */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-[1000px] py-4' : 'max-h-0 py-0'
          }`}>
            <div className="flex flex-col space-y-2 px-1">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)} 
                  className={`px-4 py-3 rounded-lg font-medium transition-glow text-sm ${
                    isActive(link.path) 
                      ? 'bg-primary text-primary-foreground shadow-[0_0_25px_rgba(255,127,107,0.4)]' 
                      : 'hover:bg-secondary hover:shadow-[0_0_20px_rgba(255,243,199,0.5)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {user && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    Admin Dashboard
                  </Button>
                </Link>
              )}
              
              <div className="pt-4 border-t border-border space-y-3">
                {user ? (
                  <>
                    <p className="text-sm text-muted-foreground px-4 break-words">
                      Signed in as: {user.email}
                    </p>
                    <Button 
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }} 
                      variant="outline" 
                      className="w-full shadow-soft"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => {
                      navigate("/auth");
                      setIsOpen(false);
                    }} 
                    className="w-full shadow-soft"
                  >
                    <User size={16} className="mr-2" />
                    Sign In / Register
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navigation;