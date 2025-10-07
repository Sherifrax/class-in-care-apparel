-- Fix orders table INSERT policy to prevent unauthorized access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "System can insert orders" ON public.orders;

-- Create a secure policy that only allows users to insert their own orders
-- Edge functions using service role key will bypass RLS anyway
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Also ensure user_id is not nullable to prevent anonymous orders
-- First, ensure all existing orders have a user_id (if any nulls exist, this will fail and we'll need to handle it)
DO $$
BEGIN
  -- Check if there are any orders without user_id
  IF EXISTS (SELECT 1 FROM public.orders WHERE user_id IS NULL) THEN
    RAISE NOTICE 'Warning: Found orders without user_id. These need to be handled before making user_id NOT NULL';
  ELSE
    -- Make user_id NOT NULL if no null values exist
    ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;