import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import { app } from './config';

export const storage: FirebaseStorage = getStorage(app);

export const uploadQuestionImage = async (file: File, questionId: string): Promise<string> => {
  const fileExtension = file.name.split('.').pop() || 'png';
  const storageRef = ref(storage, `questions/${questionId}/${Date.now()}.${fileExtension}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const uploadUserProfilePhoto = async (file: File, userId: string): Promise<string> => {
  const fileExtension = file.name.split('.').pop() || 'png';
  const storageRef = ref(storage, `users/${userId}/profile.${fileExtension}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
