import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { otpService } from '../services/otpService';

interface VerifyCodePageProps {
  onBack?: () => void;
  onVerifySuccess?: () => void;
  onChangeContact?: () => void;
  contactInfo?: string;
  verificationMethod?: 'phone' | 'email';
  password?: string;
}

const VerifyCodePage = ({
  onBack,
  onVerifySuccess,
  onChangeContact,
  contactInfo = '',
  verificationMethod = 'phone',
  password = '',
}: VerifyCodePageProps) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(22);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer for resend
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleCodeChange = (text: string, index: number) => {
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }

    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit code');
      return;
    }

    console.log('🔐 Verifying OTP with password...');
    console.log('Contact Info:', contactInfo);
    console.log('Verification Code:', verificationCode);
    console.log('Password:', password ? '***' + password.slice(-3) : 'MISSING');

    try {
      setIsVerifying(true);
      setErrorMessage('');

      // Call backend to verify OTP with password
      const result = await otpService.verifyOTP(contactInfo, verificationCode, password);

      if (result.success) {
        setErrorMessage('');
        if (onVerifySuccess) {
          onVerifySuccess();
        }
      } else {
        // Show specific error message from backend
        setErrorMessage(result.message || 'Invalid verification code. Please try again.');
        // Clear the code on error
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setErrorMessage('Failed to verify code. Please check your connection and try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      try {
        setErrorMessage('');
        // Call backend to resend OTP
        const result = await otpService.sendOTP(contactInfo);

        if (result.success) {
          setResendTimer(22);
          setCode(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        } else {
          setErrorMessage(result.message || 'Failed to resend code');
        }
      } catch (error) {
        setErrorMessage('Failed to resend code. Please try again.');
      }
    }
  };

  return (
    <LinearGradient
      colors={['#447788', '#628BB5', '#B5DBE1']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Back Button */}
          <View className="px-6 pt-6">
            <Pressable onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
          </View>

        {/* Content - Centered */}
        <View className="flex-1 items-center justify-center px-6 py-12">
          {/* Icon */}
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-8"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <Ionicons
              name={verificationMethod === 'phone' ? 'call' : 'mail'}
              size={40}
              color="#ffffff"
            />
          </View>

          {/* Title */}
          <Text className="text-white text-2xl font-bold mb-3 text-center">
            Verify Your {verificationMethod === 'phone' ? 'Phone' : 'Email'}
          </Text>

          {/* Subtitle */}
          <Text className="text-center mb-8" style={{ color: '#ffffff' }}>
            We've sent a 6-digit code to{'\n'}
            <Text className="font-semibold">
              {contactInfo ||
                (verificationMethod === 'phone' ? '+977 ...' : 'your email')}
            </Text>
          </Text>

          {/* Code Input Boxes */}
          <View className="flex-row gap-3 mb-3">
            {code.map((digit, index) => (
              <View
                key={index}
                className="w-12 h-14 rounded-xl items-center justify-center"
                style={{
                  backgroundColor: digit
                    ? '#ffffff'
                    : 'rgba(255, 255, 255, 0.3)',
                  borderWidth: 2,
                  borderColor: errorMessage
                    ? '#EF4444'
                    : digit
                    ? '#ffffff'
                    : 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  className="text-2xl font-bold text-center w-full"
                  style={{ color: digit ? '#447788' : '#ffffff' }}
                  selectTextOnFocus
                  editable={!isVerifying}
                />
              </View>
            ))}
          </View>

          {/* Error Message */}
          {errorMessage ? (
            <View className="mb-4 px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
              <View className="flex-row items-center">
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text className="text-red-500 text-sm font-semibold ml-2 flex-1">
                  {errorMessage}
                </Text>
              </View>
            </View>
          ) : (
            <View className="mb-4" />
          )}

          {/* Resend Code */}
          <View className="mb-8">
            {resendTimer > 0 ? (
              <Text className="text-sm" style={{ color: '#ffffff' }}>
                Resend code in {resendTimer}s
              </Text>
            ) : (
              <Pressable onPress={handleResend}>
                <Text className="text-white text-sm font-semibold">
                  Resend Code
                </Text>
              </Pressable>
            )}
          </View>

          {/* Verify Button */}
          <View className="w-full" style={{ maxWidth: 400 }}>
            <Pressable
              onPress={handleVerify}
              className="py-4 rounded-xl active:opacity-90"
              style={{
                backgroundColor:
                  code.every((d) => d) && !isVerifying
                    ? '#ffffff'
                    : 'rgba(255, 255, 255, 0.3)',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}
              disabled={!code.every((d) => d) || isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#447788" />
              ) : (
                <Text
                  className="text-center font-bold text-base"
                  style={{
                    color: code.every((d) => d)
                      ? '#447788'
                      : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  Verify & Continue
                </Text>
              )}
            </Pressable>

            {/* Change Contact */}
            <View className="items-center mt-6">
              <Pressable onPress={onChangeContact} disabled={isVerifying}>
                <Text className="text-white text-sm">
                  Change{' '}
                  {verificationMethod === 'phone' ? 'phone number' : 'email'}?
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default VerifyCodePage;
