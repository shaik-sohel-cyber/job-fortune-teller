import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  CODING_PROBLEMS,
  CodingProblem,
  LANGUAGES,
  LangId,
  pickProblems,
} from "@/utils/codingProblems";
import { useProctor } from "@/hooks/useProctor";
import ProctorOverlay from "@/components/ProctorOverlay";
import {
  Play,
  Send,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Code2,
  Clock,
} from "lucide-react";

const TIME_LIMIT = 30 * 60; // 30 min total
const CODING_CUTOFF = 60; // %

interface ProblemResult {
  problemId: string;
  passed: number;
  total: number;
  percent: number;
}

const CodingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [idx, setIdx] = useState(0);
  const [lang, setLang] = useState<LangId>("python");
  const [code, setCode] = useState("");
  const [runOutput, setRunOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ProblemResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [complete, setComplete] = useState(false);

  const proctor = useProctor({
    context: "coding",
    enabled: !complete,
    maxViolations: 8,
    onDisqualify: () => {
      localStorage.setItem("codingPassed", "false");
      localStorage.setItem("codingScore", "0");
      setComplete(true);
      toast({
        title: "Disqualified",
        description: "Too many proctor violations.",
        variant: "destructive",
      });
    },
  });

  // Gate
  useEffect(() => {
    if (!localStorage.getItem("resumeData")) return void navigate("/upload");
    if (!localStorage.getItem("verificationResults"))
      return void navigate("/verification");
    if (!localStorage.getItem("selectedPackage"))
      return void navigate("/package-selection");
    if (localStorage.getItem("aptitudePassed") !== "true")
      return void navigate("/aptitude");
    if (localStorage.getItem("assessmentPassed") !== "true")
      return void navigate("/assessment");
    setProblems(pickProblems(2));
  }, [navigate]);

  // Load starter code on problem/lang change
  useEffect(() => {
    if (problems[idx]) setCode(problems[idx].starterCode[lang] ?? "");
    setRunOutput("");
  }, [idx, lang, problems]);

  // Timer
  useEffect(() => {
    if (complete) return;
    if (timeLeft <= 0) {
      finalize(results);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, complete]);

  // Prevent leaving
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (!complete) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [complete]);

  const current = problems[idx];
  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const langCfg = useMemo(() => LANGUAGES.find((l) => l.id === lang)!, [lang]);

  const exec = async (stdin: string) => {
    const { data, error } = await supabase.functions.invoke("execute-code", {
      body: { language: langCfg.piston, version: langCfg.version, code, stdin },
    });
    if (error) throw error;
    return data as { stdout: string; stderr: string; compile: string; ok: boolean };
  };

  const handleRun = async () => {
    if (!current) return;
    setIsRunning(true);
    setRunOutput("Running...");
    try {
      const example = current.examples[0];
      const r = await exec(example.input);
      const out =
        r.compile?.trim() ||
        r.stderr?.trim() ||
        r.stdout?.trim() ||
        "(no output)";
      const pass = r.stdout.trim() === example.output.trim();
      setRunOutput(
        `${pass ? "✓ Sample passed" : "✗ Sample failed"}\n\n--- Output ---\n${out}\n\n--- Expected ---\n${example.output}`,
      );
    } catch (e) {
      setRunOutput(`Error: ${(e as Error).message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!current) return;
    setIsSubmitting(true);
    setRunOutput("Evaluating against test cases...");
    let passed = 0;
    try {
      for (const tc of current.testCases) {
        const r = await exec(tc.input);
        if (r.stdout.trim() === tc.expectedOutput.trim()) passed++;
      }
      const total = current.testCases.length;
      const pct = Math.round((passed / total) * 100);
      const next = [
        ...results.filter((r) => r.problemId !== current.id),
        { problemId: current.id, passed, total, percent: pct },
      ];
      setResults(next);
      setRunOutput(`Submitted: ${passed}/${total} test cases passed (${pct}%)`);
      toast({
        title: `Problem ${idx + 1} scored`,
        description: `${passed}/${total} test cases passed`,
      });
      if (idx < problems.length - 1) {
        setTimeout(() => setIdx(idx + 1), 1200);
      } else {
        setTimeout(() => finalize(next), 1200);
      }
    } catch (e) {
      setRunOutput(`Error: ${(e as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalize = (rs: ProblemResult[]) => {
    if (complete) return;
    const avg = rs.length
      ? Math.round(rs.reduce((a, b) => a + b.percent, 0) / rs.length)
      : 0;
    const passed = avg >= CODING_CUTOFF;
    localStorage.setItem("codingScore", avg.toString());
    localStorage.setItem("codingPassed", passed.toString());
    setComplete(true);
    toast({
      title: passed ? "Coding Gauntlet Passed" : "Coding Gauntlet Not Passed",
      description: `Average: ${avg}% (cutoff ${CODING_CUTOFF}%)`,
      variant: passed ? "default" : "destructive",
    });
  };

  if (!current) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-black to-slate-900">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (complete) {
    const avg = results.length
      ? Math.round(results.reduce((a, b) => a + b.percent, 0) / results.length)
      : 0;
    const passed = avg >= CODING_CUTOFF;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-20 pb-10 px-4 bg-gradient-to-b from-black to-slate-900 text-white"
      >
        <div className="max-w-2xl mx-auto bg-slate-800 rounded-xl p-8 text-center">
          <div
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${passed ? "bg-green-100" : "bg-red-100"}`}
          >
            {passed ? (
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {passed ? "Coding Gauntlet Passed!" : "Coding Gauntlet Not Passed"}
          </h2>
          <p className="text-slate-300 mb-2">Average score: {avg}%</p>
          <p className="text-sm text-slate-400 mb-6">Cutoff: {CODING_CUTOFF}%</p>
          <div className="space-y-2 mb-6 text-left max-w-md mx-auto">
            {results.map((r, i) => {
              const prob = CODING_PROBLEMS.find((p) => p.id === r.problemId);
              return (
                <div
                  key={r.problemId}
                  className="flex justify-between bg-slate-900 px-4 py-2 rounded"
                >
                  <span>
                    {i + 1}. {prob?.title ?? r.problemId}
                  </span>
                  <span
                    className={
                      r.percent >= CODING_CUTOFF
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {r.passed}/{r.total} ({r.percent}%)
                  </span>
                </div>
              );
            })}
          </div>
          {passed ? (
            <Button onClick={() => navigate("/interview")} className="button-glow">
              Proceed to AI Interview <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                Return Home
              </Button>
              <Button onClick={() => window.location.reload()}>
                Retry Coding
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 pb-6 px-4 bg-gradient-to-b from-black to-slate-900 text-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-primary p-4 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Code2 className="h-5 w-5" /> Coding Gauntlet
            </h2>
            <p className="text-sm text-white/80">
              Problem {idx + 1} of {problems.length} · {current.difficulty}
            </p>
          </div>
          <div className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
            <Clock className="h-4 w-4 mr-1" /> {fmtTime(timeLeft)}
          </div>
        </div>
        <Progress
          value={(idx / problems.length) * 100}
          className="h-1 rounded-none"
        />

        <div className="grid md:grid-cols-2 gap-0 bg-slate-800 rounded-b-xl overflow-hidden">
          {/* Problem */}
          <div className="p-6 border-r border-slate-700 overflow-y-auto max-h-[70vh]">
            <h3 className="text-lg font-semibold mb-2">{current.title}</h3>
            <p className="text-slate-300 mb-4">{current.description}</p>
            <div className="mb-3">
              <div className="text-sm font-semibold text-primary">Input</div>
              <p className="text-sm text-slate-300">{current.inputFormat}</p>
            </div>
            <div className="mb-3">
              <div className="text-sm font-semibold text-primary">Output</div>
              <p className="text-sm text-slate-300">{current.outputFormat}</p>
            </div>
            <div className="mb-3">
              <div className="text-sm font-semibold text-primary mb-1">
                Examples
              </div>
              {current.examples.map((ex, i) => (
                <div key={i} className="bg-slate-900 p-3 rounded mb-2 text-sm">
                  <div className="text-slate-400">Input:</div>
                  <pre className="text-slate-200 whitespace-pre-wrap">{ex.input}</pre>
                  <div className="text-slate-400 mt-1">Output:</div>
                  <pre className="text-slate-200 whitespace-pre-wrap">{ex.output}</pre>
                  {ex.explanation && (
                    <div className="text-xs text-slate-400 mt-1">
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Editor */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-700">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as LangId)}
                className="bg-slate-800 text-white text-sm px-3 py-1 rounded border border-slate-700"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                >
                  <Play className="h-4 w-4 mr-1" /> Run
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                  className="button-glow"
                >
                  <Send className="h-4 w-4 mr-1" /> Submit
                </Button>
              </div>
            </div>
            <div className="h-[50vh]">
              <Editor
                height="100%"
                language={lang === "cpp" ? "cpp" : lang}
                value={code}
                onChange={(v) => setCode(v ?? "")}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  contextmenu: false,
                }}
              />
            </div>
            <div className="bg-black text-green-300 p-3 text-xs font-mono h-40 overflow-y-auto whitespace-pre-wrap">
              {runOutput || "Output will appear here..."}
            </div>
          </div>
        </div>
      </div>
      <ProctorOverlay
        videoRef={proctor.videoRef}
        cameraReady={proctor.cameraReady}
        cameraError={proctor.cameraError}
        violationScore={proctor.violationScore}
        maxViolations={proctor.maxViolations}
      />
    </motion.div>
  );
};

export default CodingPage;