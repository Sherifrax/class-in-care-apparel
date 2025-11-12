-- Data Cleanup for Client Delivery
-- This removes all test data while preserving products, categories, and admin account

-- Delete order items first (foreign key dependency)
DELETE FROM order_items;

-- Delete all orders
DELETE FROM orders;

-- Delete all cart items
DELETE FROM cart_items;

-- Delete all favorites
DELETE FROM favorites;

-- Delete all admin action logs
DELETE FROM admin_actions;

-- Delete all profile audit logs
DELETE FROM profile_audit_log;

-- Delete test customer profiles (keeps Omar admin)
-- This will cascade delete their auth.users entries
DELETE FROM profiles 
WHERE id IN (
  '5168d1e2-0808-4bdc-90ab-a0d8d66f0fcb',  -- abdo
  'b3c86ed9-5315-4429-b41f-03f3d2f61059'   -- bayan
);