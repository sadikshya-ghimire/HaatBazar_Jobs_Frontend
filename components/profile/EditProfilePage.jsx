import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Image as RNImage,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../config/firebase';
import { profileService } from '../services/profileService';
import { API_CONFIG } from '../config/api.config';

export default function EditProfilePage({ onBack, userType, currentProfile }) {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    area: '',
    district: '',
    bio: '',
    profilePhoto: null,
    // Worker specific
    skills: [],
    experience: '',
    hourlyRate: '',
    // Employer specific
    companyName: '',
    contactPerson: '',
  });

  useEffect(() => {
    if (currentProfile) {
      setProfileData({
        fullName: currentProfile.fullName || currentProfile.companyName || '',
        phoneNumber: currentProfile.phoneNumber || '',
        email: currentProfile.email || '',
        area: currentProfile.area || '',
        district: currentProfile.district || '',
        bio: currentProfile.bio || '',
        profilePhoto: currentProfile.profilePhoto || null,
        skills: currentProfile.skills || [],
        experience: currentProfile.experience || '',
        hourlyRate: currentProfile.hourlyRate?.toString() || '',
        companyName: currentProfile.companyName || '',
        contactPerson: currentProfile.contactPerson || '',
      });
    }
  }, [currentProfile]);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileData(prev => ({ ...prev, profilePhoto: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    // Basic validation - only check if at least one identifying field exists
    // Allow saving even if only photo is changed
    if (userType === 'worker' && !profileData.fullName && !currentProfile?.fullName) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (userType === 'employer' && !profileData.companyName && !profileData.fullName && !currentProfile?.companyName) {
      Alert.alert('Error', 'Please enter your company name');
      return;
    }

    setLoading(true);
    try {
      const firebaseUid = auth.currentUser?.uid;
      
      // Upload profile photo if changed
      let photoUrl = profileData.profilePhoto;
      if (profileData.profilePhoto && !profileData.profilePhoto.startsWith('http')) {
        const uploadResult = await profileService.uploadProfilePhoto(profileData.profilePhoto);
        if (uploadResult.success) {
          photoUrl = uploadResult.photoUrl;
        }
      }

      // Save profile based on user type
      const saveData = {
        ...(userType === 'worker' ? {
          fullName: profileData.fullName || currentProfile?.fullName,
          phoneNumber: profileData.phoneNumber || currentProfile?.phoneNumber,
          email: profileData.email || currentProfile?.email,
          area: profileData.area || currentProfile?.area,
          district: profileData.district || currentProfile?.district,
          bio: profileData.bio || currentProfile?.bio,
          profilePhoto: photoUrl,
          skills: profileData.skills?.length > 0 ? profileData.skills : currentProfile?.skills || [],
          experience: profileData.experience || currentProfile?.experience,
          hourlyRate: profileData.hourlyRate ? parseFloat(profileData.hourlyRate) : currentProfile?.hourlyRate || 0,
        } : {
          companyName: profileData.companyName || profileData.fullName || currentProfile?.companyName,
          contactPerson: profileData.contactPerson || profileData.fullName || currentProfile?.contactPerson,
          phoneNumber: profileData.phoneNumber || currentProfile?.phoneNumber,
          email: profileData.email || currentProfile?.email,
          area: profileData.area || currentProfile?.area,
          district: profileData.district || currentProfile?.district,
          profilePhoto: photoUrl,
        }),
      };

      const result = userType === 'worker'
        ? await profileService.saveWorkerProfile(firebaseUid, 5, saveData)
        : await profileService.saveEmployerProfile(firebaseUid, 3, saveData);

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: onBack }
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveButton, loading && styles.saveButtonDisabled]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={handlePickImage} style={styles.photoContainer}>
            {profileData.profilePhoto ? (
              <RNImage
                source={{ 
                  uri: profileData.profilePhoto.startsWith('http') 
                    ? profileData.profilePhoto 
                    : profileData.profilePhoto 
                }}
                style={styles.profilePhoto}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Ionicons name="person" size={48} color="#94a3b8" />
              </View>
            )}
            <View style={styles.photoEditBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.photoHint}>Tap to change photo</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {userType === 'worker' ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.fullName}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, fullName: text }))}
                  placeholder="Enter your full name"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={profileData.bio}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, bio: text }))}
                  placeholder="Tell us about yourself"
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Hourly Rate (NPR)</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.hourlyRate}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, hourlyRate: text }))}
                  placeholder="e.g., 500"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Company Name</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.companyName || profileData.fullName}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, companyName: text, fullName: text }))}
                  placeholder="Enter company name"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Person</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.contactPerson}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, contactPerson: text }))}
                  placeholder="Enter contact person name"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profileData.phoneNumber}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, phoneNumber: text }))}
              placeholder="Enter phone number"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              editable={false}
            />
            <Text style={styles.hint}>Phone number cannot be changed</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={profileData.email}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
              placeholder="Enter email"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={false}
            />
            <Text style={styles.hint}>Email cannot be changed</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area</Text>
            <TextInput
              style={styles.input}
              value={profileData.area}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, area: text }))}
              placeholder="e.g., Thamel"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>District</Text>
            <TextInput
              style={styles.input}
              value={profileData.district}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, district: text }))}
              placeholder="e.g., Kathmandu"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    paddingHorizontal: 8,
  },
  saveButtonDisabled: {
    color: '#94a3b8',
  },
  content: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  photoContainer: {
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoHint: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 12,
  },
  form: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputGroup: {
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
