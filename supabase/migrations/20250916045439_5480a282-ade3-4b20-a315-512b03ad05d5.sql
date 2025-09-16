-- Update all product image paths to use public folder instead of src/assets
UPDATE public.products 
SET image = REPLACE(image, '/src/assets/', '/images/')
WHERE image LIKE '/src/assets/%';