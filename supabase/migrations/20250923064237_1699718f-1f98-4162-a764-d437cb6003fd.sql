-- Update admin roles: remove old admin and set new admin
-- Remove admin role from old admin (amrodew@gmail.com)
UPDATE public.profiles 
SET role = 'customer', updated_at = now()
WHERE id = 'b6f51d4e-874c-46d7-ada6-f9dc0d65a6eb';

-- Set admin role for new admin (omarmaher929@gmail.com)
UPDATE public.profiles 
SET role = 'admin', updated_at = now()
WHERE id = 'ebb0e382-b51d-4947-ab3b-7dd954ee8de6';