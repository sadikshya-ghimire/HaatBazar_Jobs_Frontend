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
  Image as RNImage,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config/firebase';
import { profileService } from '../services/profileService';

const WorkerRegistrationStep2 = ({ onBack, onContinue, onSkip }) => {
  const [nidNumber, setNidNumber] = useState('');
  const [nidFront, setNidFront] = useState(null);
  const [nidBack, setNidBack] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async (type) => {
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

      const uploadResult = await profileService.uploadNIDPhotos(nidFront, nidBack);

      if (!uploadResult.success) {
        alert('Failed to upload NID photos. Please try again.');
        setIsUploading(false);
        return;
      }

      console.log('✅ NID photos uploaded:', uploadResult.urls);

      const firebaseUid = auth.currentUser?.uid;
      if (!firebaseUid) {
        alert('User not authenticated');
        setIsUploading(false);
        return;
      }

      // Use the uploaded URLs from the server, not the local blob URIs
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
            <TouchableOpacity onPress={onBack} style={styles.backButton} disabled={isUploading}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Worker Registration</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Step 2 of 5</Text>
              <Text style={styles.progressText}>40%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '40%' }]} />
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>National ID Verification</Text>
            <Text style={styles.cardSubtitle}>
              Your NID helps verify your identity and build trust with employers.
            </Text>

            {/* NID Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NID Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="card-outline" size={20} color="#94a3b8" />
                <TextInput
                  placeholder="Enter your NID number"
                  value={nidNumber}
                  onChangeText={setNidNumber}
                  style={styles.input}
                  placeholderTextColor="#cbd5e1"
                  editable={!isUploading}
                />
              </View>
            </View>

            {/* NID Front Photo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NID Front Photo</Text>
              <TouchableOpacity
                onPress={() => pickImage('front')}
                style={styles.uploadBox}
                disabled={isUploading}
                activeOpacity={0.7}
              >
                {nidFront ? (
                  <View style={styles.uploadedContainer}>
                    <RNImage source={{ uri: nidFront }} style={styles.uploadedImage} />
                    <View style={styles.uploadedOverlay}>
                      <Ionicons name="checkmark-circle" size={32} color="#10b981" />
                      <Text style={styles.uploadedText}>Front Uploaded</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadContent}>
                    <Ionicons name="cloud-upload-outline" size={40} color="#cbd5e1" />
                    <Text style={styles.uploadText}>Upload NID Front</Text>
                    <Text style={styles.uploadHint}>JPG, PNG or JPEG</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* NID Back Photo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>NID Back Photo</Text>
              <TouchableOpacity
                onPress={() => pickImage('back')}
                style={styles.uploadBox}
                disabled={isUploading}
                activeOpacity={0.7}
              >
                {nidBack ? (
                  <View style={styles.uploadedContainer}>
                    <RNImage source={{ uri: nidBack }} style={styles.uploadedImage} />
                    <View style={styles.uploadedOverlay}>
                      <Ionicons name="checkmark-circle" size={32} color="#10b981" />
                      <Text style={styles.uploadedText}>Back Uploaded</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.uploadContent}>
                    <Ionicons name="cloud-upload-outline" size={40} color="#cbd5e1" />
                    <Text style={styles.uploadText}>Upload NID Back</Text>
                    <Text style={styles.uploadHint}>JPG, PNG or JPEG</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={!isFormValid || isUploading}
              style={[styles.continueButton, (!isFormValid || isUploading) && styles.continueButtonDisabled]}
              activeOpacity={0.8}
            >
              {isUploading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.continueButtonText}>Uploading...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity onPress={onSkip} style={styles.skipButton} disabled={isUploading}>
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
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  uploadBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 12,
  },
  uploadHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  uploadedContainer: {
    width: '100%',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: 140,
    borderRadius: 8,
  },
  uploadedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  uploadedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginTop: 8,
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

export default WorkerRegistrationStep2;
