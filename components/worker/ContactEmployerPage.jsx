import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { API_CONFIG } from '../config/api.config';
import { CustomAlert } from '../common/CustomAlert';
import { chatService } from '../services/chatService';

export default function ContactEmployerPage({ booking, onBack, workerData }) {
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customAlert, setCustomAlert] = useState({ 
    visible: false, 
    type: '', 
    title: '', 
    message: '' 
  });

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !booking) return;

      // Create or get existing chat
      const participant1 = {
        firebaseUid: currentUser.uid,
        userType: 'worker',
        name: workerData?.fullName || currentUser.displayName || 'Worker',
        profilePhoto: workerData?.profilePhoto || '',
      };

      const participant2 = {
        firebaseUid: booking.employerFirebaseUid,
        userType: 'employer',
        name: booking.employerName,
        profilePhoto: booking.employerProfile?.profilePhoto || '',
      };

      const result = await chatService.createOrGetChat(participant1, participant2);
      
      if (result.success && result.data) {
        setChatId(result.data._id);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setCustomAlert({
        visible: true,
        type: 'warning',
        title: 'Message Required',
        message: 'Please enter a message before sending.',
      });
      return;
    }

    if (!chatId) {
      setCustomAlert({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'Chat not initialized. Please try again.',
      });
      return;
    }

    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;
      
      const result = await chatService.sendMessage(chatId, currentUser.uid, message);

      if (result.success) {
        setCustomAlert({
          visible: true,
          type: 'success',
          title: 'Message Sent',
          message: 'Your message has been sent to the employer.',
        });
        setMessage('');
      } else {
        setCustomAlert({
          visible: true,
          type: 'error',
          title: 'Error',
          message: result.message || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setCustomAlert({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'An error occurred while sending the message.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Contact Employer</Text>
          <Text style={styles.headerSubtitle}>{booking?.employerName}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Employer Info Card */}
        <View style={styles.employerCard}>
          <View style={styles.employerHeader}>
            <View style={styles.employerAvatar}>
              {booking?.employerProfile?.profilePhoto ? (
                <RNImage 
                  source={{ uri: `${API_CONFIG.BASE_URL}${booking.employerProfile.profilePhoto}` }} 
                  style={styles.employerAvatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="business" size={32} color="#1e293b" />
              )}
            </View>
            <View style={styles.employerInfo}>
              <Text style={styles.employerName}>{booking?.employerName}</Text>
              <Text style={styles.jobTitle}>{booking?.jobTitle}</Text>
            </View>
          </View>

          <View style={styles.bookingDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={18} color="#10b981" />
              <Text style={styles.detailText}>NPR {booking?.agreedRate}/{booking?.rateType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color="#64748b" />
              <Text style={styles.detailText}>{booking?.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color="#64748b" />
              <Text style={styles.detailText}>{booking?.location?.area}, {booking?.location?.district}</Text>
            </View>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <Text style={styles.infoTitle}>Contact Information</Text>
          </View>
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={18} color="#64748b" />
              <Text style={styles.contactText}>{booking?.employerPhone || 'Not provided'}</Text>
            </View>
          </View>
        </View>

        {/* Message Section */}
        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <Ionicons name="chatbubbles" size={20} color="#1e293b" />
            <Text style={styles.messageTitle}>Send Message</Text>
          </View>
          
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message here..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={6}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />

          <TouchableOpacity 
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.sendButtonText}>Sending...</Text>
            ) : (
              <>
                <Ionicons name="send" size={18} color="#fff" />
                <Text style={styles.sendButtonText}>Send Message</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Note */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={18} color="#64748b" />
          <Text style={styles.noteText}>
            You can also call the employer directly using the phone number provided above.
          </Text>
        </View>
      </ScrollView>

      <CustomAlert
        visible={customAlert.visible}
        type={customAlert.type}
        title={customAlert.title}
        message={customAlert.message}
        onDismiss={() => setCustomAlert({ visible: false, type: '', title: '', message: '' })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  employerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  employerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  employerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  employerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  employerInfo: {
    flex: 1,
  },
  employerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: '#64748b',
  },
  bookingDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  contactInfo: {
    gap: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#475569',
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  messageInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#1e293b',
    minHeight: 120,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sendButton: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
});
