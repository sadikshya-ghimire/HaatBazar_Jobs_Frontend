import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleContinue = () => {
    if (selectedSkills.length > 0 && onContinue) {
      onContinue(selectedSkills);
    }
  };

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
        </View>

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
                      backgroundColor: isSelected ? '#00B8DB' : '#ffffff',
                      borderWidth: 2,
                      borderColor: isSelected ? '#00B8DB' : '#e5e7eb',
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
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
                <Text className="text-sm" style={{ color: '#00B8DB' }}>
                  {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                </Text>
              </View>
            )}

            {/* Continue Button */}
            <Pressable
              onPress={handleContinue}
              disabled={selectedSkills.length === 0}
              className="py-4 rounded-xl active:opacity-90"
              style={{
                backgroundColor: selectedSkills.length > 0 ? '#00B8DB' : '#d1d5db',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: selectedSkills.length > 0 ? 0.2 : 0.1,
                shadowRadius: 8,
                elevation: selectedSkills.length > 0 ? 6 : 2,
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

export default WorkerRegistrationStep3;
