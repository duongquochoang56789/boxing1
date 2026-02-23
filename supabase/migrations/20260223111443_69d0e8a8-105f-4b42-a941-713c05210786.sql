
-- =============================================
-- MEGAPLAN Phase 1: Database Schema
-- 10 new tables + 3 storage buckets
-- =============================================

-- 1. brand_kits (create first since decks references it)
CREATE TABLE public.brand_kits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  logo_url text,
  logo_prompt text,
  slogan text,
  primary_color text NOT NULL DEFAULT '#C67A4B',
  secondary_color text NOT NULL DEFAULT '#2D2D2D',
  accent_color text NOT NULL DEFAULT '#8B9E82',
  bg_color text NOT NULL DEFAULT '#FAF3EB',
  heading_font text NOT NULL DEFAULT 'Cormorant Garamond',
  body_font text NOT NULL DEFAULT 'Be Vietnam Pro',
  accent_font text NOT NULL DEFAULT 'Bebas Neue',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own brand kits" ON public.brand_kits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own brand kits" ON public.brand_kits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own brand kits" ON public.brand_kits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own brand kits" ON public.brand_kits FOR DELETE USING (auth.uid() = user_id);

-- 2. decks
CREATE TABLE public.decks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  brand_kit_id uuid REFERENCES public.brand_kits(id) ON DELETE SET NULL,
  is_public boolean NOT NULL DEFAULT false,
  share_slug text UNIQUE,
  slide_count integer NOT NULL DEFAULT 0,
  thumbnail_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own decks" ON public.decks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view public decks" ON public.decks FOR SELECT USING (is_public = true);
CREATE POLICY "Users can create own decks" ON public.decks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own decks" ON public.decks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own decks" ON public.decks FOR DELETE USING (auth.uid() = user_id);

-- 3. deck_slides
CREATE TABLE public.deck_slides (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id uuid NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  slide_order integer NOT NULL,
  title text NOT NULL,
  subtitle text,
  content text NOT NULL DEFAULT '',
  layout text NOT NULL DEFAULT 'two-column',
  image_url text,
  image_prompt text,
  section_name text NOT NULL DEFAULT 'brand',
  background_color text NOT NULL DEFAULT '#1a1a2e',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.deck_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own deck slides" ON public.deck_slides FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = deck_slides.deck_id AND decks.user_id = auth.uid()));
CREATE POLICY "Anyone can view public deck slides" ON public.deck_slides FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = deck_slides.deck_id AND decks.is_public = true));
CREATE POLICY "Users can insert own deck slides" ON public.deck_slides FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = deck_slides.deck_id AND decks.user_id = auth.uid()));
CREATE POLICY "Users can update own deck slides" ON public.deck_slides FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = deck_slides.deck_id AND decks.user_id = auth.uid()));
CREATE POLICY "Users can delete own deck slides" ON public.deck_slides FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = deck_slides.deck_id AND decks.user_id = auth.uid()));

-- 4. reviews
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  comment text,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can view own reviews" ON public.reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. achievements
CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '🏆',
  badge_url text,
  condition_type text NOT NULL DEFAULT 'count',
  condition_value integer NOT NULL DEFAULT 1,
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. user_achievements
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view all earned achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "System can insert achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. user_streaks
CREATE TABLE public.user_streaks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_activity_date date,
  total_points integer NOT NULL DEFAULT 0
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks" ON public.user_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view streaks for leaderboard" ON public.user_streaks FOR SELECT USING (true);
CREATE POLICY "Users can upsert own streaks" ON public.user_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON public.user_streaks FOR UPDATE USING (auth.uid() = user_id);

-- 8. ai_meal_plans
CREATE TABLE public.ai_meal_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  goal text NOT NULL,
  preferences text NOT NULL DEFAULT '',
  plan_content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meal plans" ON public.ai_meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create meal plans" ON public.ai_meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal plans" ON public.ai_meal_plans FOR DELETE USING (auth.uid() = user_id);

-- 9. ai_workout_plans
CREATE TABLE public.ai_workout_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  goal text NOT NULL,
  fitness_level text NOT NULL DEFAULT 'beginner',
  plan_content text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout plans" ON public.ai_workout_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create workout plans" ON public.ai_workout_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own workout plans" ON public.ai_workout_plans FOR DELETE USING (auth.uid() = user_id);

-- 10. blog_posts
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL DEFAULT '',
  excerpt text NOT NULL DEFAULT '',
  cover_image_url text,
  category text NOT NULL DEFAULT 'general',
  tags text[] DEFAULT '{}',
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Authors can view own posts" ON public.blog_posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Admins can manage all posts" ON public.blog_posts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authors can create posts" ON public.blog_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.blog_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own posts" ON public.blog_posts FOR DELETE USING (auth.uid() = author_id);

-- Updated_at triggers for new tables
CREATE TRIGGER update_brand_kits_updated_at BEFORE UPDATE ON public.brand_kits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_decks_updated_at BEFORE UPDATE ON public.decks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deck_slides_updated_at BEFORE UPDATE ON public.deck_slides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_deck_slides_deck_id ON public.deck_slides(deck_id);
CREATE INDEX idx_deck_slides_order ON public.deck_slides(deck_id, slide_order);
CREATE INDEX idx_decks_user_id ON public.decks(user_id);
CREATE INDEX idx_decks_share_slug ON public.decks(share_slug) WHERE share_slug IS NOT NULL;
CREATE INDEX idx_reviews_target ON public.reviews(target_type, target_id);
CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('deck-assets', 'deck-assets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Storage policies
CREATE POLICY "Anyone can view deck assets" ON storage.objects FOR SELECT USING (bucket_id = 'deck-assets');
CREATE POLICY "Authenticated users can upload deck assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'deck-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own deck assets" ON storage.objects FOR UPDATE USING (bucket_id = 'deck-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own deck assets" ON storage.objects FOR DELETE USING (bucket_id = 'deck-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view brand assets" ON storage.objects FOR SELECT USING (bucket_id = 'brand-assets');
CREATE POLICY "Authenticated users can upload brand assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'brand-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own brand assets" ON storage.objects FOR UPDATE USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own brand assets" ON storage.objects FOR DELETE USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view blog images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
CREATE POLICY "Authenticated users can upload blog images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own blog images" ON storage.objects FOR UPDATE USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own blog images" ON storage.objects FOR DELETE USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);
