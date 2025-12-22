import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, Calendar, Heart, Sparkles, Star, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-image.jpg";

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
  const [slides, setSlides] = useState<BannerSlide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
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

  return (
    <section className="relative gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="relative w-full min-h-[220px] sm:min-h-[280px] md:min-h-[320px] mt-6 md:mt-0">
            {slides.map((slide, index) => {
              const Icon = iconMap[slide.icon_type] || Heart;
              return (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0"
                      : index < currentSlide
                      ? "opacity-0 -translate-x-1/2"
                      : "opacity-0 translate-x-1/2"
                  }`}
                >
                  <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex-shrink-0 flex items-center justify-center">
                        <Icon className="text-primary w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </div>
                      <span className="text-xs sm:text-sm md:text-base text-primary font-medium">{slide.subtitle}</span>
                    </div>
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                    <div className="max-h-[120px] sm:max-h-[140px] md:max-h-[180px] lg:max-h-[220px] overflow-y-auto pr-2">
                      <p className="text-sm sm:text-base md:text-lg text-muted-foreground whitespace-pre-line">
                        {slide.description}
                      </p>
                    </div>
                    <div className="flex flex-col xs:flex-row flex-wrap gap-2 sm:gap-3 md:gap-4 pt-1 sm:pt-2 md:pt-4">
                      <Link to={slide.cta_link} className="w-full xs:w-auto">
                        <Button size="lg" className="w-full xs:w-auto shadow-medium text-sm sm:text-base">
                          {slide.cta_text}
                        </Button>
                      </Link>
                      <Link to="/contact" className="w-full xs:w-auto">
                        <Button size="lg" variant="outline" className="w-full xs:w-auto shadow-soft text-sm sm:text-base">
                          Contact Us
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Image */}
          <div className="relative w-full h-[240px] xs:h-[280px] sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-md sm:shadow-lg md:shadow-xl">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={getSlideImage(slide, index)}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10 md:mt-12">
            <button
              onClick={() => handleManualNav('prev')}
              className="p-2 rounded-full bg-card border border-border shadow-soft hover:shadow-medium hover:scale-105 transition-smooth"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-primary w-8 shadow-[0_0_15px_rgba(255,127,107,0.5)]"
                      : "bg-muted hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => handleManualNav('next')}
              className="p-2 rounded-full bg-card border border-border shadow-soft hover:shadow-medium hover:scale-105 transition-smooth"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroCarousel;