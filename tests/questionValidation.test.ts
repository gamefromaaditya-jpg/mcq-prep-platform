import { describe, it, expect } from 'vitest';
import { validateQuestion } from '../src/features/questions/utils/questionValidation';

describe('Comprehensive Question Form Validation Suite', () => {
  it('validates a complete, valid single_correct question', () => {
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

  it('validates multiple_correct questions correctly', () => {
    const validMulti = validateQuestion({
      questionText: 'Select prime numbers',
      subjectId: 'math_101',
      type: 'multiple_correct',
      marks: 4,
      negativeMarks: 1,
      options: [
        { id: 'opt_1', text: '2' },
        { id: 'opt_2', text: '3' },
        { id: 'opt_3', text: '4' },
      ],
      correctAnswer: ['opt_1', 'opt_2'],
    });
    expect(validMulti).toHaveLength(0);

    const invalidMulti = validateQuestion({
      questionText: 'Select prime numbers',
      subjectId: 'math_101',
      type: 'multiple_correct',
      marks: 4,
      negativeMarks: 1,
      options: [
        { id: 'opt_1', text: '2' },
        { id: 'opt_2', text: '3' },
      ],
      correctAnswer: [], // empty correct answer
    });
    expect(invalidMulti.some((e) => e.field === 'correctAnswer')).toBe(true);
  });

  it('validates integer questions correctly', () => {
    const validInt = validateQuestion({
      questionText: 'How many valence electrons does Carbon have?',
      subjectId: 'chem_101',
      type: 'integer',
      marks: 4,
      negativeMarks: 0,
      correctAnswer: 4,
    });
    expect(validInt).toHaveLength(0);

    const invalidInt = validateQuestion({
      questionText: 'How many valence electrons does Carbon have?',
      subjectId: 'chem_101',
      type: 'integer',
      marks: 4,
      negativeMarks: 0,
      correctAnswer: 'not_a_number',
    });
    expect(invalidInt.some((e) => e.field === 'correctAnswer')).toBe(true);
  });

  it('validates numerical questions with tolerance', () => {
    const validNum = validateQuestion({
      questionText: 'Calculate the value of e',
      subjectId: 'math_101',
      type: 'numerical',
      marks: 4,
      negativeMarks: 1,
      correctAnswer: { value: 2.718, tolerance: 0.005 },
    });
    expect(validNum).toHaveLength(0);
  });

  it('validates match matrix questions correctly', () => {
    const validMatch = validateQuestion({
      questionText: 'Match items',
      subjectId: 'phys_101',
      type: 'match',
      marks: 4,
      negativeMarks: 1,
      correctAnswer: { A: '1', B: '2' },
    });
    expect(validMatch).toHaveLength(0);
  });
});
