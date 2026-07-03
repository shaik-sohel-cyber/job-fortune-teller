import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Sun, Database, LogOut, ArrowRight, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type TabId = "overview" | "jobs" | "history" | "challenges";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "jobs", label: "Jobs" },
  { id: "history", label: "History" },
  { id: "challenges", label: "Challenges & Growth" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [tab, setTab] = useState<TabId>("overview");

  const skills = useMemo<string[]>(() => {
    try {
      const raw = localStorage.getItem("resumeData");
      if (!raw) return [];
      const d = JSON.parse(raw);
      const s = d?.candidateInfo?.skills ?? d?.skills ?? [];
      return Array.isArray(s) ? s.slice(0, 12) : [];
    } catch {
      return [];
    }
  }, []);

  const hasResume = skills.length > 0 || !!localStorage.getItem("resumeData");
  const stamp = new Date()
    .toISOString()
    .replace("T", " / ")
    .replace(/\..+/, "");

  return (
    <div className="min-h-screen w-full bg-black p-6 md:p-10 text-zinc-300 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-blue-500 shadow-inner">
              <User className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 tracking-[0.2em] uppercase mb-1 font-bold">
                {user?.name ?? "Applicant"}
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-white font-black tracking-tight text-lg">
                  PROFILE ACTIVE
                </h1>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-500 hover:text-blue-400 transition-colors" aria-label="Theme">
              <Sun className="w-[18px] h-[18px]" />
            </button>
            <button className="p-2 text-zinc-500 hover:text-blue-400 transition-colors" aria-label="Data">
              <Database className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={logout}
              className="ml-2 px-5 py-2 border-2 border-red-500/30 text-red-500 text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all active:scale-95 flex items-center gap-2 rounded-md"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-zinc-900 pb-6">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap rounded-full ${
                  active
                    ? "bg-red-500 text-black shadow-[0_0_24px_rgba(239,68,68,0.35)]"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {tab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Strength */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-red-500/5 blur-xl rounded-2xl group-hover:bg-red-500/10 transition-all" />
                  <div className="relative border border-zinc-800 bg-zinc-950/80 rounded-2xl p-8 h-full flex flex-col">
                    <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mb-8">
                      Profile Strength
                    </div>
                    <div className="mb-auto">
                      <h2 className="text-7xl font-black text-white italic tracking-tighter mb-4">
                        {hasResume ? "READY" : "IDLE"}
                      </h2>
                      <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
                        {hasResume
                          ? "Your professional identity is fully indexed. System is currently scanning for high-match opportunities."
                          : "No resume detected. Upload your CV to activate the matching engine."}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/upload")}
                      className="mt-10 inline-flex items-center justify-center px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-500 transition-colors w-full text-center rounded-md"
                    >
                      {hasResume ? "Update Resume" : "Upload Resume"}
                    </button>
                  </div>
                </div>

                {/* Extracted Skills */}
                <div className="border border-zinc-800 bg-zinc-950/40 rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
                      Extracted Top Skills
                    </div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {skills.length > 0 ? (
                      skills.map((s) => (
                        <div
                          key={s}
                          className="px-4 py-2 border border-zinc-800 rounded-lg bg-zinc-900/50 text-[12px] text-blue-400 font-medium hover:border-blue-500/50 transition-colors"
                        >
                          {s}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 border border-zinc-800 border-dashed rounded-lg text-[12px] text-zinc-600 font-medium italic">
                        Pending parsing…
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {tab === "jobs" && (
              <div className="border border-zinc-800 bg-zinc-950/40 rounded-2xl p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mb-4">
                    Target Deployment
                  </div>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter mb-3">
                    CONFIGURE ROLE
                  </h2>
                  <p className="text-zinc-500 text-sm max-w-md">
                    Pick a target company, tier and role to begin the skill scan and interview simulation.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/package-selection")}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-400 transition-colors rounded-md"
                >
                  Execute Skill Scan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {tab === "history" && (
              <div className="border border-zinc-800 bg-zinc-950/40 rounded-2xl p-10">
                <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mb-6">
                  Interview History
                </div>
                <p className="text-zinc-500 text-sm">No interviews completed yet.</p>
              </div>
            )}

            {tab === "challenges" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-zinc-800 bg-zinc-950/40 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-black text-lg tracking-tight uppercase">
                      Neural Skill Tree
                    </h3>
                    <span className="text-blue-400 font-black text-xl">0<span className="text-[9px] block uppercase tracking-widest text-zinc-600">Total XP</span></span>
                  </div>
                  <p className="text-zinc-500 text-xs mb-6">Interactive map of your technical evolution</p>
                  <div className="aspect-[4/3] w-full rounded-xl border border-zinc-900 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06),transparent_70%)] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
                    {["ALGORITHMS", "FRONTEND", "BACKEND", "SECURITY", "SYSTEM DESIGN"].map((n, i) => (
                      <div
                        key={n}
                        className="absolute w-12 h-12 rounded-full border border-blue-500/40 bg-blue-500/10 flex items-center justify-center text-[8px] text-blue-300 font-bold"
                        style={{
                          left: `${15 + i * 15}%`,
                          top: `${20 + (i % 2) * 35}%`,
                        }}
                      >
                        Lv1
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-yellow-500 text-[10px] font-bold uppercase tracking-widest">
                    <Trophy className="w-3.5 h-3.5" /> Legendary Badges
                  </div>
                  <div className="mt-3 border border-dashed border-zinc-800 rounded-lg p-4 text-[11px] text-zinc-600 italic">
                    Complete missions and solve bounties to unlock badges…
                  </div>
                </div>
                <div className="border border-zinc-800 bg-zinc-950/40 rounded-2xl p-8">
                  <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em] mb-6">
                    Practice Challenges
                  </div>
                  <p className="text-zinc-500 text-sm">No active challenges currently. Check back later.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-20 flex justify-between items-center border-t border-zinc-900 pt-6">
          <div className="text-[9px] text-zinc-700 uppercase tracking-widest">
            Last Index: {stamp}
          </div>
          <div className="flex gap-4">
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;