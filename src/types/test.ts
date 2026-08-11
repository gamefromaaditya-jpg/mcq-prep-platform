export type QuestionState =
  | 'NOT_VISITED'
  | 'UNANSWERED'
  | 'ANSWERED'
  | 'MARKED_FOR_REVIEW'
  | 'ANSWERED_AND_MARKED';

export type TestCategory = 'mock' | 'chapter_test' | 'dpp' | 'pyq' | 'custom';

export interface TestQuestion {
  questionId: string;
  section?: string;
  order: number;
  marks: number;
  negativeMarks: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  category: TestCategory;
  subjectIds: string[];
  durationMinutes: number;
  totalMarks: number;
  passingMarks?: number;
  totalQuestions: number;
  questions: TestQuestion[];
  isPublished: boolean;
  scheduledAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
