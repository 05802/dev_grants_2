import React from 'react';
import { Cpu } from 'lucide-react';
import { useAIStore } from '@/stores/aiStore';
import { Dropdown } from '@/components/ui/Dropdown';

interface ModelSelectorProps {
  contextId: string; // e.g., 'question-editor', 'evaluator-pane'
  className?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  contextId,
  className = '',
}) => {
  const { availableModels, preferences, setModelForContext } = useAIStore();

  // Default to first model if none selected
  const selectedModelId = preferences[contextId] || availableModels[0]?.id;

  const options = availableModels.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Cpu className="w-4 h-4 text-text-muted" />
      <Dropdown
        value={selectedModelId}
        options={options}
        onChange={(value) => setModelForContext(contextId, value)}
        className="w-48 h-8 text-xs"
      />
    </div>
  );
};
