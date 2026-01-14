import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image as RNImage,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config/firebase';
import { profileService } from '../services/profileService';

const { width } = Dimensions.get('window');

const WorkerRegistrationStep1 = ({ onBack, onContinue, onSkip }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
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

      const uploadResult = await profileService.uploadProfilePhoto(profilePhoto);

      if (!uploadResult.success) {
        alert('Failed to upload photo. Please try again.');
        setIsUploading(false);
        return;
      }

      console.log('✅ Photo uploaded:', uploadResult.url);

      const firebaseUid = auth.currentUser?.uid;
      if (!firebaseUid) {
        alert('User not authenticated');
        setIsUploading(false);
        return;
      }

      const saveResult = await profileService.saveWorkerProfile(firebaseUid, 1, {
        profilePhoto,
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
              <Text style={styles.progressText}>Step 1 of 5</Text>
              <Text style={styles.progressText}>20%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '20%' }]} />
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Profile Photo</Text>
            <Text style={styles.cardSubtitle}>
              Upload a clear photo of yourself. This helps employers recognize you.
            </Text>

            {/* Photo Upload Area */}
            <TouchableOpacity
              onPress={pickImage}
              style={styles.photoContainer}
              disabled={isUploading}
              activeOpacity={0.7}
            >
              <View style={styles.photoCircle}>
                {profilePhoto ? (
                  <RNImage
                    source={{ uri: profilePhoto }}
                    style={styles.photoImage}
                  />
                ) : (
                  <Ionicons name="camera-outline" size={64} color="#cbd5e1" />
                )}
              </View>
              
              {/* Upload Badge */}
              <View style={styles.uploadBadge}>
                <Ionicons name="cloud-upload" size={20} color="#fff" />
              </View>
            </TouchableOpacity>

            <Text style={styles.photoHint}>JPG, PNG or JPEG (Max 5MB)</Text>

            {/* Continue Button */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={!profilePhoto || isUploading}
              style={[styles.continueButton, (!profilePhoto || isUploading) && styles.continueButtonDisabled]}
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
    alignItems: 'center',
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
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  photoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f1f5f9',
    borderWidth: 3,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
  },
  uploadBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  photoHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 32,
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
  },
  skipButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default WorkerRegistrationStep1;
