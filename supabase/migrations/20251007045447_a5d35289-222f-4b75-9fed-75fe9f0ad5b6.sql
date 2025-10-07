-- Fix orders table SELECT policies to prevent anonymous access and cross-user data exposure
-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

-- Create strict SELECT policy for regular users
-- Only authenticated users can view their own orders
CREATE POLICY "Authenticated users can view only their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Create SELECT policy for admins
-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (is_admin());

-- Ensure anonymous users are explicitly blocked (belt and suspenders approach)
-- This policy explicitly denies anonymous access
CREATE POLICY "Block anonymous access to orders"
ON public.orders
FOR SELECT
TO anon
USING (false);