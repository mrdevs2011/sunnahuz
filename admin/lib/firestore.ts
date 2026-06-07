import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { Chapter, Hadith } from '@/types';

// ===== CHAPTERS =====

export const getChapters = async (bookId: string): Promise<Chapter[]> => {
  const chaptersRef = collection(db, 'books', bookId, 'chapters');
  const q = query(chaptersRef, orderBy('number'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    book_id: bookId,
    ...doc.data()
  } as Chapter));
};

export const addChapter = async (bookId: string, chapterData: Omit<Chapter, 'id' | 'book_id'>): Promise<string> => {
  const chaptersRef = collection(db, 'books', bookId, 'chapters');
  const docRef = await addDoc(chaptersRef, {
    ...chapterData,
    created_at: serverTimestamp()
  });
  return docRef.id;
};

export const updateChapter = async (bookId: string, chapterId: string, data: Partial<Chapter>): Promise<void> => {
  const chapterRef = doc(db, 'books', bookId, 'chapters', chapterId);
  await updateDoc(chapterRef, data);
};

export const deleteChapter = async (bookId: string, chapterId: string): Promise<void> => {
  const chapterRef = doc(db, 'books', bookId, 'chapters', chapterId);
  await deleteDoc(chapterRef);
};

// ===== HADITHS =====

export const getHadiths = async (bookId: string, chapterId: string): Promise<Hadith[]> => {
  const hadithsRef = collection(db, 'books', bookId, 'chapters', chapterId, 'hadiths');
  const q = query(hadithsRef, orderBy('number'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    book_id: bookId,
    chapter_id: chapterId,
    ...doc.data()
  } as Hadith));
};

export const addHadith = async (
  bookId: string,
  chapterId: string,
  hadithData: Omit<Hadith, 'id' | 'book_id' | 'chapter_id'>
): Promise<string> => {
  const hadithsRef = collection(db, 'books', bookId, 'chapters', chapterId, 'hadiths');
  const docRef = await addDoc(hadithsRef, {
    ...hadithData,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  });
  return docRef.id;
};

export const updateHadith = async (
  bookId: string,
  chapterId: string,
  hadithId: string,
  data: Partial<Hadith>
): Promise<void> => {
  const hadithRef = doc(db, 'books', bookId, 'chapters', chapterId, 'hadiths', hadithId);
  await updateDoc(hadithRef, {
    ...data,
    updated_at: serverTimestamp()
  });
};

export const deleteHadith = async (bookId: string, chapterId: string, hadithId: string): Promise<void> => {
  const hadithRef = doc(db, 'books', bookId, 'chapters', chapterId, 'hadiths', hadithId);
  await deleteDoc(hadithRef);
};

// Get next hadith number
export const getNextHadithNumber = async (bookId: string, chapterId: string): Promise<number> => {
  const hadiths = await getHadiths(bookId, chapterId);
  if (hadiths.length === 0) return 1;
  return Math.max(...hadiths.map(h => h.number)) + 1;
};
