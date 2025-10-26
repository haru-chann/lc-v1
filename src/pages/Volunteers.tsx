import { Heart, Linkedin, Mail } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Volunteer {
  id: number;
  name: string;
  role: string;
  quote: string;
  image: string;
  specialization: string;
}

const volunteers: Volunteer[] = [
  {
    id: 1,
    name: "Dr. Amanda Foster",
    role: "Clinical Psychologist",
    quote: "Mental health is a journey, not a destination. I'm here to walk alongside you.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    specialization: "Anxiety & Depression",
  },
  {
    id: 2,
    name: "Marcus Williams",
    role: "Peer Support Specialist",
    quote: "I've been where you are. Let's navigate this together.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    specialization: "Recovery & Resilience",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Mindfulness Coach",
    quote: "Finding peace within yourself is the greatest gift you can give yourself.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    specialization: "Meditation & Mindfulness",
  },
  {
    id: 4,
    name: "Alex Rivera",
    role: "Art Therapist",
    quote: "Sometimes words aren't enough. Let art speak for you.",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop",
    specialization: "Creative Expression",
  },
  {
    id: 5,
    name: "Dr. Rachel Kim",
    role: "Counseling Psychologist",
    quote: "You are worthy of love, support, and healing.",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
    specialization: "Trauma & PTSD",
  },
  {
    id: 6,
    name: "Jordan Taylor",
    role: "Group Facilitator",
    quote: "Together, we're stronger. Your story matters here.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    specialization: "Support Groups",
  },
];

const Volunteers = () => {
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {volunteers.map((volunteer, index) => (
              <div
                key={volunteer.id}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-smooth border border-border animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={volunteer.image}
                    alt={volunteer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Hover Info */}
                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-smooth flex flex-col items-center justify-center p-6 text-center">
                    <Heart className="text-primary-foreground mb-4" size={32} />
                    <p className="text-primary-foreground italic leading-relaxed">
                      "{volunteer.quote}"
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-bold">{volunteer.name}</h3>
                  <p className="text-primary font-medium">{volunteer.role}</p>
                  <p className="text-sm text-muted-foreground">
                    Specialization: {volunteer.specialization}
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex gap-3 pt-2">
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                    >
                      <Linkedin size={18} />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                    >
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <a href="mailto:volunteer@innerglow.com">
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
