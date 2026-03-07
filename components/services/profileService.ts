import { API_CONFIG } from '../config/api.config';
import { Platform } from 'react-native';

const API_URL = API_CONFIG.BASE_URL + '/api';

export const profileService = {
  // Upload profile photo
  uploadProfilePhoto: async (imageUri: string) => {
    try {
      console.log('📤 Uploading profile photo...');
      
      const formData = new FormData();
      
      if (Platform.OS === 'web') {
        // Web: Convert data URI to Blob
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('profilePhoto', blob, 'profile-photo.jpg');
      } else {
        // Mobile: Use file URI
        const filename = imageUri.split('/').pop() || 'photo.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        formData.append('profilePhoto', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      const response = await fetch(`${API_URL}/upload/profile-photo`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('📥 Upload response:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Error uploading profile photo:', error);
      return {
        success: false,
        message: 'Failed to upload photo',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Upload NID photos
  uploadNIDPhotos: async (nidFrontUri: string, nidBackUri: string) => {
    try {
      console.log('📤 Uploading NID photos...');
      
      const formData = new FormData();
      
      if (Platform.OS === 'web') {
        // Web: Convert data URIs to Blobs
        const frontResponse = await fetch(nidFrontUri);
        const frontBlob = await frontResponse.blob();
        formData.append('nidFront', frontBlob, 'nid-front.jpg');

        const backResponse = await fetch(nidBackUri);
        const backBlob = await backResponse.blob();
        formData.append('nidBack', backBlob, 'nid-back.jpg');
      } else {
        // Mobile: Use file URIs
        const frontFilename = nidFrontUri.split('/').pop() || 'nid-front.jpg';
        const frontMatch = /\.(\w+)$/.exec(frontFilename);
        const frontType = frontMatch ? `image/${frontMatch[1]}` : 'image/jpeg';
        
        formData.append('nidFront', {
          uri: nidFrontUri,
          name: frontFilename,
          type: frontType,
        } as any);

        const backFilename = nidBackUri.split('/').pop() || 'nid-back.jpg';
        const backMatch = /\.(\w+)$/.exec(backFilename);
        const backType = backMatch ? `image/${backMatch[1]}` : 'image/jpeg';
        
        formData.append('nidBack', {
          uri: nidBackUri,
          name: backFilename,
          type: backType,
        } as any);
      }

      const response = await fetch(`${API_URL}/upload/nid-photos`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('📥 NID upload response:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Error uploading NID photos:', error);
      return {
        success: false,
        message: 'Failed to upload NID photos',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Worker Profile APIs
  saveWorkerProfile: async (firebaseUid: string, step: number, data: any) => {
    try {
      console.log('📤 Saving worker profile:', { firebaseUid, step, data });
      
      const response = await fetch(`${API_URL}/worker-profile/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid,
          step,
          data,
        }),
      });

      const result = await response.json();
      console.log('📥 Worker profile save response:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Error saving worker profile:', error);
      return {
        success: false,
        message: 'Failed to save profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  getWorkerProfile: async (firebaseUid: string) => {
    try {
      const response = await fetch(`${API_URL}/worker-profile/${firebaseUid}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching worker profile:', error);
      return {
        success: false,
        message: 'Failed to fetch profile',
      };
    }
  },

  checkWorkerVerification: async (firebaseUid: string) => {
    try {
      console.log('🔍 Checking worker verification for:', firebaseUid);
      console.log('📡 API URL:', `${API_URL}/worker-profile/${firebaseUid}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_URL}/worker-profile/${firebaseUid}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const result = await response.json();
      console.log('✅ Verification check result:', result);
      
      if (result.success && result.data) {
        return {
          success: true,
          isVerified: result.data.isVerified || false,
          profileExists: true,
        };
      }
      return {
        success: true,
        isVerified: false,
        profileExists: false,
      };
    } catch (error) {
      console.error('❌ Error checking worker verification:', error);
      
      // Check if it's a timeout error
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏱️ Request timed out - check if backend is running and IP is correct');
      }
      
      return {
        success: false,
        isVerified: false,
        profileExists: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  getAllWorkers: async (filters?: { skills?: string; city?: string; district?: string; page?: number }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.skills) params.append('skills', filters.skills);
      if (filters?.city) params.append('city', filters.city);
      if (filters?.district) params.append('district', filters.district);
      if (filters?.page) params.append('page', filters.page.toString());

      const response = await fetch(`${API_URL}/worker-profile?${params.toString()}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching workers:', error);
      return {
        success: false,
        message: 'Failed to fetch workers',
      };
    }
  },

  // Employer Profile APIs
  saveEmployerProfile: async (firebaseUid: string, step: number, data: any) => {
    try {
      console.log('📤 Saving employer profile:', { firebaseUid, step, data });
      
      const response = await fetch(`${API_URL}/employer-profile/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid,
          step,
          data,
        }),
      });

      const result = await response.json();
      console.log('📥 Employer profile save response:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Error saving employer profile:', error);
      return {
        success: false,
        message: 'Failed to save profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  getEmployerProfile: async (firebaseUid: string) => {
    try {
      const response = await fetch(`${API_URL}/employer-profile/${firebaseUid}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching employer profile:', error);
      return {
        success: false,
        message: 'Failed to fetch profile',
      };
    }
  },

  checkEmployerVerification: async (firebaseUid: string) => {
    try {
      console.log('🔍 Checking employer verification for:', firebaseUid);
      console.log('📡 API URL:', `${API_URL}/employer-profile/${firebaseUid}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_URL}/employer-profile/${firebaseUid}`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const result = await response.json();
      console.log('✅ Verification check result:', result);
      
      if (result.success && result.data) {
        return {
          success: true,
          isVerified: result.data.isVerified || false,
          profileExists: true,
        };
      }
      return {
        success: true,
        isVerified: false,
        profileExists: false,
      };
    } catch (error) {
      console.error('❌ Error checking employer verification:', error);
      
      // Check if it's a timeout error
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏱️ Request timed out - check if backend is running and IP is correct');
      }
      
      return {
        success: false,
        isVerified: false,
        profileExists: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  getAllEmployers: async (filters?: { city?: string; district?: string; page?: number }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.city) params.append('city', filters.city);
      if (filters?.district) params.append('district', filters.district);
      if (filters?.page) params.append('page', filters.page.toString());

      const response = await fetch(`${API_URL}/employer-profile?${params.toString()}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching employers:', error);
      return {
        success: false,
        message: 'Failed to fetch employers',
      };
    }
  },
};
