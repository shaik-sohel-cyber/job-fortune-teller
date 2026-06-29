DROP TRIGGER IF EXISTS trg_enforce_email_allowlist ON auth.users;
DROP FUNCTION IF EXISTS public.enforce_email_allowlist();