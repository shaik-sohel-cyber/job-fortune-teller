import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resumeData, assessmentScore, interviewScore, roundScores, interviewResponses } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
            content: `You are an expert hiring consultant. Based on the candidate's assessment and interview performance, provide a comprehensive final evaluation.

Candidate applied for: ${resumeData?.jobTitle || "Software Developer"} at ${resumeData?.company || "Tech Company"}.
Assessment score: ${assessmentScore}%
Interview score: ${interviewScore}%
Round scores: ${JSON.stringify(roundScores)}

Provide a detailed, personalized evaluation with:
- overallFeedback: 2-3 paragraph overall assessment
- hiringProbability: percentage chance of getting hired (0-100)
- strengths: list of 3-5 key strengths demonstrated
- improvements: list of 3-5 areas to improve
- recommendations: list of 3-5 actionable recommendations
- verdict: "Strong Hire", "Hire", "Maybe", or "Not Ready Yet"
- skillGaps: list of specific skills to develop`
          },
          {
            role: "user",
            content: `Evaluate this candidate:\n\nResume: ${JSON.stringify(resumeData?.candidateInfo || {})}\n\nInterview responses sample: ${JSON.stringify((interviewResponses || []).slice(0, 10))}`
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "final_assessment",
            description: "Return final assessment",
            parameters: {
              type: "object",
              properties: {
                overallFeedback: { type: "string" },
                hiringProbability: { type: "number" },
                strengths: { type: "array", items: { type: "string" } },
                improvements: { type: "array", items: { type: "string" } },
                recommendations: { type: "array", items: { type: "string" } },
                verdict: { type: "string" },
                skillGaps: { type: "array", items: { type: "string" } }
              },
              required: ["overallFeedback", "hiringProbability", "strengths", "improvements", "recommendations", "verdict", "skillGaps"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "final_assessment" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
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

    const content = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ raw: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("assessment-results error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
