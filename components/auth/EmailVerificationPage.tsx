import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { sendEmailVerification } from 'firebase/auth';

interface EmailVerificationPageProps {
  email: string;
  userType: 'worker' | 'employer';
  onVerified: () => void;
  onBack: () => void;
}

const EmailVerificationPage = ({ email, userType, onVerified, onBack }: EmailVerificationPageProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleCheckVerification = async () => {
    setIsChecking(true);
    setMessage('');

    try {
      const user = auth.currentUser;
      if (user) {
        // Reload user to get latest emailVerified status
        await user.reload();
        
        if (user.emailVerified) {
          setMessage('✅ Email verified successfully!');
          setTimeout(() => {
            onVerified();
          }, 1500);
        } else {
          setMessage('❌ Email not verified yet. Please check your inbox and click the verification link.');
        }
      } else {
        setMessage('❌ No user found. Please sign up again.');
      }
    } catch (error) {
      console.error('Verification check error:', error);
      setMessage('❌ Failed to check verification. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    setIsResending(true);
    setMessage('');

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setMessage('✅ Verification email sent successfully!');
        setCountdown(60);
        setCanResend(false);
      }
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('❌ Failed to resend email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-6" style={{ backgroundColor: '#00B8DB' }}>
        <View className="flex-row items-center">
          <Pressable onPress={onBack} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </Pressable>
          <Text className="text-white text-xl font-bold">Verify Your Email</Text>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 items-center px-6 py-8">
        <View className="w-full" style={{ maxWidth: 500 }}>
          {/* Email Icon */}
          <View 
            className="w-24 h-24 rounded-full items-center justify-center mb-6 self-center"
            style={{ backgroundColor: '#CEFAFE' }}
          >
            <Ionicons name="mail-outline" size={48} color="#00B8DB" />
          </View>

          {/* Title */}
          <Text className="text-gray-900 text-2xl font-bold mb-2 text-center">
            Check Your Email
          </Text>
          
          <Text className="text-gray-600 text-base mb-2 text-center">
            We've sent a verification link to:
          </Text>
          
          <Text 
            className="text-lg font-semibold mb-8 text-center"
            style={{ color: '#00B8DB' }}
          >
            {email}
          </Text>

          {/* Steps */}
          <View className="mb-8">
            <View className="flex-row items-start mb-4">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: '#00B8DB' }}
              >
                <Text className="text-white font-bold">1</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 text-base">Check your email inbox</Text>
                <Text className="text-gray-500 text-sm">(Don't forget to check spam folder)</Text>
              </View>
            </View>

            <View className="flex-row items-start mb-4">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: '#00B8DB' }}
              >
                <Text className="text-white font-bold">2</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 text-base">Click the verification link</Text>
              </View>
            </View>

            <View className="flex-row items-start mb-4">
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: '#00B8DB' }}
              >
                <Text className="text-white font-bold">3</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 text-base">Come back and click the button below</Text>
              </View>
            </View>
          </View>

          {/* Message */}
          {message && (
            <View 
              className="rounded-xl px-4 py-3 mb-4"
              style={{ 
                backgroundColor: message.includes('✅') ? '#CEFAFE' : '#fee',
              }}
            >
              <Text 
                className="text-sm text-center"
                style={{ 
                  color: message.includes('✅') ? '#00B8DB' : '#dc2626',
                }}
              >
                {message}
              </Text>
            </View>
          )}

          {/* Check Verification Button */}
          <Pressable
            onPress={handleCheckVerification}
            disabled={isChecking}
            className="py-4 rounded-xl mb-4 active:opacity-90"
            style={{
              backgroundColor: isChecking ? '#d1d5db' : '#00B8DB',
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            {isChecking ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="#ffffff" size="small" />
                <Text className="text-white font-bold text-base ml-2">
                  Checking...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-center font-bold text-base">
                I've Verified My Email
              </Text>
            )}
          </Pressable>

          {/* Resend Section */}
          <View className="items-center mt-6">
            <Text className="text-gray-600 text-sm mb-3">
              Didn't receive the email?
            </Text>
            
            {canResend ? (
              <Pressable
                onPress={handleResendEmail}
                disabled={isResending}
                className="py-3 px-6 rounded-xl"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: 1,
                  borderColor: '#00B8DB',
                }}
              >
                {isResending ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="#00B8DB" size="small" />
                    <Text className="font-semibold text-sm ml-2" style={{ color: '#00B8DB' }}>
                      Sending...
                    </Text>
                  </View>
                ) : (
                  <Text className="font-semibold text-sm" style={{ color: '#00B8DB' }}>
                    Resend Verification Email
                  </Text>
                )}
              </Pressable>
            ) : (
              <Text className="text-gray-500 text-sm">
                Resend available in {countdown}s
              </Text>
            )}
          </View>

          {/* Info Box */}
          <View 
            className="mt-8 rounded-xl px-4 py-4"
            style={{ backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fbbf24' }}
          >
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#f59e0b" style={{ marginRight: 8, marginTop: 2 }} />
              <Text className="flex-1 text-xs" style={{ color: '#92400e' }}>
                You must verify your email before proceeding to registration. 
                The verification link expires in 24 hours.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerificationPage;
