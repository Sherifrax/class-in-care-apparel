-- Clean all test data for production deployment

-- Delete test cart items
DELETE FROM public.cart_items;

-- Delete test favorites
DELETE FROM public.favorites;

-- Delete test order items
DELETE FROM public.order_items;

-- Delete test orders
DELETE FROM public.orders;

-- Delete test user roles (will be recreated for production admin)
DELETE FROM public.user_roles;

-- Delete test profiles (except we'll keep the structure)
DELETE FROM public.profiles;

-- Delete test profile audit logs
DELETE FROM public.profile_audit_log;

-- Reset product stock to default values if needed
-- (Keep products but reset any test modifications)
UPDATE public.products 
SET stock_quantity = 100, 
    updated_at = now()
WHERE track_stock = true;

-- Note: Auth users in auth.users table cannot be deleted via migration
-- Admin will need to manually clean those in Supabase dashboard at:
-- https://supabase.com/dashboard/project/ceymokfcuingwrafxpzy/auth/users