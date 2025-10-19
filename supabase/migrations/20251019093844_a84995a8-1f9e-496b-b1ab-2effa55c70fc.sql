-- Add order reference column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_reference TEXT UNIQUE;

-- Create a function to generate friendly order references
CREATE OR REPLACE FUNCTION public.generate_order_reference()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_reference TEXT;
  reference_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate reference like BT-2025-1234
    new_reference := 'BT-' || 
                     TO_CHAR(NOW(), 'YYYY') || '-' || 
                     LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0');
    
    -- Check if reference already exists
    SELECT EXISTS(SELECT 1 FROM public.orders WHERE order_reference = new_reference)
    INTO reference_exists;
    
    -- Exit loop if reference is unique
    EXIT WHEN NOT reference_exists;
  END LOOP;
  
  RETURN new_reference;
END;
$$;

-- Add payment receipt URL column for proof of payment uploads
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_receipt_url TEXT;

-- Add payment reminder sent timestamp
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_reminder_sent_at TIMESTAMP WITH TIME ZONE;

-- Create storage bucket for payment receipts
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-receipts', 
  'payment-receipts', 
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for payment receipts bucket
CREATE POLICY "Users can upload their own payment receipts"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'payment-receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own payment receipts"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment-receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all payment receipts"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'payment-receipts' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can update their own payment receipts"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'payment-receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own payment receipts"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'payment-receipts' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Update existing orders to have order references
UPDATE public.orders 
SET order_reference = 'BT-' || TO_CHAR(created_at, 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0')
WHERE order_reference IS NULL;