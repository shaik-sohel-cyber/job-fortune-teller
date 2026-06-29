-- 1. Allowlist table
CREATE TABLE public.allowed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.allowed_emails TO authenticated;
GRANT ALL ON public.allowed_emails TO service_role;

ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read; nobody (except service_role) can write via the API.
CREATE POLICY "Authenticated can view allowlist"
ON public.allowed_emails FOR SELECT
TO authenticated
USING (true);

-- Normalize emails to lowercase on insert/update
CREATE OR REPLACE FUNCTION public.normalize_allowed_email()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.email = lower(trim(NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_normalize_allowed_email
BEFORE INSERT OR UPDATE ON public.allowed_emails
FOR EACH ROW EXECUTE FUNCTION public.normalize_allowed_email();

-- 2. Gate signups: block if email not in allowlist
CREATE OR REPLACE FUNCTION public.enforce_email_allowlist()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS NULL THEN
    RAISE EXCEPTION 'Email is required';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.allowed_emails
    WHERE email = lower(trim(NEW.email))
  ) THEN
    RAISE EXCEPTION 'This email is not authorized to access JobGenisis. Contact the administrator.'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_email_allowlist() FROM PUBLIC;

CREATE TRIGGER trg_enforce_email_allowlist
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.enforce_email_allowlist();