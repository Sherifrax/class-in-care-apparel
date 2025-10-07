-- Make the image column nullable to allow products without images
ALTER TABLE public.products 
ALTER COLUMN image DROP NOT NULL;