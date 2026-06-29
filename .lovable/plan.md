
# JobGenesis → Lovable Port Plan

## 0. Security first (do this yourself, today)
The `.env` files you uploaded are now in chat history. **Rotate before anything else:**
- Gemini API keys (×3), Groq key, SerpAPI key
- MongoDB Atlas password for user `sohel`
- Firebase web API key + JWT secret
- Google OAuth client secret (if any)

I won't paste these anywhere; I'll use Lovable AI Gateway instead (no key needed).

---

## 1. Feasibility review of the Antigravity stack

| Antigravity piece | Status here | What we use instead |
|---|---|---|
| MongoDB Atlas + Mongoose | ❌ can't run | Lovable Cloud Postgres + RLS |
| Express :4000 backend | ❌ no persistent server | Edge Functions |
| FastAPI ML engine (spaCy + sklearn KNN) | ❌ no Python runtime | Edge Function + Lovable AI (Gemini) for skill extraction & gap analysis |
| Firebase Auth + Admin SDK | ❌ replace | Lovable Cloud Auth (email + Google) |
| Socket.io real-time | ❌ no persistent socket server | Lovable Cloud Realtime (Postgres changes) |
| BullMQ + Upstash Redis queues | ❌ | Edge Function async + DB job rows |
| isolated-vm JS sandbox | ❌ unsafe in Edge runtime | Judge0 / Piston public API for code execution, or a constrained Web Worker for JS-only |
| Monaco Editor | ✅ runs in browser | Keep as-is |
| TensorFlow.js webcam detection | ✅ runs in browser | Keep as-is |
| Recharts | ✅ already installed pattern | Keep |
| Groq/Gemini direct calls | ❌ keys client-side | Lovable AI Gateway via Edge Functions |

**Bottom line:** ~70% of the feature set is portable. The architecture changes, the UX doesn't.

---

## 2. New process flow (replaces current one)

```text
Signup/Login
   ↓
Resume Upload  →  AI parse (analyze-resume EF)
   ↓
Resume Verification
   ↓
Package Selection (company / role)
   ↓
Aptitude Round         ← NEW (replaces technical MCQs in this slot)
   ↓ pass
Technical MCQ Round    ← moved to before AI interview
   ↓ pass
AI Interview (4 rounds: Tech, Coding Gauntlet, Domain, HR)
   ↓ pass
Results + Skill-Gap Report
```

Gating, fail-cooldown, anti-cheat tab lock — all kept from current implementation.

---

## 3. Phased build

### Phase 1 — Foundation (auth + DB)
- Replace localStorage-based auth (`AuthContext`) with **Lovable Cloud Auth** (email/password + Google).
- DB tables: `profiles`, `resumes`, `assessment_attempts`, `interview_sessions`, `interview_answers`, `proctor_events`, `skill_gaps`, `cooldowns`. All with RLS + grants.
- Migrate existing flow gates to read from DB instead of `localStorage` (localStorage kept only as fast cache).

### Phase 2 — Aptitude + Technical rounds
- New `AptitudeAssessment` component: quantitative, logical, verbal sections, ~20 questions, timed, negative marking matches current scheme.
- Reorder routes: `/aptitude` → `/assessment` (renamed Technical MCQ) → `/interview`.
- Question bank seeded into DB; randomized per attempt.

### Phase 3 — Coding Gauntlet (Monaco)
- Add `monaco-editor` + `@monaco-editor/react`.
- New `CodingRound` component inside the interview flow with problem statement, editor, test cases.
- Code execution via **Judge0 CE public API** wrapped in an Edge Function `execute-code` (so no key in browser).
- Submission scored by hidden test cases + Lovable AI rubric review.

### Phase 4 — Overwatch proctoring
- Browser-only:
  - Webcam + TensorFlow.js `coco-ssd` for phone/extra-person detection
  - Tab-visibility, fullscreen-exit, copy/paste, devtools open events
  - Mic level monitor (already noted in handoff)
- Events streamed to `proctor_events` table; >N violations → auto-disqualify current round.
- Pre-task device check screen (camera/mic permission, lighting).

### Phase 5 — Real-time telemetry
- Recharts dashboard for the candidate's own session (focus %, keystroke rhythm, time-per-question).
- Live updates via Lovable Cloud Realtime on `proctor_events`.

### Phase 6 — Skill-gap engine (replaces Python ML)
- Edge Function `skill-gap`:
  - Input: parsed resume skills + role requirements + interview/assessment scores
  - Uses Lovable AI (Gemini) to produce: matched skills, missing skills, severity, learning roadmap (courses, projects, est. weeks).
- Rendered as the final section of Results page.

### Phase 7 — Polish / cyberpunk theme (optional, ask later)
- Only if you want the JobGenesis visual identity. Would touch `index.css` design tokens, add Framer Motion glitch presets, dark neon palette. Default = keep current theme.

---

## 4. Technical notes (skim if non-technical)

- **No client-side LLM keys.** Every AI call goes through an Edge Function using `LOVABLE_API_KEY`. Default model: `google/gemini-3-flash-preview`; upgrade to `google/gemini-2.5-pro` for heavy reasoning (resume parse, skill-gap).
- **Code execution sandbox:** Judge0 CE has a free public endpoint, rate-limited; we can also self-host later or swap to Piston. Edge Function proxies the request so we can add auth, rate limits, and audit logs.
- **Realtime billing:** Subscriptions live inside `useEffect` with `removeChannel` cleanup to avoid reconnect storms.
- **Cooldowns** keep current 10-min rule but move from `localStorage` to `cooldowns` table so they survive logout / device switch.
- **Schema gating:** every new public table ships with explicit `GRANT` + RLS policies in the same migration.

---

## 5. What I need from you before building

1. Confirm rotation of the leaked keys (just reply "rotated").
2. Approve replacing the current mock auth with real Lovable Cloud auth (this logs current localStorage users out — they'll need to sign up again).
3. Choose starting phase. Recommended order: **Phase 1 → 2 → 4 → 3 → 5 → 6**. Phase 7 (cyberpunk theme) only if you want it.
4. Pick code-execution languages for the Gauntlet (Phase 3). Default suggestion: JavaScript, Python, Java, C++.

Once you confirm, I'll start with Phase 1.
