import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { profileService } from '../services/profileService';

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

const WorkerRegistrationStep3 = ({ onBack, onContinue, onSkip }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const toggleSkill = (skill) => {
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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2c3e50', '#34495e', '#3d5a6c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={isSaving}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Worker Registration</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Step 3 of 5</Text>
              <Text style={styles.progressText}>60%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '60%' }]} />
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Skills</Text>
            <Text style={styles.cardSubtitle}>
              Select all the skills you can offer (Select at least one)
            </Text>

            {/* Skills Grid */}
            <View style={styles.skillsGrid}>
              {AVAILABLE_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <TouchableOpacity
                    key={skill}
                    onPress={() => toggleSkill(skill)}
                    style={[
                      styles.skillChip,
                      isSelected && styles.skillChipSelected
                    ]}
                    disabled={isSaving}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.skillText,
                      isSelected && styles.skillTextSelected
                    ]}>
                      {skill}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Selected Count */}
            {selectedSkills.length > 0 && (
              <View style={styles.selectedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.selectedText}>
                  {selectedSkills.length} skill(s) selected
                </Text>
              </View>
            )}

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={selectedSkills.length === 0 || isSaving}
              style={[styles.continueButton, (selectedSkills.length === 0 || isSaving) && styles.continueButtonDisabled]}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.continueButtonText}>Saving...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity onPress={onSkip} style={styles.skipButton} disabled={isSaving}>
              <Text style={styles.skipButtonText}>Skip for now →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 32,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  skillChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  skillChipSelected: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  skillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  skillTextSelected: {
    color: '#fff',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10b981',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  continueButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  skipButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default WorkerRegistrationStep3;
