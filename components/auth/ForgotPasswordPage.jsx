import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { API_CONFIG } from '../config/api.config';

const ForgotPasswordPage = ({ onBack, onBackToLogin, onSendCode }) => {
  const [resetMethod, setResetMethod] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    // Email reset - use Firebase
    if (resetMethod === 'email') {
      if (!email.trim()) {
        Alert.alert('Error', 'Please enter your email address');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      setLoading(true);
      try {
        // Optional: Check if email exists in your database first
        // This is less secure but provides better UX
        const checkResponse = await fetch(`${API_CONFIG.AUTH_ENDPOINT}/check-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });
        
        const checkResult = await checkResponse.json();
        
        if (!checkResult.exists) {
          Alert.alert(
            'Email Not Found',
            'No account found with this email address. Please check your email or sign up for a new account.',
            [{ text: 'OK' }]
          );
          setLoading(false);
          return;
        }

        // Email exists, send reset link
        await sendPasswordResetEmail(auth, email);
        Alert.alert(
          'Success',
          'If an account exists with this email, you will receive a password reset link. Please check your inbox and spam folder.',
          [
            {
              text: 'OK',
              onPress: () => onBackToLogin && onBackToLogin()
            }
          ]
        );
      } catch (error) {
        console.error('Firebase password reset error:', error);
        let errorMessage = 'Failed to send reset email. Please try again.';
        
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email address.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address format.';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many attempts. Please try again later.';
        }
        
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    } 
    // Phone reset - use existing method (Twilio OTP)
    else {
      if (!phoneNumber.trim()) {
        Alert.alert('Error', 'Please enter your phone number');
        return;
      }
      
      if (onSendCode) {
        onSendCode(resetMethod, phoneNumber);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#2c3e50', '#34495e', '#3d5a6c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Brand Icon */}
          <View style={styles.brandBadge}>
            <RNImage 
              source={require('../../assets/Logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandTitle}>HaatBazar Jobs</Text>

          {/* Title */}
          <Text style={styles.welcomeTitle}>Forgot Password?</Text>
          <Text style={styles.welcomeSubtitle}>We'll send you a reset code</Text>

          {/* Reset Card */}
          <View style={styles.resetCard}>
            {/* Method Toggle */}
            <View style={styles.methodToggle}>
              <TouchableOpacity
                onPress={() => setResetMethod('phone')}
                style={[
                  styles.methodButton,
                  resetMethod === 'phone' && styles.methodButtonActive
                ]}
              >
                <Ionicons
                  name="call"
                  size={18}
                  color={resetMethod === 'phone' ? '#fff' : '#64748b'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[
                  styles.methodButtonText,
                  resetMethod === 'phone' && styles.methodButtonTextActive
                ]}>
                  Phone
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setResetMethod('email')}
                style={[
                  styles.methodButton,
                  resetMethod === 'email' && styles.methodButtonActive
                ]}
              >
                <Ionicons
                  name="mail"
                  size={18}
                  color={resetMethod === 'email' ? '#fff' : '#64748b'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[
                  styles.methodButtonText,
                  resetMethod === 'email' && styles.methodButtonTextActive
                ]}>
                  Email
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            {resetMethod === 'phone' ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    placeholder="98XXXXXXXX"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    style={styles.input}
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                  />
                </View>
                <Text style={styles.helperText}>
                  We'll send a verification code via SMS
                </Text>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                  <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <Text style={styles.helperText}>
                  We'll send a password reset link via email
                </Text>
              </View>
            )}

            {/* Send Code Button */}
            <TouchableOpacity
              onPress={handleSendCode}
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="paper-plane-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.sendButtonText}>
                    {resetMethod === 'email' ? 'Send Reset Link' : 'Send Code'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity onPress={onBackToLogin} style={styles.backToLoginButton}>
              <Ionicons name="arrow-back" size={16} color="#64748b" style={{ marginRight: 6 }} />
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadge: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  logoImage: {
    width: 65,
    height: 65,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 32,
    textAlign: 'center',
  },
  resetCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  methodButtonActive: {
    backgroundColor: '#1e293b',
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  methodButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  helperText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  backToLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingVertical: 12,
  },
  backToLoginText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});

export default ForgotPasswordPage;
