export interface Application {
  id: string;
  title: string;
  questions: Question[];
  logframe: Logframe;
  criteria: EvaluationCriteria[];
}

export interface Question {
  id: string;
  title: string;
  promptText: string;
  maxWords?: number;
  currentVersionId: string;
  versions: QuestionVersion[];
}

export interface QuestionVersion {
  id: string;
  content: string;
  wordCount: number;
  // We track which model generated this version
  generatedByModelId?: string;
  createdAt: Date;
  source: 'user' | 'ai';
}

export interface Logframe {
  id: string;
  goal: string;
  outcomes: Outcome[];
  outputs: Output[];
  activities: Activity[];
}

export interface Outcome {
  id: string;
  description: string;
  indicators: string[];
}

export interface Output {
  id: string;
  description: string;
  indicators: string[];
  linkedActivities: string[]; // Activity IDs
}

export interface Activity {
  id: string;
  description: string;
  timeline: string;
  resources: string[];
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  type: 'rubric' | 'checklist' | 'custom';
  weight?: number;
  items: CriteriaItem[];
}

export interface CriteriaItem {
  id: string;
  description: string;
  maxScore?: number;
}

export interface EvaluationResult {
  id: string;
  criteriaId: string;
  questionId: string;
  versionId: string;
  score: number;
  feedback: string;
  evaluatedByModelId?: string;
  timestamp: Date;
}
