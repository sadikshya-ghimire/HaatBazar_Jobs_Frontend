import React, { useState } from 'react';
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
import { auth } from '../config/firebase';
import { profileService } from '../services/profileService';

interface EmployerRegistrationStep3Props {
  onBack?: () => void;
  onSubmit?: (data: { 
    fullName: string; 
    phoneNumber: string; 
    email: string; 
    companyName: string; 
    address: string; 
    city: string; 
    district: string; 
  }) => void;
}

const EmployerRegistrationStep3 = ({ onBack, onSubmit }: EmployerRegistrationStep3Props) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!fullName || !phoneNumber || !address || !city || !district) return;

    try {
      setIsSaving(true);
      console.log('📤 Saving employer business information...');

      const firebaseUid = auth.currentUser?.uid;
      if (!firebaseUid) {
        alert('User not authenticated');
        setIsSaving(false);
        return;
      }

      const saveResult = await profileService.saveEmployerProfile(firebaseUid, 3, {
        fullName,
        phoneNumber,
        email,
        companyName,
        address,
        city,
        district,
      });

      if (saveResult.success) {
        console.log('✅ Employer registration completed');
        setIsSaving(false);
        onSubmit?.({ fullName, phoneNumber, email, companyName, address, city, district });
      } else {
        alert('Failed to save information. Please try again.');
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      setIsSaving(false);
    }
  };

  const isFormValid = fullName && phoneNumber && address && city && district;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#447788', '#628BB5', '#B5DBE1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 py-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <Pressable onPress={onBack} className="mr-4" disabled={isSaving}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <Text className="text-white text-xl font-bold">Employer Registration</Text>
            </View>
          </View>

          {/* Progress */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-sm">Step 3 of 3</Text>
            <Text className="text-white text-sm">100%</Text>
          </View>
          <View className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full"
              style={{ 
                width: '100%',
                backgroundColor: '#ffffff'
              }}
            />
          </View>
        </LinearGradient>

        {/* Content */}
        <View className="items-center px-6 py-8">
          <View className="w-full" style={{ maxWidth: 500 }}>
            {/* Title */}
            <Text className="text-gray-900 text-2xl font-bold mb-2">Personal Information</Text>
            <Text className="text-gray-600 text-sm mb-8">
              Provide your contact details and location information
            </Text>

            {/* Full Name */}
            <Text className="text-gray-700 text-sm mb-2">Full Name</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Ionicons name="person-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                className="flex-1 text-gray-700"
                placeholderTextColor="#9ca3af"
                editable={!isSaving}
              />
            </View>

            {/* Phone Number */}
            <Text className="text-gray-700 text-sm mb-2">Phone Number</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000000',
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
                editable={!isSaving}
              />
            </View>

            {/* Email Address */}
            <Text className="text-gray-700 text-sm mb-2">Email Address</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Ionicons name="mail-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                className="flex-1 text-gray-700"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSaving}
              />
            </View>

            {/* Company Name (Optional) */}
            <Text className="text-gray-700 text-sm mb-2">Company Name (Optional)</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Ionicons name="business-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter company name if applicable"
                value={companyName}
                onChangeText={setCompanyName}
                className="flex-1 text-gray-700"
                placeholderTextColor="#9ca3af"
                editable={!isSaving}
              />
            </View>

            {/* Address */}
            <Text className="text-gray-700 text-sm mb-2">Street Address</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Ionicons name="location-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter your street address"
                value={address}
                onChangeText={setAddress}
                className="flex-1 text-gray-700"
                placeholderTextColor="#9ca3af"
                editable={!isSaving}
              />
            </View>

            {/* City */}
            <Text className="text-gray-700 text-sm mb-2">City</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Ionicons name="business-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="e.g., Kathmandu"
                value={city}
                onChangeText={setCity}
                className="flex-1 text-gray-700"
                placeholderTextColor="#9ca3af"
                editable={!isSaving}
              />
            </View>

            {/* District */}
            <Text className="text-gray-700 text-sm mb-2">District</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 mb-8"
              style={{
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <Pressable
                onPress={() => {
                  if (!isSaving) setDistrict('Kathmandu');
                }}
                className="flex-row items-center justify-between"
                disabled={isSaving}
              >
                <Text className={district ? 'text-gray-700' : 'text-gray-400'}>
                  {district || 'e.g., Kathmandu'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </Pressable>
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={!isFormValid || isSaving}
              className="py-4 rounded-xl active:opacity-90 mb-3"
              style={{
                backgroundColor: isFormValid && !isSaving ? '#447788' : '#d1d5db',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isFormValid ? 0.2 : 0.1,
                shadowRadius: 8,
                elevation: isFormValid ? 6 : 2,
              }}
            >
              {isSaving ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text className="text-white text-center font-bold text-base ml-2">
                    Saving...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-bold text-base">
                  Complete Registration
                </Text>
              )}
            </Pressable>

            {/* Back Button */}
            <Pressable 
              onPress={onBack}
              className="py-3 rounded-xl"
              style={{
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}
              disabled={isSaving}
            >
              <Text className="text-gray-700 text-center font-semibold text-base">
                Back
              </Text>
            </Pressable>

            <View className="mt-6 bg-blue-50 rounded-xl px-4 py-3">
              <Text className="text-xs text-center" style={{ color: '#447788' }}>
                Your profile will be reviewed by our admin team within 24-48 hours
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmployerRegistrationStep3;
