import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { auth } from '../config/firebase';
import { applyActionCode } from 'firebase/auth';
import { storage } from '../utils/storage';

interface EmailVerificationHandlerProps {
  onVerified: (userType: 'worker' | 'employer') => void;
  onError: () => void;
}

const EmailVerificationHandler = ({ onVerified, onError }: EmailVerificationHandlerProps) => {
  const [status, setStatus] = useState<'checking' | 'verifying' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('Checking verification status...');

  useEffect(() => {
    checkEmailVerification();
  }, []);

  const checkEmailVerification = async () => {
    try {
      // Only check URL params on web
      if (Platform.OS === 'web') {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const oobCode = urlParams.get('oobCode');

        if (mode === 'verifyEmail' && oobCode) {
          setStatus('verifying');
          setMessage('Verifying your email...');

          // Apply the verification code
          await applyActionCode(auth, oobCode);
          
          setStatus('success');
          setMessage('Email verified successfully! Redirecting...');

          // Wait a moment then redirect
          setTimeout(async () => {
            const userType = await storage.getItem('pendingUserType') as 'worker' | 'employer' || 'worker';
            onVerified(userType);
          }, 2000);
          return;
        }
      }

      // For mobile or if no verification code, just check if current user is verified
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setStatus('success');
          setMessage('Email already verified! Redirecting...');
          setTimeout(async () => {
            const userType = await storage.getItem('pendingUserType') as 'worker' | 'employer' || 'worker';
            onVerified(userType);
          }, 1500);
        } else {
          setStatus('error');
          setMessage('Email not verified yet. Please check your inbox.');
          setTimeout(onError, 2000);
        }
      } else {
        setStatus('error');
        setMessage('No user found. Please sign up first.');
        setTimeout(onError, 2000);
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      setStatus('error');
      setMessage('Verification failed. Please try again.');
      setTimeout(onError, 2000);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-6">
      <View className="bg-white rounded-2xl p-8 items-center" style={{ maxWidth: 400, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 }}>
        {status === 'checking' || status === 'verifying' ? (
          <>
            <ActivityIndicator size="large" color="#00B8DB" />
            <Text className="text-gray-700 text-center mt-4 text-base">{message}</Text>
          </>
        ) : status === 'success' ? (
          <>
            <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: '#CEFAFE' }}>
              <Text className="text-4xl">✓</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">Success!</Text>
            <Text className="text-gray-600 text-center">{message}</Text>
          </>
        ) : (
          <>
            <View className="w-16 h-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: '#fee' }}>
              <Text className="text-4xl">✗</Text>
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">Error</Text>
            <Text className="text-gray-600 text-center">{message}</Text>
          </>
        )}
      </View>
    </View>
  );
};

export default EmailVerificationHandler;
