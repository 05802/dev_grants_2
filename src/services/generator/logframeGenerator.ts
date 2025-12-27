import { llm } from '../ai/llmOrchestrator';
import { prompts } from '../ai/prompts';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAIStore } from '@/stores/aiStore';

export class LogframeGenerator {
  private contextId = 'logframe-pane';

  async generateGoal(): Promise<string> {
    const appStore = useApplicationStore.getState();
    const aiStore = useAIStore.getState();

    if (!appStore.application) {
      throw new Error('No application loaded');
    }

    const modelConfig = aiStore.getModelForContext(this.contextId);
    aiStore.setGenerating(true, 'Generating project goal...');

    try {
      const context = this.buildContext(appStore.application);
      const prompt = `You are helping to develop a logical framework (logframe) for a grant application.

Project Context:
${context}

Generate a clear, high-level project goal statement that:
1. Captures the ultimate impact or change the project aims to achieve
2. Is inspirational yet achievable
3. Aligns with the project context and questions

Respond with ONLY the goal statement, no additional text or formatting.`;

      const goal = await llm.generate(
        'You are an expert grant writer specializing in logical frameworks.',
        prompt,
        modelConfig
      );

      appStore.updateLogframeGoal(goal.trim());
      return goal.trim();
    } finally {
      aiStore.setGenerating(false);
    }
  }

  async generateOutcome(): Promise<void> {
    const appStore = useApplicationStore.getState();
    const aiStore = useAIStore.getState();

    if (!appStore.application) {
      throw new Error('No application loaded');
    }

    const modelConfig = aiStore.getModelForContext(this.contextId);
    const logframe = appStore.application.logframe;
    const existingOutcomes = logframe.outcomes.map((o) => o.description);

    aiStore.setGenerating(true, 'Generating outcome...');

    try {
      const context = this.buildContext(appStore.application);
      const prompt = prompts.generateLogframeElement('outcome', context, existingOutcomes);

      const response = await llm.generate(
        'You are an expert grant writer specializing in logical frameworks. Always respond with valid JSON.',
        prompt,
        modelConfig
      );

      const parsed = this.parseJsonResponse(response);
      appStore.addOutcome({
        description: parsed.description,
        indicators: parsed.indicators || [],
      });
    } finally {
      aiStore.setGenerating(false);
    }
  }

  async generateOutput(): Promise<void> {
    const appStore = useApplicationStore.getState();
    const aiStore = useAIStore.getState();

    if (!appStore.application) {
      throw new Error('No application loaded');
    }

    const modelConfig = aiStore.getModelForContext(this.contextId);
    const logframe = appStore.application.logframe;
    const existingOutputs = logframe.outputs.map((o) => o.description);

    aiStore.setGenerating(true, 'Generating output...');

    try {
      const context = this.buildContext(appStore.application);
      const prompt = prompts.generateLogframeElement('output', context, existingOutputs);

      const response = await llm.generate(
        'You are an expert grant writer specializing in logical frameworks. Always respond with valid JSON.',
        prompt,
        modelConfig
      );

      const parsed = this.parseJsonResponse(response);
      appStore.addOutput({
        description: parsed.description,
        indicators: parsed.indicators || [],
        linkedActivities: [],
      });
    } finally {
      aiStore.setGenerating(false);
    }
  }

  async generateActivity(): Promise<void> {
    const appStore = useApplicationStore.getState();
    const aiStore = useAIStore.getState();

    if (!appStore.application) {
      throw new Error('No application loaded');
    }

    const modelConfig = aiStore.getModelForContext(this.contextId);
    const logframe = appStore.application.logframe;
    const existingActivities = logframe.activities.map((a) => a.description);

    aiStore.setGenerating(true, 'Generating activity...');

    try {
      const context = this.buildContext(appStore.application);
      const prompt = prompts.generateLogframeElement('activity', context, existingActivities);

      const response = await llm.generate(
        'You are an expert grant writer specializing in logical frameworks. Always respond with valid JSON.',
        prompt,
        modelConfig
      );

      const parsed = this.parseJsonResponse(response);
      appStore.addActivity({
        description: parsed.description,
        timeline: '',
        resources: [],
      });
    } finally {
      aiStore.setGenerating(false);
    }
  }

  private buildContext(application: { title: string; questions: Array<{ title: string; promptText: string }> }): string {
    const questionSummary = application.questions
      .map((q) => `- ${q.title}: ${q.promptText}`)
      .join('\n');

    return `Application Title: ${application.title}

Grant Questions:
${questionSummary}`;
  }

  private parseJsonResponse(response: string): { description: string; indicators?: string[] } {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      // Fallback: treat entire response as description
      return { description: response.trim(), indicators: [] };
    } catch {
      return { description: response.trim(), indicators: [] };
    }
  }
}

export const logframeGenerator = new LogframeGenerator();
