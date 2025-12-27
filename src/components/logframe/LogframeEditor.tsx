import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, Target, TrendingUp, Package, Activity } from 'lucide-react';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAIStore } from '@/stores/aiStore';
import { logframeGenerator } from '@/services/generator/logframeGenerator';
import { ModelSelector } from '../shared/ModelSelector';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

interface LogframeItemProps {
  title: string;
  description: string;
  indicators?: string[];
  onDescriptionChange: (value: string) => void;
  onIndicatorChange?: (index: number, value: string) => void;
  onAddIndicator?: () => void;
  onRemoveIndicator?: (index: number) => void;
  onRemove: () => void;
  icon: React.ReactNode;
  colorClass: string;
}

const LogframeItem: React.FC<LogframeItemProps> = ({
  title,
  description,
  indicators,
  onDescriptionChange,
  onIndicatorChange,
  onAddIndicator,
  onRemoveIndicator,
  onRemove,
  icon,
  colorClass,
}) => {
  return (
    <div className={cn('border rounded-lg p-4 bg-bg-secondary', colorClass)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-text-primary">{title}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove} className="h-7 w-7 text-text-muted hover:text-accent-red">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Enter description..."
        className="w-full bg-bg-primary border border-border rounded-md p-2 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-1 focus:ring-accent-purple"
        rows={2}
      />
      {indicators && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase">Indicators</span>
            {onAddIndicator && (
              <button
                onClick={onAddIndicator}
                className="text-xs text-accent-purple hover:text-accent-purple-hover flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            )}
          </div>
          <div className="space-y-2">
            {indicators.map((indicator, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={indicator}
                  onChange={(e) => onIndicatorChange?.(index, e.target.value)}
                  placeholder="Enter indicator..."
                  className="flex-1 bg-bg-primary border border-border rounded px-2 py-1 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-purple"
                />
                <button
                  onClick={() => onRemoveIndicator?.(index)}
                  className="text-text-muted hover:text-accent-red"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const LogframeEditor: React.FC = () => {
  const { application, updateLogframeGoal, updateOutcome, removeOutcome, updateOutput, removeOutput, updateActivity, removeActivity } = useApplicationStore();
  const { isGenerating, currentTask } = useAIStore();
  const [error, setError] = useState<string | null>(null);

  if (!application) {
    return (
      <div className="h-full flex items-center justify-center text-text-muted">
        No application loaded
      </div>
    );
  }

  const { logframe } = application;

  const handleGenerateGoal = async () => {
    setError(null);
    try {
      await logframeGenerator.generateGoal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate goal');
    }
  };

  const handleGenerateOutcome = async () => {
    setError(null);
    try {
      await logframeGenerator.generateOutcome();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate outcome');
    }
  };

  const handleGenerateOutput = async () => {
    setError(null);
    try {
      await logframeGenerator.generateOutput();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate output');
    }
  };

  const handleGenerateActivity = async () => {
    setError(null);
    try {
      await logframeGenerator.generateActivity();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate activity');
    }
  };

  const handleOutcomeIndicatorChange = (outcomeId: string, indicators: string[], index: number, value: string) => {
    const newIndicators = [...indicators];
    newIndicators[index] = value;
    updateOutcome(outcomeId, { indicators: newIndicators });
  };

  const handleAddOutcomeIndicator = (outcomeId: string, indicators: string[]) => {
    updateOutcome(outcomeId, { indicators: [...indicators, ''] });
  };

  const handleRemoveOutcomeIndicator = (outcomeId: string, indicators: string[], index: number) => {
    updateOutcome(outcomeId, { indicators: indicators.filter((_, i) => i !== index) });
  };

  const handleOutputIndicatorChange = (outputId: string, indicators: string[], index: number, value: string) => {
    const newIndicators = [...indicators];
    newIndicators[index] = value;
    updateOutput(outputId, { indicators: newIndicators });
  };

  const handleAddOutputIndicator = (outputId: string, indicators: string[]) => {
    updateOutput(outputId, { indicators: [...indicators, ''] });
  };

  const handleRemoveOutputIndicator = (outputId: string, indicators: string[], index: number) => {
    updateOutput(outputId, { indicators: indicators.filter((_, i) => i !== index) });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-2 bg-bg-secondary border-b border-border-muted flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-text-primary">Logical Framework</span>
          <ModelSelector contextId="logframe-pane" />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-6 py-3 bg-accent-red/10 border-b border-accent-red/20">
          <p className="text-sm text-accent-red">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="px-6 py-3 bg-accent-purple/10 border-b border-accent-purple/20">
          <p className="text-sm text-accent-purple">{currentTask}</p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Goal Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-green" />
              <h2 className="text-lg font-semibold text-text-primary">Project Goal</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateGoal}
              disabled={isGenerating}
              className="text-accent-purple hover:text-accent-purple"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Generate
            </Button>
          </div>
          <textarea
            value={logframe.goal}
            onChange={(e) => updateLogframeGoal(e.target.value)}
            placeholder="Enter the high-level goal of your project..."
            className="w-full bg-bg-secondary border border-border rounded-lg p-3 text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-accent-purple"
            rows={3}
            disabled={isGenerating}
          />
        </section>

        {/* Outcomes Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-blue" />
              <h2 className="text-lg font-semibold text-text-primary">Outcomes</h2>
              <span className="text-xs text-text-muted">({logframe.outcomes.length})</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateOutcome}
              disabled={isGenerating}
              className="text-accent-purple hover:text-accent-purple"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Generate
            </Button>
          </div>
          <div className="space-y-3">
            {logframe.outcomes.map((outcome, index) => (
              <LogframeItem
                key={outcome.id}
                title={`Outcome ${index + 1}`}
                description={outcome.description}
                indicators={outcome.indicators}
                onDescriptionChange={(value) => updateOutcome(outcome.id, { description: value })}
                onIndicatorChange={(idx, value) => handleOutcomeIndicatorChange(outcome.id, outcome.indicators, idx, value)}
                onAddIndicator={() => handleAddOutcomeIndicator(outcome.id, outcome.indicators)}
                onRemoveIndicator={(idx) => handleRemoveOutcomeIndicator(outcome.id, outcome.indicators, idx)}
                onRemove={() => removeOutcome(outcome.id)}
                icon={<TrendingUp className="w-4 h-4 text-accent-blue" />}
                colorClass="border-accent-blue/20"
              />
            ))}
            {logframe.outcomes.length === 0 && (
              <p className="text-sm text-text-muted italic">No outcomes defined. Click "Generate" to create one.</p>
            )}
          </div>
        </section>

        {/* Outputs Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-accent-yellow" />
              <h2 className="text-lg font-semibold text-text-primary">Outputs</h2>
              <span className="text-xs text-text-muted">({logframe.outputs.length})</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateOutput}
              disabled={isGenerating}
              className="text-accent-purple hover:text-accent-purple"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Generate
            </Button>
          </div>
          <div className="space-y-3">
            {logframe.outputs.map((output, index) => (
              <LogframeItem
                key={output.id}
                title={`Output ${index + 1}`}
                description={output.description}
                indicators={output.indicators}
                onDescriptionChange={(value) => updateOutput(output.id, { description: value })}
                onIndicatorChange={(idx, value) => handleOutputIndicatorChange(output.id, output.indicators, idx, value)}
                onAddIndicator={() => handleAddOutputIndicator(output.id, output.indicators)}
                onRemoveIndicator={(idx) => handleRemoveOutputIndicator(output.id, output.indicators, idx)}
                onRemove={() => removeOutput(output.id)}
                icon={<Package className="w-4 h-4 text-accent-yellow" />}
                colorClass="border-accent-yellow/20"
              />
            ))}
            {logframe.outputs.length === 0 && (
              <p className="text-sm text-text-muted italic">No outputs defined. Click "Generate" to create one.</p>
            )}
          </div>
        </section>

        {/* Activities Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent-orange" />
              <h2 className="text-lg font-semibold text-text-primary">Activities</h2>
              <span className="text-xs text-text-muted">({logframe.activities.length})</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGenerateActivity}
              disabled={isGenerating}
              className="text-accent-purple hover:text-accent-purple"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Generate
            </Button>
          </div>
          <div className="space-y-3">
            {logframe.activities.map((activity, index) => (
              <div key={activity.id} className="border border-accent-orange/20 rounded-lg p-4 bg-bg-secondary">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent-orange" />
                    <span className="text-sm font-medium text-text-primary">Activity {index + 1}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeActivity(activity.id)} className="h-7 w-7 text-text-muted hover:text-accent-red">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <textarea
                  value={activity.description}
                  onChange={(e) => updateActivity(activity.id, { description: e.target.value })}
                  placeholder="Enter activity description..."
                  className="w-full bg-bg-primary border border-border rounded-md p-2 text-sm text-text-primary placeholder-text-muted resize-none focus:outline-none focus:ring-1 focus:ring-accent-purple"
                  rows={2}
                />
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text-muted uppercase mb-1 block">Timeline</label>
                    <input
                      type="text"
                      value={activity.timeline}
                      onChange={(e) => updateActivity(activity.id, { timeline: e.target.value })}
                      placeholder="e.g., Month 1-3"
                      className="w-full bg-bg-primary border border-border rounded px-2 py-1 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-purple"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-muted uppercase mb-1 block">Resources</label>
                    <input
                      type="text"
                      value={activity.resources.join(', ')}
                      onChange={(e) => updateActivity(activity.id, { resources: e.target.value.split(',').map(r => r.trim()).filter(Boolean) })}
                      placeholder="e.g., Staff, Budget"
                      className="w-full bg-bg-primary border border-border rounded px-2 py-1 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-purple"
                    />
                  </div>
                </div>
              </div>
            ))}
            {logframe.activities.length === 0 && (
              <p className="text-sm text-text-muted italic">No activities defined. Click "Generate" to create one.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
