/**
 * Firebase Realtime Chat Service
 * Handles all real-time chat operations using Firestore
 */

import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Initialize chat service
export const firebaseChatService = {
  /**
   * Send a message to a chat
   * @param {string} chatId - The chat ID
   * @param {object} messageData - Message data (text, senderId, senderName)
   */
  sendMessage: async (chatId, messageData) => {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      
      await addDoc(messagesRef, {
        text: messageData.text,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        timestamp: serverTimestamp(),
        read: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Subscribe to real-time messages in a chat
   * @param {string} chatId - The chat ID
   * @param {function} callback - Callback function to receive messages
   * @returns {function} Unsubscribe function
   */
  subscribeToMessages: (chatId, callback) => {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      // Real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        }));
        
        callback(messages);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      return () => {};
    }
  },
};
