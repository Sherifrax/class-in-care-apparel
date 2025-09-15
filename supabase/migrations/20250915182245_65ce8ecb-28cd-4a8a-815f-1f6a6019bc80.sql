-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  original_price TEXT,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  reviews INTEGER NOT NULL DEFAULT 0,
  image_path TEXT NOT NULL,
  description TEXT NOT NULL,
  colors TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  badge TEXT,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read products (public data)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert current product data
INSERT INTO public.products (name, price, original_price, rating, reviews, image_path, description, colors, features, badge, sizes) VALUES
('Black Professional', '250 AED', '275 AED', 4.9, 324, '/src/assets/collection-black-female.jpg', 'Sophisticated black uniform with gold accents - perfect for professional settings', ARRAY['Black', 'Charcoal', 'Navy', 'White'], ARRAY['4-Way Stretch', 'Moisture-Wicking', 'Wrinkle-Resistant'], 'Best Seller', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL']),

('Black Elite Men''s', '250 AED', '275 AED', 4.8, 256, '/src/assets/collection-black-male.jpg', 'Premium black scrubs designed for male healthcare professionals', ARRAY['Black', 'Navy', 'Charcoal', 'Steel'], ARRAY['Ultra-Lightweight', 'Quick-Dry', 'Antimicrobial'], 'New', ARRAY['S', 'M', 'L', 'XL', 'XXL']),

('Navy Blue Professional', '275 AED', '300 AED', 4.9, 218, '/src/assets/collection-light-blue-front.jpg', 'Elegant light blue uniforms with superior comfort and style', ARRAY['Light Blue', 'Mint', 'Seafoam', 'White'], ARRAY['Ultra-Soft', 'Breathable', 'Wrinkle-Free'], 'New', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL']),

('White Professional Set', '250 AED', '275 AED', 5.0, 189, '/src/assets/collection-white-lifestyle.jpg', 'Classic white scrubs - the traditional professional look with modern comfort', ARRAY['Pure White', 'Off-White', 'Cream', 'Pearl'], ARRAY['Premium Fabric', 'Stain Resistant', 'Professional Fit'], 'Premium Set', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL']),

('Team Collection', '250 AED', '275 AED', 4.7, 142, '/src/assets/collection-team-black.jpg', 'Coordinated team uniforms for unified professional appearance', ARRAY['Team Black', 'Team Navy', 'Team Teal', 'Team White'], ARRAY['Team Coordination', 'Bulk Discounts', 'Custom Embroidery'], 'Team Special', ARRAY['S', 'M', 'L', 'XL', 'XXL']),

('Clinical Black', '250 AED', '275 AED', 4.9, 98, '/src/assets/collection-black-male-clinic.jpg', 'Clinical-grade black uniforms for demanding medical environments', ARRAY['Clinical Black', 'Surgical Navy', 'OR Green', 'Lab White'], ARRAY['Clinical Grade', 'Stain Resistant', 'Easy Care'], 'Clinical Grade', ARRAY['S', 'M', 'L', 'XL', 'XXL', 'XXXL']),

('White Professional Complete Set', '250 AED', '275 AED', 4.8, 156, '/src/assets/collection-light-blue-full.jpg', 'Complete light blue uniform set with matching top and pants', ARRAY['Light Blue', 'Sky Blue', 'Powder Blue', 'Mint'], ARRAY['Complete Set', 'Professional Cut', 'Comfortable All-Day'], 'Complete Set', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL']),

('Lab Coat Premium', '300 AED', '325 AED', 4.7, 134, '/src/assets/collection-white-lifestyle.jpg', 'Premium lab coat for medical professionals - sophisticated and durable', ARRAY['Pure White', 'Off-White', 'Medical White', 'Lab White'], ARRAY['Premium Fabric', 'Professional Design', 'Stain Resistant'], 'Lab Coat', ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL']);

-- Create index for better query performance
CREATE INDEX idx_products_name ON public.products(name);
CREATE INDEX idx_products_rating_reviews ON public.products(rating DESC, reviews DESC);