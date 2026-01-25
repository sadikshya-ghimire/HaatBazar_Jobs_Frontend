import { API_URL } from '../config/api';

export const jobOfferService = {
  // Worker Job Offers
  createWorkerJobOffer: async (firebaseUid, jobData) => {
    try {
      console.log('📤 Creating worker job offer...');
      
      const response = await fetch(`${API_URL}/worker-job-offers/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid,
          ...jobData,
        }),
      });

      const result = await response.json();
      console.log('📥 Worker job offer response:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Error creating worker job offer:', error);
      return {
        success: false,
        message: 'Failed to create job offer',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  getWorkerJobOffers: async (firebaseUid) => {
    try {
      const response = await fetch(`${API_URL}/worker-job-offers/worker/${firebaseUid}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching worker job offers:', error);
      return {
        success: false,
        message: 'Failed to fetch job offers',
      };
    }
  },

  getAllActiveWorkerJobOffers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.skills) params.append('skills', filters.skills);
      if (filters.district) params.append('district', filters.district);
      if (filters.page) params.append('page', filters.page.toString());

      const response = await fetch(`${API_URL}/worker-job-offers/active?${params.toString()}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching active worker job offers:', error);
      return {
        success: false,
        message: 'Failed to fetch job offers',
      };
    }
  },

  // Employer Job Offers
  createEmployerJobOffer: async (firebaseUid, jobData) => {
    try {
      console.log('📤 Creating employer job offer...');
      
      const response = await fetch(`${API_URL}/employer-job-offers/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid,
          ...jobData,
        }),
      });

      const result = await response.json();
      console.log('📥 Employer job offer response:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Error creating employer job offer:', error);
      return {
        success: false,
        message: 'Failed to create job offer',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  getEmployerJobOffers: async (firebaseUid) => {
    try {
      const response = await fetch(`${API_URL}/employer-job-offers/employer/${firebaseUid}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching employer job offers:', error);
      return {
        success: false,
        message: 'Failed to fetch job offers',
      };
    }
  },

  getAllActiveEmployerJobOffers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.skills) params.append('skills', filters.skills);
      if (filters.district) params.append('district', filters.district);
      if (filters.urgent) params.append('urgent', filters.urgent.toString());
      if (filters.page) params.append('page', filters.page.toString());

      const response = await fetch(`${API_URL}/employer-job-offers/active?${params.toString()}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching active employer job offers:', error);
      return {
        success: false,
        message: 'Failed to fetch job offers',
      };
    }
  },

  applyToJob: async (jobId, workerFirebaseUid) => {
    try {
      const response = await fetch(`${API_URL}/employer-job-offers/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workerFirebaseUid }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error applying to job:', error);
      return {
        success: false,
        message: 'Failed to apply to job',
      };
    }
  },
};
