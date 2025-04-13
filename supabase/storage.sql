
-- Create a new storage bucket for service images
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true);

-- Set up policy to allow users to upload images to this bucket
CREATE POLICY "Anyone can view service images"
ON storage.objects FOR SELECT
USING (bucket_id = 'service-images');

-- Create policy to allow providers to upload service images
CREATE POLICY "Authenticated users can upload service images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'service-images' AND
    auth.role() = 'authenticated'
);

-- Create policy to allow providers to update their own service images
CREATE POLICY "Providers can update their own service images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'service-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow providers to delete their own service images
CREATE POLICY "Providers can delete their own service images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'service-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
);
