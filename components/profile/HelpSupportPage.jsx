import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HelpSupportPage({ onBack }) {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I create an account?',
      answer: 'You can sign up using your email or phone number. For email, verify your email address. For phone, enter the OTP code sent to your number.',
    },
    {
      id: 2,
      question: 'How does the booking process work?',
      answer: 'Employers can browse workers and create booking requests. The admin reviews and approves the booking. Then the worker can accept or reject it. Once accepted, both parties can communicate via chat.',
    },
    {
      id: 3,
      question: 'How do I get verified as a worker?',
      answer: 'Complete your profile with all required information including NID photos. Admin will review your profile and verify it within 24-48 hours.',
    },
    {
      id: 4,
      question: 'What payment methods are supported?',
      answer: 'Currently, we support Cash and eSewa payments. Payment is arranged directly between employer and worker.',
    },
    {
      id: 5,
      question: 'How do I reset my password?',
      answer: 'Go to Login page → Click "Forgot Password?" → Enter your email or phone → Follow the instructions sent to you.',
    },
    {
      id: 6,
      question: 'Can I cancel a booking?',
      answer: 'Yes, you can cancel a booking before it starts. Go to your bookings, select the booking, and click cancel. Note that frequent cancellations may affect your rating.',
    },
    {
      id: 7,
      question: 'How does the rating system work?',
      answer: 'After a job is completed, employers can rate workers on a 5-star scale and leave feedback. This helps build trust in the community.',
    },
    {
      id: 8,
      question: 'Is my personal information safe?',
      answer: 'Yes, we take privacy seriously. Your NID and personal information are encrypted and only visible to admins for verification purposes.',
    },
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Choose how you want to contact us:',
      [
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:support@haatbazarjobs.com')
        },
        {
          text: 'Phone',
          onPress: () => Linking.openURL('tel:+9779800000000')
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleReportIssue = () => {
    Alert.alert(
      'Report an Issue',
      'Please describe the issue you\'re facing and we\'ll get back to you within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Email',
          onPress: () => Linking.openURL('mailto:support@haatbazarjobs.com?subject=Issue Report')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleContactSupport}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="headset-outline" size={24} color="#3b82f6" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Contact Support</Text>
              <Text style={styles.actionSubtitle}>Get help from our team</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleReportIssue}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="warning-outline" size={24} color="#f59e0b" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Report an Issue</Text>
              <Text style={styles.actionSubtitle}>Let us know about problems</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Linking.openURL('https://haatbazarjobs.com/terms')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#e0e7ff' }]}>
              <Ionicons name="document-text-outline" size={24} color="#6366f1" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Terms & Conditions</Text>
              <Text style={styles.actionSubtitle}>Read our terms of service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Linking.openURL('https://haatbazarjobs.com/privacy')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#22c55e" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Privacy Policy</Text>
              <Text style={styles.actionSubtitle}>How we protect your data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(faq.id)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Ionicons 
                  name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#64748b" 
                />
              </TouchableOpacity>
              
              {expandedFAQ === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About HaatBazar Jobs</Text>
          
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              HaatBazar Jobs is a mobile-first employment marketplace connecting informal workers with local employers for short-term and piece-based jobs.
            </Text>
            
            <View style={styles.aboutInfo}>
              <View style={styles.aboutInfoItem}>
                <Text style={styles.aboutInfoLabel}>Version</Text>
                <Text style={styles.aboutInfoValue}>1.0.0</Text>
              </View>
              <View style={styles.aboutInfoItem}>
                <Text style={styles.aboutInfoLabel}>Email</Text>
                <Text style={styles.aboutInfoValue}>support@haatbazarjobs.com</Text>
              </View>
              <View style={styles.aboutInfoItem}>
                <Text style={styles.aboutInfoLabel}>Phone</Text>
                <Text style={styles.aboutInfoValue}>+977 980-0000000</Text>
              </View>
            </View>

            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-twitter" size={24} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-instagram" size={24} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={24} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  faqItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  aboutCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  aboutInfo: {
    marginBottom: 16,
  },
  aboutInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  aboutInfoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  aboutInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 16,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
