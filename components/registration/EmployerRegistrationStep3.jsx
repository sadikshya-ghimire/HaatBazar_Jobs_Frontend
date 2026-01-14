import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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

const EmployerRegistrationStep3 = ({ onBack, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    if (!fullName || !phoneNumber || !address || !city || !district) return;

    try {
      setIsSaving(true);
      console.log('📤 Saving employer business information...');

      const firebaseUid = auth.currentUser?.uid;
      if (!firebaseUid) {
        alert('User not authenticated');
        setIsSaving(false);
        return;
      }

      const saveResult = await profileService.saveEmployerProfile(firebaseUid, 3, {
        fullName,
        phoneNumber,
        email,
        companyName,
        address,
        city,
        district,
      });

      if (saveResult.success) {
        console.log('✅ Employer registration completed');
        setIsSaving(false);
        onSubmit?.({ fullName, phoneNumber, email, companyName, address, city, district });
      } else {
        alert('Failed to save information. Please try again.');
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      setIsSaving(false);
    }
  };

  const isFormValid = fullName && phoneNumber && address && city && district;

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
            <Text style={styles.headerTitle}>Employer Registration</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Step 3 of 3</Text>
              <Text style={styles.progressText}>100%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '100%' }]} />
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <Text style={styles.cardSubtitle}>
              Provide your contact details and location information
            </Text>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                  editable={!isSaving}
                />
              </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="98XXXXXXXX"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                  keyboardType="phone-pad"
                  editable={!isSaving}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address (Optional)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isSaving}
                />
              </View>
            </View>

            {/* Company Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Company Name (Optional)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Enter company name"
                  value={companyName}
                  onChangeText={setCompanyName}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                  editable={!isSaving}
                />
              </View>
            </View>

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
                  editable={!isSaving}
                />
              </View>
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="e.g., Kathmandu"
                  value={city}
                  onChangeText={setCity}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                  editable={!isSaving}
                />
              </View>
            </View>

            {/* District */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>District</Text>
              <TouchableOpacity
                onPress={() => !isSaving && setDistrict('Kathmandu')}
                style={styles.inputContainer}
                disabled={isSaving}
                activeOpacity={0.7}
              >
                <Ionicons name="map-outline" size={20} color="#94a3b8" />
                <Text style={[styles.inputText, !district && styles.inputPlaceholder]}>
                  {district || 'Select district'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isFormValid || isSaving}
              style={[styles.submitButton, (!isFormValid || isSaving) && styles.submitButtonDisabled]}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.submitButtonText}>Saving...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.submitButtonText}>Complete Registration</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Info Badge */}
            <View style={styles.infoBadge}>
              <Ionicons name="information-circle" size={16} color="#10b981" />
              <Text style={styles.infoText}>
                Your information will be verified within 24-48 hours
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
    marginBottom: 20,
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
  submitButton: {
    width: '100%',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    marginTop: 12,
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

export default EmployerRegistrationStep3;
