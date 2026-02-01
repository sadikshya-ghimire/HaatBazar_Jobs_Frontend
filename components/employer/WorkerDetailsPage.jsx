import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image as RNImage,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_CONFIG } from '../config/api.config';

export default function WorkerDetailsPage({ worker, onBack, onHire }) {
  if (!worker) return null;

  const handleHire = () => {
    if (onHire) {
      onHire(worker);
    }
  };

  const renderSkillBadge = (skill) => (
    <View key={skill} style={styles.skillBadge}>
      <Text style={styles.skillText}>{skill}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Worker Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {worker.workerProfile?.profilePhoto ? (
              <RNImage 
                source={{ uri: `${API_CONFIG.BASE_URL}${worker.workerProfile.profilePhoto}` }} 
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={60} color="#94a3b8" />
              </View>
            )}
            {worker.workerProfile?.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
            )}
          </View>

          <Text style={styles.workerName}>{worker.workerName}</Text>
          <Text style={styles.jobTitle}>{worker.title}</Text>

          {/* Rating and Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.ratingBox}>
                <Ionicons name="star" size={20} color="#f59e0b" />
                <Text style={styles.ratingValue}>
                  {worker.workerProfile?.rating?.toFixed(1) || '0.0'}
                </Text>
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {worker.workerProfile?.completedJobs || 0}
              </Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {worker.workerProfile?.experience || 0}
              </Text>
              <Text style={styles.statLabel}>Years Exp.</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color="#1e293b" />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <Text style={styles.description}>{worker.description}</Text>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="construct" size={20} color="#1e293b" />
            <Text style={styles.sectionTitle}>Skills</Text>
          </View>
          <View style={styles.skillsContainer}>
            {worker.skills.map(renderSkillBadge)}
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#1e293b" />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Area:</Text>
              <Text style={styles.locationValue}>{worker.area}</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>District:</Text>
              <Text style={styles.locationValue}>{worker.district}</Text>
            </View>
          </View>
        </View>

        {/* Rate Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cash" size={20} color="#1e293b" />
            <Text style={styles.sectionTitle}>Rate</Text>
          </View>
          <View style={styles.rateCard}>
            <Text style={styles.rateAmount}>NPR {worker.rate}</Text>
            <Text style={styles.rateType}>per {worker.rateType}</Text>
          </View>
        </View>

        {/* Availability Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color="#1e293b" />
            <Text style={styles.sectionTitle}>Availability</Text>
          </View>
          {typeof worker.availability === 'string' ? (
            // Simple availability (text)
            <View style={styles.availabilityCard}>
              <View style={styles.availableDot} />
              <Text style={styles.availabilityText}>{worker.availability}</Text>
            </View>
          ) : (
            // Detailed availability (day-wise)
            <View style={styles.detailedAvailabilityContainer}>
              {Object.entries(worker.availability).map(([day, schedule]) => {
                if (!schedule.available) return null;
                return (
                  <View key={day} style={styles.availabilityDayCard}>
                    <View style={styles.availabilityDayHeader}>
                      <View style={styles.availableDot} />
                      <Text style={styles.availabilityDayName}>{day}</Text>
                    </View>
                    {schedule.from && schedule.to && (
                      <Text style={styles.availabilityTime}>
                        {schedule.from} - {schedule.to}
                      </Text>
                    )}
                  </View>
                );
              })}
              {Object.values(worker.availability).every(s => !s.available) && (
                <View style={styles.availabilityCard}>
                  <Ionicons name="alert-circle" size={20} color="#f59e0b" />
                  <Text style={styles.availabilityText}>No availability specified</Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Hire Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.hireButton} onPress={handleHire}>
          <Ionicons name="briefcase" size={20} color="#fff" />
          <Text style={styles.hireButtonText}>Hire Worker</Text>
        </TouchableOpacity>
      </View>

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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
  },
  workerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  ratingValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  skillText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  locationValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  rateCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  rateAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  rateType: {
    fontSize: 14,
    color: '#059669',
  },
  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  availableDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
  },
  availabilityText: {
    fontSize: 15,
    color: '#059669',
    fontWeight: '500',
    flex: 1,
  },
  detailedAvailabilityContainer: {
    gap: 12,
  },
  availabilityDayCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  availabilityDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  availabilityDayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  availabilityTime: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 24,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  hireButton: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  hireButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
