import { llm } from '../ai/llmOrchestrator';
import { prompts } from '../ai/prompts';
import { useApplicationStore } from '@/stores/applicationStore';
import { useAIStore } from '@/stores/aiStore';

export class ContentGenerator {
  async generate(questionId: string, contextId: string): Promise<void> {
    const appStore = useApplicationStore.getState();
    const aiStore = useAIStore.getState();

    const question = appStore.application?.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Get the model config for this context
    const modelConfig = aiStore.getModelForContext(contextId);

    // Set generating state
    aiStore.setGenerating(true, `Generating answer for "${question.title}"`);

    try {
      // 1. Build Context
      const context = this.buildContext(appStore.application?.title || '', question);

      // 2. Get criteria if any
      const criteria = appStore.application?.criteria
        .flatMap((c) => c.items.map((item) => item.description))
        || [];

      // 3. Select Prompt
      const prompt = prompts.generateQuestionContent(
        question.promptText,
        criteria.slice(0, 3), // Limit to first 3 criteria for context
        question.maxWords,
        context
      );

      // 4. Generate using specific Model Config
      const content = await llm.generate(
        'You are a professional grant writer with expertise in creating compelling, well-structured grant applications.',
        prompt,
        modelConfig
      );

      // 5. Update Store (Create new version)
      appStore.createQuestionVersion(questionId, content, 'ai', modelConfig.id);
    } catch (error) {
      console.error('Content generation failed:', error);
      throw error;
    } finally {
      aiStore.setGenerating(false);
    }
  }

  private buildContext(title: string, question: any): string {
    return `Application Title: ${title}
Question: ${question.title}
Word Limit: ${question.maxWords || 'No limit'}`;
  }
}

export const contentGenerator = new ContentGenerator();
