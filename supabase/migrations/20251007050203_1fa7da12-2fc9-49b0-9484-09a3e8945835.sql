-- Fix audit log security: prevent tampering and deletion

-- Only allow system/triggers to insert audit logs (not users directly)
CREATE POLICY "Only system can insert audit logs"
ON public.profile_audit_log
FOR INSERT
TO authenticated
WITH CHECK (false);  -- Blocks all direct inserts; only triggers/functions can insert

-- Prevent any updates to audit logs (immutable audit trail)
CREATE POLICY "Audit logs are immutable"
ON public.profile_audit_log
FOR UPDATE
TO authenticated
USING (false);

-- Prevent deletion of audit logs (permanent record)
CREATE POLICY "Audit logs cannot be deleted"
ON public.profile_audit_log
FOR DELETE
TO authenticated
USING (false);