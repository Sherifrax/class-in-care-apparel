-- Fix order_items table INSERT policy to prevent fraudulent order creation
-- Drop any existing permissive policies
DROP POLICY IF EXISTS "System can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert items for their own orders" ON public.order_items;

-- Create a secure policy with a unique name that validates the user owns the order
CREATE POLICY "Authenticated users insert own order items only"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);