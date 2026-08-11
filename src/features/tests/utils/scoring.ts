import { Question, StudentAnswer } from '../../../types';

export interface QuestionScoreResult {
  isCorrect: boolean;
  marksAwarded: number;
}

export const calculateQuestionScore = (
  question: Question,
  userAnswer: StudentAnswer['userAnswer']
): QuestionScoreResult => {
  // If unanswered or null
  if (userAnswer === null || userAnswer === undefined || userAnswer === '') {
    return { isCorrect: false, marksAwarded: 0 };
  }

  const { type, correctAnswer, marks, negativeMarks } = question;

  switch (type) {
    case 'single_correct': {
      const isCorrect = String(userAnswer).trim() === String(correctAnswer).trim();
      return {
        isCorrect,
        marksAwarded: isCorrect ? marks : -Math.abs(negativeMarks),
      };
    }

    case 'multiple_correct': {
      if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) {
        return { isCorrect: false, marksAwarded: -Math.abs(negativeMarks) };
      }
      const userSorted = [...userAnswer].map(String).sort();
      const correctSorted = [...correctAnswer].map(String).sort();

      const isCorrect =
        userSorted.length === correctSorted.length &&
        userSorted.every((val, index) => val === correctSorted[index]);

      return {
        isCorrect,
        marksAwarded: isCorrect ? marks : -Math.abs(negativeMarks),
      };
    }

    case 'integer': {
      const userNum = Number(userAnswer);
      const correctNum = Number(correctAnswer);
      const isCorrect = !isNaN(userNum) && !isNaN(correctNum) && userNum === correctNum;

      return {
        isCorrect,
        marksAwarded: isCorrect ? marks : -Math.abs(negativeMarks),
      };
    }

    case 'numerical': {
      const userNum = Number(userAnswer);
      if (isNaN(userNum)) return { isCorrect: false, marksAwarded: -Math.abs(negativeMarks) };

      if (typeof correctAnswer === 'object' && correctAnswer !== null && 'value' in correctAnswer) {
        const target = Number((correctAnswer as { value: number; tolerance?: number }).value);
        const tol = Number((correctAnswer as { value: number; tolerance?: number }).tolerance || 0.01);
        const isCorrect = !isNaN(target) && Math.abs(userNum - target) <= tol;
        return {
          isCorrect,
          marksAwarded: isCorrect ? marks : -Math.abs(negativeMarks),
        };
      } else {
        const correctNum = Number(correctAnswer);
        const isCorrect = !isNaN(correctNum) && Math.abs(userNum - correctNum) <= 0.01;
        return {
          isCorrect,
          marksAwarded: isCorrect ? marks : -Math.abs(negativeMarks),
        };
      }
    }

    case 'match': {
      if (typeof userAnswer !== 'object' || typeof correctAnswer !== 'object' || !userAnswer || !correctAnswer) {
        return { isCorrect: false, marksAwarded: -Math.abs(negativeMarks) };
      }
      const userMap = userAnswer as Record<string, string>;
      const correctMap = correctAnswer as Record<string, string>;

      const keys = Object.keys(correctMap);
      const isCorrect =
        keys.length > 0 &&
        keys.every((key) => String(userMap[key]).trim() === String(correctMap[key]).trim());

      return {
        isCorrect,
        marksAwarded: isCorrect ? marks : -Math.abs(negativeMarks),
      };
    }

    default:
      return { isCorrect: false, marksAwarded: 0 };
  }
};
