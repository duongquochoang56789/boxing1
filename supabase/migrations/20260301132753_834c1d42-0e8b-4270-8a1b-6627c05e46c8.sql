
-- Create slide_templates table for storing reusable deck templates
CREATE TABLE public.slide_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'general',
  thumbnail_emoji TEXT NOT NULL DEFAULT '📊',
  accent_color TEXT NOT NULL DEFAULT '#6366f1',
  slide_count INTEGER NOT NULL DEFAULT 1,
  slides JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.slide_templates ENABLE ROW LEVEL SECURITY;

-- Anyone can view templates (public gallery)
CREATE POLICY "Anyone can view slide templates"
ON public.slide_templates FOR SELECT
USING (true);

-- Only admins can manage templates
CREATE POLICY "Admins can manage slide templates"
ON public.slide_templates FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
