-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  emergency_contact TEXT,
  health_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create trainers table for PT information
CREATE TABLE public.trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  specialization TEXT,
  bio TEXT,
  avatar_url TEXT,
  experience_years INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group_classes table for class types
CREATE TABLE public.group_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  max_participants INTEGER NOT NULL DEFAULT 15,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_schedules table for scheduled classes
CREATE TABLE public.class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.group_classes(id) ON DELETE CASCADE NOT NULL,
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  room TEXT DEFAULT 'Studio A',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_registrations table for class bookings
CREATE TABLE public.class_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES public.class_schedules(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled', 'no_show')),
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (schedule_id, user_id)
);

-- Create pt_sessions table for personal training sessions
CREATE TABLE public.pt_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trainer_availability table for PT schedules
CREATE TABLE public.trainer_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_availability ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'));
  
  -- Assign member role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers for all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trainers_updated_at
  BEFORE UPDATE ON public.trainers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_classes_updated_at
  BEFORE UPDATE ON public.group_classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_schedules_updated_at
  BEFORE UPDATE ON public.class_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_registrations_updated_at
  BEFORE UPDATE ON public.class_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pt_sessions_updated_at
  BEFORE UPDATE ON public.pt_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles (admin only)
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for trainers (public read, admin write)
CREATE POLICY "Anyone can view active trainers"
  ON public.trainers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage trainers"
  ON public.trainers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for group_classes (public read, admin write)
CREATE POLICY "Anyone can view active classes"
  ON public.group_classes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage classes"
  ON public.group_classes FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for class_schedules (public read, admin write)
CREATE POLICY "Anyone can view scheduled classes"
  ON public.class_schedules FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage schedules"
  ON public.class_schedules FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for class_registrations
CREATE POLICY "Users can view their own registrations"
  ON public.class_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can register for classes"
  ON public.class_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their registrations"
  ON public.class_registrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all registrations"
  ON public.class_registrations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pt_sessions
CREATE POLICY "Users can view their own PT sessions"
  ON public.pt_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can book PT sessions"
  ON public.pt_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their PT sessions"
  ON public.pt_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Trainers can view their sessions"
  ON public.pt_sessions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.trainers 
    WHERE trainers.id = pt_sessions.trainer_id 
    AND trainers.user_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all PT sessions"
  ON public.pt_sessions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for trainer_availability (public read, admin/trainer write)
CREATE POLICY "Anyone can view trainer availability"
  ON public.trainer_availability FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage availability"
  ON public.trainer_availability FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_class_schedules_start_time ON public.class_schedules(start_time);
CREATE INDEX idx_class_schedules_class_id ON public.class_schedules(class_id);
CREATE INDEX idx_class_registrations_schedule_id ON public.class_registrations(schedule_id);
CREATE INDEX idx_class_registrations_user_id ON public.class_registrations(user_id);
CREATE INDEX idx_pt_sessions_trainer_id ON public.pt_sessions(trainer_id);
CREATE INDEX idx_pt_sessions_user_id ON public.pt_sessions(user_id);
CREATE INDEX idx_pt_sessions_start_time ON public.pt_sessions(start_time);
CREATE INDEX idx_trainer_availability_trainer_id ON public.trainer_availability(trainer_id);