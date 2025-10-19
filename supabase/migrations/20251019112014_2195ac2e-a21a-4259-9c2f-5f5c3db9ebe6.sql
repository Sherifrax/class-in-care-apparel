-- Add payment deadline tracking to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_deadline timestamp with time zone;

-- Set default deadline to 24 hours from created_at for existing pending orders
UPDATE public.orders 
SET payment_deadline = created_at + INTERVAL '24 hours'
WHERE status = 'pending_payment' 
  AND payment_deadline IS NULL;

-- Create index for efficient deadline queries
CREATE INDEX IF NOT EXISTS idx_orders_payment_deadline 
ON public.orders(payment_deadline) 
WHERE status = 'pending_payment';