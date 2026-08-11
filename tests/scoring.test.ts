import { describe, it, expect } from 'vitest';
import { calculateQuestionScore } from '../src/features/tests/utils/scoring';
import { Question } from '../src/types';

describe('Test Engine Scoring Logic', () => {
  const mockBaseQuestion: Question = {
    id: 'q1',
    type: 'single_correct',
    subjectId: 'sub_phys',
    chapterId: 'chap_rot',
    questionText: 'What is the moment of inertia of a uniform disk?',
    options: [
      { id: 'opt_1', text: '1/2 MR^2' },
      { id: 'opt_2', text: 'MR^2' },
      { id: 'opt_3', text: '2/5 MR^2' },
    ],
    correctAnswer: 'opt_1',
    explanation: 'Standard formula for solid disk',
    difficulty: 'medium',
    marks: 4,
    negativeMarks: 1,
    createdAt: '2026-08-11T00:00:00Z',
    updatedAt: '2026-08-11T00:00:00Z',
    createdBy: 'admin1',
    isPublished: true,
  };

  it('awards full marks for correct single_correct choice', () => {
    const result = calculateQuestionScore(mockBaseQuestion, 'opt_1');
    expect(result.isCorrect).toBe(true);
    expect(result.marksAwarded).toBe(4);
  });

  it('deducts negative marks for incorrect single_correct choice', () => {
    const result = calculateQuestionScore(mockBaseQuestion, 'opt_2');
    expect(result.isCorrect).toBe(false);
    expect(result.marksAwarded).toBe(-1);
  });

  it('awards 0 marks for un-attempted question', () => {
    const result = calculateQuestionScore(mockBaseQuestion, null);
    expect(result.isCorrect).toBe(false);
    expect(result.marksAwarded).toBe(0);
  });

  it('handles multiple_correct option arrays correctly', () => {
    const multiQuestion: Question = {
      ...mockBaseQuestion,
      type: 'multiple_correct',
      correctAnswer: ['opt_1', 'opt_3'],
    };

    const correctResult = calculateQuestionScore(multiQuestion, ['opt_3', 'opt_1']);
    expect(correctResult.isCorrect).toBe(true);
    expect(correctResult.marksAwarded).toBe(4);

    const incorrectResult = calculateQuestionScore(multiQuestion, ['opt_1']);
    expect(incorrectResult.isCorrect).toBe(false);
    expect(incorrectResult.marksAwarded).toBe(-1);
  });

  it('scores integer questions correctly', () => {
    const integerQuestion: Question = {
      ...mockBaseQuestion,
      type: 'integer',
      correctAnswer: 5,
    };

    const correct = calculateQuestionScore(integerQuestion, 5);
    expect(correct.isCorrect).toBe(true);
    expect(correct.marksAwarded).toBe(4);

    const wrong = calculateQuestionScore(integerQuestion, 4);
    expect(wrong.isCorrect).toBe(false);
    expect(wrong.marksAwarded).toBe(-1);
  });

  it('scores numerical questions with tolerance band', () => {
    const numericalQuestion: Question = {
      ...mockBaseQuestion,
      type: 'numerical',
      correctAnswer: { value: 3.1415, tolerance: 0.01 },
    };

    const withinTolerance = calculateQuestionScore(numericalQuestion, 3.14);
    expect(withinTolerance.isCorrect).toBe(true);
    expect(withinTolerance.marksAwarded).toBe(4);

    const outsideTolerance = calculateQuestionScore(numericalQuestion, 3.25);
    expect(outsideTolerance.isCorrect).toBe(false);
    expect(outsideTolerance.marksAwarded).toBe(-1);
  });

  it('scores match matrix questions accurately', () => {
    const matchQuestion: Question = {
      ...mockBaseQuestion,
      type: 'match',
      correctAnswer: { A: 'P', B: 'Q', C: 'R' },
    };

    const correctMatch = calculateQuestionScore(matchQuestion, { A: 'P', B: 'Q', C: 'R' });
    expect(correctMatch.isCorrect).toBe(true);
    expect(correctMatch.marksAwarded).toBe(4);

    const wrongMatch = calculateQuestionScore(matchQuestion, { A: 'P', B: 'R', C: 'Q' });
    expect(wrongMatch.isCorrect).toBe(false);
    expect(wrongMatch.marksAwarded).toBe(-1);
  });
});
