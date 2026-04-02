import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function maskValue(value: string | undefined): string {
  if (!value) return '(missing)';
  if (value.length <= 6) return `${value.slice(0, 1)}***`;
  return `${value.slice(0, 3)}***${value.slice(-2)}`;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredFirebaseVars: Array<keyof typeof firebaseConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
];

const missingRequiredFirebaseVars = requiredFirebaseVars.filter((key) => !firebaseConfig[key]);

export const firebaseStartupStatus = {
  isValid: missingRequiredFirebaseVars.length === 0,
  missingRequiredFirebaseVars,
};

if (!firebaseStartupStatus.isValid) {
  console.error('[firebase] missing required config', {
    missing: firebaseStartupStatus.missingRequiredFirebaseVars,
    masked: {
      apiKey: maskValue(firebaseConfig.apiKey),
      authDomain: maskValue(firebaseConfig.authDomain),
      projectId: maskValue(firebaseConfig.projectId),
      appId: maskValue(firebaseConfig.appId),
    },
  });
} else {
  console.info('[firebase] startup config validated', {
    masked: {
      apiKey: maskValue(firebaseConfig.apiKey),
      authDomain: maskValue(firebaseConfig.authDomain),
      projectId: maskValue(firebaseConfig.projectId),
      appId: maskValue(firebaseConfig.appId),
    },
  });
}


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;