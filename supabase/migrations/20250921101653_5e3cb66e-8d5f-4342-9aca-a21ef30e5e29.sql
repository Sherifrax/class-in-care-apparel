-- Add stock management to products table
ALTER TABLE public.products 
ADD COLUMN stock_quantity integer NOT NULL DEFAULT 0,
ADD COLUMN low_stock_threshold integer NOT NULL DEFAULT 5,
ADD COLUMN track_stock boolean NOT NULL DEFAULT true;

-- Add index for efficient stock queries
CREATE INDEX idx_products_stock ON public.products(stock_quantity) WHERE track_stock = true;

-- Create function to reduce stock when order is placed
CREATE OR REPLACE FUNCTION public.reduce_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Only reduce stock for products that track stock
    UPDATE public.products 
    SET stock_quantity = stock_quantity - NEW.quantity,
        updated_at = now()
    WHERE id = NEW.product_id 
    AND track_stock = true
    AND stock_quantity >= NEW.quantity;
    
    -- Check if update actually happened (stock was sufficient)
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient stock for product %', NEW.product_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically reduce stock when order items are inserted
CREATE TRIGGER trigger_reduce_stock_on_order
    AFTER INSERT ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION public.reduce_product_stock();

-- Create function to check stock availability
CREATE OR REPLACE FUNCTION public.check_stock_availability(p_product_id uuid, p_quantity integer)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.products 
        WHERE id = p_product_id 
        AND (track_stock = false OR stock_quantity >= p_quantity)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;