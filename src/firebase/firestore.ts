import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Firestore,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';
import { app } from './config';
import { UserProfile, Question, Test, TestAttempt, Subject, Chapter } from '../types';

export const db: Firestore = getFirestore(app);

// Helper for typed collection references
export const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};

export const collections = {
  users: createCollection<UserProfile>('users'),
  questions: createCollection<Question>('questions'),
  tests: createCollection<Test>('tests'),
  attempts: createCollection<TestAttempt>('attempts'),
  subjects: createCollection<Subject>('subjects'),
  chapters: createCollection<Chapter>('chapters'),
};

export {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
};
