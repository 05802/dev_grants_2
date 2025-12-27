import { create } from 'zustand';
import rawModelConfig from '@/config/models.json';
import type { ModelConfig, ModelPreferences } from '@/types/models';

interface AIState {
  availableModels: ModelConfig[];
  preferences: ModelPreferences;
  isGenerating: boolean;
  currentTask: string | null;

  // Actions
  setModelForContext: (contextId: string, modelId: string) => void;
  getModelForContext: (contextId: string) => ModelConfig;
  setGenerating: (isGenerating: boolean, task?: string) => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  availableModels: rawModelConfig as ModelConfig[],
  preferences: {
    'editor-pane': rawModelConfig[0].id,
    'evaluator-pane': rawModelConfig[0].id,
    'logframe-pane': rawModelConfig[0].id,
  },
  isGenerating: false,
  currentTask: null,

  setModelForContext: (contextId, modelId) => {
    set((state) => ({
      preferences: { ...state.preferences, [contextId]: modelId },
    }));
  },

  getModelForContext: (contextId) => {
    const { availableModels, preferences } = get();
    const modelId = preferences[contextId];
    return availableModels.find((m) => m.id === modelId) || availableModels[0];
  },

  setGenerating: (isGenerating, task) => {
    set({ isGenerating, currentTask: task || null });
  },
}));
