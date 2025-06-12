
-- DrawBoard Database Schema
-- This file contains the complete database schema for self-hosting DrawBoard

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table for tldraw documents
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Untitled',
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}',
  snapshot JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_collaborators table for sharing
CREATE TABLE public.document_collaborators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission TEXT CHECK (permission IN ('read', 'write', 'admin')) DEFAULT 'write',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, user_id)
);

-- Create real-time sync table for tldraw operations
CREATE TABLE public.document_operations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  operation JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_operations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Documents policies
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (
    owner_id = auth.uid() OR 
    is_public = true OR
    id IN (
      SELECT document_id FROM public.document_collaborators 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own documents" ON public.documents
  FOR UPDATE USING (
    owner_id = auth.uid() OR
    id IN (
      SELECT document_id FROM public.document_collaborators 
      WHERE user_id = auth.uid() AND permission IN ('write', 'admin')
    )
  );

CREATE POLICY "Users can delete own documents" ON public.documents
  FOR DELETE USING (owner_id = auth.uid());

-- Document collaborators policies
CREATE POLICY "Users can view collaborators of accessible documents" ON public.document_collaborators
  FOR SELECT USING (
    document_id IN (
      SELECT id FROM public.documents 
      WHERE owner_id = auth.uid() OR 
      id IN (SELECT document_id FROM public.document_collaborators WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Document owners can manage collaborators" ON public.document_collaborators
  FOR ALL USING (
    document_id IN (SELECT id FROM public.documents WHERE owner_id = auth.uid())
  );

-- Document operations policies (for real-time sync)
CREATE POLICY "Users can view operations of accessible documents" ON public.document_operations
  FOR SELECT USING (
    document_id IN (
      SELECT id FROM public.documents 
      WHERE owner_id = auth.uid() OR 
      id IN (SELECT document_id FROM public.document_collaborators WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert operations to accessible documents" ON public.document_operations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    document_id IN (
      SELECT id FROM public.documents 
      WHERE owner_id = auth.uid() OR 
      id IN (
        SELECT document_id FROM public.document_collaborators 
        WHERE user_id = auth.uid() AND permission IN ('write', 'admin')
      )
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable realtime for documents and operations
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.document_operations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.document_collaborators;

-- Set replica identity for realtime
ALTER TABLE public.documents REPLICA IDENTITY FULL;
ALTER TABLE public.document_operations REPLICA IDENTITY FULL;
ALTER TABLE public.document_collaborators REPLICA IDENTITY FULL;

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true);

-- Storage policies
CREATE POLICY "Users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
