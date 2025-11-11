-- Create posts/updates table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'news', -- news, notification, alert, event_cancellation
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Anyone can view active posts"
ON public.posts
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can insert posts"
ON public.posts
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update posts"
ON public.posts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete posts"
ON public.posts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();

-- Create memory lane gallery table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gallery
CREATE POLICY "Anyone can view active gallery images"
ON public.gallery_images
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can insert gallery images"
ON public.gallery_images
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update gallery images"
ON public.gallery_images
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete gallery images"
ON public.gallery_images
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for memory lane images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memory-lane', 'memory-lane', true);

-- Storage policies for memory lane bucket
CREATE POLICY "Anyone can view memory lane images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'memory-lane');

CREATE POLICY "Admins can upload memory lane images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'memory-lane' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update memory lane images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'memory-lane' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete memory lane images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'memory-lane' AND has_role(auth.uid(), 'admin'::app_role));