
-- =========================================================
-- 1. UPDATED_AT TRIGGER HELPER
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- 2. PROFILES
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- 3. RESUMES
-- =========================================================
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  raw_text TEXT,
  parsed JSONB,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resumes_own" ON public.resumes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_resumes_updated BEFORE UPDATE ON public.resumes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_resumes_user ON public.resumes(user_id, created_at DESC);

-- =========================================================
-- 4. PACKAGES (selected company/role per attempt)
-- =========================================================
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  cutoff_score INTEGER NOT NULL DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages_own" ON public.packages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_packages_updated BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_packages_user ON public.packages(user_id, created_at DESC);

-- =========================================================
-- 5. ASSESSMENT ATTEMPTS (aptitude + technical MCQ)
-- =========================================================
CREATE TYPE public.assessment_kind AS ENUM ('aptitude', 'technical');

CREATE TABLE public.assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  kind public.assessment_kind NOT NULL,
  questions JSONB NOT NULL,
  answers JSONB,
  score NUMERIC,
  cutoff NUMERIC NOT NULL DEFAULT 60,
  passed BOOLEAN,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_attempts TO authenticated;
GRANT ALL ON public.assessment_attempts TO service_role;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assessment_attempts_own" ON public.assessment_attempts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_assessment_attempts_updated BEFORE UPDATE ON public.assessment_attempts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_assessment_attempts_user ON public.assessment_attempts(user_id, kind, created_at DESC);

-- =========================================================
-- 6. INTERVIEW SESSIONS + ANSWERS
-- =========================================================
CREATE TABLE public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  current_round TEXT NOT NULL DEFAULT 'technical',
  status TEXT NOT NULL DEFAULT 'in_progress',
  overall_score NUMERIC,
  verdict TEXT,
  summary JSONB,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_sessions TO authenticated;
GRANT ALL ON public.interview_sessions TO service_role;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "interview_sessions_own" ON public.interview_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_interview_sessions_updated BEFORE UPDATE ON public.interview_sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_interview_sessions_user ON public.interview_sessions(user_id, created_at DESC);

CREATE TABLE public.interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  round TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  code TEXT,
  language TEXT,
  ai_score NUMERIC,
  ai_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.interview_answers TO authenticated;
GRANT ALL ON public.interview_answers TO service_role;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "interview_answers_own" ON public.interview_answers FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_interview_answers_session ON public.interview_answers(session_id, created_at);

-- =========================================================
-- 7. PROCTOR EVENTS
-- =========================================================
CREATE TABLE public.proctor_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context TEXT NOT NULL,
  context_id UUID,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proctor_events TO authenticated;
GRANT ALL ON public.proctor_events TO service_role;
ALTER TABLE public.proctor_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proctor_events_own" ON public.proctor_events FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_proctor_events_user ON public.proctor_events(user_id, created_at DESC);
ALTER PUBLICATION supabase_realtime ADD TABLE public.proctor_events;

-- =========================================================
-- 8. SKILL GAPS
-- =========================================================
CREATE TABLE public.skill_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE SET NULL,
  matched_skills JSONB,
  missing_skills JSONB,
  roadmap JSONB,
  overall_match NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_gaps TO authenticated;
GRANT ALL ON public.skill_gaps TO service_role;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skill_gaps_own" ON public.skill_gaps FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_skill_gaps_updated BEFORE UPDATE ON public.skill_gaps FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_skill_gaps_user ON public.skill_gaps(user_id, created_at DESC);

-- =========================================================
-- 9. COOLDOWNS (per-user, per-company)
-- =========================================================
CREATE TABLE public.cooldowns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  reason TEXT,
  cooldown_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, company)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cooldowns TO authenticated;
GRANT ALL ON public.cooldowns TO service_role;
ALTER TABLE public.cooldowns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cooldowns_own" ON public.cooldowns FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_cooldowns_updated BEFORE UPDATE ON public.cooldowns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_cooldowns_user ON public.cooldowns(user_id);
