DO $$
BEGIN
  -- Allow anyone to read/list objects in the public banner-images bucket
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public can read banner-images'
  ) THEN
    CREATE POLICY "Public can read banner-images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'banner-images');
  END IF;

  -- Allow admins to upload objects to banner-images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can upload banner-images'
  ) THEN
    CREATE POLICY "Admins can upload banner-images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'banner-images'
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;

  -- Allow admins to update objects in banner-images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can update banner-images'
  ) THEN
    CREATE POLICY "Admins can update banner-images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'banner-images'
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    )
    WITH CHECK (
      bucket_id = 'banner-images'
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;

  -- Allow admins to delete objects in banner-images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can delete banner-images'
  ) THEN
    CREATE POLICY "Admins can delete banner-images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'banner-images'
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;
END $$;