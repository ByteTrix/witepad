
-- First, drop the problematic policies that are causing infinite recursion
DROP POLICY IF EXISTS "Users can view collaborators of accessible documents" ON public.document_collaborators;
DROP POLICY IF EXISTS "Document owners can manage collaborators" ON public.document_collaborators;

-- Create a security definer function to check if user can access a document
CREATE OR REPLACE FUNCTION public.user_can_access_document(doc_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.documents 
    WHERE id = doc_id 
    AND (owner_id = user_id OR is_public = true)
  );
$$;

-- Create a security definer function to check if user owns a document
CREATE OR REPLACE FUNCTION public.user_owns_document(doc_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.documents 
    WHERE id = doc_id 
    AND owner_id = user_id
  );
$$;

-- Recreate the document collaborators policies using the security definer functions
CREATE POLICY "Users can view collaborators of accessible documents" ON public.document_collaborators
  FOR SELECT USING (
    public.user_can_access_document(document_id, auth.uid())
  );

CREATE POLICY "Document owners can manage collaborators" ON public.document_collaborators
  FOR ALL USING (
    public.user_owns_document(document_id, auth.uid())
  );

-- Also fix the document operations policies to avoid potential issues
DROP POLICY IF EXISTS "Users can view operations of accessible documents" ON public.document_operations;
DROP POLICY IF EXISTS "Users can insert operations to accessible documents" ON public.document_operations;

CREATE POLICY "Users can view operations of accessible documents" ON public.document_operations
  FOR SELECT USING (
    public.user_can_access_document(document_id, auth.uid())
  );

CREATE POLICY "Users can insert operations to accessible documents" ON public.document_operations
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    (public.user_owns_document(document_id, auth.uid()) OR 
     EXISTS (
       SELECT 1 FROM public.document_collaborators 
       WHERE document_id = document_operations.document_id 
       AND user_id = auth.uid() 
       AND permission IN ('write', 'admin')
     ))
  );
