import {
  db,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from '../firebase/firestore';
import { Subject, Chapter } from '../types';

const SUBJECTS_COLLECTION = 'subjects';
const CHAPTERS_COLLECTION = 'chapters';

// --- SUBJECT CRUD ---

export const getSubjects = async (): Promise<Subject[]> => {
  try {
    const q = query(collection(db, SUBJECTS_COLLECTION), orderBy('displayOrder', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Object) } as Subject));
  } catch (err) {
    console.error('Error fetching subjects:', err);
    const snapshot = await getDocs(collection(db, SUBJECTS_COLLECTION));
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Object) } as Subject));
  }
};

export const createSubject = async (
  subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Subject> => {
  const newRef = doc(collection(db, SUBJECTS_COLLECTION));
  const timestamp = new Date().toISOString();
  const subject: Subject = {
    ...subjectData,
    id: newRef.id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await setDoc(newRef, subject);
  return subject;
};

export const updateSubject = async (
  subjectId: string,
  updates: Partial<Omit<Subject, 'id' | 'createdAt'>>
): Promise<void> => {
  const docRef = doc(db, SUBJECTS_COLLECTION, subjectId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteSubject = async (subjectId: string): Promise<void> => {
  const chaptersQ = query(collection(db, CHAPTERS_COLLECTION), where('subjectId', '==', subjectId));
  const chaptersSnap = await getDocs(chaptersQ);
  if (!chaptersSnap.empty) {
    await updateSubject(subjectId, { isActive: false });
    return;
  }
  await deleteDoc(doc(db, SUBJECTS_COLLECTION, subjectId));
};

// --- CHAPTER CRUD ---

export const getChapters = async (subjectId?: string): Promise<Chapter[]> => {
  try {
    let q;
    if (subjectId) {
      q = query(
        collection(db, CHAPTERS_COLLECTION),
        where('subjectId', '==', subjectId),
        orderBy('displayOrder', 'asc')
      );
    } else {
      q = query(collection(db, CHAPTERS_COLLECTION), orderBy('displayOrder', 'asc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Object) } as Chapter));
  } catch (err) {
    console.error('Error fetching chapters:', err);
    let snapshot;
    if (subjectId) {
      const fallbackQ = query(collection(db, CHAPTERS_COLLECTION), where('subjectId', '==', subjectId));
      snapshot = await getDocs(fallbackQ);
    } else {
      snapshot = await getDocs(collection(db, CHAPTERS_COLLECTION));
    }
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Object) } as Chapter));
  }
};

export const createChapter = async (
  chapterData: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Chapter> => {
  const newRef = doc(collection(db, CHAPTERS_COLLECTION));
  const timestamp = new Date().toISOString();
  const chapter: Chapter = {
    ...chapterData,
    id: newRef.id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await setDoc(newRef, chapter);
  return chapter;
};

export const updateChapter = async (
  chapterId: string,
  updates: Partial<Omit<Chapter, 'id' | 'createdAt'>>
): Promise<void> => {
  const docRef = doc(db, CHAPTERS_COLLECTION, chapterId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteChapter = async (chapterId: string): Promise<void> => {
  await updateChapter(chapterId, { isActive: false });
};
