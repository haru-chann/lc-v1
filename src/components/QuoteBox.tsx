import { Quote } from "lucide-react";

interface QuoteBoxProps {
  text: string;
  author?: string;
}

const QuoteBox = ({ text, author }: QuoteBoxProps) => {
  return (
    <div className="relative bg-secondary/30 rounded-2xl p-8 shadow-soft hover:shadow-medium transition-smooth">
      <Quote className="absolute top-4 left-4 text-primary/20" size={48} />
      <blockquote className="relative z-10 space-y-4">
        <p className="text-lg md:text-xl font-medium text-primary italic leading-relaxed">
          "{text}"
        </p>
        {author && (
          <footer className="text-sm text-muted-foreground font-medium">
            — {author}
          </footer>
        )}
      </blockquote>
    </div>
  );
};

export default QuoteBox;
