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

export default function ContactWorkerPage({ worker, onBack, employerData }) {
  const [message, setMessage] = useState('');
  const [selectedContactMethod, setSelectedContactMethod] = useState('chat'); // 'chat' or 'phone'
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
      if (!currentUser || !worker) return;

      // Create or get existing chat
      const participant1 = {
        firebaseUid: currentUser.uid,
        userType: 'employer',
        name: employerData?.companyName || currentUser.displayName || 'Employer',
        profilePhoto: employerData?.profilePhoto || '',
      };

      const participant2 = {
        firebaseUid: worker.firebaseUid,
        userType: 'worker',
        name: worker.workerName,
        profilePhoto: worker.workerProfile?.profilePhoto || '',
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
          message: 'Your message has been sent to the worker. You can continue chatting in the Messages tab.',
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

  const handleCallWorker = () => {
    // TODO: Implement phone call logic
    setCustomAlert({
      visible: true,
      type: 'info',
      title: 'Call Worker',
      message: 'Phone call feature will be available soon. For now, please use the chat feature.',
    });
  };

  const hideAlert = () => {
    setCustomAlert({ visible: false, type: '', title: '', message: '' });
  };

  if (!worker) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Worker</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Worker Info Card */}
        <View style={styles.workerCard}>
          <View style={styles.workerHeader}>
            <View style={styles.workerImageContainer}>
              {worker.workerProfile?.profilePhoto ? (
                <RNImage 
                  source={{ uri: `${API_CONFIG.BASE_URL}${worker.workerProfile.profilePhoto}` }} 
                  style={styles.workerImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.workerImagePlaceholder}>
                  <Ionicons name="person" size={32} color="#94a3b8" />
                </View>
              )}
            </View>
            <View style={styles.workerInfo}>
              <Text style={styles.workerName}>{worker.workerName}</Text>
              <Text style={styles.workerTitle}>{worker.title}</Text>
              {worker.workerProfile?.rating > 0 && (
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.ratingText}>
                    {worker.workerProfile.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.availableBadge}>
              <View style={styles.availableDot} />
            </View>
          </View>
        </View>

        {/* Contact Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Method</Text>
          <View style={styles.contactMethodContainer}>
            <TouchableOpacity 
              style={[
                styles.methodButton, 
                selectedContactMethod === 'chat' && styles.methodButtonActive
              ]}
              onPress={() => setSelectedContactMethod('chat')}
            >
              <Ionicons 
                name="chatbubble-ellipses" 
                size={24} 
                color={selectedContactMethod === 'chat' ? '#fff' : '#64748b'} 
              />
              <Text style={[
                styles.methodText,
                selectedContactMethod === 'chat' && styles.methodTextActive
              ]}>
                Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.methodButton, 
                selectedContactMethod === 'phone' && styles.methodButtonActive
              ]}
              onPress={() => setSelectedContactMethod('phone')}
            >
              <Ionicons 
                name="call" 
                size={24} 
                color={selectedContactMethod === 'phone' ? '#fff' : '#64748b'} 
              />
              <Text style={[
                styles.methodText,
                selectedContactMethod === 'phone' && styles.methodTextActive
              ]}>
                Phone
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Section */}
        {selectedContactMethod === 'chat' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Send Message</Text>
            <View style={styles.messageInputContainer}>
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
            </View>
            
            {/* Quick Message Templates */}
            <View style={styles.templatesContainer}>
              <Text style={styles.templatesTitle}>Quick Messages:</Text>
              <TouchableOpacity 
                style={styles.templateButton}
                onPress={() => setMessage('Hi, I am interested in hiring you for a job. Are you available?')}
              >
                <Text style={styles.templateText}>Interested in hiring</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.templateButton}
                onPress={() => setMessage('Hello, can we discuss the job details and your availability?')}
              >
                <Text style={styles.templateText}>Discuss job details</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.templateButton}
                onPress={() => setMessage('Hi, what is your earliest availability for this job?')}
              >
                <Text style={styles.templateText}>Ask about availability</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Phone Section */}
        {selectedContactMethod === 'phone' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Call Worker</Text>
            <View style={styles.phoneCard}>
              <Ionicons name="call-outline" size={48} color="#1e293b" />
              <Text style={styles.phoneTitle}>Direct Phone Call</Text>
              <Text style={styles.phoneDescription}>
                Connect with the worker directly via phone call to discuss job details.
              </Text>
              <TouchableOpacity style={styles.callButton} onPress={handleCallWorker}>
                <Ionicons name="call" size={20} color="#fff" />
                <Text style={styles.callButtonText}>Call Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Job Details Reference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Details</Text>
          <View style={styles.jobDetailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="briefcase-outline" size={18} color="#64748b" />
              <Text style={styles.detailText}>{worker.title}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color="#64748b" />
              <Text style={styles.detailText}>{worker.area}, {worker.district}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash-outline" size={18} color="#10b981" />
              <Text style={styles.detailTextGreen}>NPR {worker.rate}/{worker.rateType}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Custom Alert */}
      {customAlert.visible && customAlert.type && (
        <CustomAlert
          visible={customAlert.visible}
          title={customAlert.title}
          message={customAlert.message}
          buttons={[
            {
              text: 'OK',
              style: 'default',
              onPress: hideAlert,
            },
          ]}
          onDismiss={hideAlert}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  workerCard: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  workerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerImageContainer: {
    marginRight: 12,
  },
  workerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  workerImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  workerTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  availableBadge: {
    alignItems: 'center',
  },
  availableDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  contactMethodContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  methodButtonActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  methodText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  methodTextActive: {
    color: '#fff',
  },
  messageInputContainer: {
    marginBottom: 16,
  },
  messageInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1e293b',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  templatesContainer: {
    marginBottom: 16,
  },
  templatesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 8,
  },
  templateButton: {
    backgroundColor: '#f8fafc',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  templateText: {
    fontSize: 14,
    color: '#475569',
  },
  sendButton: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  phoneTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  phoneDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  callButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  jobDetailsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
  },
  detailTextGreen: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    flex: 1,
  },
});
