// FIREBASE DISABLED - Mock authentication service
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   sendPasswordResetEmail,
//   updateProfile,
//   User
// } from 'firebase/auth';
// import { auth } from '../config/firebase';

// Mock user type
type MockUser = {
  uid: string;
  email: string;
  displayName: string;
};

export const authService = {
  // Sign up with email and password - MOCK VERSION
  signUp: async (email: string, password: string, displayName: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user object
      const mockUser: MockUser = {
        uid: 'mock-user-' + Date.now(),
        email: email,
        displayName: displayName
      };
      
      return { success: true, user: mockUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password - MOCK VERSION
  signIn: async (email: string, password: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock user object
      const mockUser: MockUser = {
        uid: 'mock-user-' + Date.now(),
        email: email,
        displayName: email.split('@')[0]
      };
      
      return { success: true, user: mockUser };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Sign out - MOCK VERSION
  signOut: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Reset password - MOCK VERSION
  resetPassword: async (email: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get current user - MOCK VERSION
  getCurrentUser: (): MockUser | null => {
    return null;
  },

  // Send OTP to email - MOCK VERSION
  sendOTP: async (email: string, password: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, expiresAt: Date.now() + 300000 };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error. Please check your connection.' };
    }
  }
};