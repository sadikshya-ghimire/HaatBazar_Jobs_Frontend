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

const ForgotPasswordPage = ({ onBack, onBackToLogin, onSendCode }) => {
  const [resetMethod, setResetMethod] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSendCode = () => {
    const contact = resetMethod === 'phone' ? phoneNumber : email;
    if (contact) {
      onSendCode(resetMethod, contact);
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
            <Text className="text-white text-xl font-bold">Forgot Password</Text>
          </View>
          <Text className="text-white text-sm">We'll send you a reset code</Text>
        </LinearGradient>

        <View className="items-center px-6 py-8">
          <View className="w-full" style={{ maxWidth: 500 }}>
            <Text className="text-gray-700 text-sm mb-3">Send reset code via:</Text>
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => setResetMethod('phone')}
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                style={{
                  backgroundColor: resetMethod === 'phone' ? '#447788' : '#ffffff',
                  borderWidth: 1,
                  borderColor: resetMethod === 'phone' ? '#447788' : '#e5e7eb',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons
                  name="call"
                  size={18}
                  color={resetMethod === 'phone' ? '#ffffff' : '#6b7280'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  className="font-semibold"
                  style={{ color: resetMethod === 'phone' ? '#ffffff' : '#6b7280' }}
                >
                  Phone
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setResetMethod('email')}
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                style={{
                  backgroundColor: resetMethod === 'email' ? '#447788' : '#ffffff',
                  borderWidth: 1,
                  borderColor: resetMethod === 'email' ? '#447788' : '#e5e7eb',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons
                  name="mail"
                  size={18}
                  color={resetMethod === 'email' ? '#ffffff' : '#6b7280'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  className="font-semibold"
                  style={{ color: resetMethod === 'email' ? '#ffffff' : '#6b7280' }}
                >
                  Email
                </Text>
              </Pressable>
            </View>

            {resetMethod === 'phone' ? (
              <>
                <Text className="text-gray-700 text-sm mb-2">Phone Number</Text>
                <View
                  className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-2"
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
                  <Ionicons name="call-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="98XXXXXXXX"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    className="flex-1 text-gray-700"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                  />
                </View>
                <Text className="text-gray-500 text-xs mb-6">
                  We'll send a verification code via SMS
                </Text>
              </>
            ) : (
              <>
                <Text className="text-gray-700 text-sm mb-2">Email</Text>
                <View
                  className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-2"
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
                  <Ionicons name="mail-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    className="flex-1 text-gray-700"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <Text className="text-gray-500 text-xs mb-6">
                  We'll send a verification code via email
                </Text>
              </>
            )}

            <Pressable
              onPress={handleSendCode}
              className="py-4 rounded-xl active:opacity-90 flex-row items-center justify-center"
              style={{
                backgroundColor: '#447788',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Ionicons name="paper-plane-outline" size={18} color="#ffffff" style={{ marginRight: 8 }} />
              <Text className="text-white text-center font-bold text-base">
                Send Code
              </Text>
            </Pressable>

            <View className="items-center mt-8">
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

export default ForgotPasswordPage;
