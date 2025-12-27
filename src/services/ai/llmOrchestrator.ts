import type { ModelConfig } from '@/types/models';

// LLM Orchestrator - calls the server-side proxy at /api/llm
// API keys are kept server-side in Cloudflare environment variables

export class LLMOrchestrator {
  async generate(
    systemPrompt: string,
    userPrompt: string,
    config: ModelConfig
  ): Promise<string> {
    const response = await fetch('/api/llm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: config.provider,
        model: config.parameters.modelName,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        temperature: config.parameters.temperature,
        max_tokens: config.parameters.maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API error: ${response.status}`);
    }

    const data = await response.json();

    // Handle OpenAI response format
    if (config.provider === 'openai') {
      return data.choices?.[0]?.message?.content || '';
    }

    // Handle Anthropic response format
    if (config.provider === 'anthropic') {
      return data.content?.[0]?.text || '';
    }

    throw new Error(`Unknown provider: ${config.provider}`);
  }
}

export const llm = new LLMOrchestrator();
