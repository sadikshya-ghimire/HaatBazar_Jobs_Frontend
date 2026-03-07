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
  limit,
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
      console.log('🔥 Firebase sendMessage called:', { chatId, messageData });
      
      if (!db) {
        console.error('❌ Firestore db is not initialized');
        return { success: false, error: 'Firestore not initialized' };
      }
      
      console.log('📊 Firestore instance check:', {
        type: db.type,
        app: db.app?.name
      });
      
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      console.log('📁 Messages collection ref created');
      
      const docData = {
        text: messageData.text,
        senderId: messageData.senderId,
        senderName: messageData.senderName,
        timestamp: serverTimestamp(),
        read: false,
      };
      
      console.log('📝 Document data:', docData);
      console.log('🚀 Attempting to add document to Firestore...');
      
      const docRef = await addDoc(messagesRef, docData);
      console.log('✅ Message added to Firestore:', docRef.id);

      return { success: true };
    } catch (error) {
      console.error('❌ Error sending message:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 200)
      });
      
      // Specific error messages
      if (error.code === 'permission-denied') {
        console.error('🚫 PERMISSION DENIED: Firestore security rules are blocking this operation');
        console.error('💡 Fix: Update Firestore rules in Firebase Console');
      } else if (error.code === 'unavailable') {
        console.error('📡 UNAVAILABLE: Cannot connect to Firestore');
        console.error('💡 Check: Internet connection and Firebase configuration');
      }
      
      return { success: false, error: error.message, code: error.code };
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
      console.log('👂 Subscribing to messages for chat:', chatId);
      
      if (!db) {
        console.error('❌ Firestore db is not initialized');
        return () => {};
      }
      
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      console.log('📡 Setting up real-time listener...');
      
      // Real-time listener
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          console.log('📨 Snapshot received:', snapshot.docs.length, 'messages');
          
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate(),
          }));
          
          console.log('✅ Messages processed:', messages.length);
          callback(messages);
        },
        (error) => {
          console.error('❌ Snapshot error:', error);
          console.error('❌ Error details:', {
            code: error.code,
            message: error.message,
            name: error.name
          });
          
          if (error.code === 'permission-denied') {
            console.error('🚫 PERMISSION DENIED: Firestore security rules are blocking read access');
            console.error('💡 Fix: Update Firestore rules in Firebase Console to allow authenticated users');
          } else if (error.code === 'unavailable') {
            console.error('📡 UNAVAILABLE: Cannot connect to Firestore');
            console.error('💡 Check: Internet connection and Firebase configuration');
          }
          
          // Call callback with empty array on error
          callback([]);
        }
      );

      console.log('✅ Listener setup complete');
      return unsubscribe;
    } catch (error) {
      console.error('❌ Error subscribing to messages:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        name: error.name
      });
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
      console.log('💬 Creating/getting chat for participants:', {
        p1: participant1.firebaseUid,
        p2: participant2.firebaseUid
      });
      
      if (!db) {
        console.error('❌ Firestore db is not initialized');
        return { success: false, error: 'Firestore not initialized' };
      }
      
      // Create a consistent chat ID based on user IDs
      const chatId = [participant1.firebaseUid, participant2.firebaseUid]
        .sort()
        .join('_');

      console.log('🆔 Chat ID:', chatId);

      const chatRef = doc(db, 'chats', chatId);
      console.log('📄 Getting chat document...');
      
      const chatDoc = await getDoc(chatRef);
      console.log('📄 Chat exists:', chatDoc.exists());

      if (!chatDoc.exists()) {
        console.log('➕ Creating new chat...');
        
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
        
        console.log('✅ New chat created');
      } else {
        console.log('✅ Using existing chat');
      }

      return { success: true, chatId };
    } catch (error) {
      console.error('❌ Error creating/getting chat:', error);
      console.error('❌ Error details:', {
        code: error.code,
        message: error.message,
        name: error.name
      });
      
      if (error.code === 'permission-denied') {
        console.error('🚫 PERMISSION DENIED: Firestore security rules are blocking this operation');
        console.error('💡 Fix: Update Firestore rules in Firebase Console');
      }
      
      return { success: false, error: error.message, code: error.code };
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

  /**
   * Get last message from a chat
   * @param {string} chatId - The chat ID
   * @returns {object} Last message data
   */
  getLastMessage: async (chatId) => {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          success: true,
          data: {
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate(),
          },
        };
      }
      
      return { success: true, data: null };
    } catch (error) {
      console.error('Error getting last message:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get unread message count for a user in a chat
   * @param {string} chatId - The chat ID
   * @param {string} userId - User's Firebase UID
   * @returns {number} Unread message count
   */
  getUnreadCount: async (chatId, userId) => {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      const q = query(messagesRef, where('read', '==', false));
      
      const snapshot = await getDocs(q);
      
      // Filter out messages sent by current user (count only received unread messages)
      const unreadCount = snapshot.docs.filter(doc => doc.data().senderId !== userId).length;
      
      return { success: true, count: unreadCount };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { success: false, count: 0 };
    }
  },
};
