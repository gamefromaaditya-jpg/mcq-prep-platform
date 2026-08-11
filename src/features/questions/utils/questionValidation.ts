import { Question } from '../../../types';

export interface QuestionValidationError {
  field: string;
  message: string;
}

export const validateQuestion = (question: Partial<Question>): QuestionValidationError[] => {
  const errors: QuestionValidationError[] = [];

  if (!question.questionText || question.questionText.trim().length === 0) {
    errors.push({ field: 'questionText', message: 'Question text is required.' });
  }

  if (!question.subjectId) {
    errors.push({ field: 'subjectId', message: 'Subject selection is required.' });
  }

  if (!question.type) {
    errors.push({ field: 'type', message: 'Question type is required.' });
  }

  if (question.marks === undefined || question.marks <= 0) {
    errors.push({ field: 'marks', message: 'Marks must be greater than 0.' });
  }

  if (question.negativeMarks === undefined || question.negativeMarks < 0) {
    errors.push({ field: 'negativeMarks', message: 'Negative marks cannot be negative.' });
  }

  if (question.type === 'single_correct' || question.type === 'multiple_correct') {
    if (!question.options || question.options.length < 2) {
      errors.push({ field: 'options', message: 'At least 2 options are required.' });
    } else {
      const hasEmptyOption = question.options.some((opt) => !opt.text || opt.text.trim().length === 0);
      if (hasEmptyOption) {
        errors.push({ field: 'options', message: 'All option choices must have text.' });
      }
    }
  }

  if (question.correctAnswer === undefined || question.correctAnswer === null || question.correctAnswer === '') {
    errors.push({ field: 'correctAnswer', message: 'Correct answer definition is required.' });
  }

  return errors;
};
