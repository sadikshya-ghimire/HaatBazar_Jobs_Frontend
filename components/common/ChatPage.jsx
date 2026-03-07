import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  TextInput,
  Image as RNImage,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { API_CONFIG } from '../config/api.config';
import { chatService } from '../services/chatService';
import { firebaseChatService } from '../services/firebaseChatService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ChatPage({ participant, onBack, currentUserData, userType }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);
  const scrollViewRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const onlineStatusUnsubscribeRef = useRef(null);

  useEffect(() => {
    initializeChat();
    
    // Set current user as online
    const currentUser = auth.currentUser;
    if (currentUser) {
      firebaseChatService.updateOnlineStatus(currentUser.uid, true);
    }
    
    // Cleanup subscription on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (onlineStatusUnsubscribeRef.current) {
        onlineStatusUnsubscribeRef.current();
      }
      // Set user offline when leaving chat
      if (currentUser) {
        firebaseChatService.updateOnlineStatus(currentUser.uid, false);
      }
    };
  }, []);

  const initializeChat = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !participant) return;

      setIsLoading(true);

      // Prepare participant data
      const participant1 = {
        firebaseUid: currentUser.uid,
        name: currentUserData?.fullName || currentUserData?.companyName || currentUser.displayName || 'User',
        profilePhoto: currentUserData?.profilePhoto || '',
      };

      const participant2 = {
        firebaseUid: participant.firebaseUid,
        name: participant.name || participant.workerName || participant.employerName,
        profilePhoto: participant.profilePhoto || '',
      };

      // Create or get chat using Firebase
      const result = await firebaseChatService.createOrGetChat(participant1, participant2);
      
      if (result.success && result.chatId) {
        setChatId(result.chatId);
        
        // Subscribe to real-time messages
        unsubscribeRef.current = firebaseChatService.subscribeToMessages(
          result.chatId,
          (newMessages) => {
            setMessages(newMessages);
            
            // Mark unread messages as read
            const currentUserId = auth.currentUser?.uid;
            newMessages.forEach(msg => {
              if (msg.senderId !== currentUserId && !msg.read) {
                firebaseChatService.markMessageAsRead(result.chatId, msg.id);
              }
            });
            
            // Auto-scroll to bottom when new message arrives
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        );
        
        // Subscribe to chat updates (for typing indicator)
        const chatRef = doc(db, 'chats', result.chatId);
        const unsubscribeChat = onSnapshot(chatRef, (docSnapshot) => {
          const chatData = docSnapshot.data();
          if (chatData?.typing) {
            // Check if other participant is typing
            const otherUserId = participant.firebaseUid;
            setIsTyping(chatData.typing[otherUserId] || false);
          }
        });
        
        // Store both unsubscribe functions
        const originalUnsubscribe = unsubscribeRef.current;
        unsubscribeRef.current = () => {
          originalUnsubscribe();
          unsubscribeChat();
        };
        
        // Subscribe to participant's online status
        onlineStatusUnsubscribeRef.current = firebaseChatService.subscribeToOnlineStatus(
          participant.firebaseUid,
          (status) => {
            setIsOnline(status.isOnline);
            setLastSeen(status.lastSeen);
          }
        );
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId || isSending) return;

    try {
      setIsSending(true);
      const currentUser = auth.currentUser;
      
      // Stop typing indicator before sending
      await firebaseChatService.updateTypingStatus(chatId, currentUser.uid, false);
      
      // Send message using Firebase (instant delivery!)
      const result = await firebaseChatService.sendMessage(chatId, {
        text: message.trim(),
        senderId: currentUser.uid,
        senderName: currentUserData?.fullName || currentUserData?.companyName || 'User',
      });

      if (result.success) {
        setMessage('');
        // No need to manually fetch - real-time subscription handles it!
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = async (text) => {
    setMessage(text);
    
    if (!chatId) return;
    
    const currentUser = auth.currentUser;
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set typing to true
    if (text.trim()) {
      await firebaseChatService.updateTypingStatus(chatId, currentUser.uid, true);
      
      // Set timeout to stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(async () => {
        await firebaseChatService.updateTypingStatus(chatId, currentUser.uid, false);
      }, 2000);
    } else {
      // If text is empty, stop typing immediately
      await firebaseChatService.updateTypingStatus(chatId, currentUser.uid, false);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDateHeader = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const shouldShowDateHeader = (currentMsg, previousMsg) => {
    if (!previousMsg) return true;
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const previousDate = new Date(previousMsg.timestamp).toDateString();
    return currentDate !== previousDate;
  };

  const formatLastSeen = (lastSeenDate) => {
    if (!lastSeenDate) return 'Offline';
    
    const now = new Date();
    const diff = now - lastSeenDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return lastSeenDate.toLocaleDateString();
  };

  if (!participant) return null;

  const participantName = participant.name || participant.workerName || participant.employerName || 'User';
  const participantPhoto = participant.profilePhoto || participant.workerProfile?.profilePhoto || participant.employerProfile?.profilePhoto;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            {participantPhoto ? (
              <RNImage 
                source={{ uri: participantPhoto.startsWith('http') ? participantPhoto : `${API_CONFIG.BASE_URL}${participantPhoto}` }} 
                style={styles.headerAvatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.headerAvatarPlaceholder}>
                <Text style={styles.headerAvatarText}>
                  {participantName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>{participantName}</Text>
            <Text style={styles.headerStatus}>
              {isTyping ? 'typing...' : isOnline ? 'Online' : lastSeen ? formatLastSeen(lastSeen) : 'Offline'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#c7c7cc" />
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Send a message to start the conversation</Text>
            </View>
          ) : (
            messages.map((msg, index) => {
              const isMyMessage = msg.senderId === auth.currentUser?.uid;
              const showDateHeader = shouldShowDateHeader(msg, messages[index - 1]);
              
              return (
                <View key={msg._id || index}>
                  {showDateHeader && (
                    <View style={styles.dateHeader}>
                      <Text style={styles.dateHeaderText}>{formatDateHeader(msg.timestamp)}</Text>
                    </View>
                  )}
                  
                  <View style={[styles.messageRow, isMyMessage && styles.messageRowRight]}>
                    <View style={[
                      styles.messageBubble,
                      isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble
                    ]}>
                      <Text style={[
                        styles.messageText,
                        isMyMessage ? styles.myMessageText : styles.theirMessageText
                      ]}>
                        {msg.text}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={[styles.messageTimeRow, isMyMessage && styles.messageTimeRowRight]}>
                    <Text style={styles.messageTime}>{formatMessageTime(msg.timestamp)}</Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle" size={28} color="#007AFF" />
          </TouchableOpacity>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="iMessage"
              placeholderTextColor="#8e8e93"
              value={message}
              onChangeText={handleTyping}
              multiline
              maxLength={1000}
            />
          </View>
          
          {message.trim() ? (
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={isSending}
            >
              <Ionicons name="arrow-up-circle" size={32} color="#007AFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.voiceButton}>
              <Ionicons name="mic" size={24} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 0.5,
    borderBottomColor: '#c6c6c8',
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerAvatar: {
    marginRight: 8,
  },
  headerAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerStatus: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
  },
  headerButton: {
    padding: 4,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 15,
    color: '#8e8e93',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#8e8e93',
    marginTop: 8,
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateHeaderText: {
    fontSize: 13,
    color: '#8e8e93',
    fontWeight: '500',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingHorizontal: 8,
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#e9e9eb',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#000',
  },
  messageTimeRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  messageTimeRowRight: {
    justifyContent: 'flex-end',
  },
  messageTime: {
    fontSize: 11,
    color: '#8e8e93',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#c6c6c8',
  },
  attachButton: {
    padding: 4,
    marginBottom: 4,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 16,
    color: '#000',
    minHeight: 20,
  },
  sendButton: {
    padding: 0,
    marginBottom: 2,
  },
  voiceButton: {
    padding: 4,
    marginBottom: 6,
  },
});
