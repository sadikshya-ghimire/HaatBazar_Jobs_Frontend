import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const WorkerRegistrationStep4 = ({ onBack, onContinue, onSkip }) => {
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
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Worker Registration</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Step 4 of 5</Text>
              <Text style={styles.progressText}>80%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '80%' }]} />
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Experience & Rates</Text>
            <Text style={styles.cardSubtitle}>
              Tell us about your experience and set your rates
            </Text>

            {/* Years of Experience */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Years of Experience</Text>
              <TouchableOpacity
                onPress={() => setExperience('2-5 years')}
                style={styles.inputContainer}
                activeOpacity={0.7}
              >
                <Ionicons name="briefcase-outline" size={20} color="#94a3b8" />
                <Text style={[styles.inputText, !experience && styles.inputPlaceholder]}>
                  {experience || 'Select experience level'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Hourly Rate */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hourly Rate (NPR)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="cash-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Enter your hourly rate"
                  value={hourlyRate}
                  onChangeText={setHourlyRate}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Bio */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio (Optional)</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  placeholder="Tell employers about yourself..."
                  value={bio}
                  onChangeText={setBio}
                  style={[styles.input, styles.textArea]}
                  placeholderTextColor="#cbd5e1"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={!isFormValid}
              style={[styles.continueButton, !isFormValid && styles.continueButtonDisabled]}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.continueButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
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
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  inputPlaceholder: {
    color: '#cbd5e1',
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

export default WorkerRegistrationStep4;
