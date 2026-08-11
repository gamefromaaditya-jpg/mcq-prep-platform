import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';

export interface FirebaseEnvConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
}

export const getFirebaseEnvConfig = (): FirebaseEnvConfig => {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
};

export const validateFirebaseConfig = (): { isValid: boolean; missingKeys: string[] } => {
  const envConfig = getFirebaseEnvConfig();
  const requiredKeys: (keyof FirebaseEnvConfig)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const placeholderValues = [
    'your_api_key_here',
    'your_project_id.firebaseapp.com',
    'your_project_id',
    'your_project_id.appspot.com',
    '1234567890',
    '1:1234567890:web:abcdef123456',
    'AIzaSyDemoKeyForLocalDevelopmentOnly123',
  ];

  const missingKeys: string[] = [];

  for (const key of requiredKeys) {
    const value = envConfig[key];
    const envVarName = `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;

    if (!value || typeof value !== 'string' || value.trim() === '' || placeholderValues.includes(value.trim())) {
      missingKeys.push(envVarName);
    }
  }

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  };
};

// Perform runtime configuration audit
const validation = validateFirebaseConfig();

if (!validation.isValid) {
  console.error(
    `[Firebase Diagnostic Error] FIREBASE CONFIGURATION REQUIRED.\n` +
    `The following required environment variables are missing or contain placeholder values:\n` +
    `  - ${validation.missingKeys.join('\n  - ')}\n\n` +
    `Please set valid environment variables in your .env file copied from:\n` +
    `Firebase Console -> Project Settings -> General -> Your apps -> Web app -> SDK setup and configuration.`
  );
}

const envConfig = getFirebaseEnvConfig();

const firebaseConfig = {
  apiKey: envConfig.apiKey || '',
  authDomain: envConfig.authDomain || '',
  projectId: envConfig.projectId || '',
  storageBucket: envConfig.storageBucket || '',
  messagingSenderId: envConfig.messagingSenderId || '',
  appId: envConfig.appId || '',
  measurementId: envConfig.measurementId,
};

export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
