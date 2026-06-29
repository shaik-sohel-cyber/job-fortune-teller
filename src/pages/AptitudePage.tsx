import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { AptitudeQuestion, getAptitudeQuestions } from "@/utils/aptitudeBank";

const APTITUDE_CUTOFF = 60; // percent
const TIME_LIMIT = 600; // 10 min

const AptitudePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [complete, setComplete] = useState(false);
  const [score, setScore] = useState(0);

  // Gate: require previous steps
  useEffect(() => {
    if (!localStorage.getItem("resumeData")) {
      toast({ title: "Upload resume first", variant: "destructive" });
      navigate("/upload");
      return;
    }
    if (!localStorage.getItem("verificationResults")) {
      toast({ title: "Verify resume first", variant: "destructive" });
      navigate("/verification");
      return;
    }
    if (!localStorage.getItem("selectedPackage")) {
      toast({ title: "Select a package first", variant: "destructive" });
      navigate("/package-selection");
      return;
    }
    setQuestions(getAptitudeQuestions(10));
  }, [navigate, toast]);

  // Timer
  useEffect(() => {
    if (complete || timeLeft <= 0) {
      if (timeLeft <= 0 && !complete) finish();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, complete]);

  // Lock navigation while in progress
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!complete) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [complete]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const next = () => {
    if (selected === null) return;
    const updated = { ...answers, [current]: selected };
    setAnswers(updated);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      finish(updated);
    }
  };

  const finish = (finalAnswers: Record<number, number> = answers) => {
    if (complete) return;
    let correct = 0;
    questions.forEach((q, i) => {
      if (finalAnswers[i] === q.correctAnswer) correct++;
    });
    const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;
    setScore(pct);
    setComplete(true);
    const passed = pct >= APTITUDE_CUTOFF;
    localStorage.setItem("aptitudeScore", pct.toString());
    localStorage.setItem("aptitudePassed", passed.toString());
    toast({
      title: passed ? "Aptitude Passed" : "Aptitude Not Passed",
      description: `You scored ${pct}% (cutoff ${APTITUDE_CUTOFF}%)`,
      variant: passed ? "default" : "destructive",
    });
  };

  const passed = score >= APTITUDE_CUTOFF;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 pb-10 px-4 bg-gradient-to-b from-black to-slate-900 text-white"
    >
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-primary p-4">
          <h2 className="text-xl font-semibold">Aptitude Round</h2>
          <p className="text-sm text-white/80">Quantitative, Logical & Verbal reasoning</p>
        </div>

        {!complete && questions.length > 0 && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Question {current + 1} / {questions.length}</span>
              <div className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                <Clock className="h-4 w-4 mr-1" /> {formatTime(timeLeft)}
              </div>
            </div>
            <Progress value={(current / questions.length) * 100} className="mb-6 h-2" />

            <div className="bg-slate-900 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">{questions[current].question}</h3>
              <div className="space-y-3">
                {questions[current].options.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => setSelected(i)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selected === i
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-slate-700 hover:border-slate-600 hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 mr-3 rounded-full flex items-center justify-center ${
                        selected === i ? "bg-primary text-white" : "border border-slate-500"
                      }`}>
                        {selected === i && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <span>{opt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-300 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                Cutoff: {APTITUDE_CUTOFF}% to proceed
              </div>
              <Button onClick={next} disabled={selected === null} className="button-glow">
                {current < questions.length - 1 ? (
                  <>Next <ArrowRight className="ml-2 h-5 w-5" /></>
                ) : (
                  <>Finish <ArrowRight className="ml-2 h-5 w-5" /></>
                )}
              </Button>
            </div>
          </div>
        )}

        {complete && (
          <div className="p-8 text-center">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
              passed ? "bg-green-100" : "bg-red-100"
            }`}>
              {passed ? (
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {passed ? "Aptitude Passed!" : "Aptitude Not Passed"}
            </h2>
            <p className="text-slate-300 mb-2">You scored {score}%</p>
            <p className="text-sm text-slate-400 mb-6">Cutoff: {APTITUDE_CUTOFF}%</p>
            <div className="h-4 bg-slate-700 rounded-full mb-6 overflow-hidden max-w-md mx-auto">
              <div
                className={`h-full ${passed ? "bg-gradient-to-r from-green-500 to-blue-500" : "bg-gradient-to-r from-red-500 to-orange-500"}`}
                style={{ width: `${score}%` }}
              />
            </div>
            {passed ? (
              <Button onClick={() => navigate("/assessment")} className="button-glow">
                Proceed to Technical MCQ <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  You did not meet the cutoff. You can retry the aptitude round.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate("/")}>Return Home</Button>
                  <Button onClick={() => window.location.reload()}>Retry Aptitude</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AptitudePage;