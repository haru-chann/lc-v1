import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Users, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import QuoteBox from "@/components/QuoteBox";
import HeroCarousel from "@/components/HeroCarousel";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const Index = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState<Array<{
    text: string;
    author?: string;
  }>>([]);
  useEffect(() => {
    fetchQuotes();
  }, []);
  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [quotes.length]);
  const fetchQuotes = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("quotes").select("*").eq("is_active", true).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      if (data && data.length > 0) {
        setQuotes(data.map(q => ({
          text: q.text,
          author: q.author || undefined
        })));
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              How We Support You
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Listening To MannKiBaat offers multiple ways to connect, heal, and find support
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-large transition-smooth border border-border hover-glow-strong neon-border">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-glow group-hover:shadow-[0_0_30px_rgba(255,127,107,0.5)]">
                <Calendar className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Live Sessions</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Join our community sessions, workshops, and support groups led by
                trained volunteers and mental health advocates.
              </p>
            </div>

            <div className="group bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-large transition-smooth border border-border hover-glow-strong neon-border">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-glow group-hover:shadow-[0_0_30px_rgba(255,127,107,0.5)]">
                <Users className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Peer Support</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Connect with others who understand your journey. Share experiences
                and find comfort in a safe, judgment-free space.
              </p>
            </div>

            <div className="group bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-soft hover:shadow-large transition-smooth border border-border hover-glow-strong neon-border sm:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-glow group-hover:shadow-[0_0_30px_rgba(255,127,107,0.5)]">
                <Heart className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Resources</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Access curated mental health resources, coping strategies, and
                professional guidance to support your wellbeing journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Quote Section */}
      <section className="bg-secondary py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto animate-fade-in">
            {quotes.length > 0 && <QuoteBox text={quotes[currentQuoteIndex].text} author={quotes[currentQuoteIndex].author} />}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/30 rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 text-center shadow-medium">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
              Take the first step towards better mental health. Join our community
              today and find the support you deserve.
            </p>
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
              <Link to="/events" className="w-full xs:w-auto">
                <Button size="lg" className="w-full xs:w-auto shadow-medium">
                  Book an Event
                </Button>
              </Link>
              <Link to="/founders" className="w-full xs:w-auto">
                <Button size="lg" variant="outline" className="w-full xs:w-auto">
                  Meet Our Founders
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;