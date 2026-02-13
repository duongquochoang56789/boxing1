
-- Create site_content table
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL,
  content_type TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint for section + content_type + key
CREATE UNIQUE INDEX idx_site_content_unique ON public.site_content (section, content_type, key);

-- Create index for section lookups
CREATE INDEX idx_site_content_section ON public.site_content (section);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view site content"
ON public.site_content
FOR SELECT
USING (true);

-- Admins can manage content
CREATE POLICY "Admins can manage site content"
ON public.site_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for site images
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

-- Public read access for site-images bucket
CREATE POLICY "Anyone can view site images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-images');

-- Admins can upload site images
CREATE POLICY "Admins can upload site images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Admins can update site images
CREATE POLICY "Admins can update site images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete site images
CREATE POLICY "Admins can delete site images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'site-images' AND has_role(auth.uid(), 'admin'::app_role));
