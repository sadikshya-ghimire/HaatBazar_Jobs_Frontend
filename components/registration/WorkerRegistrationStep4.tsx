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

interface WorkerRegistrationStep4Props {
  onBack?: () => void;
  onContinue?: (data: { experience: string; hourlyRate: string; bio: string }) => void;
  onSkip?: () => void;
}

const WorkerRegistrationStep4 = ({ onBack, onContinue, onSkip }: WorkerRegistrationStep4Props) => {
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');

  const handleContinue = () => {
    if (experience && hourlyRate && onContinue) {
      onContinue({ experience, hourlyRate, bio });
    }
  };

  const isFormValid = experience && hourlyRate;

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
            <Text className="text-white text-sm">Step 4 of 5</Text>
            <Text className="text-white text-sm">80%</Text>
          </View>
          <View className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full"
              style={{ 
                width: '80%',
                backgroundColor: '#ffffff'
              }}
            />
          </View>
        </View>

        {/* Content */}
        <View className="items-center px-6 py-8">
          <View className="w-full" style={{ maxWidth: 500 }}>
            {/* Title */}
            <Text className="text-gray-900 text-2xl font-bold mb-2">Experience & Rates</Text>
            <Text className="text-gray-600 text-sm mb-8">
              Tell us about your experience and set your rates
            </Text>

            {/* Years of Experience */}
            <Text className="text-gray-700 text-sm mb-2">Years of Experience</Text>
            <View
              className="bg-white rounded-xl px-4 py-4 mb-4"
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
                  // In a real app, this would open a picker
                  setExperience('2-5 years');
                }}
                className="flex-row items-center justify-between"
              >
                <Text className={experience ? 'text-gray-700' : 'text-gray-400'}>
                  {experience || 'Select experience level'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </Pressable>
            </View>

            {/* Hourly Rate */}
            <Text className="text-gray-700 text-sm mb-2">Hourly Rate (Rs.)</Text>
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
              <Ionicons name="cash-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter your hourly rate"
                value={hourlyRate}
                onChangeText={setHourlyRate}
                className="flex-1 text-gray-700"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>

            {/* Bio */}
            <Text className="text-gray-700 text-sm mb-2">Bio (Optional)</Text>
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
                placeholder="Tell employers about yourself..."
                value={bio}
                onChangeText={setBio}
                className="text-gray-700"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              disabled={!isFormValid}
              className="py-4 rounded-xl active:opacity-90"
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

            {/* Skip Button */}
            <Pressable onPress={onSkip} className="mt-4">
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

export default WorkerRegistrationStep4;
