
-- Create project_slides table
CREATE TABLE public.project_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slide_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL DEFAULT '',
  layout TEXT NOT NULL DEFAULT 'default',
  image_url TEXT,
  image_prompt TEXT,
  background_color TEXT NOT NULL DEFAULT '#1a1a2e',
  section_name TEXT NOT NULL DEFAULT 'brand',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_slides ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view slides"
ON public.project_slides FOR SELECT
USING (true);

-- Admin write access
CREATE POLICY "Admins can insert slides"
ON public.project_slides FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update slides"
ON public.project_slides FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete slides"
ON public.project_slides FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE TRIGGER update_project_slides_updated_at
BEFORE UPDATE ON public.project_slides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('project-slides', 'project-slides', true);

-- Storage policies
CREATE POLICY "Anyone can view project slides"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-slides');

CREATE POLICY "Admins can upload project slides"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-slides' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update project slides"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-slides' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete project slides"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-slides' AND public.has_role(auth.uid(), 'admin'));
