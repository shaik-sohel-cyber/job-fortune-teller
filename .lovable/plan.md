## New Post-Login Dashboard

Create `/dashboard` as the landing page after login, styled scoped to match the selected Tech-Industrial direction (pure black, JetBrains Mono, red primary + blue secondary). No global theme changes.

### Files
- **Add `src/pages/Dashboard.tsx`** — implements header (avatar tile, "APPLICANT / PROFILE ACTIVE" + live dot, theme/database icons, red Log Out), tab pill bar (Overview / Jobs / History / Challenges & Growth), and tab content.
  - Overview: Profile Strength card ("READY" + Update Resume → `/upload`) and Extracted Top Skills card (chips from `resumeData.candidateInfo.skills` in localStorage, fallback "Pending parsing…").
  - Jobs: link into existing `/package-selection` flow (button "Configure Target").
  - History: empty state "No interviews completed yet." (later can read from Supabase).
  - Challenges & Growth: Neural Skill Tree placeholder + Legendary Badges + Practice Challenges empty state.
- **Add `bun add @fontsource/jetbrains-mono`** and import in `src/main.tsx`. Register `mono` family in `tailwind.config.ts` under `fontFamily.mono` so we can use `font-mono` locally on the Dashboard page only.
- **Edit `src/App.tsx`** — add `<Route path="/dashboard" element={<Dashboard/>} />` inside `ProtectedRoute`.
- **Edit `src/contexts/AuthContext.tsx`** — change post-login/signup `navigate("/")` to `navigate("/dashboard")`.
- **Edit `src/components/Header.tsx`** — hide the global header on `/dashboard` (the dashboard has its own header) to avoid double chrome. Keep it on all other routes.

### Technical notes
- All colors via Tailwind arbitrary utility values scoped inside Dashboard.tsx (`bg-black`, `text-red-500`, `border-zinc-800`) — no changes to `index.css` tokens.
- Tabs are local `useState`; no route changes.
- Log Out button calls existing `useAuth().logout()`.
- Skills read: `JSON.parse(localStorage.getItem('resumeData'))?.candidateInfo?.skills ?? []`.
- Reachable from anywhere via the existing nav (optionally add "Dashboard" link to `Header.tsx` nav items).
