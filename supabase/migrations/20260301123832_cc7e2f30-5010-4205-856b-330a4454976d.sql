
-- Add background_image_url column to deck_slides
ALTER TABLE public.deck_slides ADD COLUMN IF NOT EXISTS background_image_url text DEFAULT NULL;
