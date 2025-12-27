import OpenAI from 'openai';
import type { ModelConfig } from '@/types/models';

export class LLMOrchestrator {
  async generate(
    systemPrompt: string,
    userPrompt: string,
    config: ModelConfig
  ): Promise<string> {
    const apiKey = import.meta.env[config.apiKeyEnvVar];
    if (!apiKey) {
      throw new Error(
        `Missing API Key: ${config.apiKeyEnvVar}. Please set it in your .env file.`
      );
    }

    // Initialize client based on provider
    if (config.provider === 'openai') {
      return await this.generateOpenAI(systemPrompt, userPrompt, config, apiKey);
    }

    if (config.provider === 'anthropic') {
      return await this.generateAnthropic(systemPrompt, userPrompt, config, apiKey);
    }

    throw new Error(`Provider ${config.provider} not implemented`);
  }

  private async generateOpenAI(
    systemPrompt: string,
    userPrompt: string,
    config: ModelConfig,
    apiKey: string
  ): Promise<string> {
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: config.baseURL,
      dangerouslyAllowBrowser: true,
    });

    const response = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: config.parameters.modelName,
      temperature: config.parameters.temperature,
      max_tokens: config.parameters.maxTokens,
      frequency_penalty: config.parameters.frequencyPenalty,
      presence_penalty: config.parameters.presencePenalty,
      top_p: config.parameters.topP,
    });

    return response.choices[0]?.message?.content || '';
  }

  private async generateAnthropic(
    systemPrompt: string,
    userPrompt: string,
    config: ModelConfig,
    apiKey: string
  ): Promise<string> {
    // For Anthropic, we'll use fetch to call the API directly
    // since the Anthropic SDK may have different browser compatibility
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: config.parameters.modelName,
        max_tokens: config.parameters.maxTokens || 4000,
        temperature: config.parameters.temperature,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${error}`);
    }

    const data = await response.json();
    return data.content[0]?.text || '';
  }
}

export const llm = new LLMOrchestrator();
