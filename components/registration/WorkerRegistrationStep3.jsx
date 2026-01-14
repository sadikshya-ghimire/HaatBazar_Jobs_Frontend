import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { profileService } from '../services/profileService';

interface WorkerRegistrationStep3Props {
  onBack?: () => void;
  onContinue?: (skills: string[]) => void;
  onSkip?: () => void;
}

const AVAILABLE_SKILLS = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Mason',
  'Painter',
  'Welder',
  'Mechanic',
  'Tailor',
  'Cook',
  'Cleaner',
  'Gardener',
  'Driver',
  'Tutor',
  'Babysitter',
];

const WorkerRegistrationStep3 = ({ onBack, onContinue, onSkip }: WorkerRegistrationStep3Props) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleContinue = async () => {
    if (selectedSkills.length === 0) return;

    try {
      setIsSaving(true);
      console.log('📤 Saving skills...');

      const firebaseUid = auth.currentUser?.uid;
      if (!firebaseUid) {
        alert('User not authenticated');
        setIsSaving(false);
        return;
      }

      const saveResult = await profileService.saveWorkerProfile(firebaseUid, 3, {
        skills: selectedSkills,
      });

      if (saveResult.success) {
        console.log('✅ Skills saved to database');
        setIsSaving(false);
        onContinue?.(selectedSkills);
      } else {
        alert('Failed to save skills. Please try again.');
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      setIsSaving(false);
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
              <Pressable onPress={onBack} className="mr-4" disabled={isSaving}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <Text className="text-white text-xl font-bold">Worker Registration</Text>
            </View>
          </View>

          {/* Progress */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-sm">Step 3 of 5</Text>
            <Text className="text-white text-sm">60%</Text>
          </View>
          <View className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full"
              style={{ 
                width: '60%',
                backgroundColor: '#ffffff'
              }}
            />
          </View>
        </LinearGradient>

        {/* Content */}
        <View className="items-center px-6 py-8">
          <View className="w-full" style={{ maxWidth: 500 }}>
            {/* Title */}
            <Text className="text-gray-900 text-2xl font-bold mb-2">Your Skills</Text>
            <Text className="text-gray-600 text-sm mb-8">
              Select all the skills you can offer (Select at least one)
            </Text>

            {/* Skills Grid */}
            <View className="flex-row flex-wrap gap-3 mb-8">
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <Pressable
                    key={skill}
                    onPress={() => toggleSkill(skill)}
                    className="rounded-xl px-6 py-3"
                    style={{
                      backgroundColor: isSelected ? '#447788' : '#ffffff',
                      borderWidth: 2,
                      borderColor: isSelected ? '#447788' : '#e5e7eb',
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                    disabled={isSaving}
                  >
                    <Text
                      className="font-semibold text-sm"
                      style={{ color: isSelected ? '#ffffff' : '#6b7280' }}
                    >
                      {skill}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Selected Count */}
            {selectedSkills.length > 0 && (
              <View className="bg-blue-50 rounded-xl px-4 py-3 mb-6">
                <Text className="text-sm" style={{ color: '#447788' }}>
                  {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                </Text>
              </View>
            )}

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              disabled={selectedSkills.length === 0 || isSaving}
              className="py-4 rounded-xl active:opacity-90"
              style={{
                backgroundColor: selectedSkills.length > 0 && !isSaving ? '#447788' : '#d1d5db',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: selectedSkills.length > 0 ? 0.2 : 0.1,
                shadowRadius: 8,
                elevation: selectedSkills.length > 0 ? 6 : 2,
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
                  Continue
                </Text>
              )}
            </Pressable>

            {/* Skip Button */}
            <Pressable onPress={onSkip} className="mt-4" disabled={isSaving}>
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

export default WorkerRegistrationStep3;
