import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ResetPasswordPage = ({ 
  onBack, 
  onBackToLogin, 
  onResetSuccess,
  onChangeContact,
  contactInfo,
  resetMethod
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = () => {
    if (onResetSuccess) {
      onResetSuccess();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#447788', '#628BB5', '#B5DBE1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 py-6"
        >
          <View className="flex-row items-center mb-4">
            <Pressable onPress={onBack} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <Text className="text-white text-xl font-bold">Reset Password</Text>
          </View>
          <Text className="text-white text-sm">Enter the code sent to you</Text>
        </LinearGradient>

        <View className="items-center px-6 py-8">
          <View className="w-full" style={{ maxWidth: 500 }}>
            <Text className="text-gray-700 text-sm mb-2">Verification Code</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 mb-2"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <TextInput
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChangeText={setVerificationCode}
                className="text-gray-700 text-center text-lg tracking-widest"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-gray-500 text-xs">
                Code sent to {contactInfo || (resetMethod === 'phone' ? 'your phone' : 'your email')}
              </Text>
              <Pressable>
                <Text className="text-xs font-semibold" style={{ color: '#447788' }}>
                  Resend
                </Text>
              </Pressable>
            </View>

            <Text className="text-gray-700 text-sm mb-2">New Password</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                className="flex-1 text-gray-700"
                placeholderTextColor="#9ca3af"
                secureTextEntry
              />
            </View>

            <Text className="text-gray-700 text-sm mb-2">Confirm New Password</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-6"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="flex-1 text-gray-700"
                placeholderTextColor="#9ca3af"
                secureTextEntry
              />
            </View>

            <Pressable
              onPress={handleResetPassword}
              className="py-4 rounded-xl active:opacity-90"
              style={{
                backgroundColor: '#1e293b',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text className="text-white text-center font-bold text-base">
                Reset Password
              </Text>
            </Pressable>

            <View className="items-center mt-6">
              <Pressable onPress={onChangeContact}>
                <Text className="text-sm" style={{ color: '#1e293b' }}>
                  Change {resetMethod === 'phone' ? 'phone number' : 'email'}
                </Text>
              </Pressable>
            </View>

            <View className="items-center mt-4">
              <Pressable onPress={onBackToLogin} className="flex-row items-center">
                <Ionicons name="arrow-back" size={16} color="#6b7280" style={{ marginRight: 6 }} />
                <Text className="text-gray-600 text-sm">Back to Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPasswordPage;
