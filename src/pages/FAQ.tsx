import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is InnerGlow?",
    answer: "InnerGlow is a mental health awareness and listening community dedicated to providing support, resources, and safe spaces for individuals on their mental wellness journey. We offer peer support groups, workshops, and events facilitated by trained volunteers and mental health professionals.",
  },
  {
    question: "Do I need to pay to attend events?",
    answer: "Most of our events are completely free! We believe mental health support should be accessible to everyone. Some specialized workshops may have a small fee to cover materials, but we always offer scholarship options for those in need.",
  },
  {
    question: "Are your services confidential?",
    answer: "Yes, absolutely. We take confidentiality very seriously. Everything shared in our support groups and sessions remains private. We follow strict privacy guidelines to ensure you feel safe and secure when sharing your experiences.",
  },
  {
    question: "Who are your volunteers?",
    answer: "Our volunteers include licensed mental health professionals, peer support specialists, trained facilitators, and compassionate community members. All volunteers undergo thorough training and background checks before working with our community.",
  },
  {
    question: "Can I attend events if I'm not in crisis?",
    answer: "Absolutely! InnerGlow is for everyone, whether you're in crisis, seeking preventive care, or simply want to maintain your mental wellness. You don't need to be struggling to join our community - we welcome all who want to prioritize their mental health.",
  },
  {
    question: "What if I can't attend events in person?",
    answer: "We offer many online events via Zoom, making our support accessible from anywhere. Check our events page to see which sessions are offered online. We're committed to making mental health support available to everyone, regardless of location.",
  },
  {
    question: "How do I book an event?",
    answer: "Simply visit our Events page, find an event that interests you, and click the 'Book via WhatsApp' button. You'll be directed to send us a message with your booking request. You'll receive confirmation and event details shortly after.",
  },
  {
    question: "Can I volunteer with InnerGlow?",
    answer: "Yes! We're always looking for dedicated, compassionate individuals to join our team. Whether you're a mental health professional or someone with lived experience who wants to give back, we'd love to hear from you. Contact us through our Contact page to learn more about volunteer opportunities.",
  },
  {
    question: "What types of events do you offer?",
    answer: "We offer a variety of events including mindfulness and meditation circles, mental health awareness workshops, peer support groups, art therapy sessions, stress management workshops, and community wellness activities. Check our Events page for the full schedule.",
  },
  {
    question: "Is InnerGlow a replacement for professional therapy?",
    answer: "While we provide valuable support and resources, InnerGlow is not a substitute for professional mental health treatment. We complement traditional therapy by offering peer support and community connection. If you're experiencing a mental health crisis, please contact a licensed professional or emergency services.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Header */}
      <section className="gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="mx-auto text-primary mb-6" size={64} />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up">
            Find answers to common questions about InnerGlow, our services, and how we can support your mental wellness journey.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-2xl border border-border shadow-soft px-6 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <AccordionTrigger className="text-left hover:text-primary transition-smooth py-6">
                    <span className="text-lg font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Still Have Questions CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-6 p-8 bg-gradient-to-r from-primary/10 to-secondary/30 rounded-2xl shadow-medium max-w-2xl">
              <h3 className="text-2xl font-bold">Still have questions?</h3>
              <p className="text-muted-foreground">
                We're here to help! Reach out to our team and we'll get back to you as soon as possible.
              </p>
              <a href="/contact">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:scale-105 transition-smooth shadow-soft">
                  Contact Us
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
