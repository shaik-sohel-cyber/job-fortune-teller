import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Target, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MissingSkill { skill: string; severity: "high" | "medium" | "low"; reason: string; }
interface RoadmapStep { title: string; why: string; resources: string[]; estWeeks: number; }
interface SkillGap {
  overallMatch: number;
  matchedSkills: string[];
  missingSkills: MissingSkill[];
  roadmap: RoadmapStep[];
}

const severityColor = (s: string) =>
  s === "high" ? "bg-red-100 text-red-700" : s === "medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700";

const SkillGapReport = () => {
  const [report, setReport] = useState<SkillGap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const resumeData = JSON.parse(localStorage.getItem("resumeData") || "{}");
        const pkg = JSON.parse(localStorage.getItem("selectedPackage") || "{}");
        const payload = {
          resumeData,
          targetRole: resumeData?.jobTitle || pkg?.role || "Software Developer",
          targetCompany: resumeData?.company || pkg?.company || "Tech Company",
          aptitudeScore: Number(localStorage.getItem("aptitudeScore") || 0),
          assessmentScore: Number(localStorage.getItem("assessmentScore") || 0),
          codingScore: Number(localStorage.getItem("codingScore") || 0),
          interviewScore: Number(localStorage.getItem("interviewScore") || 0),
        };
        const { data, error: invErr } = await supabase.functions.invoke("skill-gap", { body: payload });
        if (invErr) throw invErr;
        if (data?.error) throw new Error(data.error);
        setReport(data as SkillGap);

        // Persist (best-effort)
        const { data: userRes } = await supabase.auth.getUser();
        if (userRes?.user && data) {
          await supabase.from("skill_gaps").insert({
            user_id: userRes.user.id,
            matched_skills: data.matchedSkills,
            missing_skills: data.missingSkills,
            roadmap: data.roadmap,
            overall_match: data.overallMatch,
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to generate skill gap report");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Skill-Gap Analysis</CardTitle>
          <CardDescription>Generating personalized roadmap…</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your profile against the target role…
        </CardContent>
      </Card>
    );
  }

  if (error || !report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Skill-Gap Analysis</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {error || "Report unavailable."}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" /> Skill-Gap Analysis</CardTitle>
        <CardDescription>How your profile compares to the target role, with a learning roadmap.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall role match</span>
            <span className="text-lg font-bold text-primary">{Math.round(report.overallMatch)}%</span>
          </div>
          <Progress value={report.overallMatch} className="h-3" />
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" /> Matched skills</h4>
          <div className="flex flex-wrap gap-2">
            {report.matchedSkills.length === 0 && <span className="text-sm text-muted-foreground">None detected.</span>}
            {report.matchedSkills.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-600" /> Missing / weak skills</h4>
          <div className="space-y-2">
            {report.missingSkills.length === 0 && <span className="text-sm text-muted-foreground">No major gaps.</span>}
            {report.missingSkills.map((m) => (
              <div key={m.skill} className="p-3 rounded-md border bg-card">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{m.skill}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${severityColor(m.severity)}`}>{m.severity}</span>
                </div>
                <p className="text-sm text-muted-foreground">{m.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-600" /> Learning roadmap</h4>
          <ol className="space-y-3">
            {report.roadmap.map((step, i) => (
              <li key={i} className="p-3 rounded-md border bg-card">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{i + 1}. {step.title}</span>
                  <span className="text-xs text-muted-foreground">~{step.estWeeks} week{step.estWeeks === 1 ? "" : "s"}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{step.why}</p>
                {step.resources?.length > 0 && (
                  <ul className="list-disc pl-5 text-sm space-y-0.5">
                    {step.resources.map((r, j) => <li key={j}>{r}</li>)}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillGapReport;