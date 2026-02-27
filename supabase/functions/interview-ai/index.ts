import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, jobTitle, company, round, packageLevel, question, answer, resumeSkills, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let messages: any[] = [];

    if (action === "generate_questions") {
      messages = [
        {
          role: "system",
          content: `You are an expert interviewer for ${company}. Generate exactly 5 interview questions for a ${jobTitle} candidate for the "${round}" round. 
          
The candidate has these skills: ${(resumeSkills || []).join(", ")}.
Package level: ${packageLevel || "entry"}.

For "technical" round: focus on technical knowledge and experience.
For "coding" round: focus on coding problems and system design.
For "domain" round: focus on domain-specific expertise.
For "hr" round: focus on behavioral questions, culture fit, and soft skills.

Make questions specific to the job title and company. For senior level, make questions harder.`
        },
        { role: "user", content: `Generate 5 ${round} interview questions for ${jobTitle} at ${company}.` }
      ];
    } else if (action === "evaluate_answer") {
      messages = [
        {
          role: "system",
          content: `You are an expert interviewer evaluating a candidate's answer. Score the answer 1-10 and provide brief feedback.
Job: ${jobTitle} at ${company}. Round: ${round}. Package: ${packageLevel || "entry"}.
Be more strict for senior level candidates.

Return JSON with: score (1-10), feedback (string), followUp (optional string - a follow-up question if the answer needs clarification).`
        },
        { role: "user", content: `Question: ${question}\n\nCandidate's Answer: ${answer}` }
      ];
    }

    const body: any = {
      model: "google/gemini-3-flash-preview",
      messages,
    };

    if (action === "generate_questions") {
      body.tools = [{
        type: "function",
        function: {
          name: "return_questions",
          description: "Return interview questions",
          parameters: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: { type: "string" },
                description: "List of 5 interview questions"
              }
            },
            required: ["questions"],
            additionalProperties: false
          }
        }
      }];
      body.tool_choice = { type: "function", function: { name: "return_questions" } };
    } else if (action === "evaluate_answer") {
      body.tools = [{
        type: "function",
        function: {
          name: "evaluate",
          description: "Return evaluation of the answer",
          parameters: {
            type: "object",
            properties: {
              score: { type: "number", description: "Score 1-10" },
              feedback: { type: "string", description: "Brief feedback" },
              followUp: { type: "string", description: "Optional follow-up question" }
            },
            required: ["score", "feedback"],
            additionalProperties: false
          }
        }
      }];
      body.tool_choice = { type: "function", function: { name: "evaluate" } };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
    console.error("interview-ai error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
