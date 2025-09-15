-- Drop the existing products table
DROP TABLE IF EXISTS public.products CASCADE;

-- Recreate the products table with the same structure
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rating NUMERIC NOT NULL DEFAULT 0.0,
  reviews INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sizes TEXT[] NOT NULL DEFAULT '{}',
  image_path TEXT NOT NULL,
  description TEXT NOT NULL,
  colors TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  original_price TEXT,
  badge TEXT
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, price, original_price, rating, reviews, image_path, description, colors, features, badge, sizes) VALUES
('AURA Professional Scrub Top', '189 AED', '229 AED', 4.8, 245, '/src/assets/collection-black-female.jpg', 'Premium 4-way stretch fabric with moisture-wicking technology', ARRAY['Navy', 'Teal', 'Charcoal'], ARRAY['4-Way Stretch', 'Moisture-Wicking', 'Antimicrobial'], 'Best Seller', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL']),
('AURA Elite Scrub Pants', '165 AED', NULL, 4.7, 189, '/src/assets/collection-black-male.jpg', 'Tailored fit with reinforced seams for durability', ARRAY['Navy', 'Charcoal', 'Sage'], ARRAY['Reinforced Seams', 'Multiple Pockets', 'Fade Resistant'], NULL, ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL']),
('AURA Signature Lab Coat', '295 AED', '349 AED', 4.9, 156, '/src/assets/collection-light-blue-front.jpg', 'Classic white lab coat with modern tailoring', ARRAY['White', 'Light Blue'], ARRAY['Wrinkle Resistant', 'Professional Fit', 'Easy Care'], 'Premium', ARRAY['S', 'M', 'L', 'XL', 'XXL']),
('AURA Comfort Scrub Set', '319 AED', '389 AED', 4.6, 203, '/src/assets/collection-white-lifestyle.jpg', 'Complete scrub set with matching top and bottom', ARRAY['White', 'Light Gray', 'Powder Blue'], ARRAY['Soft Touch Fabric', 'Coordinated Set', 'All-Day Comfort'], 'Value Pack', ARRAY['XS', 'S', 'M', 'L', 'XL']),
('AURA Team Uniform', '445 AED', NULL, 4.8, 92, '/src/assets/collection-team-black.jpg', 'Coordinated team uniforms for medical facilities', ARRAY['Navy', 'Teal', 'Charcoal', 'White'], ARRAY['Team Colors', 'Bulk Discount', 'Custom Embroidery'], 'Team Pack', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL']),
('AURA Clinic Essentials', '225 AED', '265 AED', 4.5, 167, '/src/assets/collection-black-male-clinic.jpg', 'Essential scrubs for everyday clinical work', ARRAY['Black', 'Navy', 'Forest Green'], ARRAY['Practical Design', 'Easy Maintenance', 'Professional Look'], NULL, ARRAY['S', 'M', 'L', 'XL', 'XXL']),
('AURA Luxury Collection', '389 AED', '459 AED', 4.9, 134, '/src/assets/collection-light-blue-full.jpg', 'Premium luxury scrubs with advanced fabric technology', ARRAY['Light Blue', 'Sage', 'Pearl White'], ARRAY['Luxury Fabric', 'Advanced Fit', 'Premium Finish'], 'Luxury', ARRAY['XS', 'S', 'M', 'L', 'XL']),
('AURA Active Wear', '275 AED', NULL, 4.7, 178, '/src/assets/collection-blue-scrubs.jpg', 'Athletic-inspired scrubs for active healthcare professionals', ARRAY['Royal Blue', 'Teal', 'Navy'], ARRAY['Athletic Fit', 'Performance Fabric', 'Movement Ready'], 'New', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL']);