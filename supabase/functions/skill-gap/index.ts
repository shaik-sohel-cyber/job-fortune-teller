import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeData, targetRole, targetCompany, assessmentScore, codingScore, aptitudeScore, interviewScore } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const candidateInfo = resumeData?.candidateInfo || resumeData || {};

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a career coach. Compare the candidate's skills/experience to the requirements of ${targetRole || "the target role"} at ${targetCompany || "the target company"}. Use the assessment performance to detect weak areas.

Aptitude: ${aptitudeScore ?? "n/a"}%  Technical MCQ: ${assessmentScore ?? "n/a"}%  Coding: ${codingScore ?? "n/a"}%  Interview: ${interviewScore ?? "n/a"}%

Return a structured skill-gap analysis with matched skills, missing skills (with severity high/medium/low), an overall match score 0-100, and a learning roadmap with 3-6 concrete steps (each: title, why, resources [list of strings], estWeeks number).`,
          },
          {
            role: "user",
            content: `Candidate profile:\n${JSON.stringify(candidateInfo).slice(0, 4000)}`,
          },
        ],
        tools: [{
          type: "function",
          function: {
            name: "skill_gap_report",
            description: "Return skill gap analysis",
            parameters: {
              type: "object",
              properties: {
                overallMatch: { type: "number" },
                matchedSkills: { type: "array", items: { type: "string" } },
                missingSkills: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      skill: { type: "string" },
                      severity: { type: "string", enum: ["high", "medium", "low"] },
                      reason: { type: "string" },
                    },
                    required: ["skill", "severity", "reason"],
                    additionalProperties: false,
                  },
                },
                roadmap: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      why: { type: "string" },
                      resources: { type: "array", items: { type: "string" } },
                      estWeeks: { type: "number" },
                    },
                    required: ["title", "why", "resources", "estWeeks"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["overallMatch", "matchedSkills", "missingSkills", "roadmap"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "skill_gap_report" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "No structured response" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("skill-gap error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});