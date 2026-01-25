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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { CustomAlert } from '../common/CustomAlert';
import { storage } from '../utils/storage';
import { otpService } from '../services/otpService';
import { userService } from '../services/userService';

const SignUpPage = ({ onBack, onLogin, onSignUpSuccess }) => {
  const [userType, setUserType] = useState('worker');
  const [signUpMethod, setSignUpMethod] = useState('phone');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: '',
    general: '',
  });

  const [alertState, setAlertState] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showCustomAlert = (title, message, buttons) => {
    setAlertState({
      visible: true,
      title,
      message,
      buttons,
    });
  };

  const hideAlert = () => {
    setAlertState({ ...alertState, visible: false });
  };

  const handleSignUp = async () => {
    if (isLoading) return;

    // Clear previous errors
    setErrors({
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: '',
      general: '',
    });

    let hasError = false;
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
      hasError = true;
    }

    if (signUpMethod === 'phone') {
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = 'Please enter your phone number';
        hasError = true;
      }
    } else {
      if (!email.trim()) {
        newErrors.email = 'Please enter your email address';
        hasError = true;
      }
    }

    if (!password) {
      newErrors.password = 'Please enter a password';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      hasError = true;
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Please agree to the Terms & Conditions';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);

      if (signUpMethod === 'phone') {
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+977${phoneNumber}`;
        
        const result = await otpService.sendOTP(formattedPhone);

        if (result.success) {
          setIsLoading(false);
          showCustomAlert(
            'OTP Sent! 📱',
            `Verification code sent to ${formattedPhone}`,
            [
              {
                text: 'Verify',
                onPress: () => {
                  onSignUpSuccess?.(userType, signUpMethod, formattedPhone, password);
                },
              },
            ]
          );
        } else {
          setIsLoading(false);
          setErrors({ ...errors, general: result.message || 'Failed to send OTP. Please try again.' });
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password
        );

        const user = userCredential.user;

        await updateProfile(user, {
          displayName: fullName.trim(),
        });

        await sendEmailVerification(user);

        // Save user profile to backend database
        const saveResult = await userService.saveUserProfile(
          user.uid,
          user.email,
          userType,
          fullName.trim()
        );

        if (!saveResult.success) {
          // If saving profile fails, delete the Firebase user and show error
          await user.delete();
          setIsLoading(false);
          setErrors({ ...errors, general: 'Failed to create user profile. Please try again.' });
          return;
        }

        await storage.setItem('pendingFirebaseUid', user.uid);

        setIsLoading(false);

        showCustomAlert(
          'Verification Email Sent! 📧',
          `We've sent a verification link to ${email}. Please check your inbox and verify your email.`,
          [
            {
              text: 'OK',
              onPress: () => {
                onSignUpSuccess?.(userType, signUpMethod, email, password);
              },
            },
          ]
        );
      }
    } catch (error) {
      setIsLoading(false);

      let message = 'Sign up failed. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        setErrors({ ...errors, email: 'This email is already registered. Please login instead.' });
        return;
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ ...errors, email: 'Invalid email address. Please check and try again.' });
        return;
      } else if (error.code === 'auth/weak-password') {
        setErrors({ ...errors, password: 'Password is too weak. Please use a stronger password.' });
        return;
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your connection.';
      } else if (error.message) {
        message = error.message;
      }

      setErrors({ ...errors, general: message });
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
              source={require('../../assets/Icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandTitle}>HaatBazar Jobs</Text>

          {/* Welcome Text */}
          <Text style={styles.welcomeTitle}>Create Account</Text>
          <Text style={styles.welcomeSubtitle}>Join us and start your journey today</Text>

          {/* Signup Card */}
          <View style={styles.signupCard}>
            {/* User Type Selection */}
            <Text style={styles.sectionLabel}>I want to</Text>
            <View style={styles.userTypeToggle}>
              <TouchableOpacity
                onPress={() => setUserType('worker')}
                style={[
                  styles.userTypeButton,
                  userType === 'worker' && styles.userTypeButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="briefcase" 
                  size={18} 
                  color={userType === 'worker' ? '#fff' : '#94a3b8'} 
                />
                <Text style={[
                  styles.userTypeButtonText,
                  userType === 'worker' && styles.userTypeButtonTextActive
                ]}>
                  Find Jobs
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setUserType('employer')}
                style={[
                  styles.userTypeButton,
                  userType === 'employer' && styles.userTypeButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="people" 
                  size={18} 
                  color={userType === 'employer' ? '#fff' : '#94a3b8'} 
                />
                <Text style={[
                  styles.userTypeButtonText,
                  userType === 'employer' && styles.userTypeButtonTextActive
                ]}>
                  Hire Workers
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign up with */}
            <Text style={styles.sectionLabel}>Sign up with</Text>
            <View style={styles.methodToggle}>
              <TouchableOpacity
                onPress={() => setSignUpMethod('phone')}
                style={[
                  styles.methodButton,
                  signUpMethod === 'phone' && styles.methodButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="call" 
                  size={18} 
                  color={signUpMethod === 'phone' ? '#fff' : '#94a3b8'} 
                />
                <Text style={[
                  styles.methodButtonText,
                  signUpMethod === 'phone' && styles.methodButtonTextActive
                ]}>
                  Phone
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSignUpMethod('email')}
                style={[
                  styles.methodButton,
                  signUpMethod === 'email' && styles.methodButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="mail" 
                  size={18} 
                  color={signUpMethod === 'email' ? '#fff' : '#94a3b8'} 
                />
                <Text style={[
                  styles.methodButtonText,
                  signUpMethod === 'email' && styles.methodButtonTextActive
                ]}>
                  Email
                </Text>
              </TouchableOpacity>
            </View>

            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputContainer, errors.fullName && styles.inputContainerError]}>
                <Ionicons name="person-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                />
              </View>
              {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
            </View>

            {/* Phone/Email Input */}
            {signUpMethod === 'phone' ? (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={[styles.inputContainer, errors.phoneNumber && styles.inputContainerError]}>
                  <Ionicons name="call-outline" size={20} color="#94a3b8" />
                  <TextInput
                    placeholder="98XXXXXXXX"
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text);
                      if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                    }}
                    style={styles.input}
                    placeholderTextColor="#cbd5e1"
                    keyboardType="phone-pad"
                  />
                </View>
                {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={[styles.inputContainer, errors.email && styles.inputContainerError]}>
                  <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                  <TextInput
                    placeholder="your@email.com"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    style={styles.input}
                    placeholderTextColor="#cbd5e1"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
              </View>
            )}

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputContainer, errors.password && styles.inputContainerError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Create a password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#94a3b8" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[styles.inputContainer, errors.confirmPassword && styles.inputContainerError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#94a3b8" 
                  />
                </TouchableOpacity>
                {confirmPassword.length > 0 && password.length > 0 && (
                  <View style={styles.matchIndicator}>
                    {password === confirmPassword ? (
                      <Ionicons name="checkmark-circle" size={22} color="#10b981" />
                    ) : (
                      <Ionicons name="close-circle" size={22} color="#ef4444" />
                    )}
                  </View>
                )}
              </View>
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Terms Checkbox */}
            <View style={styles.termsGroup}>
              <TouchableOpacity 
                onPress={() => {
                  setAgreedToTerms(!agreedToTerms);
                  if (errors.terms) setErrors({ ...errors, terms: '' });
                }}
                style={styles.termsContainer}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                  {agreedToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
              {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}
            </View>

            {/* General Error */}
            {errors.general ? (
              <View style={styles.generalErrorContainer}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            ) : null}

            {/* Create Account Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={isLoading}
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
              {!isLoading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={onLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms */}
          <Text style={styles.bottomTermsText}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </ScrollView>
      </LinearGradient>

      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onDismiss={hideAlert}
      />
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  brandText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 32,
  },
  signupCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  userTypeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  userTypeButtonActive: {
    backgroundColor: '#1e293b',
  },
  userTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  userTypeButtonTextActive: {
    color: '#fff',
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  methodButtonActive: {
    backgroundColor: '#1e293b',
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  methodButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputContainerError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 6,
    marginLeft: 4,
  },
  generalErrorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  generalErrorText: {
    fontSize: 13,
    color: '#dc2626',
    textAlign: 'center',
  },
  eyeIcon: {
    marginRight: 4,
  },
  matchIndicator: {
    marginLeft: 4,
  },
  termsGroup: {
    marginBottom: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  termsLink: {
    color: '#10b981',
    fontWeight: '600',
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  signupButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  bottomTermsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default SignUpPage;
