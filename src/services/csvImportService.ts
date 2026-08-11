import {
  db,
  collection,
  writeBatch,
  doc,
  getDocs,
  query,
  limit,
} from '../firebase/firestore';
import { Question, QuestionType, QuestionDifficulty, CSVImportRow, CSVRowResult, CSVValidationError, CSVImportSummary } from '../types';
import { validateQuestion } from '../features/questions/utils/questionValidation';

const QUESTIONS_COLLECTION = 'questions';

export const createQuestionFingerprint = (text: string, subjectId: string): string => {
  const normalizedText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${subjectId.toLowerCase()}_${normalizedText}`;
};

export const parseCSVText = (csvContent: string): CSVImportRow[] => {
  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, '').toLowerCase());

  const rows: CSVImportRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    const values = matches.map((val) => val.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

    if (values.length === 0 || values.every((v) => v === '')) continue;

    const rowObj: any = { rowIndex: i };

    headers.forEach((header, index) => {
      if (index < values.length) {
        rowObj[header] = values[index];
      }
    });

    rows.push({
      rowIndex: i,
      subject: rowObj.subject || rowObj.subjectid || '',
      chapter: rowObj.chapter || rowObj.chapterid || '',
      type: (rowObj.type || 'single_correct').toLowerCase() as QuestionType,
      question: rowObj.question || rowObj.questiontext || '',
      optionA: rowObj.optiona || rowObj.opt_1 || '',
      optionB: rowObj.optionb || rowObj.opt_2 || '',
      optionC: rowObj.optionc || rowObj.opt_3 || '',
      optionD: rowObj.optiond || rowObj.opt_4 || '',
      correctAnswer: rowObj.correctanswer || rowObj.answer || '',
      explanation: rowObj.explanation || '',
      difficulty: (rowObj.difficulty || 'medium').toLowerCase() as QuestionDifficulty,
      marks: rowObj.marks !== undefined ? Number(rowObj.marks) : 4,
      negativeMarks: rowObj.negativemarks !== undefined ? Number(rowObj.negativemarks) : 1,
      exam: rowObj.exam || '',
      year: rowObj.year || '',
      source: rowObj.source || '',
      tags: rowObj.tags || '',
      imageUrl: rowObj.imageurl || rowObj.image || '',
    });
  }

  return rows;
};

export const mapCSVRowToQuestion = (
  row: CSVImportRow,
  subjectId: string,
  chapterId: string,
  userId: string
): Partial<Question> => {
  const type = (row.type || 'single_correct') as QuestionType;

  let options = undefined;
  let correctAnswer: any = row.correctAnswer;

  if (type === 'single_correct' || type === 'multiple_correct') {
    options = [
      { id: 'opt_1', text: row.optionA || '' },
      { id: 'opt_2', text: row.optionB || '' },
      { id: 'opt_3', text: row.optionC || '' },
      { id: 'opt_4', text: row.optionD || '' },
    ].filter((opt) => opt.text.trim().length > 0);

    const letterMap: Record<string, string> = { A: 'opt_1', B: 'opt_2', C: 'opt_3', D: 'opt_4' };

    if (type === 'single_correct') {
      const rawAns = String(row.correctAnswer).trim().toUpperCase();
      correctAnswer = letterMap[rawAns] || row.correctAnswer;
    } else if (type === 'multiple_correct') {
      const parts = String(row.correctAnswer).split('|').map((p) => p.trim().toUpperCase());
      correctAnswer = parts.map((p) => letterMap[p] || p);
    }
  } else if (type === 'integer') {
    correctAnswer = Number(row.correctAnswer);
  } else if (type === 'numerical') {
    const parts = String(row.correctAnswer).split('|').map((p) => p.trim());
    if (parts.length > 1) {
      correctAnswer = {
        value: Number(parts[0]),
        tolerance: Number(parts[1]),
      };
    } else {
      correctAnswer = Number(parts[0]);
    }
  } else if (type === 'match') {
    const pairs = String(row.correctAnswer).split('|');
    const matchMap: Record<string, string> = {};
    for (const pair of pairs) {
      const [left, right] = pair.split(':').map((s) => s.trim());
      if (left && right) {
        matchMap[left] = right;
      }
    }
    correctAnswer = matchMap;
  }

  const tagsArray = row.tags
    ? String(row.tags)
        .split(';')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return {
    subjectId,
    chapterId,
    type,
    questionText: row.question,
    options,
    correctAnswer,
    explanation: row.explanation || '',
    difficulty: (row.difficulty as QuestionDifficulty) || 'medium',
    marks: Number(row.marks) || 4,
    negativeMarks: Number(row.negativeMarks) || 1,
    exam: row.exam || undefined,
    year: row.year ? Number(row.year) : undefined,
    source: row.source || undefined,
    tags: tagsArray,
    questionImageUrl: row.imageUrl || undefined,
    isPublished: true,
    createdBy: userId,
  };
};

export const validateAndAnalyzeCSV = async (
  rows: CSVImportRow[],
  subjectId: string,
  chapterId: string,
  userId: string
): Promise<CSVImportSummary> => {
  const results: CSVRowResult[] = [];
  const inMemoryFingerprints = new Set<string>();

  const existingSnapshot = await getDocs(query(collection(db, QUESTIONS_COLLECTION), limit(500)));
  const existingFingerprints = new Set<string>(
    existingSnapshot.docs.map((d) => {
      const data = d.data() as Record<string, any>;
      return createQuestionFingerprint(data.questionText || '', data.subjectId || '');
    })
  );

  let validCount = 0;
  let invalidCount = 0;
  let duplicateCount = 0;

  for (const row of rows) {
    const mappedQuestion = mapCSVRowToQuestion(row, subjectId, chapterId, userId);
    const validationErrors = validateQuestion(mappedQuestion);

    const csvErrors: CSVValidationError[] = validationErrors.map((e) => ({
      rowIndex: row.rowIndex,
      field: e.field,
      message: e.message,
    }));

    const fingerprint = createQuestionFingerprint(row.question || '', subjectId);
    let isDuplicate = false;
    let duplicateReason = undefined;

    if (inMemoryFingerprints.has(fingerprint)) {
      isDuplicate = true;
      duplicateReason = 'Duplicate question text found within this CSV file.';
      csvErrors.push({
        rowIndex: row.rowIndex,
        field: 'question',
        message: duplicateReason,
      });
    } else if (existingFingerprints.has(fingerprint)) {
      isDuplicate = true;
      duplicateReason = 'Question text already exists in Master Question Bank.';
      csvErrors.push({
        rowIndex: row.rowIndex,
        field: 'question',
        message: duplicateReason,
      });
    }

    if (!isDuplicate && csvErrors.length === 0) {
      inMemoryFingerprints.add(fingerprint);
    }

    const isValid = csvErrors.length === 0 && !isDuplicate;

    if (isValid) validCount++;
    else invalidCount++;

    if (isDuplicate) duplicateCount++;

    results.push({
      row,
      isValid,
      errors: csvErrors,
      isDuplicate,
      duplicateReason,
    });
  }

  return {
    totalRows: rows.length,
    validRowsCount: validCount,
    invalidRowsCount: invalidCount,
    duplicateRowsCount: duplicateCount,
    importedCount: 0,
    failedCount: 0,
    results,
  };
};

export const executeBatchImport = async (
  validRowResults: CSVRowResult[],
  subjectId: string,
  chapterId: string,
  userId: string
): Promise<{ importedCount: number; failedCount: number }> => {
  let importedCount = 0;
  let failedCount = 0;

  const BATCH_SIZE = 400;
  const chunks: CSVRowResult[][] = [];

  for (let i = 0; i < validRowResults.length; i += BATCH_SIZE) {
    chunks.push(validRowResults.slice(i, i + BATCH_SIZE));
  }

  const timestamp = new Date().toISOString();

  for (const chunk of chunks) {
    const batch = writeBatch(db);

    for (const item of chunk) {
      try {
        const questionData = mapCSVRowToQuestion(item.row, subjectId, chapterId, userId);
        const newRef = doc(collection(db, QUESTIONS_COLLECTION));
        const fullQuestion: Question = {
          ...questionData,
          id: newRef.id,
          createdAt: timestamp,
          updatedAt: timestamp,
        } as Question;

        batch.set(newRef, fullQuestion);
        importedCount++;
      } catch (err) {
        console.error('Error adding question to batch:', err);
        failedCount++;
      }
    }

    try {
      await batch.commit();
    } catch (err) {
      console.error('Error committing Firestore batch write:', err);
      failedCount += chunk.length;
      importedCount -= chunk.length;
    }
  }

  return { importedCount, failedCount };
};

export const generateErrorReportCSV = (summary: CSVImportSummary): string => {
  const headers = ['Row Number', 'Status', 'Field', 'Error Message', 'Question Text'];
  const csvRows: string[] = [headers.join(',')];

  summary.results
    .filter((r) => !r.isValid)
    .forEach((r) => {
      const errorMsg = r.errors.map((e) => `${e.field}: ${e.message}`).join(' | ');
      const qText = (r.row.question || '').replace(/"/g, '""');
      csvRows.push(`${r.row.rowIndex},"INVALID","${errorMsg}","${qText}"`);
    });

  return csvRows.join('\n');
};
