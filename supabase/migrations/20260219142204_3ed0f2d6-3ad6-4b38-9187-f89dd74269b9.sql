
-- Tạo bảng admin_documents
CREATE TABLE public.admin_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  uploaded_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_documents ENABLE ROW LEVEL SECURITY;

-- Chỉ admin mới có thể đọc
CREATE POLICY "Admins can view documents"
ON public.admin_documents
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Chỉ admin mới có thể upload
CREATE POLICY "Admins can insert documents"
ON public.admin_documents
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Chỉ admin mới có thể xóa
CREATE POLICY "Admins can delete documents"
ON public.admin_documents
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger tự động cập nhật updated_at
CREATE TRIGGER update_admin_documents_updated_at
BEFORE UPDATE ON public.admin_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Tạo storage bucket admin-documents (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-documents', 'admin-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS cho storage: chỉ admin upload
CREATE POLICY "Admins can upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'admin-documents'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- RLS cho storage: chỉ admin đọc
CREATE POLICY "Admins can read documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'admin-documents'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

-- RLS cho storage: chỉ admin xóa
CREATE POLICY "Admins can delete documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'admin-documents'
  AND public.has_role(auth.uid(), 'admin'::app_role)
);
