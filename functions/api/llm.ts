// Cloudflare Pages Function: Proxies LLM API calls
// This keeps API keys server-side and avoids CORS issues
//
// Environment variables (set in Cloudflare Dashboard):
//   OPENAI_API_KEY     - OpenAI API key
//   ANTHROPIC_API_KEY  - Anthropic API key

interface Env {
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}

interface LLMRequest {
  provider: 'openai' | 'anthropic';
  model: string;
  messages: Array<{ role: string; content: string }>;
  system?: string;
  temperature?: number;
  max_tokens?: number;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  try {
    const body: LLMRequest = await request.json();
    const { provider, model, messages, system, temperature, max_tokens } = body;

    if (provider === 'openai') {
      if (!env.OPENAI_API_KEY) {
        return Response.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: system
            ? [{ role: 'system', content: system }, ...messages]
            : messages,
          temperature: temperature ?? 0.7,
          max_tokens: max_tokens ?? 4000,
        }),
      });

      const data = await response.json();
      return Response.json(data);
    }

    if (provider === 'anthropic') {
      if (!env.ANTHROPIC_API_KEY) {
        return Response.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          system: system ?? '',
          messages,
          max_tokens: max_tokens ?? 4000,
          temperature: temperature ?? 0.7,
        }),
      });

      const data = await response.json();
      return Response.json(data);
    }

    return Response.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
};
