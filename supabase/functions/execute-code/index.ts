import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

interface ExecReq {
  language: string;
  version?: string;
  code: string;
  stdin?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = (await req.json()) as ExecReq;
    if (!body?.language || !body?.code) {
      return new Response(JSON.stringify({ error: 'language and code required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(PISTON_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: body.language,
        version: body.version ?? '*',
        files: [{ content: body.code }],
        stdin: body.stdin ?? '',
        run_timeout: 5000,
        compile_timeout: 10000,
      }),
    });

    const data = await res.json();
    const stdout = (data?.run?.stdout ?? '').toString();
    const stderr = (data?.run?.stderr ?? '').toString();
    const compile = (data?.compile?.stderr ?? '').toString();
    const code = data?.run?.code ?? 0;

    return new Response(
      JSON.stringify({ stdout, stderr, compile, code, ok: !compile && code === 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});