export interface Summary {
  id: string;
  title: string;
  originalText: string;
  summaryText: string;
  timestamp: Date;
  length: 'short' | 'medium' | 'long';
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  sourceId: string; // ID of summary this was generated from
  questions: QuizQuestion[];
  timestamp: Date;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  answers: Record<string, string | number>;
  score: number;
  timestamp: Date;
  completed: boolean;
}

export interface UserSettings {
  defaultSummaryLength: 'short' | 'medium' | 'long';
  defaultQuizDifficulty: 'easy' | 'medium' | 'hard';
  defaultQuizQuestionCount: number;
  theme: 'light' | 'dark' | 'system';
}