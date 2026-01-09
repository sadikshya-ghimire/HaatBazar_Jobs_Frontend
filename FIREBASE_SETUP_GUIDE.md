# Firebase Authentication Setup for HaatBazar Jobs

## Step 1: Install Firebase Dependencies

```bash
npm install firebase
npm install @react-native-firebase/app @react-native-firebase/auth
```

## Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: "HaatBazar Jobs"
4. Enable Google Analytics (optional)
5. Create project

## Step 3: Register Your App

### For Web/Expo:
1. Click "Web" icon in Firebase Console
2. Register app name: "HaatBazar Jobs"
3. Copy the Firebase config

### For React Native:
1. Click "Android" or "iOS" icon
2. Follow platform-specific setup

## Step 4: Enable Authentication Methods

1. Go to Authentication → Sign-in method
2. Enable:
   - ✅ Email/Password
   - ✅ Phone (for OTP)
   - ✅ Google (optional)

## Step 5: Create Firebase Config File

Create `config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
```

## Step 6: Create Authentication Service

Create `services/authService.ts`:

```typescript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export const authService = {
  // Sign up with email and password
  signUp: async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  }
};
```

## Step 7: Create Firestore Service for User Data

Create `services/userService.ts`:

```typescript
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  phoneNumber: string;
  displayName: string;
  userType: 'worker' | 'employer' | null;
  profileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const userService = {
  // Create user profile in Firestore
  createUserProfile: async (uid: string, data: Partial<UserProfile>) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...data,
        uid,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get user profile
  getUserProfile: async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() as UserProfile };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateUserProfile: async (uid: string, data: Partial<UserProfile>) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...data,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
```

## Step 8: Update SignUp Screen

```typescript
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

const handleSignUp = async () => {
  // Validate inputs...
  
  setState(prev => ({ ...prev, loading: true }));
  
  // Sign up with Firebase
  const result = await authService.signUp(
    state.email,
    state.password,
    state.fullName
  );
  
  if (result.success && result.user) {
    // Create user profile in Firestore
    await userService.createUserProfile(result.user.uid, {
      email: state.email,
      phoneNumber: state.phoneNumber,
      displayName: state.fullName,
      userType: null,
      profileComplete: false
    });
    
    setState(prev => ({ ...prev, loading: false }));
    onSignUpSuccess();
  } else {
    setState(prev => ({ 
      ...prev, 
      loading: false,
      errors: { email: result.error }
    }));
  }
};
```

## Step 9: Update Login Screen

```typescript
import { authService } from '../../services/authService';

const handleLogin = async () => {
  // Validate inputs...
  
  setState(prev => ({ ...prev, loading: true }));
  
  const result = await authService.signIn(state.email, state.password);
  
  if (result.success) {
    setState(prev => ({ ...prev, loading: false }));
    onLoginSuccess();
  } else {
    setState(prev => ({ 
      ...prev, 
      loading: false,
      errors: { email: result.error }
    }));
  }
};
```

## Step 10: Add Auth State Listener in App.tsx

```typescript
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { userService } from './services/userService';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const profile = await userService.getUserProfile(firebaseUser.uid);
        if (profile.success) {
          setUserProfile(profile.data);
          setUser(firebaseUser);
          
          // Navigate based on profile completion
          if (!profile.data.userType) {
            setCurrentScreen('roleSelection');
          } else if (!profile.data.profileComplete) {
            setCurrentScreen('onboarding');
          } else {
            setCurrentScreen('dashboard');
          }
        }
      } else {
        // User is signed out
        setUser(null);
        setUserProfile(null);
        setCurrentScreen('welcome');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  // Rest of your app...
}
```

## Step 11: Firestore Security Rules

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
    
    // Worker profiles
    match /workerProfiles/{profileId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Jobs
    match /jobs/{jobId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
    }
  }
}
```

## Step 12: Environment Variables

Create `.env` file:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

Update `firebase.ts` to use env variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};
```

## Benefits of Firebase Auth

✅ **Secure**: Industry-standard security
✅ **Scalable**: Handles millions of users
✅ **Easy**: Simple API, less code
✅ **Features**: Email, phone, social login
✅ **Free Tier**: 10K verifications/month
✅ **Real-time**: Instant auth state updates
✅ **Cross-platform**: Works on web, iOS, Android

## Next Steps

1. Install Firebase packages
2. Create Firebase project
3. Copy config to your app
4. Create service files
5. Update auth screens
6. Test authentication flow
7. Add error handling
8. Implement phone OTP
9. Add social login (optional)
10. Deploy and test

## Phone OTP Setup (Optional)

For phone authentication:

```typescript
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Send OTP
const sendOTP = async (phoneNumber: string) => {
  const appVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  return confirmationResult;
};

// Verify OTP
const verifyOTP = async (confirmationResult, code: string) => {
  const result = await confirmationResult.confirm(code);
  return result.user;
};
```

## Troubleshooting

### Common Issues:
1. **CORS errors**: Enable authorized domains in Firebase Console
2. **API key errors**: Check .env file and restart server
3. **Auth state not persisting**: Check AsyncStorage setup
4. **Phone auth not working**: Enable reCAPTCHA in Firebase Console

## Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
