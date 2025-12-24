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
    title: 'Listen to Your Heart',
    subtitle: 'Welcome to Our Community',
    description: 'Join us in creating a safe space for open conversations and mental well-being.',
    image_url: null,
    cta_text: 'Join Now',
    cta_link: '/register',
    icon_type: 'heart'
  },
  {
    id: '2',
    title: 'Heal Together',
    subtitle: 'Support & Understanding',
    description: 'Find comfort in shared experiences and professional guidance on your journey to wellness.',
    image_url: null,
    cta_text: 'Learn More',
    cta_link: '/about',
    icon_type: 'users'
  },
  {
    id: '3',
    title: 'Start Your Journey',
    subtitle: 'Take the First Step',
    description: 'Begin your path to better mental health with our supportive community and resources.',
    image_url: null,
    cta_text: 'Get Started',
    cta_link: '/services',
    icon_type: 'star'
  }
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

  // Current slide data
  const currentSlideData = slides[currentSlide] || slides[0];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides */}
      <div className="relative h-[90vh] min-h-[600px] w-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          >
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-10"></div>
            
            {/* Background image */}
            <img
              src={getSlideImage(slide, index)}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            
            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4 sm:px-6">
              <div className="max-w-4xl mx-auto text-white space-y-6 px-4 sm:px-6">
                {/* Subtitle */}
                {slide.subtitle && (
                  <span className="inline-block text-lg sm:text-xl font-medium text-primary mb-2">
                    {slide.subtitle}
                  </span>
                )}
                
                {/* Main Title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                  {slide.title}
                </h1>
                
                {/* Description */}
                <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                  {slide.description}
                </p>
                
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button 
                    size="lg" 
                    className="px-8 py-6 text-base sm:text-lg font-medium bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleCtaClick(slide.cta_link)}
                  >
                    {slide.cta_text}
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-base sm:text-lg font-medium border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show on larger screens */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => handleManualNav('prev')}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={() => handleManualNav('next')}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;