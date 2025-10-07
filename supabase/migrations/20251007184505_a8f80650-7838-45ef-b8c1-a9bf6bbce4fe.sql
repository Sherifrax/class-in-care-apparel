-- Add new columns to orders table for embroidery and shipping options
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS embroidery_requested boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS embroidery_details text,
ADD COLUMN IF NOT EXISTS embroidery_cost numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS express_shipping boolean DEFAULT false;