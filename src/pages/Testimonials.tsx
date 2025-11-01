import { Play } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  video_url: string;
  thumbnail_url: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
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
            Community Stories
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up">
            Real stories from real people. Hear how InnerGlow has impacted lives and created meaningful connections.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-glow border border-border hover-glow-strong neon-border animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Video Thumbnail */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={testimonial.thumbnail_url}
                    alt={testimonial.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                    <a 
                      href={testimonial.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,127,107,0.8)] group-hover:scale-110 transition-glow"
                    >
                      <Play className="text-primary-foreground ml-1" size={28} />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="pt-4">
                    <p className="font-bold text-lg">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {testimonials.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No testimonials available yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
