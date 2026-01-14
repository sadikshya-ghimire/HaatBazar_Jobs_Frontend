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

interface WorkerRegistrationStep5Props {
  onBack?: () => void;
  onSubmit?: (data: { address: string; city: string; district: string; availability: string[] }) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WorkerRegistrationStep5 = ({ onBack, onSubmit }: WorkerRegistrationStep5Props) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [availability, setAvailability] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    if (availability.includes(day)) {
      setAvailability(availability.filter(d => d !== day));
    } else {
      setAvailability([...availability, day]);
    }
  };

  const handleSubmit = () => {
    if (address && city && district && availability.length > 0 && onSubmit) {
      onSubmit({ address, city, district, availability });
    }
  };

  const isFormValid = address && city && district && availability.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6" style={{ backgroundColor: '#447788' }}>
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
            <Text className="text-white text-sm">Step 5 of 5</Text>
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
        </View>

        {/* Content */}
        <View className="items-center px-6 py-8">
          <View className="w-full" style={{ maxWidth: 500 }}>
            {/* Title */}
            <Text className="text-gray-900 text-2xl font-bold mb-2">Location & Availability</Text>
            <Text className="text-gray-600 text-sm mb-8">
              Let employers know where you work and when you're available
            </Text>

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
                placeholder="Enter your city"
                value={city}
                onChangeText={setCity}
                className="flex-1 text-gray-700"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* District */}
            <Text className="text-gray-700 text-sm mb-2">District</Text>
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
              <Pressable
                onPress={() => {
                  // In a real app, this would open a picker
                  setDistrict('Kathmandu');
                }}
                className="flex-row items-center justify-between"
              >
                <Text className={district ? 'text-gray-700' : 'text-gray-400'}>
                  {district || 'Select district'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#9ca3af" />
              </Pressable>
            </View>

            {/* Availability */}
            <Text className="text-gray-700 text-sm mb-3">Available Days</Text>
            <View className="flex-row flex-wrap gap-2 mb-8">
              {DAYS.map((day) => {
                const isSelected = availability.includes(day);
                return (
                  <Pressable
                    key={day}
                    onPress={() => toggleDay(day)}
                    className="rounded-lg px-4 py-2"
                    style={{
                      backgroundColor: isSelected ? '#447788' : '#ffffff',
                      borderWidth: 1,
                      borderColor: isSelected ? '#447788' : '#e5e7eb',
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Text
                      className="font-semibold text-xs"
                      style={{ color: isSelected ? '#ffffff' : '#6b7280' }}
                    >
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={!isFormValid}
              className="py-4 rounded-xl active:opacity-90"
              style={{
                backgroundColor: isFormValid ? '#447788' : '#d1d5db',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isFormValid ? 0.2 : 0.1,
                shadowRadius: 8,
                elevation: isFormValid ? 6 : 2,
              }}
            >
              <Text className="text-white text-center font-bold text-base">
                Submit for Verification
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

export default WorkerRegistrationStep5;
