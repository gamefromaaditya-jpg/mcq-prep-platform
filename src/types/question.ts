export type QuestionType =
  | 'single_correct'
  | 'multiple_correct'
  | 'integer'
  | 'numerical'
  | 'match';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface MatchPair {
  leftId: string;
  leftText: string;
  rightId: string;
  rightText: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  subjectId: string;
  chapterId: string;
  questionText: string;
  questionImageUrl?: string;
  options?: QuestionOption[];
  matchPairs?: MatchPair[];
  // Correct answer schema:
  // - single_correct: option id e.g. "opt_1"
  // - multiple_correct: array of option ids e.g. ["opt_1", "opt_3"]
  // - integer: number e.g. 5
  // - numerical: number or range e.g. { value: 3.14, tolerance: 0.01 }
  // - match: mapping object { leftId: rightId }
  correctAnswer: string | string[] | number | { value: number; tolerance?: number } | Record<string, string>;
  explanation: string;
  explanationImageUrl?: string;
  difficulty: QuestionDifficulty;
  marks: number;
  negativeMarks: number;
  source?: string;
  exam?: string;
  year?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublished: boolean;
}
