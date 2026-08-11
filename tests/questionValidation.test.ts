import { describe, it, expect } from 'vitest';
import { validateQuestion } from '../src/features/questions/utils/questionValidation';

describe('Question Form Validation', () => {
  it('validates a complete, valid question', () => {
    const errors = validateQuestion({
      questionText: 'What is gravitational acceleration on Earth?',
      subjectId: 'phys_101',
      type: 'single_correct',
      marks: 4,
      negativeMarks: 1,
      options: [
        { id: 'opt_1', text: '9.8 m/s^2' },
        { id: 'opt_2', text: '10.5 m/s^2' },
      ],
      correctAnswer: 'opt_1',
    });

    expect(errors).toHaveLength(0);
  });

  it('detects missing fields in incomplete questions', () => {
    const errors = validateQuestion({});
    expect(errors.some((e) => e.field === 'questionText')).toBe(true);
    expect(errors.some((e) => e.field === 'subjectId')).toBe(true);
    expect(errors.some((e) => e.field === 'type')).toBe(true);
  });
});
