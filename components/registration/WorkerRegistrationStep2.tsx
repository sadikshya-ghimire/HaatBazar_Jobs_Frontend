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
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config/firebase';
import { profileService } from '../services/profileService';

interface WorkerRegistrationStep2Props {
  onBack?: () => void;
  onContinue?: (data: { nidNumber: string; nidFront: string; nidBack: string }) => void;
  onSkip?: () => void;
}

const WorkerRegistrationStep2 = ({ onBack, onContinue, onSkip }: WorkerRegistrationStep2Props) => {
  const [nidNumber, setNidNumber] = useState('');
  const [nidFront, setNidFront] = useState<string | null>(null);
  const [nidBack, setNidBack] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleContinue = async () => {
    if (!nidNumber || !nidFront || !nidBack) return;

    try {
      setIsUploading(true);
      console.log('📤 Uploading NID photos...');

      // Upload NID photos
      const uploadResult = await profileService.uploadNIDPhotos(nidFront, nidBack);

      if (!uploadResult.success) {
        alert('Failed to upload NID photos. Please try again.');
        setIsUploading(false);
        return;
      }

      console.log('✅ NID photos uploaded:', uploadResult.urls);

      // Save to database
      const firebaseUid = auth.currentUser?.uid;
      if (!firebaseUid) {
        alert('User not authenticated');
        setIsUploading(false);
        return;
      }

      const saveResult = await profileService.saveWorkerProfile(firebaseUid, 2, {
        nidNumber,
        nidFront: uploadResult.urls.nidFront,
        nidBack: uploadResult.urls.nidBack,
      });

      if (saveResult.success) {
        console.log('✅ NID information saved to database');
        setIsUploading(false);
        onContinue?.({ 
          nidNumber, 
          nidFront: uploadResult.urls.nidFront, 
          nidBack: uploadResult.urls.nidBack 
        });
      } else {
        alert('Failed to save NID information. Please try again.');
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      setIsUploading(false);
    }
  };

  const isFormValid = nidNumber && nidFront && nidBack;

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
              <Pressable onPress={onBack} className="mr-4" disabled={isUploading}>
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
        </LinearGradient>

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
                editable={!isUploading}
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
              disabled={isUploading}
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
              disabled={isUploading}
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
              disabled={!isFormValid || isUploading}
              className="py-4 rounded-xl active:opacity-90 mb-3"
              style={{
                backgroundColor: isFormValid && !isUploading ? '#447788' : '#d1d5db',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isFormValid ? 0.2 : 0.1,
                shadowRadius: 8,
                elevation: isFormValid ? 6 : 2,
              }}
            >
              {isUploading ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text className="text-white text-center font-bold text-base ml-2">
                    Uploading...
                  </Text>
                </View>
              ) : (
                <Text className="text-white text-center font-bold text-base">
                  Continue
                </Text>
              )}
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
              disabled={isUploading}
            >
              <Text className="text-gray-700 text-center font-semibold text-base">
                Back
              </Text>
            </Pressable>

            {/* Skip Button */}
            <Pressable onPress={onSkip} className="mt-2" disabled={isUploading}>
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
