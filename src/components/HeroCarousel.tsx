import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, Calendar, Heart, Sparkles, Star, Shield, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-image.jpg";
import { cn } from "@/lib/utils";

// Error Boundary Component for Image Loading
class ImageErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Image loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-muted/50 text-muted-foreground p-4">
          <AlertCircle className="w-12 h-12 mb-2 text-destructive" />
          <p className="text-center">Couldn't load this image</p>
        </div>
      );
    }

    return this.props.children;
  }
}

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string | null;
  cta_text: string;
  cta_link: string;
  icon_type: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  users: Users,
  calendar: Calendar,
  heart: Heart,
  sparkles: Sparkles,
  star: Star,
  shield: Shield,
};

const defaultSlides: BannerSlide[] = [
  {
    id: "1",
    title: "Meet Our Founders",
    subtitle: "The Heart Behind ListeningClub",
    description: "Geetika – Counsellor, Psychotherapist, and Parenting Coach, Geetika helps you feel heard, understood, and supported.\n\nSneha – NLP Practitioner, Life Coach, and Certified Zentangle Teacher, Sneha sparks creativity and empowers positive shifts in life.\n\nTogether, they run Listening to Mann ki Baat – a safe space where loneliness ends and real connection begins.",
    image_url: null,
    cta_text: "Meet the Team",
    cta_link: "/founders",
    icon_type: "users",
  },
  {
    id: "2",
    title: "Upcoming Events",
    subtitle: "Join Our Community Sessions",
    description: "Participate in workshops, support groups, and wellness sessions designed to nurture your mental wellbeing.",
    image_url: null,
    cta_text: "View Events",
    cta_link: "/events",
    icon_type: "calendar",
  },
  {
    id: "3",
    title: "Our Mission",
    subtitle: "A Space to Listen, Heal, and Grow",
    description: "ListeningClub is dedicated to creating safe, judgment-free spaces where everyone can find support on their mental health journey.",
    image_url: null,
    cta_text: "Learn More",
    cta_link: "/services",
    icon_type: "heart",
  },
];

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState<BannerSlide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout>();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  const handleCtaClick = (ctaLink: string) => {
    if (ctaLink.includes('#')) {
      const [path, hash] = ctaLink.split('#');
      if (path === '' || path === '/') {
        // Same page scroll
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to page then scroll
        navigate(path);
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(ctaLink);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from("banner_slides")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setSlides(data);
      }
    } catch (error) {
      console.error("Error fetching banner slides:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    
    const play = () => {
      if (isMounted.current) {
        nextSlide();
        autoPlayTimeoutRef.current = setTimeout(play, 5000);
      }
    };
    
    autoPlayTimeoutRef.current = setTimeout(play, 5000);
    
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [isAutoPlaying, nextSlide, slides.length]);

  const handleManualNav = (direction: 'prev' | 'next') => {
    setIsAutoPlaying(false);
    if (direction === 'prev') prevSlide();
    else nextSlide();
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getSlideImage = (slide: BannerSlide, index: number) => {
    return slide.image_url || heroImage;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Get current slide for rendering
  const currentSlideData = slides[currentSlide];
  const CurrentIcon = iconMap[currentSlideData?.icon_type] || Heart;

  // Show skeleton during initial load
  if (isLoading) {
    return (
      <section className="relative gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="w-full order-2 lg:order-1 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-xl animate-pulse" />
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-12 sm:h-16 w-3/4 bg-muted rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
              </div>
              <div className="flex gap-4 pt-4">
                <div className="h-10 w-32 bg-muted rounded animate-pulse" />
                <div className="h-10 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="w-full order-1 lg:order-2">
              <div className="aspect-[4/3] lg:aspect-square bg-muted rounded-2xl sm:rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-gradient-to-b from-background/90 to-background/70">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full">
          <ImageErrorBoundary>
            <img
              src={getSlideImage(currentSlideData, currentSlide)}
              alt={currentSlideData?.title}
              className="w-full h-full object-cover object-center"
              onError={() => {
                console.error("Failed to load image:", getSlideImage(currentSlideData, currentSlide));
                setImageError(true);
              }}
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 text-muted-foreground">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
            )}
          </ImageErrorBoundary>
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-4xl">
          <div className="space-y-4 sm:space-y-6 text-white">
            <div className="flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-full w-fit px-4 py-1.5">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CurrentIcon className="text-primary" size={16} />
              </div>
              <span className="text-primary font-medium text-sm sm:text-base">{currentSlideData?.subtitle}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-white drop-shadow-lg">
              {currentSlideData?.title}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed drop-shadow-sm">
              {currentSlideData?.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button 
                size="lg" 
                className="shadow-medium w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => handleCtaClick(currentSlideData?.cta_link || "/")}
              >
                {currentSlideData?.cta_text}
              </Button>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-background/80 hover:bg-background/90 text-white border-white/20 hover:border-white/30"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 sm:gap-4 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
          <button
            onClick={() => handleManualNav('prev')}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-primary w-6 sm:w-8 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => handleManualNav('next')}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;