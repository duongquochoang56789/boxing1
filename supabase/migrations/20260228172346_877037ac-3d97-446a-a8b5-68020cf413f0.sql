-- Add theme and transition columns to decks table
ALTER TABLE public.decks 
  ADD COLUMN IF NOT EXISTS theme text NOT NULL DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS transition text NOT NULL DEFAULT 'fade';