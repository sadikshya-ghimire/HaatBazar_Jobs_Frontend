import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface WorkerRegistrationStep2Props {
  onBack?: () => void;
  onContinue?: (data: { nidNumber: string; nidFront: string; nidBack: string }) => void;
  onSkip?: () => void;
}

const WorkerRegistrationStep2 = ({ onBack, onContinue, onSkip }: WorkerRegistrationStep2Props) => {
  const [nidNumber, setNidNumber] = useState('');
  const [nidFront, setNidFront] = useState<string | null>(null);
  const [nidBack, setNidBack] = useState<string | null>(null);

  const pickImage = async (type: 'front' | 'back') => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'front') {
        setNidFront(result.assets[0].uri);
      } else {
        setNidBack(result.assets[0].uri);
      }
    }
  };

  const handleContinue = () => {
    if (nidNumber && nidFront && nidBack && onContinue) {
      onContinue({ nidNumber, nidFront, nidBack });
    }
  };

  const isFormValid = nidNumber && nidFront && nidBack;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6" style={{ backgroundColor: '#00B8DB' }}>
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <Pressable onPress={onBack} className="mr-4">
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <Text className="text-white text-xl font-bold">Worker Registration</Text>
            </View>
          </View>

          {/* Progress */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-sm">Step 2 of 5</Text>
            <Text className="text-white text-sm">40%</Text>
          </View>
          <View className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full"
              style={{ 
                width: '40%',
                backgroundColor: '#ffffff'
              }}
            />
          </View>
        </View>

        {/* Content */}
        <View className="items-center px-6 py-8">
          <View className="w-full" style={{ maxWidth: 500 }}>
            {/* Title */}
            <Text className="text-gray-900 text-2xl font-bold mb-2">National ID Verification</Text>
            <Text className="text-gray-600 text-sm mb-8">
              Your NID helps verify your identity and build trust with employers.
            </Text>

            {/* NID Number */}
            <Text className="text-gray-700 text-sm mb-2">NID Number</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 mb-6"
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
              <TextInput
                placeholder="Enter your NID number"
                value={nidNumber}
                onChangeText={setNidNumber}
                className="text-gray-700"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* NID Front Photo */}
            <Text className="text-gray-700 text-sm mb-2">NID Front Photo</Text>
            <Pressable
              onPress={() => pickImage('front')}
              className="bg-white rounded-xl px-4 py-12 mb-6"
              style={{
                borderWidth: 2,
                borderColor: '#e5e7eb',
                borderStyle: 'dashed',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View className="items-center">
                <Ionicons 
                  name={nidFront ? "checkmark-circle" : "cloud-upload-outline"} 
                  size={32} 
                  color={nidFront ? "#10b981" : "#9ca3af"} 
                  style={{ marginBottom: 8 }}
                />
                <Text className="text-gray-500 text-sm">
                  {nidFront ? 'NID Front Uploaded' : 'Upload NID Front'}
                </Text>
              </View>
            </Pressable>

            {/* NID Back Photo */}
            <Text className="text-gray-700 text-sm mb-2">NID Back Photo</Text>
            <Pressable
              onPress={() => pickImage('back')}
              className="bg-white rounded-xl px-4 py-12 mb-8"
              style={{
                borderWidth: 2,
                borderColor: '#e5e7eb',
                borderStyle: 'dashed',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View className="items-center">
                <Ionicons 
                  name={nidBack ? "checkmark-circle" : "cloud-upload-outline"} 
                  size={32} 
                  color={nidBack ? "#10b981" : "#9ca3af"} 
                  style={{ marginBottom: 8 }}
                />
                <Text className="text-gray-500 text-sm">
                  {nidBack ? 'NID Back Uploaded' : 'Upload NID Back'}
                </Text>
              </View>
            </Pressable>

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              disabled={!isFormValid}
              className="py-4 rounded-xl active:opacity-90 mb-3"
              style={{
                backgroundColor: isFormValid ? '#00B8DB' : '#d1d5db',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isFormValid ? 0.2 : 0.1,
                shadowRadius: 8,
                elevation: isFormValid ? 6 : 2,
              }}
            >
              <Text className="text-white text-center font-bold text-base">
                Continue
              </Text>
            </Pressable>

            {/* Back Button */}
            <Pressable 
              onPress={onBack}
              className="py-3 rounded-xl mb-3"
              style={{
                backgroundColor: '#ffffff',
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}
            >
              <Text className="text-gray-700 text-center font-semibold text-base">
                Back
              </Text>
            </Pressable>

            {/* Skip Button */}
            <Pressable onPress={onSkip} className="mt-2">
              <Text className="text-gray-600 text-center text-sm">
                Skip for now
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkerRegistrationStep2;
