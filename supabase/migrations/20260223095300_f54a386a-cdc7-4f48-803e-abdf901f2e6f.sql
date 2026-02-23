
-- Create backups storage bucket (private, admin only)
INSERT INTO storage.buckets (id, name, public)
VALUES ('backups', 'backups', false);

-- Admin can read backups
CREATE POLICY "Admins can read backups"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'backups' AND public.has_role(auth.uid(), 'admin'));

-- Admin can upload backups
CREATE POLICY "Admins can upload backups"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'backups' AND public.has_role(auth.uid(), 'admin'));

-- Admin can delete backups
CREATE POLICY "Admins can delete backups"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'backups' AND public.has_role(auth.uid(), 'admin'));
