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

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WorkerRegistrationStep5 = ({ onBack, onSubmit }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [availability, setAvailability] = useState([]);

  const toggleDay = (day) => {
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
              <Text style={styles.progressText}>Step 5 of 5</Text>
              <Text style={styles.progressText}>100%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '100%' }]} />
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Location & Availability</Text>
            <Text style={styles.cardSubtitle}>
              Let employers know where you work and when you're available
            </Text>

            {/* Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Street Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Enter your street address"
                  value={address}
                  onChangeText={setAddress}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                />
              </View>
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Enter your city"
                  value={city}
                  onChangeText={setCity}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                />
              </View>
            </View>

            {/* District */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>District</Text>
              <TouchableOpacity
                onPress={() => setDistrict('Kathmandu')}
                style={styles.inputContainer}
                activeOpacity={0.7}
              >
                <Ionicons name="map-outline" size={20} color="#94a3b8" />
                <Text style={[styles.inputText, !district && styles.inputPlaceholder]}>
                  {district || 'Select district'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Availability */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Available Days</Text>
              <View style={styles.daysGrid}>
                {DAYS.map((day) => {
                  const isSelected = availability.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() => toggleDay(day)}
                      style={[
                        styles.dayChip,
                        isSelected && styles.dayChipSelected
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.dayText,
                        isSelected && styles.dayTextSelected
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isFormValid}
              style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.submitButtonText}>Submit for Verification</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Info Badge */}
            <View style={styles.infoBadge}>
              <Ionicons name="information-circle" size={16} color="#10b981" />
              <Text style={styles.infoText}>
                Your profile will be reviewed within 24-48 hours
              </Text>
            </View>
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
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  inputPlaceholder: {
    color: '#cbd5e1',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minWidth: 60,
    alignItems: 'center',
  },
  dayChipSelected: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  dayTextSelected: {
    color: '#fff',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#059669',
    lineHeight: 16,
  },
});

export default WorkerRegistrationStep5;
