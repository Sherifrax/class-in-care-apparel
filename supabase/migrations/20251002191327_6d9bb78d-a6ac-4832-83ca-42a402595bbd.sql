-- Add color field to cart_items table
ALTER TABLE public.cart_items 
ADD COLUMN IF NOT EXISTS color text;

-- Add color field to order_items table
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS color text;

-- Update all existing products to include the new medical color palette
UPDATE public.products 
SET colors = ARRAY['Ceil Blue', 'Navy Blue', 'Royal Blue', 'Turquoise', 'Teal', 'Surgical Green', 'Caribbean Blue', 'Black', 'White', 'Gray', 'Charcoal']
WHERE array_length(colors, 1) IS NULL OR array_length(colors, 1) = 0 OR colors = '{}';

-- For products that already have colors, append the new ones if they don't exist
UPDATE public.products 
SET colors = colors || ARRAY['Ceil Blue', 'Navy Blue', 'Royal Blue', 'Turquoise', 'Teal', 'Surgical Green', 'Caribbean Blue', 'Black', 'White', 'Gray', 'Charcoal']
WHERE array_length(colors, 1) > 0 
AND NOT (colors @> ARRAY['Ceil Blue', 'Navy Blue', 'Royal Blue', 'Turquoise', 'Teal', 'Surgical Green', 'Caribbean Blue', 'Black', 'White', 'Gray', 'Charcoal']);