import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, AlertCircle, Info } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
}

const Updates = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "alert":
      case "event_cancellation":
        return <AlertCircle className="w-5 h-5" />;
      case "notification":
        return <Bell className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "alert":
      case "event_cancellation":
        return "destructive";
      case "notification":
        return "default";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <section className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
            Updates & News
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest news, notifications, and important announcements from Mann Ki Baat
          </p>
        </section>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No updates available at the moment.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                    </div>
                    <Badge variant={getTypeBadgeVariant(post.type)} className="flex items-center gap-1">
                      {getTypeIcon(post.type)}
                      {post.type.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Updates;
