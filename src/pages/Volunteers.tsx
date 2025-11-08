import { useState, useEffect } from "react";
import { Heart, Linkedin, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface Volunteer {
  id: string;
  name: string;
  role: string;
  quote: string;
  image_url: string;
  display_order: number;
}

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      if (data) setVolunteers(data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Header */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Meet Our Volunteers
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up">
            Our dedicated team of mental health professionals, peer supporters, and compassionate listeners are here for you.
          </p>
        </div>
      </section>

      {/* Volunteers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {volunteers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {volunteers.map((volunteer, index) => (
                <div
                  key={volunteer.id}
                  className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-glow border border-border hover-glow-strong neon-border animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={volunteer.image_url}
                      alt={volunteer.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Hover Info */}
                    <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-glow flex flex-col items-center justify-center p-6 text-center shadow-[inset_0_0_60px_rgba(255,127,107,0.4)]">
                      <Heart className="text-primary-foreground mb-4 animate-pulse-glow" size={32} />
                      <p className="text-primary-foreground italic leading-relaxed">
                        "{volunteer.quote}"
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-2xl font-bold">{volunteer.name}</h3>
                    <p className="text-primary font-medium">{volunteer.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No volunteers listed at the moment.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/30 rounded-3xl p-12 md:p-16 text-center shadow-medium">
            <Heart className="mx-auto text-primary mb-6" size={48} />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Want to Volunteer?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join our compassionate team and make a difference in people's lives. We're always looking for dedicated individuals who want to support mental health awareness.
            </p>
            <a href="/contact">
              <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:scale-105 transition-smooth shadow-medium">
                Get in Touch
              </button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Volunteers;
