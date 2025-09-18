-- Update existing products to use image_url field properly
UPDATE products 
SET image_url = 
  CASE 
    WHEN image LIKE '/images/%' THEN 'https://ceymokfcuingwrafxpzy.supabase.co/storage/v1/object/public/product-images' || REPLACE(image, '/images/', '/products/')
    ELSE image
  END
WHERE image_url IS NULL AND image IS NOT NULL;

-- Make image_url the primary field and keep image for backward compatibility
UPDATE products 
SET image = image_url 
WHERE image_url IS NOT NULL;