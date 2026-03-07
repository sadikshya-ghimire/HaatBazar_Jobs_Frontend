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
  doc,
  setDoc,
  getDoc,
  getDocs,
  where,
  updateDoc,
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

  /**
   * Create or get existing chat between two users
   * @param {object} participant1 - First user data
   * @param {object} participant2 - Second user data
   * @returns {string} chatId
   */
  createOrGetChat: async (participant1, participant2) => {
    try {
      // Create a consistent chat ID based on user IDs
      const chatId = [participant1.firebaseUid, participant2.firebaseUid]
        .sort()
        .join('_');

      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
        // Create new chat
        await setDoc(chatRef, {
          participants: [
            {
              firebaseUid: participant1.firebaseUid,
              name: participant1.name,
              profilePhoto: participant1.profilePhoto || null,
            },
            {
              firebaseUid: participant2.firebaseUid,
              name: participant2.name,
              profilePhoto: participant2.profilePhoto || null,
            },
          ],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      return { success: true, chatId };
    } catch (error) {
      console.error('Error creating/getting chat:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get all chats for a user
   * @param {string} firebaseUid - User's Firebase UID
   * @param {function} callback - Callback for real-time updates
   * @returns {function} Unsubscribe function
   */
  subscribeToUserChats: (firebaseUid, callback) => {
    try {
      const chatsRef = collection(db, 'chats');
      
      // Query chats where user is a participant
      const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
        const chats = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(chat => 
            chat.participants?.some(p => p.firebaseUid === firebaseUid)
          );
        
        callback(chats);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to user chats:', error);
      return () => {};
    }
  },

  /**
   * Mark messages as read
   * @param {string} chatId - The chat ID
   * @param {string} messageId - The message ID
   */
  markMessageAsRead: async (chatId, messageId) => {
    try {
      const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
      await updateDoc(messageRef, {
        read: true,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update typing status
   * @param {string} chatId - The chat ID
   * @param {string} userId - User ID
   * @param {boolean} isTyping - Typing status
   */
  updateTypingStatus: async (chatId, userId, isTyping) => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        [`typing.${userId}`]: isTyping,
        updatedAt: serverTimestamp(),
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating typing status:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update user online status
   * @param {string} userId - User's Firebase UID
   * @param {boolean} isOnline - Online status
   */
  updateOnlineStatus: async (userId, isOnline) => {
    try {
      const userStatusRef = doc(db, 'userStatus', userId);
      await setDoc(userStatusRef, {
        isOnline,
        lastSeen: serverTimestamp(),
      }, { merge: true });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating online status:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Subscribe to user's online status
   * @param {string} userId - User's Firebase UID
   * @param {function} callback - Callback for status updates
   * @returns {function} Unsubscribe function
   */
  subscribeToOnlineStatus: (userId, callback) => {
    try {
      const userStatusRef = doc(db, 'userStatus', userId);
      
      const unsubscribe = onSnapshot(userStatusRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          callback({
            isOnline: data.isOnline || false,
            lastSeen: data.lastSeen?.toDate(),
          });
        } else {
          callback({ isOnline: false, lastSeen: null });
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to online status:', error);
      return () => {};
    }
  },
};
