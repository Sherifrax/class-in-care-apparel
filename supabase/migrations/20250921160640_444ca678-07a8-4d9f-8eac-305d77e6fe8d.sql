-- Allow admins to update orders  
CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());