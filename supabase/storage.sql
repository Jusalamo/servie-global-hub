-- Create a new storage bucket for service images
-- NOTE: Bucket is public for read access since service images need to be viewable by all users
-- Write/Delete access is controlled via RLS policies below
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- SECURITY NOTE: While the bucket is public for SELECT (required for public listings),
-- INSERT/UPDATE/DELETE operations are protected by RLS policies that:
-- 1. Require authentication
-- 2. Enforce user ownership via folder structure (user_id as first folder)

-- Set up policy to allow anyone to view service images (required for public listings)
CREATE POLICY "Anyone can view service images"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

-- Create policy to allow authenticated users to upload service images to their own folder
-- Files must be uploaded to: service-images/{user_id}/{filename}
CREATE POLICY "Authenticated users can upload service images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'service-images' AND
    auth.role() = 'authenticated' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to update their own service images only
CREATE POLICY "Users can update their own service images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'service-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to delete their own service images only
CREATE POLICY "Users can delete their own service images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'service-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
