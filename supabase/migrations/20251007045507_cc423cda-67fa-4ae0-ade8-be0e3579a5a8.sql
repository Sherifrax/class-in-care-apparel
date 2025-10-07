-- Fix order_items table INSERT policy to prevent fraudulent order creation
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can insert order items" ON public.order_items;

-- Create a secure policy that validates the user owns the order
-- This uses a subquery to check if the order belongs to the authenticated user
CREATE POLICY "Users can insert items for their own orders"
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

-- Note: Edge functions using service role key will bypass RLS for server-side order creation