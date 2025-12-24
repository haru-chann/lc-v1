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

      {/* Motivational Quote Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-fade-in">
            {quotes.length > 0 && <QuoteBox text={quotes[currentQuoteIndex].text} author={quotes[currentQuoteIndex].author} />}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/30 rounded-3xl p-12 md:p-16 text-center shadow-medium">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Take the first step towards better mental health. Join our community
              today and find the support you deserve.
            </p>
            <div className="flex justify-center">
              <Link to="/events">
                <Button size="lg" className="shadow-medium">
                  Book an Event
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