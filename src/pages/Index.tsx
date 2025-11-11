import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, Users, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import QuoteBox from "@/components/QuoteBox";
import heroImage from "@/assets/hero-image.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [quotes, setQuotes] = useState<Array<{ text: string; author?: string }>>([]);

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [quotes.length]);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setQuotes(data.map(q => ({ text: q.text, author: q.author || undefined })));
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                A space to listen, heal, and{" "}
                <span className="text-primary">grow</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Join ListeningClub, a compassionate community dedicated to mental health
                awareness and emotional wellbeing. You're not alone.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/events">
                  <Button size="lg" className="shadow-medium">
                    <Calendar className="mr-2" size={20} />
                    Join a Session
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="shadow-soft">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <img
                src={heroImage}
                alt="ListeningClub Community"
                className="rounded-3xl shadow-large w-full h-auto object-cover"
              />
              {/* Floating coral accents */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-float animate-pulse-glow"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/40 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How We Support You
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ListeningClub offers multiple ways to connect, heal, and find support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-smooth border border-border hover-glow-strong neon-border">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-glow group-hover:shadow-[0_0_30px_rgba(255,127,107,0.5)]">
                <Calendar className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Live Sessions</h3>
              <p className="text-muted-foreground leading-relaxed">
                Join our community sessions, workshops, and support groups led by
                trained volunteers and mental health advocates.
              </p>
            </div>

            <div className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-smooth border border-border hover-glow-strong neon-border">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-glow group-hover:shadow-[0_0_30px_rgba(255,127,107,0.5)]">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Peer Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with others who understand your journey. Share experiences
                and find comfort in a safe, judgment-free space.
              </p>
            </div>

            <div className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-large transition-smooth border border-border hover-glow-strong neon-border">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-glow group-hover:shadow-[0_0_30px_rgba(255,127,107,0.5)]">
                <Heart className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Resources</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access curated mental health resources, coping strategies, and
                professional guidance to support your wellbeing journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Quote Section */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-fade-in">
            {quotes.length > 0 && (
              <QuoteBox
                text={quotes[currentQuoteIndex].text}
                author={quotes[currentQuoteIndex].author}
              />
            )}
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
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/events">
                <Button size="lg" className="shadow-medium">
                  Book an Event
                </Button>
              </Link>
              <Link to="/volunteers">
                <Button size="lg" variant="outline">
                  Meet Our Volunteers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
