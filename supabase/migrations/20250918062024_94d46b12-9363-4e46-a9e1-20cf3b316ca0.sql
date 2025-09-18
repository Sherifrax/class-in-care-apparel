-- Add support for multiple images to products table
ALTER TABLE public.products 
ADD COLUMN images text[] DEFAULT '{}';

-- Update existing products to include their current image in the new images array
UPDATE public.products 
SET images = ARRAY[COALESCE(image_url, image)] 
WHERE image_url IS NOT NULL OR image IS NOT NULL;