import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: firebaseConfigData.projectId,
  appId: firebaseConfigData.appId,
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
};

// Initialize Firebase App instance
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId if configured
const databaseId = (firebaseConfigData as Record<string, string>).firestoreDatabaseId;

export const db = databaseId && databaseId !== '(default)'
  ? getFirestore(app, databaseId)
  : getFirestore(app);
