export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'custom';
  contextWindow: number;

  // Connection details
  apiKeyEnvVar: string; // e.g., "VITE_OPENAI_API_KEY"
  baseURL?: string;

  // Hyperparameters
  parameters: {
    temperature: number;
    topP?: number;
    presencePenalty?: number;
    frequencyPenalty?: number;
    maxTokens?: number;
    modelName: string; // The actual string sent to API (e.g., "gpt-4-1106-preview")
  };
}

export interface ModelPreferences {
  // Maps specific UI contexts to model IDs
  // e.g., { "editor": "gpt-4", "evaluator": "claude-3" }
  [contextId: string]: string;
}
