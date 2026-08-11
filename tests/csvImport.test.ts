import { describe, it, expect } from 'vitest';
import { parseCSVText, mapCSVRowToQuestion, createQuestionFingerprint } from '../src/services/csvImportService';
import { CSVImportRow } from '../src/types';

describe('CSV Bulk Import Parser & Validator Engine', () => {
  it('parses raw CSV text into structured rows', () => {
    const rawCSV = `subject,chapter,type,question,optionA,optionB,optionC,optionD,correctAnswer,explanation,difficulty,marks,negativeMarks
phys_101,chap_rot,single_correct,"What is the unit of Torque?",N-m,Joule,Watt,Pascal,A,"Torque = r x F",easy,4,1`;

    const rows = parseCSVText(rawCSV);
    expect(rows).toHaveLength(1);
    expect(rows[0].question).toBe('What is the unit of Torque?');
    expect(rows[0].optionA).toBe('N-m');
    expect(rows[0].correctAnswer).toBe('A');
  });

  it('maps single_correct letter choice A to opt_1 correctly', () => {
    const row: CSVImportRow = {
      rowIndex: 1,
      subject: 'phys_101',
      chapter: 'chap_rot',
      type: 'single_correct',
      question: 'Sample single question',
      optionA: 'Option 1 text',
      optionB: 'Option 2 text',
      correctAnswer: 'A',
      difficulty: 'easy',
      marks: 4,
      negativeMarks: 1,
    };

    const mapped = mapCSVRowToQuestion(row, 'sub_1', 'chap_1', 'admin_1');
    expect(mapped.type).toBe('single_correct');
    expect(mapped.correctAnswer).toBe('opt_1');
    expect(mapped.options).toHaveLength(2);
  });

  it('maps multiple_correct letter pipe-separated choice A|B to opt_1, opt_2', () => {
    const row: CSVImportRow = {
      rowIndex: 2,
      subject: 'chem_101',
      chapter: 'chap_elem',
      type: 'multiple_correct',
      question: 'Which of the following are noble gases?',
      optionA: 'Helium',
      optionB: 'Neon',
      optionC: 'Oxygen',
      correctAnswer: 'A|B',
      difficulty: 'medium',
      marks: 4,
      negativeMarks: 1,
    };

    const mapped = mapCSVRowToQuestion(row, 'sub_2', 'chap_2', 'admin_1');
    expect(mapped.type).toBe('multiple_correct');
    expect(mapped.correctAnswer).toEqual(['opt_1', 'opt_2']);
  });

  it('maps numerical value and tolerance correctly', () => {
    const row: CSVImportRow = {
      rowIndex: 3,
      subject: 'math_101',
      chapter: 'chap_calc',
      type: 'numerical',
      question: 'Find the value of pi to two decimal places',
      correctAnswer: '3.14|0.01',
      difficulty: 'easy',
      marks: 4,
      negativeMarks: 1,
    };

    const mapped = mapCSVRowToQuestion(row, 'sub_3', 'chap_3', 'admin_1');
    expect(mapped.type).toBe('numerical');
    expect(mapped.correctAnswer).toEqual({ value: 3.14, tolerance: 0.01 });
  });

  it('maps match matrix mapping A:1|B:2 correctly', () => {
    const row: CSVImportRow = {
      rowIndex: 4,
      subject: 'phys_101',
      chapter: 'chap_units',
      type: 'match',
      question: 'Match physical quantities with their SI units',
      correctAnswer: 'A:1|B:2',
      difficulty: 'hard',
      marks: 4,
      negativeMarks: 1,
    };

    const mapped = mapCSVRowToQuestion(row, 'sub_1', 'chap_1', 'admin_1');
    expect(mapped.type).toBe('match');
    expect(mapped.correctAnswer).toEqual({ A: '1', B: '2' });
  });

  it('generates normalized text fingerprints for duplicate detection', () => {
    const fp1 = createQuestionFingerprint('What is Newton\'s 2nd Law?!', 'sub_1');
    const fp2 = createQuestionFingerprint('what is newton s 2nd law', 'sub_1');
    expect(fp1).toBe(fp2);
  });
});
