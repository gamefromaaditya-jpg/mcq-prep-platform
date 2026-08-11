import {
  db,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from '../firebase/firestore';
import { storage, ref, uploadBytes, getDownloadURL } from '../firebase/storage';
import { Question, QuestionType, QuestionDifficulty } from '../types';

const QUESTIONS_COLLECTION = 'questions';

export interface QuestionFilterOptions {
  subjectId?: string;
  chapterId?: string;
  type?: QuestionType;
  difficulty?: QuestionDifficulty;
  exam?: string;
  year?: number;
  isPublished?: boolean;
  searchText?: string;
  pageSize?: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}

export interface QuestionQueryResult {
  questions: Question[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export const getQuestions = async (
  options: QuestionFilterOptions = {}
): Promise<QuestionQueryResult> => {
  const {
    subjectId,
    chapterId,
    type,
    difficulty,
    exam,
    year,
    isPublished,
    searchText,
    pageSize = 15,
    lastDoc = null,
  } = options;

  try {
    const constraints: any[] = [];

    if (subjectId && subjectId !== 'all') {
      constraints.push(where('subjectId', '==', subjectId));
    }
    if (chapterId && chapterId !== 'all') {
      constraints.push(where('chapterId', '==', chapterId));
    }
    if (type && type !== ('all' as any)) {
      constraints.push(where('type', '==', type));
    }
    if (difficulty && difficulty !== ('all' as any)) {
      constraints.push(where('difficulty', '==', difficulty));
    }
    if (exam && exam !== 'all') {
      constraints.push(where('exam', '==', exam));
    }
    if (year) {
      constraints.push(where('year', '==', Number(year)));
    }
    if (isPublished !== undefined) {
      constraints.push(where('isPublished', '==', isPublished));
    }

    constraints.push(limit(pageSize + 1));
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, QUESTIONS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    let docs = snapshot.docs;
    let hasMore = docs.length > pageSize;
    if (hasMore) {
      docs = docs.slice(0, pageSize);
    }

    let questions = docs.map((d) => ({ id: d.id, ...(d.data() as Object) } as Question));

    if (searchText && searchText.trim().length > 0) {
      const term = searchText.toLowerCase().trim();
      questions = questions.filter(
        (q) =>
          q.questionText.toLowerCase().includes(term) ||
          q.tags?.some((t) => t.toLowerCase().includes(term)) ||
          q.source?.toLowerCase().includes(term)
      );
    }

    const newLastDoc = docs.length > 0 ? docs[docs.length - 1] : null;

    return {
      questions,
      lastDoc: newLastDoc,
      hasMore,
    };
  } catch (err) {
    console.error('Error fetching questions from Firestore:', err);
    const snapshot = await getDocs(query(collection(db, QUESTIONS_COLLECTION), limit(pageSize)));
    const questions = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Object) } as Question));
    return {
      questions,
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
      hasMore: false,
    };
  }
};

export const getQuestionById = async (questionId: string): Promise<Question | null> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...(docSnap.data() as Object) } as Question;
  }
  return null;
};

export const createQuestion = async (
  questionData: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Question> => {
  const newRef = doc(collection(db, QUESTIONS_COLLECTION));
  const timestamp = new Date().toISOString();
  const question: Question = {
    ...questionData,
    id: newRef.id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await setDoc(newRef, question);
  return question;
};

export const updateQuestion = async (
  questionId: string,
  updates: Partial<Omit<Question, 'id' | 'createdAt'>>
): Promise<void> => {
  const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const publishQuestion = async (questionId: string): Promise<void> => {
  await updateQuestion(questionId, { isPublished: true });
};

export const unpublishQuestion = async (questionId: string): Promise<void> => {
  await updateQuestion(questionId, { isPublished: false });
};

export const deleteOrArchiveQuestion = async (questionId: string): Promise<void> => {
  await unpublishQuestion(questionId);
};

export const uploadQuestionImageFile = async (
  file: File,
  questionId: string
): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files (PNG, JPEG, WebP) are allowed.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image size must be less than 5MB.');
  }

  const storageRef = ref(storage, `questions/${questionId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
