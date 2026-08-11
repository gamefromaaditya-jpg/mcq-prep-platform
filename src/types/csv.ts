import { QuestionType, QuestionDifficulty } from './question';

export interface CSVImportRow {
  rowIndex: number;
  subject: string;
  chapter: string;
  type: QuestionType | string;
  question: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  explanation?: string;
  difficulty: QuestionDifficulty | string;
  marks: string | number;
  negativeMarks: string | number;
  exam?: string;
  year?: string | number;
  source?: string;
  tags?: string;
  imageUrl?: string;
}

export interface CSVValidationError {
  rowIndex: number;
  field: string;
  message: string;
}

export interface CSVRowResult {
  row: CSVImportRow;
  isValid: boolean;
  errors: CSVValidationError[];
  isDuplicate?: boolean;
  duplicateReason?: string;
}

export interface CSVImportSummary {
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  duplicateRowsCount: number;
  importedCount: number;
  failedCount: number;
  results: CSVRowResult[];
}
