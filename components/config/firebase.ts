import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

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
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { auth };
export default app;