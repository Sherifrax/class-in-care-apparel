-- Add RLS policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (is_admin());