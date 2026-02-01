import { API_CONFIG } from '../config/api.config';

export const bookingService = {
  // Create a new booking
  createBooking: async (employerFirebaseUid, bookingData) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/employer/${employerFirebaseUid}/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, message: error.message };
    }
  },

  // Get all bookings for an employer
  getEmployerBookings: async (employerFirebaseUid, status = null) => {
    try {
      let url = `${API_CONFIG.BASE_URL}/api/employer/${employerFirebaseUid}/bookings`;
      if (status) {
        url += `?status=${status}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching employer bookings:', error);
      return { success: false, message: error.message };
    }
  },

  // Get all bookings for a worker
  getWorkerBookings: async (workerFirebaseUid, status = null) => {
    try {
      let url = `${API_CONFIG.BASE_URL}/api/worker/${workerFirebaseUid}/bookings`;
      if (status) {
        url += `?status=${status}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching worker bookings:', error);
      return { success: false, message: error.message };
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/bookings/${bookingId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return { success: false, message: error.message };
    }
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/bookings/${bookingId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return { success: false, message: error.message };
    }
  },

  // Delete booking
  deleteBooking: async (bookingId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/bookings/${bookingId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      return { success: false, message: error.message };
    }
  },
};
