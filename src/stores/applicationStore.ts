import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  Application,
  Question,
  QuestionVersion,
  EvaluationResult,
  Outcome,
  Output,
  Activity,
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

  // Logframe Actions
  updateLogframeGoal: (goal: string) => void;
  addOutcome: (outcome: Omit<Outcome, 'id'>) => void;
  updateOutcome: (id: string, outcome: Partial<Outcome>) => void;
  removeOutcome: (id: string) => void;
  addOutput: (output: Omit<Output, 'id'>) => void;
  updateOutput: (id: string, output: Partial<Output>) => void;
  removeOutput: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  removeActivity: (id: string) => void;
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

  // Logframe Actions
  updateLogframeGoal: (goal) => {
    set((state) => {
      if (!state.application) return state;
      return {
        application: {
          ...state.application,
          logframe: { ...state.application.logframe, goal },
        },
      };
    });
  },

  addOutcome: (outcome) => {
    set((state) => {
      if (!state.application) return state;
      const newOutcome = { ...outcome, id: uuidv4() };
      return {
        application: {
          ...state.application,
          logframe: {
            ...state.application.logframe,
            outcomes: [...state.application.logframe.outcomes, newOutcome],
          },
        },
      };
    });
  },

  updateOutcome: (id, outcome) => {
    set((state) => {
      if (!state.application) return state;
      return {
        application: {
          ...state.application,
          logframe: {
            ...state.application.logframe,
            outcomes: state.application.logframe.outcomes.map((o) =>
              o.id === id ? { ...o, ...outcome } : o
            ),
          },
        },
      };
    });
  },

  removeOutcome: (id) => {
    set((state) => {
      if (!state.application) return state;
      return {
        application: {
          ...state.application,
          logframe: {
            ...state.application.logframe,
            outcomes: state.application.logframe.outcomes.filter((o) => o.id !== id),
          },
        },
      };
    });
  },

  addOutput: (output) => {
    set((state) => {
      if (!state.application) return state;
      const newOutput = { ...output, id: uuidv4() };
      return {
        application: {
          ...state.application,
          logframe: {
            ...state.application.logframe,
            outputs: [...state.application.logframe.outputs, newOutput],
          },
        },
      };
    });
  },

  updateOutput: (id, output) => {
    set((state) => {
      if (!state.application) return state;
      return {
        application: {
          ...state.application,
          logframe: {
            ...state.application.logframe,
            outputs: state.application.logframe.outputs.map((o) =>
              o.id === id ? { ...o, ...output } : o
            ),
          },
        },
      };
    });
  },

  removeOutput: (id) => {
    set((state) => {
      if (!state.application) return state;
      return {
        application: {
          ...state.application,
          logframe: {
            ...state.application.logframe,
            outputs: state.application.logframe.outputs.filter((o) => o.id !== id),
          },
        },
      };
    });
  },

  addActivity: (activity) => {
    set((state) => {
      if (!state.application) return state;
      const newActivity = { ...activity, id: uuidv4() };
      return {
        application: {
          ...state.application,
          logframe: {
            ...state.application.logframe,
            activities: [...state.application.logframe.activities, newActivity],
          },
        },
      };
    });
  },

  updateActivity: (id, activity) => {
    set((state) => {
      if (!state.application) return state;
      return {
        application: {
          ...state.application,
          logframe: {
            ...state.application.logframe,
            activities: state.application.logframe.activities.map((a) =>
              a.id === id ? { ...a, ...activity } : a
            ),
          },
        },
      };
    });
  },

  removeActivity: (id) => {
    set((state) => {
      if (!state.application) return state;
      return {
        application: {
          ...state.application,
          logframe: {
            ...state.application.logframe,
            activities: state.application.logframe.activities.filter((a) => a.id !== id),
          },
        },
      };
    });
  },
}));
