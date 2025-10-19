-- Allow users to update payment_receipt_url on their own orders
CREATE POLICY "Users can upload payment receipt for their orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id 
  AND auth.uid() IS NOT NULL
  -- Only allow updating payment_receipt_url, not other fields
);