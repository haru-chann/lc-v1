import { useState, useEffect } from "react";
import { Lock, Calendar, MessageSquare, Quote, Save, Plus, Edit, Trash2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const whatsappSchema = z.object({
  whatsapp_contact: z.string().min(1).max(100).trim(),
});

const eventSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  date: z.string().min(1),
  time: z.string().min(1).max(100).trim(),
  description: z.string().min(1).max(1000).trim(),
  location: z.string().min(1).max(200).trim(),
});

const testimonialSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  role: z.string().min(1).max(100).trim(),
  video_url: z.string().url().max(500).trim(),
  thumbnail_url: z.string().url().max(500).trim(),
});

const quoteSchema = z.object({
  text: z.string().min(1).max(500).trim(),
  author: z.string().max(100).trim().optional(),
});

type WhatsAppFormValues = z.infer<typeof whatsappSchema>;
type EventFormValues = z.infer<typeof eventSchema>;
type TestimonialFormValues = z.infer<typeof testimonialSchema>;
type QuoteFormValues = z.infer<typeof quoteSchema>;

const Admin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const whatsappForm = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsappSchema),
    defaultValues: { whatsapp_contact: "" },
  });

  const eventForm = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      date: "",
      time: "",
      description: "",
      location: "",
    },
  });

  const testimonialForm = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      role: "",
      video_url: "",
      thumbnail_url: "",
    },
  });

  const quoteForm = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      text: "",
      author: "",
    },
  });

  useEffect(() => {
    fetchWhatsAppContact();
    fetchEvents();
    fetchTestimonials();
    fetchQuotes();
  }, []);

  const fetchWhatsAppContact = async () => {
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "whatsapp_contact")
      .maybeSingle();
    if (data) whatsappForm.reset({ whatsapp_contact: data.value });
  };

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("date", { ascending: true });
    if (data) setEvents(data);
  };

  const fetchTestimonials = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (data) setTestimonials(data);
  };

  const fetchQuotes = async () => {
    const { data } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
    if (data) setQuotes(data);
  };

  const onWhatsAppSubmit = async (values: WhatsAppFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("settings").upsert({
        key: "whatsapp_contact",
        value: values.whatsapp_contact.trim(),
      }, { onConflict: "key" });
      if (error) throw error;
      toast({ title: "Success", description: "WhatsApp contact updated successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onEventSubmit = async (values: EventFormValues) => {
    setIsLoading(true);
    try {
      if (editingItem?.id) {
        const { error } = await supabase.from("events").update(values as any).eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Success", description: "Event updated successfully" });
      } else {
        const { error } = await supabase.from("events").insert([values as any]);
        if (error) throw error;
        toast({ title: "Success", description: "Event created successfully" });
      }
      fetchEvents();
      setDialogOpen(false);
      setEditingItem(null);
      eventForm.reset({
        name: "",
        date: "",
        time: "",
        description: "",
        location: "",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onTestimonialSubmit = async (values: TestimonialFormValues) => {
    setIsLoading(true);
    try {
      if (editingItem?.id) {
        const { error } = await supabase.from("testimonials").update(values as any).eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Success", description: "Testimonial updated successfully" });
      } else {
        const { error } = await supabase.from("testimonials").insert([values as any]);
        if (error) throw error;
        toast({ title: "Success", description: "Testimonial created successfully" });
      }
      fetchTestimonials();
      setDialogOpen(false);
      setEditingItem(null);
      testimonialForm.reset({
        name: "",
        role: "",
        video_url: "",
        thumbnail_url: "",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onQuoteSubmit = async (values: QuoteFormValues) => {
    setIsLoading(true);
    try {
      if (editingItem?.id) {
        const { error } = await supabase.from("quotes").update(values as any).eq("id", editingItem.id);
        if (error) throw error;
        toast({ title: "Success", description: "Quote updated successfully" });
      } else {
        const { error } = await supabase.from("quotes").insert([{ ...values, is_active: true } as any]);
        if (error) throw error;
        toast({ title: "Success", description: "Quote created successfully" });
      }
      fetchQuotes();
      setDialogOpen(false);
      setEditingItem(null);
      quoteForm.reset({
        text: "",
        author: "",
      });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Event deleted successfully" });
      fetchEvents();
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Testimonial deleted successfully" });
      fetchTestimonials();
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;
    const { error } = await supabase.from("quotes").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Quote deleted successfully" });
      fetchQuotes();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Lock className="mx-auto text-primary mb-6" size={64} />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Admin Dashboard
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up">
            Manage events, testimonials, and motivational quotes for the InnerGlow community.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* WhatsApp Configuration */}
            <Card className="shadow-soft border-border animate-fade-in mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="text-primary" size={24} />
                  WhatsApp Configuration
                </CardTitle>
                <CardDescription>
                  Set the WhatsApp phone number or link for event bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...whatsappForm}>
                  <form onSubmit={whatsappForm.handleSubmit(onWhatsAppSubmit)} className="space-y-4">
                    <FormField
                      control={whatsappForm.control}
                      name="whatsapp_contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890 or wa.me/1234567890" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter a phone number (e.g., 1234567890) or WhatsApp link
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} className="shadow-soft">
                      <Save className="mr-2" size={18} />
                      {isLoading ? "Saving..." : "Save Configuration"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Management Tabs */}
            <Tabs defaultValue="events" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
              </TabsList>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-4">
                <Dialog open={dialogOpen && editingItem?.type === 'event'} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingItem(null); eventForm.reset(); } }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingItem({ type: 'event' }); setDialogOpen(true); }} className="mb-4">
                      <Plus className="mr-2" size={18} />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingItem?.id ? 'Edit' : 'Add'} Event</DialogTitle>
                      <DialogDescription>Fill in the event details below</DialogDescription>
                    </DialogHeader>
                    <Form {...eventForm}>
                      <form onSubmit={eventForm.handleSubmit(onEventSubmit)} className="space-y-4">
                        <FormField control={eventForm.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={eventForm.control} name="date" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl><Input type="date" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={eventForm.control} name="time" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <FormControl><Input placeholder="6:00 PM - 7:30 PM" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={eventForm.control} name="location" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={eventForm.control} name="description" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Event"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <div className="grid gap-4">
                  {events.map(event => (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{event.name}</h3>
                            <p className="text-sm text-muted-foreground">{event.date} • {event.time}</p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                            <p className="mt-2">{event.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingItem({ ...event, type: 'event' }); eventForm.reset(event); setDialogOpen(true); }}>
                              <Edit size={16} />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteEvent(event.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Testimonials Tab */}
              <TabsContent value="testimonials" className="space-y-4">
                <Dialog open={dialogOpen && editingItem?.type === 'testimonial'} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingItem(null); testimonialForm.reset(); } }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingItem({ type: 'testimonial' }); setDialogOpen(true); }} className="mb-4">
                      <Plus className="mr-2" size={18} />
                      Add Testimonial
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem?.id ? 'Edit' : 'Add'} Testimonial</DialogTitle>
                      <DialogDescription>Fill in the testimonial details below</DialogDescription>
                    </DialogHeader>
                    <Form {...testimonialForm}>
                      <form onSubmit={testimonialForm.handleSubmit(onTestimonialSubmit)} className="space-y-4">
                        <FormField control={testimonialForm.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={testimonialForm.control} name="role" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={testimonialForm.control} name="video_url" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video URL</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={testimonialForm.control} name="thumbnail_url" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thumbnail URL</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Testimonial"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <div className="grid gap-4">
                  {testimonials.map(testimonial => (
                    <Card key={testimonial.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{testimonial.name}</h3>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingItem({ ...testimonial, type: 'testimonial' }); testimonialForm.reset(testimonial); setDialogOpen(true); }}>
                              <Edit size={16} />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteTestimonial(testimonial.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Quotes Tab */}
              <TabsContent value="quotes" className="space-y-4">
                <Dialog open={dialogOpen && editingItem?.type === 'quote'} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingItem(null); quoteForm.reset(); } }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { setEditingItem({ type: 'quote' }); setDialogOpen(true); }} className="mb-4">
                      <Plus className="mr-2" size={18} />
                      Add Quote
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingItem?.id ? 'Edit' : 'Add'} Quote</DialogTitle>
                      <DialogDescription>Fill in the quote details below</DialogDescription>
                    </DialogHeader>
                    <Form {...quoteForm}>
                      <form onSubmit={quoteForm.handleSubmit(onQuoteSubmit)} className="space-y-4">
                        <FormField control={quoteForm.control} name="text" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quote Text</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={quoteForm.control} name="author" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author (optional)</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Quote"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <div className="grid gap-4">
                  {quotes.map(quote => (
                    <Card key={quote.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="italic">"{quote.text}"</p>
                            {quote.author && <p className="text-sm text-muted-foreground mt-2">— {quote.author}</p>}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setEditingItem({ ...quote, type: 'quote' }); quoteForm.reset(quote); setDialogOpen(true); }}>
                              <Edit size={16} />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteQuote(quote.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
