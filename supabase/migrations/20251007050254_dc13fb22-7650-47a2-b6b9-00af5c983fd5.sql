-- Prevent audit log tampering by blocking all write operations

-- Block direct inserts (only system triggers should insert)
CREATE POLICY "Block direct inserts to audit log"
ON public.profile_audit_log
FOR INSERT
WITH CHECK (false);

-- Block all updates
CREATE POLICY "Block updates to audit log"
ON public.profile_audit_log
FOR UPDATE
USING (false);

-- Block all deletes  
CREATE POLICY "Block deletes from audit log"
ON public.profile_audit_log
FOR DELETE
USING (false);