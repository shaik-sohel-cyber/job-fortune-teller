REVOKE EXECUTE ON FUNCTION public.enforce_email_allowlist() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.normalize_allowed_email() FROM PUBLIC, anon, authenticated;