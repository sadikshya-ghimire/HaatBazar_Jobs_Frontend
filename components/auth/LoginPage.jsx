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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { CustomAlert } from '../common/CustomAlert';
import { otpService } from '../services/otpService';
import { userService } from '../services/userService.js';

const LoginPage = ({ onBack, onSignUp, onLoginSuccess, onForgotPassword }) => {
  const [loginMethod, setLoginMethod] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState({
    phoneNumber: '',
    email: '',
    password: '',
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
      buttons: buttons || [{ text: 'OK' }],
    });
  };

  const hideAlert = () => {
    setAlertState({ ...alertState, visible: false });
  };

  const handleLogin = async () => {
    if (isLoading) return;

    // Clear previous errors
    setErrors({
      phoneNumber: '',
      email: '',
      password: '',
      general: '',
    });

    let hasError = false;
    const newErrors = {};

    if (loginMethod === 'phone') {
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = 'Please enter your phone number';
        hasError = true;
      }
      
      if (!password) {
        newErrors.password = 'Please enter your password';
        hasError = true;
      }

      if (hasError) {
        setErrors(newErrors);
        return;
      }

      try {
        setIsLoading(true);
        
        const formattedPhone = phoneNumber.startsWith("+")
          ? phoneNumber
          : `+977${phoneNumber}`;

        const result = await otpService.phoneLogin(formattedPhone, password);

        if (result.success) {
          setIsLoading(false);
          const userType = result.user.userType || 'worker';
          const profileComplete = result.user.profileComplete || false;
          const displayName = result.user.displayName || 'User';
          
          showCustomAlert(
            "Welcome Back! 🎉",
            "Login successful",
            [
              {
                text: "Continue",
                onPress: () => onLoginSuccess?.(userType, profileComplete, displayName)
              }
            ]
          );
        } else {
          setIsLoading(false);
          
          if (result.code === 'PHONE_NOT_FOUND') {
            setErrors({ ...errors, phoneNumber: 'No account found with this phone number' });
          } else if (result.code === 'WRONG_PASSWORD') {
            setErrors({ ...errors, password: 'Incorrect password. Please try again.' });
          } else {
            setErrors({ ...errors, general: result.message || 'Unable to login. Please try again.' });
          }
        }
      } catch (error) {
        setIsLoading(false);
        setErrors({ ...errors, general: 'Unable to login. Please try again.' });
      }
      return;
    }

    if (loginMethod === 'email') {
      if (!email.trim()) {
        setErrors({ email: 'Please enter your email address' });
        return;
      }
      
      if (!password) {
        setErrors({ password: 'Please enter your password' });
        return;
      }

      try {
        setIsLoading(true);
        
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password
        );

        const user = userCredential.user;

        if (!user.emailVerified) {
          setIsLoading(false);
          showCustomAlert(
            "Email Not Verified",
            "Please verify your email before logging in. Check your inbox for the verification link.",
            [{ text: "OK" }]
          );
          return;
        }

        const userProfile = await userService.getUserProfile(user.uid);

        setIsLoading(false);

        if (userProfile.success) {
          const userType = userProfile.user.userType || 'worker';
          const profileComplete = userProfile.user.profileComplete || false;
          const displayName = userProfile.user.displayName || user.displayName || 'User';
          
          showCustomAlert(
            "Welcome Back! 🎉",
            "Login successful",
            [
              {
                text: "Continue",
                onPress: () => onLoginSuccess?.(userType, profileComplete, displayName)
              }
            ]
          );
        } else {
          setErrors({ ...errors, general: 'Unable to fetch user profile. Please try again.' });
        }
      } catch (error) {
        setIsLoading(false);
        
        if (error.code === 'auth/user-not-found') {
          setErrors({ ...errors, email: 'No account found with this email. Please sign up first.' });
          return;
        } else if (error.code === 'auth/wrong-password') {
          setErrors({ ...errors, password: 'Incorrect password. Please try again.' });
          return;
        } else if (error.code === 'auth/invalid-email') {
          setErrors({ ...errors, email: 'Invalid email address. Please check and try again.' });
          return;
        } else if (error.code === 'auth/network-request-failed') {
          setErrors({ ...errors, general: 'Network error. Please check your connection.' });
          return;
        } else if (error.message) {
          setErrors({ ...errors, general: error.message });
          return;
        }

        setErrors({ ...errors, general: 'Login failed. Please try again.' });
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
              source={require('../../assets/Icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandTitle}>HaatBazar Jobs</Text>

          {/* Welcome Text */}
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to continue your journey</Text>

          {/* Login Card */}
          <View style={styles.loginCard}>
            {/* Method Toggle */}
            <View style={styles.methodToggle}>
              <TouchableOpacity
                onPress={() => setLoginMethod('phone')}
                style={[
                  styles.methodButton,
                  loginMethod === 'phone' && styles.methodButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="call" 
                  size={18} 
                  color={loginMethod === 'phone' ? '#fff' : '#94a3b8'} 
                />
                <Text style={[
                  styles.methodButtonText,
                  loginMethod === 'phone' && styles.methodButtonTextActive
                ]}>
                  Phone
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setLoginMethod('email')}
                style={[
                  styles.methodButton,
                  loginMethod === 'email' && styles.methodButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="mail" 
                  size={18} 
                  color={loginMethod === 'email' ? '#fff' : '#94a3b8'} 
                />
                <Text style={[
                  styles.methodButtonText,
                  loginMethod === 'email' && styles.methodButtonTextActive
                ]}>
                  Email
                </Text>
              </TouchableOpacity>
            </View>

            {/* Phone/Email Input */}
            {loginMethod === 'phone' ? (
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
                  placeholder="Enter your password"
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

            {/* Forgot Password */}
            <TouchableOpacity onPress={onForgotPassword} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* General Error */}
            {errors.general ? (
              <View style={styles.generalErrorContainer}>
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            ) : null}

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Login'}
              </Text>
              {!isLoading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onSignUp}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms */}
          <Text style={styles.termsText}>
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
    marginBottom: 32,
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
    marginBottom: 40,
  },
  loginCard: {
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
    marginBottom: 20,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94a3b8',
    marginHorizontal: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#64748b',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  termsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default LoginPage;
