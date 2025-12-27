import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  Application,
  Question,
  QuestionVersion,
  EvaluationResult,
} from '@/types/application';

interface ApplicationState {
  application: Application | null;
  evaluationResults: EvaluationResult[];

  // Actions
  setApplication: (application: Application) => void;
  updateQuestionContent: (questionId: string, content: string) => void;
  createQuestionVersion: (
    questionId: string,
    content: string,
    source: 'user' | 'ai',
    modelId?: string
  ) => void;
  setCurrentVersion: (questionId: string, versionId: string) => void;
  addEvaluationResult: (result: EvaluationResult) => void;
  getQuestionById: (questionId: string) => Question | undefined;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  application: null,
  evaluationResults: [],

  setApplication: (application) => {
    set({ application });
  },

  updateQuestionContent: (questionId, content) => {
    set((state) => {
      if (!state.application) return state;

      const questions = state.application.questions.map((q) => {
        if (q.id !== questionId) return q;

        const currentVersion = q.versions.find(
          (v) => v.id === q.currentVersionId
        );
        if (!currentVersion) return q;

        const updatedVersion: QuestionVersion = {
          ...currentVersion,
          content,
          wordCount: content.trim().split(/\s+/).length,
        };

        return {
          ...q,
          versions: q.versions.map((v) =>
            v.id === q.currentVersionId ? updatedVersion : v
          ),
        };
      });

      return {
        application: {
          ...state.application,
          questions,
        },
      };
    });
  },

  createQuestionVersion: (questionId, content, source, modelId) => {
    set((state) => {
      if (!state.application) return state;

      const newVersion: QuestionVersion = {
        id: uuidv4(),
        content,
        wordCount: content.trim().split(/\s+/).length,
        generatedByModelId: modelId,
        createdAt: new Date(),
        source,
      };

      const questions = state.application.questions.map((q) => {
        if (q.id !== questionId) return q;

        return {
          ...q,
          currentVersionId: newVersion.id,
          versions: [...q.versions, newVersion],
        };
      });

      return {
        application: {
          ...state.application,
          questions,
        },
      };
    });
  },

  setCurrentVersion: (questionId, versionId) => {
    set((state) => {
      if (!state.application) return state;

      const questions = state.application.questions.map((q) => {
        if (q.id !== questionId) return q;
        return { ...q, currentVersionId: versionId };
      });

      return {
        application: {
          ...state.application,
          questions,
        },
      };
    });
  },

  addEvaluationResult: (result) => {
    set((state) => ({
      evaluationResults: [...state.evaluationResults, result],
    }));
  },

  getQuestionById: (questionId) => {
    const { application } = get();
    return application?.questions.find((q) => q.id === questionId);
  },
}));
