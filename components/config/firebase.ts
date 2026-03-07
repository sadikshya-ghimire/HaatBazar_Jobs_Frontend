import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableNetwork, initializeFirestore } from 'firebase/firestore';

// Firebase configuration with the latest values from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBO0q-69SS6ITmapLhcp3qK4emdZrZBZzc",
  authDomain: "haatbazarjobs.firebaseapp.com",
  projectId: "haatbazarjobs",
  storageBucket: "haatbazarjobs.firebasestorage.app",
  messagingSenderId: "145155553368",
  appId: "1:145155553368:web:03f535ac35ba597a49f22d",
  measurementId: "G-M75CT0GKJB"
};

console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
});

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (getApps().length === 0) {
    console.log('Initializing Firebase app...');
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized');
    console.log('App name:', app.name);
    console.log('App options:', app.options);
  } else {
    console.log('Using existing Firebase app');
    app = getApp();
  }
  
  auth = getAuth(app);
  console.log('Firebase Auth initialized');
  console.log('Auth app name:', auth.app.name);
  console.log('Auth config apiKey:', auth.config.apiKey?.substring(0, 10) + '...');
  
  // Initialize Firestore with settings
  try {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true, // Better for React Native
      useFetchStreams: false,
    });
    console.log('Firestore initialized with custom settings');
  } catch (error: any) {
    // If already initialized, just get it
    if (error.code === 'failed-precondition') {
      db = getFirestore(app);
      console.log('Firestore already initialized, using existing instance');
    } else {
      throw error;
    }
  }
  
  // Enable network
  enableNetwork(db).then(() => {
    console.log('✅ Firestore network enabled successfully');
  }).catch((error) => {
    console.error('❌ Error enabling Firestore network:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      name: error.name
    });
  });
  
  console.log('🔥 Firebase initialization complete');
  console.log('📊 Firestore instance:', db ? 'Created' : 'Failed');
  
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.error('Error details:', {
    code: error.code,
    message: error.message,
    name: error.name
  });
  throw error;
}

export { auth, db };
export default app;