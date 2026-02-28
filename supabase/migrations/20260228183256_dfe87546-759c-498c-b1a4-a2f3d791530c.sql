
-- Slide comments table
CREATE TABLE public.slide_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slide_id UUID NOT NULL REFERENCES public.deck_slides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.slide_comments ENABLE ROW LEVEL SECURITY;

-- Anyone who can see the deck can see comments
CREATE POLICY "Users can view comments on own deck slides"
ON public.slide_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deck_slides ds
    JOIN decks d ON d.id = ds.deck_id
    WHERE ds.id = slide_comments.slide_id
    AND (d.user_id = auth.uid() OR d.is_public = true)
  )
);

CREATE POLICY "Users can create comments on own deck slides"
ON public.slide_comments FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM deck_slides ds
    JOIN decks d ON d.id = ds.deck_id
    WHERE ds.id = slide_comments.slide_id
    AND (d.user_id = auth.uid() OR d.is_public = true)
  )
);

CREATE POLICY "Users can update own comments"
ON public.slide_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON public.slide_comments FOR DELETE
USING (auth.uid() = user_id);

-- Slide version history table
CREATE TABLE public.slide_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slide_id UUID NOT NULL REFERENCES public.deck_slides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL DEFAULT '',
  layout TEXT NOT NULL DEFAULT 'two-column',
  notes TEXT,
  version_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.slide_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of own deck slides"
ON public.slide_versions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM deck_slides ds
    JOIN decks d ON d.id = ds.deck_id
    WHERE ds.id = slide_versions.slide_id
    AND d.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create versions of own deck slides"
ON public.slide_versions FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM deck_slides ds
    JOIN decks d ON d.id = ds.deck_id
    WHERE ds.id = slide_versions.slide_id
    AND d.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete versions of own deck slides"
ON public.slide_versions FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM deck_slides ds
    JOIN decks d ON d.id = ds.deck_id
    WHERE ds.id = slide_versions.slide_id
    AND d.user_id = auth.uid()
  )
);

-- Enable realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.slide_comments;

-- Trigger for updated_at
CREATE TRIGGER update_slide_comments_updated_at
BEFORE UPDATE ON public.slide_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
