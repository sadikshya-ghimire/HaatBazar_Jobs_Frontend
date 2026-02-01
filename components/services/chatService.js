import { API_CONFIG } from '../config/api.config';

export const chatService = {
  // Create or get existing chat
  createOrGetChat: async (participant1, participant2, bookingId = null) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/chats`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ participant1, participant2, bookingId }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating/getting chat:', error);
      return { success: false, message: error.message };
    }
  },

  // Get all chats for a user
  getUserChats: async (firebaseUid) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/chats/user/${firebaseUid}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      return { success: false, message: error.message };
    }
  },

  // Get chat by ID
  getChatById: async (chatId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/chats/${chatId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching chat:', error);
      return { success: false, message: error.message };
    }
  },

  // Send a message
  sendMessage: async (chatId, senderId, text) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/chats/${chatId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ senderId, text }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, message: error.message };
    }
  },

  // Mark messages as read
  markAsRead: async (chatId, firebaseUid) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/chats/${chatId}/read`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firebaseUid }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error marking as read:', error);
      return { success: false, message: error.message };
    }
  },

  // Delete chat
  deleteChat: async (chatId) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/chats/${chatId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting chat:', error);
      return { success: false, message: error.message };
    }
  },
};
