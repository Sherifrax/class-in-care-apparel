-- 1) Ensure admin profile exists and has admin role
DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'amrodew@gmail.com' LIMIT 1;
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (admin_id, 'Admin', 'admin'::user_role)
    ON CONFLICT (id) DO UPDATE SET role = 'admin'::user_role;
  END IF;
END $$;

-- 2) Storage policies for product-images bucket
-- Allow public read access to product images
DO $$
BEGIN
  -- SELECT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Product images are publicly readable'
  ) THEN
    CREATE POLICY "Product images are publicly readable"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-images');
  END IF;

  -- INSERT policy for admins
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Admins can upload product images'
  ) THEN
    CREATE POLICY "Admins can upload product images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin(auth.uid()));
  END IF;

  -- UPDATE policy for admins
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Admins can update product images'
  ) THEN
    CREATE POLICY "Admins can update product images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));
  END IF;

  -- DELETE policy for admins
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Admins can delete product images'
  ) THEN
    CREATE POLICY "Admins can delete product images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin(auth.uid()));
  END IF;
END $$;
