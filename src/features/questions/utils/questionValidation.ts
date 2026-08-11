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

  if (!question.subjectId || question.subjectId.trim().length === 0) {
    errors.push({ field: 'subjectId', message: 'Subject selection is required.' });
  }

  if (!question.type) {
    errors.push({ field: 'type', message: 'Question type is required.' });
  }

  if (question.marks === undefined || question.marks === null || Number(question.marks) < 0) {
    errors.push({ field: 'marks', message: 'Marks must be greater than or equal to zero.' });
  }

  if (question.negativeMarks === undefined || question.negativeMarks === null || Number(question.negativeMarks) < 0) {
    errors.push({ field: 'negativeMarks', message: 'Negative marks must be greater than or equal to zero.' });
  }

  if (!question.type) return errors;

  switch (question.type) {
    case 'single_correct': {
      if (!question.options || question.options.length < 2) {
        errors.push({ field: 'options', message: 'Single correct questions require at least 2 options.' });
      } else {
        const optionIds = new Set<string>();
        for (const opt of question.options) {
          if (!opt.text || opt.text.trim().length === 0) {
            errors.push({ field: 'options', message: `Option choice (${opt.id || 'unnamed'}) cannot be empty.` });
          }
          if (optionIds.has(opt.id)) {
            errors.push({ field: 'options', message: `Duplicate option identifier detected: ${opt.id}.` });
          }
          optionIds.add(opt.id);
        }

        if (!question.correctAnswer || typeof question.correctAnswer !== 'string') {
          errors.push({ field: 'correctAnswer', message: 'Single correct questions require exactly one correct answer.' });
        } else if (!optionIds.has(question.correctAnswer)) {
          errors.push({ field: 'correctAnswer', message: 'Correct answer does not reference an existing option.' });
        }
      }
      break;
    }

    case 'multiple_correct': {
      if (!question.options || question.options.length < 2) {
        errors.push({ field: 'options', message: 'Multiple correct questions require at least 2 options.' });
      } else {
        const optionIds = new Set<string>();
        for (const opt of question.options) {
          if (!opt.text || opt.text.trim().length === 0) {
            errors.push({ field: 'options', message: `Option choice (${opt.id || 'unnamed'}) cannot be empty.` });
          }
          optionIds.add(opt.id);
        }

        if (!Array.isArray(question.correctAnswer) || question.correctAnswer.length === 0) {
          errors.push({ field: 'correctAnswer', message: 'Multiple correct questions require at least one correct answer.' });
        } else {
          const selectedSet = new Set<string>();
          for (const ansId of question.correctAnswer) {
            if (selectedSet.has(ansId)) {
              errors.push({ field: 'correctAnswer', message: `Duplicate correct answer choice: ${ansId}.` });
            }
            selectedSet.add(ansId);
            if (!optionIds.has(ansId)) {
              errors.push({ field: 'correctAnswer', message: `Correct answer (${ansId}) does not reference an existing option.` });
            }
          }
        }
      }
      break;
    }

    case 'integer': {
      if (question.correctAnswer === undefined || question.correctAnswer === null || question.correctAnswer === '') {
        errors.push({ field: 'correctAnswer', message: 'Integer answer value is required.' });
      } else {
        const num = Number(question.correctAnswer);
        if (isNaN(num) || !Number.isInteger(num)) {
          errors.push({ field: 'correctAnswer', message: 'Answer must be a valid integer number.' });
        }
      }
      break;
    }

    case 'numerical': {
      if (question.correctAnswer === undefined || question.correctAnswer === null || question.correctAnswer === '') {
        errors.push({ field: 'correctAnswer', message: 'Numerical answer value is required.' });
      } else if (typeof question.correctAnswer === 'object' && 'value' in question.correctAnswer) {
        const val = Number(question.correctAnswer.value);
        if (isNaN(val)) {
          errors.push({ field: 'correctAnswer', message: 'Numerical target value must be a valid number.' });
        }
        if (question.correctAnswer.tolerance !== undefined) {
          const tol = Number(question.correctAnswer.tolerance);
          if (isNaN(tol) || tol < 0) {
            errors.push({ field: 'correctAnswer', message: 'Tolerance must be a non-negative number.' });
          }
        }
      } else {
        const num = Number(question.correctAnswer);
        if (isNaN(num)) {
          errors.push({ field: 'correctAnswer', message: 'Answer must be a valid numerical value.' });
        }
      }
      break;
    }

    case 'match': {
      if (!question.correctAnswer || typeof question.correctAnswer !== 'object' || Array.isArray(question.correctAnswer)) {
        errors.push({ field: 'correctAnswer', message: 'Match matrix requires a valid mapping of pairs (e.g. { A: "1", B: "2" }).' });
      } else {
        const map = question.correctAnswer as Record<string, string>;
        const keys = Object.keys(map);
        if (keys.length === 0) {
          errors.push({ field: 'correctAnswer', message: 'Match matrix requires at least one pair mapping.' });
        } else {
          for (const key of keys) {
            if (!map[key] || String(map[key]).trim().length === 0) {
              errors.push({ field: 'correctAnswer', message: `Match pair for column "${key}" cannot be empty.` });
            }
          }
        }
      }
      break;
    }
  }

  return errors;
};
