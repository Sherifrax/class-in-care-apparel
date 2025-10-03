-- Fix cart_items uniqueness to allow same product+size with different colors
-- Drop existing unique constraint (user_id, product_id, size)
ALTER TABLE public.cart_items
DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_size_key;

-- Create new unique constraint including color
-- Note: NULL colors are allowed multiple times by Postgres UNIQUE semantics.
-- App logic merges duplicates, so this is acceptable.
ALTER TABLE public.cart_items
ADD CONSTRAINT cart_items_user_id_product_id_size_color_key
UNIQUE (user_id, product_id, size, color);