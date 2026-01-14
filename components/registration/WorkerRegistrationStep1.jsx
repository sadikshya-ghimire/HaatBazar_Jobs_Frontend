import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config/firebase';
import { profileService } from '../services/profileService';

interface WorkerRegistrationStep1Props {
  onBack?: () => void;
  onContinue?: (photoUri: string) => void;
  onSkip?: () => void;
}

const WorkerRegistrationStep1 = ({ onBack, onContinue, onSkip }: WorkerRegistrationStep1Props) => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleContinue = async () => {
    if (!profilePhoto) return;

    try {
      setIsUploading(true);
      console.log('📤 Uploading profile photo...');

      // Upload photo to server
      const uploadResult = await profileService.uploadProfilePhoto(profilePhoto);

      if (!uploadResult.success) {
        alert('Failed to upload photo. Please try again.');
        setIsUploading(false);
        return;
      }

      console.log('✅ Photo uploaded:', uploadResult.url);

      // Save to database
      const firebaseUid = auth.currentUser?.uid;
      if (!firebaseUid) {
        alert('User not authenticated');
        setIsUploading(false);
        return;
      }

      const saveResult = await profileService.saveWorkerProfile(firebaseUid, 1, {
        profilePhoto: uploadResult.url,
      });

      if (saveResult.success) {
        console.log('✅ Profile photo saved to database');
        setIsUploading(false);
        onContinue?.(uploadResult.url);
      } else {
        alert('Failed to save profile. Please try again.');
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      setIsUploading(false);
    }
  };

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
            <Text className="text-white text-sm">Step 1 of 5</Text>
            <Text className="text-white text-sm">20%</Text>
          </View>
          <View className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full"
              style={{ 
                width: '20%',
                backgroundColor: '#ffffff'
              }}
            />
          </View>
        </LinearGradient>

        {/* Content */}
        <View className="items-center px-6 py-12">
          <View className="w-full" style={{ maxWidth: 500 }}>
            {/* Title */}
            <Text className="text-gray-900 text-2xl font-bold mb-2">Profile Photo</Text>
            <Text className="text-gray-600 text-sm mb-8">
              Upload a clear photo of yourself. This helps employers recognize you.
            </Text>

            {/* Photo Upload */}
            <View className="items-center mb-8">
              <Pressable
                onPress={pickImage}
                className="relative"
                disabled={isUploading}
              >
                <View
                  className="w-40 h-40 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: profilePhoto ? 'transparent' : '#e5e7eb',
                    borderWidth: 2,
                    borderColor: '#d1d5db',
                    borderStyle: 'dashed',
                  }}
                >
                  {profilePhoto ? (
                    <Image
                      source={{ uri: profilePhoto }}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <Ionicons name="camera" size={48} color="#9ca3af" />
                  )}
                </View>
                
                {/* Upload Button */}
                <View
                  className="absolute bottom-0 right-0 w-12 h-12 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: '#447788',
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Ionicons name="cloud-upload" size={24} color="#ffffff" />
                </View>
              </Pressable>

              <Text className="text-gray-500 text-xs mt-4">
                JPG, PNG or JPEG (Max 5MB)
              </Text>
            </View>

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              disabled={!profilePhoto || isUploading}
              className="py-4 rounded-xl active:opacity-90"
              style={{
                backgroundColor: profilePhoto && !isUploading ? '#447788' : '#d1d5db',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: profilePhoto ? 0.2 : 0.1,
                shadowRadius: 8,
                elevation: profilePhoto ? 6 : 2,
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

            {/* Skip Button */}
            <Pressable onPress={onSkip} className="mt-4" disabled={isUploading}>
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

export default WorkerRegistrationStep1;
