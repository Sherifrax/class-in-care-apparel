-- Add audit logging table for profile access
CREATE TABLE IF NOT EXISTS public.profile_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    action TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.profile_audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow users to view their own audit logs
CREATE POLICY "Users can view own audit logs" ON public.profile_audit_log
    FOR SELECT USING (auth.uid() = user_id);

-- Add function to log profile access
CREATE OR REPLACE FUNCTION public.log_profile_access(
    p_user_id UUID,
    p_action TEXT,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profile_audit_log (user_id, action, ip_address, user_agent)
    VALUES (p_user_id, p_action, p_ip_address, p_user_agent);
END;
$$;

-- Add data validation function for profiles
CREATE OR REPLACE FUNCTION public.validate_profile_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Validate phone number format (basic validation)
    IF NEW.phone IS NOT NULL AND LENGTH(NEW.phone) > 0 THEN
        IF NOT (NEW.phone ~ '^[\+]?[0-9\-\(\)\s]+$') THEN
            RAISE EXCEPTION 'Invalid phone number format';
        END IF;
    END IF;
    
    -- Validate full name (prevent script injection)
    IF NEW.full_name IS NOT NULL THEN
        IF NEW.full_name ~ '[<>"\''&]' THEN
            RAISE EXCEPTION 'Invalid characters in full name';
        END IF;
    END IF;
    
    -- Limit address length for security
    IF NEW.address IS NOT NULL AND LENGTH(NEW.address) > 500 THEN
        RAISE EXCEPTION 'Address too long';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Add validation trigger
CREATE TRIGGER validate_profile_before_insert_update
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_profile_data();

-- Add additional RLS policy for extra protection during updates
CREATE POLICY "Prevent unauthorized profile updates" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = id AND 
        auth.uid() IS NOT NULL AND
        current_setting('role') = 'authenticated'
    );

-- Add policy to prevent unauthorized inserts
CREATE POLICY "Prevent unauthorized profile inserts" ON public.profiles  
    FOR INSERT WITH CHECK (
        auth.uid() = id AND
        auth.uid() IS NOT NULL AND
        current_setting('role') = 'authenticated'
    );