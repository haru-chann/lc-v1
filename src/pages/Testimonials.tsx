import { Play, Quote } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  videoThumbnail: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Community Member",
    quote: "InnerGlow helped me find my voice and realize I'm not alone in my struggles. The support here is incredible.",
    videoThumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Workshop Participant",
    quote: "The mindfulness sessions changed my life. I've learned tools that help me manage anxiety every single day.",
    videoThumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Support Group Member",
    quote: "Finding this community was a turning point. The volunteers are compassionate and the space feels so safe.",
    videoThumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "David Patel",
    role: "Event Attendee",
    quote: "I was skeptical at first, but the art therapy session helped me express emotions I didn't know I had.",
    videoThumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Regular Participant",
    quote: "The peer support groups gave me strength during my darkest times. Forever grateful to this community.",
    videoThumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Workshop Graduate",
    quote: "InnerGlow taught me that healing isn't linear, and that's perfectly okay. This community saved my life.",
    videoThumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=300&fit=crop",
  },
];

const Testimonials = () => {
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
                className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-smooth border border-border animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Video Thumbnail */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={testimonial.videoThumbnail}
                    alt={testimonial.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <Play className="text-primary-foreground ml-1" size={28} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <Quote className="text-primary/30" size={32} />
                  
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="font-bold text-lg">{testimonial.name}</p>
                    <p className="text-sm text-primary">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Admin CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 p-6 bg-secondary/30 rounded-2xl">
              <p className="text-muted-foreground">Want to share your story?</p>
              <Button variant="outline">
                Add Testimonial
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
