import { API_CONFIG } from '../config/api.config';

const BASE_URL = API_CONFIG.AUTH_ENDPOINT;

export const userService = {
  saveUserProfile: async (firebaseUid, email, userType, displayName) => {
    try {
      console.log('💾 Saving user profile to backend...');
      console.log('API URL:', `${BASE_URL}/save-profile`);
      console.log('Firebase UID:', firebaseUid);
      console.log('Email:', email);
      console.log('User Type:', userType);
      
      const res = await fetch(`${BASE_URL}/save-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebaseUid, email, userType, displayName }),
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      const data = await res.json();
      console.log('Save Profile Response:', data);
      return data;
    } catch (error) {
      console.error("Save profile error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      return { 
        success: false, 
        message: `Network error: ${error.message}. Check if backend is running and accessible.`,
        code: 'NETWORK_ERROR'
      };
    }
  },

  getUserProfile: async (firebaseUid) => {
    try {
      console.log('📥 Getting user profile from backend...');
      console.log('API URL:', `${BASE_URL}/profile/${firebaseUid}`);
      console.log('Firebase UID:', firebaseUid);
      
      const res = await fetch(`${BASE_URL}/profile/${firebaseUid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      const data = await res.json();
      console.log('Get Profile Response:', data);
      return data;
    } catch (error) {
      console.error("Get profile error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      return { 
        success: false, 
        message: `Network error: ${error.message}. Check if backend is running and accessible.`,
        code: 'NETWORK_ERROR'
      };
    }
  },

  markProfileComplete: async (firebaseUid) => {
    try {
      console.log('✅ Marking profile as complete...');
      console.log('Firebase UID:', firebaseUid);
      
      const res = await fetch(`${BASE_URL}/profile/${firebaseUid}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await res.json();
      console.log('Mark Complete Response:', data);
      return data;
    } catch (error) {
      console.error("Mark complete error:", error);
      return { 
        success: false, 
        message: "Network error. Make sure backend is running on port 8080." 
      };
    }
  },
};
