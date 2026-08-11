import { QuestionState } from './test';

export interface StudentAnswer {
  questionId: string;
  userAnswer: string | string[] | number | Record<string, string> | null;
  state: QuestionState;
  timeSpentSeconds: number;
  isCorrect?: boolean;
  marksAwarded?: number;
}

export type AttemptStatus = 'in_progress' | 'submitted' | 'auto_submitted' | 'timed_out';

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  startedAt: string;
  submittedAt?: string;
  durationSeconds: number;
  remainingSeconds: number;
  status: AttemptStatus;
  answers: Record<string, StudentAnswer>; // Keyed by questionId
  totalScore?: number;
  accuracyPercentage?: number;
  correctCount?: number;
  incorrectCount?: number;
  unansweredCount?: number;
}
