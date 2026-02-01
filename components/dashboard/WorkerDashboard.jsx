import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image as RNImage,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { jobOfferService } from '../services/jobOfferService';
import { profileService } from '../services/profileService';
import { bookingService } from '../services/bookingService';
import { API_CONFIG } from '../config/api.config';

export default function WorkerDashboard({ onLogout, userName = 'Worker' }) {
  const [selectedTab, setSelectedTab] = useState('home');
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showRateTypeModal, setShowRateTypeModal] = useState(false);
  const [availabilityMode, setAvailabilityMode] = useState('simple'); // 'simple' or 'detailed'
  const [customAlert, setCustomAlert] = useState({ visible: false, type: 'success', title: '', message: '' });
  const [isVerified, setIsVerified] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    skills: [],
    area: '',
    district: '',
    rate: '',
    rateType: 'Daily',
    availability: '',
    detailedAvailability: {
      Monday: { available: false, from: '', to: '' },
      Tuesday: { available: false, from: '', to: '' },
      Wednesday: { available: false, from: '', to: '' },
      Thursday: { available: false, from: '', to: '' },
      Friday: { available: false, from: '', to: '' },
      Saturday: { available: false, from: '', to: '' },
      Sunday: { available: false, from: '', to: '' },
    },
  });

  const skillOptions = [
    'Plumber', 'Electrician', 'Carpenter', 'Tailor',
    'Tutor', 'Painter', 'Mechanic', 'Cleaner',
    'Gardener', 'Driver', 'Mason', 'Welder',
    'Cook', 'Security Guard', 'Babysitter'
  ];

  useEffect(() => {
    checkVerificationStatus();
    fetchProfileData();
    fetchAvailableJobs();
    fetchMyJobs();
    fetchBookingRequests();
  }, []);

  const fetchProfileData = async () => {
    const firebaseUid = auth.currentUser?.uid;
    if (firebaseUid) {
      const result = await profileService.getWorkerProfile(firebaseUid);
      if (result.success && result.data) {
        // Construct full URL for profile photo if it exists
        const data = { ...result.data };
        if (data.profilePhoto && !data.profilePhoto.startsWith('http')) {
          data.profilePhoto = `${API_CONFIG.BASE_URL}${data.profilePhoto}`;
        }
        setProfileData(data);
      }
    }
  };

  const checkVerificationStatus = async () => {
    const firebaseUid = auth.currentUser?.uid;
    if (firebaseUid) {
      const result = await profileService.checkWorkerVerification(firebaseUid);
      setIsVerified(result.isVerified);
      setProfileExists(result.profileExists);
    }
  };

  const fetchAvailableJobs = async () => {
    try {
      const result = await jobOfferService.getAllActiveEmployerJobOffers();
      if (result.success && result.data) {
        setAvailableJobs(result.data);
      }
    } catch (error) {
      console.error('Error fetching available jobs:', error);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const firebaseUid = auth.currentUser?.uid;
      if (firebaseUid) {
        const result = await jobOfferService.getWorkerJobOffers(firebaseUid);
        if (result.success && result.data) {
          setMyJobs(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching my jobs:', error);
    }
  };

  const fetchBookingRequests = async () => {
    try {
      const firebaseUid = auth.currentUser?.uid;
      if (firebaseUid) {
        const result = await bookingService.getWorkerBookings(firebaseUid);
        if (result.success && result.data) {
          setBookingRequests(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching booking requests:', error);
    }
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const status = action === 'accept' ? 'accepted' : 'rejected';
      const result = await bookingService.updateBookingStatus(bookingId, status);
      
      if (result.success) {
        showAlert('success', action === 'accept' ? 'Booking Accepted!' : 'Booking Rejected', 
          action === 'accept' ? 'You can now contact the employer and start the work.' : 'The booking request has been declined.');
        // Refresh booking requests
        fetchBookingRequests();
      } else {
        showAlert('error', 'Error', result.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      showAlert('error', 'Error', 'An error occurred while updating the booking');
    }
  };

  const showAlert = (type, title, message) => {
    setCustomAlert({ visible: true, type, title, message });
  };

  const hideAlert = () => {
    setCustomAlert({ visible: false, type: '', title: '', message: '' });
  };

  const handleActionWithVerification = (action) => {
    if (!profileExists || !isVerified) {
      showAlert('warning', 'Account Under Review', 'Your account is currently under review by our admin team. You will be able to access all features once your profile is verified.');
      return false;
    }
    action();
    return true;
  };

  const toggleSkill = (skill) => {
    if (serviceForm.skills.includes(skill)) {
      setServiceForm({
        ...serviceForm,
        skills: serviceForm.skills.filter(s => s !== skill)
      });
    } else {
      setServiceForm({
        ...serviceForm,
        skills: [...serviceForm.skills, skill]
      });
    }
  };

  const updateDayAvailability = (day, field, value) => {
    setServiceForm({
      ...serviceForm,
      detailedAvailability: {
        ...serviceForm.detailedAvailability,
        [day]: {
          ...serviceForm.detailedAvailability[day],
          [field]: value,
        },
      },
    });
  };

  const handlePostService = async () => {
    // Validation
    if (!serviceForm.title || !serviceForm.description || serviceForm.skills.length === 0 || 
        !serviceForm.area || !serviceForm.district || !serviceForm.rate) {
      showAlert('error', 'Error', 'Please fill in all required fields');
      return;
    }

    // Validate availability
    if (availabilityMode === 'simple' && !serviceForm.availability) {
      showAlert('error', 'Error', 'Please specify your availability');
      return;
    }

    if (availabilityMode === 'detailed') {
      const hasAvailability = Object.values(serviceForm.detailedAvailability).some(day => day.available);
      if (!hasAvailability) {
        showAlert('error', 'Error', 'Please select at least one day of availability');
        return;
      }
    }

    try {
      setIsPosting(true);
      const firebaseUid = auth.currentUser?.uid;
      
      if (!firebaseUid) {
        showAlert('error', 'Error', 'User not authenticated');
        setIsPosting(false);
        return;
      }

      // Prepare availability data
      const availabilityData = availabilityMode === 'simple' 
        ? serviceForm.availability 
        : serviceForm.detailedAvailability;

      const result = await jobOfferService.createWorkerJobOffer(firebaseUid, {
        title: serviceForm.title,
        description: serviceForm.description,
        skills: serviceForm.skills,
        area: serviceForm.area,
        district: serviceForm.district,
        rate: serviceForm.rate,
        rateType: serviceForm.rateType,
        availability: availabilityData,
      });

      if (result.success) {
        showAlert('success', 'Success', 'Job offer posted successfully!');
        setShowServiceModal(false);
        setAvailabilityMode('simple');
        setServiceForm({
          title: '',
          description: '',
          skills: [],
          area: '',
          district: '',
          rate: '',
          rateType: 'Daily',
          availability: '',
          detailedAvailability: {
            Monday: { available: false, from: '', to: '' },
            Tuesday: { available: false, from: '', to: '' },
            Wednesday: { available: false, from: '', to: '' },
            Thursday: { available: false, from: '', to: '' },
            Friday: { available: false, from: '', to: '' },
            Saturday: { available: false, from: '', to: '' },
            Sunday: { available: false, from: '', to: '' },
          },
        });
        // Refresh the job list and profile data
        fetchMyJobs();
        fetchProfileData();
      } else {
        showAlert('error', 'Error', result.message || 'Failed to post job offer');
      }
    } catch (error) {
      console.error('Error posting job offer:', error);
      showAlert('error', 'Error', 'An error occurred while posting the job offer');
    } finally {
      setIsPosting(false);
    }
  };

  const stats = [
    { label: 'Total Jobs', value: (profileData?.totalJobs || 0).toString(), icon: 'briefcase', color: '#3b82f6' },
    { label: 'Completed', value: (profileData?.completedJobs || 0).toString(), icon: 'checkmark-circle', color: '#10b981' },
    { label: 'Success Rate', value: profileData?.totalJobs ? `${Math.round((profileData.completedJobs / profileData.totalJobs) * 100)}%` : '0%', icon: 'trophy', color: '#f59e0b' },
    { label: 'Rating', value: (profileData?.rating || 0).toFixed(1), icon: 'star', color: '#8b5cf6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <RNImage 
              source={require('../../assets/Icon.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleActionWithVerification(() => setShowServiceModal(true))}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Verification Status Banner */}
        {profileExists && !isVerified && (
          <View style={styles.verificationBanner}>
            <View style={styles.verificationBannerContent}>
              <Ionicons name="time-outline" size={24} color="#f59e0b" />
              <View style={styles.verificationBannerText}>
                <Text style={styles.verificationBannerTitle}>Account Under Review</Text>
                <Text style={styles.verificationBannerMessage}>
                  Your profile is being verified by our admin team. Full access will be granted once approved.
                </Text>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'home' && (
          <>
            {/* Stats Grid */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Stats</Text>
              <View style={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <View key={index} style={styles.statCard}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                      <Ionicons name={stat.icon} size={24} color={stat.color} />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Available Jobs */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Jobs</Text>
                <TouchableOpacity onPress={() => handleActionWithVerification(() => {
                  // See all logic
                })}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {availableJobs.map((job) => (
                <View key={job._id} style={styles.jobCard}>
                  {job.markAsUrgent && (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentText}>URGENT</Text>
                    </View>
                  )}
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobDescription} numberOfLines={2}>{job.description}</Text>
                  <View style={styles.jobInfo}>
                    <Ionicons name="construct-outline" size={16} color="#64748b" />
                    <Text style={styles.jobInfoText}>{job.requiredSkills.join(', ')}</Text>
                  </View>
                  <View style={styles.jobInfo}>
                    <Ionicons name="location-outline" size={16} color="#64748b" />
                    <Text style={styles.jobInfoText}>{job.area}, {job.district}</Text>
                  </View>
                  <View style={styles.jobFooter}>
                    <View style={styles.budgetContainer}>
                      <Ionicons name="cash-outline" size={16} color="#10b981" />
                      <Text style={styles.budgetText}>NPR {job.budget}/{job.paymentType}</Text>
                    </View>
                    <Text style={styles.postedText}>{new Date(job.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.applyButton}
                    onPress={() => handleActionWithVerification(() => {
                      // Apply logic
                    })}
                  >
                    <Text style={styles.applyButtonText}>Apply Now</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'myJobs' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Active Jobs</Text>
            
            {myJobs.map((job) => (
              <View key={job._id} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <View style={[styles.statusBadge, !job.isApproved && styles.pendingBadge]}>
                    <Text style={styles.statusText}>{job.isApproved ? 'Approved' : 'Pending Review'}</Text>
                  </View>
                </View>
                <Text style={styles.jobDescription} numberOfLines={2}>{job.description}</Text>
                <View style={styles.jobInfo}>
                  <Ionicons name="construct-outline" size={16} color="#64748b" />
                  <Text style={styles.jobInfoText}>{job.skills.join(', ')}</Text>
                </View>
                <View style={styles.jobInfo}>
                  <Ionicons name="location-outline" size={16} color="#64748b" />
                  <Text style={styles.jobInfoText}>{job.area}, {job.district}</Text>
                </View>
                <View style={styles.jobFooter}>
                  <View style={styles.budgetContainer}>
                    <Ionicons name="cash-outline" size={16} color="#10b981" />
                    <Text style={styles.budgetText}>NPR {job.rate}/{job.rateType}</Text>
                  </View>
                  <Text style={styles.postedText}>{new Date(job.createdAt).toLocaleDateString()}</Text>
                </View>
                {!job.isApproved && (
                  <View style={styles.pendingNotice}>
                    <Ionicons name="time-outline" size={16} color="#f59e0b" />
                    <Text style={styles.pendingNoticeText}>Waiting for admin approval</Text>
                  </View>
                )}
                <View style={styles.jobActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleActionWithVerification(() => {
                      // Edit logic
                    })}
                  >
                    <Ionicons name="create-outline" size={18} color="#64748b" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleActionWithVerification(() => {
                      // Delete logic
                    })}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'bookings' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Requests</Text>
            
            {bookingRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={64} color="#cbd5e1" />
                <Text style={styles.emptyStateTitle}>No Booking Requests</Text>
                <Text style={styles.emptyStateText}>
                  Employers' booking requests will appear here. You can accept or reject them.
                </Text>
              </View>
            ) : (
              bookingRequests.map((booking) => {
                const getStatusColor = () => {
                  switch(booking.status) {
                    case 'pending': return { bg: '#fef3c7', text: '#f59e0b', dot: '#f59e0b' };
                    case 'accepted': return { bg: '#dcfce7', text: '#16a34a', dot: '#16a34a' };
                    case 'in-progress': return { bg: '#dbeafe', text: '#2563eb', dot: '#2563eb' };
                    case 'completed': return { bg: '#d1fae5', text: '#10b981', dot: '#10b981' };
                    case 'rejected': return { bg: '#fee2e2', text: '#ef4444', dot: '#ef4444' };
                    default: return { bg: '#f1f5f9', text: '#64748b', dot: '#64748b' };
                  }
                };
                const statusColor = getStatusColor();
                
                return (
                  <View key={booking._id} style={styles.bookingCard}>
                    <View style={styles.bookingHeader}>
                      <View style={styles.bookingAvatar}>
                        {booking.employerProfile?.profilePhoto ? (
                          <RNImage 
                            source={{ uri: `${API_CONFIG.BASE_URL}${booking.employerProfile.profilePhoto}` }} 
                            style={styles.bookingAvatarImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons name="business" size={28} color="#1e293b" />
                        )}
                      </View>
                      <View style={styles.bookingInfo}>
                        <Text style={styles.bookingEmployerName}>{booking.employerName}</Text>
                        <Text style={styles.bookingJobTitle}>{booking.jobTitle}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor.dot }]} />
                        <Text style={[styles.statusText, { color: statusColor.text }]}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.bookingDescription} numberOfLines={2}>
                      {booking.jobDescription || 'No description provided'}
                    </Text>
                    
                    <View style={styles.bookingDetails}>
                      <View style={styles.bookingDetailRow}>
                        <Ionicons name="cash-outline" size={16} color="#10b981" />
                        <Text style={styles.bookingDetailText}>NPR {booking.agreedRate}/{booking.rateType}</Text>
                      </View>
                      <View style={styles.bookingDetailRow}>
                        <Ionicons name="card-outline" size={16} color="#3b82f6" />
                        <Text style={styles.bookingDetailText}>{booking.paymentMethod === 'cash' ? 'Cash' : 'eSewa'}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.bookingDetails}>
                      <View style={styles.bookingDetailRow}>
                        <Ionicons name="calendar-outline" size={16} color="#64748b" />
                        <Text style={styles.bookingDetailText}>{new Date(booking.startDate).toLocaleDateString()}</Text>
                      </View>
                      <View style={styles.bookingDetailRow}>
                        <Ionicons name="location-outline" size={16} color="#64748b" />
                        <Text style={styles.bookingDetailText}>{booking.location?.area}, {booking.location?.district}</Text>
                      </View>
                    </View>
                    
                    {booking.status === 'pending' && (
                      <View style={styles.bookingActions}>
                        <TouchableOpacity 
                          style={styles.rejectButton}
                          onPress={() => handleBookingAction(booking._id, 'reject')}
                        >
                          <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
                          <Text style={styles.rejectButtonText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.acceptButton}
                          onPress={() => handleBookingAction(booking._id, 'accept')}
                        >
                          <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                          <Text style={styles.acceptButtonText}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    
                    {booking.status !== 'pending' && (
                      <View style={styles.bookingStatusInfo}>
                        <Ionicons 
                          name={booking.status === 'accepted' || booking.status === 'in-progress' || booking.status === 'completed' ? 'checkmark-circle' : 'close-circle'} 
                          size={16} 
                          color={statusColor.text} 
                        />
                        <Text style={[styles.bookingStatusText, { color: statusColor.text }]}>
                          {booking.status === 'accepted' ? 'You accepted this booking' :
                           booking.status === 'rejected' ? 'You rejected this booking' :
                           booking.status === 'in-progress' ? 'Work in progress' :
                           booking.status === 'completed' ? 'Work completed' : ''}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

        {selectedTab === 'profile' && (
          <View style={styles.section}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                {profileData?.profilePhoto ? (
                  <RNImage 
                    source={{ uri: profileData.profilePhoto }} 
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={48} color="#1e293b" />
                )}
              </View>
              <Text style={styles.profileName}>{userName}</Text>
              <Text style={styles.profileRole}>Professional Worker</Text>
              {isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>

            {profileData && (
              <View style={styles.profileInfoCard}>
                {profileData.skills && profileData.skills.length > 0 && (
                  <View style={styles.profileInfoRow}>
                    <Ionicons name="construct-outline" size={20} color="#64748b" />
                    <Text style={styles.profileInfoText}>{profileData.skills.join(', ')}</Text>
                  </View>
                )}
                {profileData.experience && (
                  <View style={styles.profileInfoRow}>
                    <Ionicons name="briefcase-outline" size={20} color="#64748b" />
                    <Text style={styles.profileInfoText}>Experience: {profileData.experience}</Text>
                  </View>
                )}
                {profileData.hourlyRate && (
                  <View style={styles.profileInfoRow}>
                    <Ionicons name="cash-outline" size={20} color="#64748b" />
                    <Text style={styles.profileInfoText}>NPR {profileData.hourlyRate}/hour</Text>
                  </View>
                )}
                <View style={styles.profileInfoRow}>
                  <Ionicons name="location-outline" size={20} color="#64748b" />
                  <Text style={styles.profileInfoText}>
                    {profileData.address ? `${profileData.address}, ` : ''}{profileData.city || ''}, {profileData.district || ''}
                  </Text>
                </View>
                {profileData.bio && (
                  <View style={styles.profileInfoRow}>
                    <Ionicons name="document-text-outline" size={20} color="#64748b" />
                    <Text style={styles.profileInfoText}>{profileData.bio}</Text>
                  </View>
                )}
              </View>
            )}

            <View style={styles.profileStats}>
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatValue}>{profileData?.completedJobs || 0}</Text>
                <Text style={styles.profileStatLabel}>Completed</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatValue}>{profileData?.totalJobs ? Math.round((profileData.completedJobs / profileData.totalJobs) * 100) : 0}%</Text>
                <Text style={styles.profileStatLabel}>Success Rate</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatValue}>{profileData?.rating?.toFixed(1) || '0.0'}</Text>
                <Text style={styles.profileStatLabel}>Rating</Text>
              </View>
            </View>

            <View style={styles.menuList}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleActionWithVerification(() => {
                  // Edit profile logic - to be implemented
                  showAlert('info', 'Coming Soon', 'Profile editing feature will be available soon!');
                })}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name="create-outline" size={20} color="#64748b" />
                  <Text style={styles.menuItemText}>Edit Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleActionWithVerification(() => {
                  // Settings logic
                  showAlert('info', 'Coming Soon', 'Settings feature will be available soon!');
                })}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name="settings-outline" size={20} color="#64748b" />
                  <Text style={styles.menuItemText}>Settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="help-circle-outline" size={20} color="#64748b" />
                  <Text style={styles.menuItemText}>Help & Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={onLogout}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                  <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setSelectedTab('home')}
        >
          <Ionicons 
            name={selectedTab === 'home' ? 'home' : 'home-outline'} 
            size={24} 
            color={selectedTab === 'home' ? '#1e293b' : '#94a3b8'} 
          />
          <Text style={[styles.navText, selectedTab === 'home' && styles.navTextActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setSelectedTab('myJobs')}
        >
          <Ionicons 
            name={selectedTab === 'myJobs' ? 'briefcase' : 'briefcase-outline'} 
            size={24} 
            color={selectedTab === 'myJobs' ? '#1e293b' : '#94a3b8'} 
          />
          <Text style={[styles.navText, selectedTab === 'myJobs' && styles.navTextActive]}>
            My Jobs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setSelectedTab('bookings')}
        >
          <View style={styles.navIconContainer}>
            <Ionicons 
              name={selectedTab === 'bookings' ? 'calendar' : 'calendar-outline'} 
              size={24} 
              color={selectedTab === 'bookings' ? '#1e293b' : '#94a3b8'} 
            />
            {bookingRequests.filter(b => b.status === 'pending').length > 0 && (
              <View style={styles.messageBadge}>
                <Text style={styles.messageBadgeText}>
                  {bookingRequests.filter(b => b.status === 'pending').length}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.navText, selectedTab === 'bookings' && styles.navTextActive]}>
            Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setSelectedTab('messages')}
        >
          <View style={styles.navIconContainer}>
            <Ionicons 
              name={selectedTab === 'messages' ? 'chatbubbles' : 'chatbubbles-outline'} 
              size={24} 
              color={selectedTab === 'messages' ? '#1e293b' : '#94a3b8'} 
            />
            <View style={styles.messageBadge}>
              <Text style={styles.messageBadgeText}>3</Text>
            </View>
          </View>
          <Text style={[styles.navText, selectedTab === 'messages' && styles.navTextActive]}>
            Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => setSelectedTab('profile')}
        >
          <Ionicons 
            name={selectedTab === 'profile' ? 'person' : 'person-outline'} 
            size={24} 
            color={selectedTab === 'profile' ? '#1e293b' : '#94a3b8'} 
          />
          <Text style={[styles.navText, selectedTab === 'profile' && styles.navTextActive]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Service Posting Modal */}
      <Modal
        visible={showServiceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowServiceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post Your Job Offer</Text>
              <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>Create a job offer to advertise your services to employers.</Text>

              {/* Job Title */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Job Title *</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g., Professional Plumbing Services"
                  value={serviceForm.title}
                  onChangeText={(text) => setServiceForm({...serviceForm, title: text})}
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.inputField, styles.textAreaField]}
                  placeholder="Describe your services and experience..."
                  value={serviceForm.description}
                  onChangeText={(text) => setServiceForm({...serviceForm, description: text})}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Your Skills */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Your Skills *</Text>
                <View style={styles.skillsGrid}>
                  {skillOptions.map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      style={[
                        styles.skillButton,
                        serviceForm.skills.includes(skill) && styles.skillButtonActive
                      ]}
                      onPress={() => toggleSkill(skill)}
                    >
                      <Text style={[
                        styles.skillButtonText,
                        serviceForm.skills.includes(skill) && styles.skillButtonTextActive
                      ]}>
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Location */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  <Ionicons name="location-outline" size={16} color="#64748b" /> Location
                </Text>
                <View style={styles.locationRow}>
                  <TextInput
                    style={[styles.inputField, styles.locationInput]}
                    placeholder="Area"
                    value={serviceForm.area}
                    onChangeText={(text) => setServiceForm({...serviceForm, area: text})}
                  />
                  <TextInput
                    style={[styles.inputField, styles.locationInput]}
                    placeholder="District"
                    value={serviceForm.district}
                    onChangeText={(text) => setServiceForm({...serviceForm, district: text})}
                  />
                </View>
              </View>

              {/* Rate and Rate Type */}
              <View style={[styles.formGroup, { zIndex: 100 }]}>
                <View style={styles.budgetRow}>
                  <View style={styles.budgetInputContainer}>
                    <Text style={styles.label}>
                      <Ionicons name="cash-outline" size={16} color="#64748b" /> Rate (Rs.)
                    </Text>
                    <TextInput
                      style={styles.inputField}
                      placeholder="e.g., 1500"
                      value={serviceForm.rate}
                      onChangeText={(text) => setServiceForm({...serviceForm, rate: text})}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.paymentTypeContainer}>
                    <Text style={styles.label}>Rate Type</Text>
                    <TouchableOpacity 
                      style={styles.paymentTypeButton}
                      onPress={() => setShowRateTypeModal(!showRateTypeModal)}
                    >
                      <Text style={styles.paymentTypeText}>{serviceForm.rateType}</Text>
                      <Ionicons name={showRateTypeModal ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
                    </TouchableOpacity>
                    {showRateTypeModal && (
                      <View style={styles.inlineDropdown}>
                        {['Daily', 'Weekly', 'Monthly'].map((type, index) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.inlineDropdownItem,
                              index === 2 && styles.inlineDropdownItemLast,
                            ]}
                            onPress={() => {
                              setServiceForm({...serviceForm, rateType: type});
                              setShowRateTypeModal(false);
                            }}
                          >
                            <Text style={styles.inlineDropdownText}>{type}</Text>
                            {serviceForm.rateType === type && (
                              <Ionicons name="checkmark" size={20} color="#10b981" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Availability Mode Toggle */}
              <View style={[styles.formGroup, { zIndex: 1 }]}>
                <Text style={styles.label}>
                  <Ionicons name="time-outline" size={16} color="#64748b" /> Availability
                </Text>
                <View style={styles.availabilityModeToggle}>
                  <TouchableOpacity
                    style={[styles.modeButton, availabilityMode === 'simple' && styles.modeButtonActive]}
                    onPress={() => setAvailabilityMode('simple')}
                  >
                    <Text style={[styles.modeButtonText, availabilityMode === 'simple' && styles.modeButtonTextActive]}>
                      Simple
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modeButton, availabilityMode === 'detailed' && styles.modeButtonActive]}
                    onPress={() => setAvailabilityMode('detailed')}
                  >
                    <Text style={[styles.modeButtonText, availabilityMode === 'detailed' && styles.modeButtonTextActive]}>
                      Detailed
                    </Text>
                  </TouchableOpacity>
                </View>

                {availabilityMode === 'simple' ? (
                  <TextInput
                    style={styles.inputField}
                    placeholder="e.g., Monday to Friday, 8 AM - 5 PM"
                    value={serviceForm.availability}
                    onChangeText={(text) => setServiceForm({...serviceForm, availability: text})}
                  />
                ) : (
                  <View style={styles.detailedAvailability}>
                    {Object.keys(serviceForm.detailedAvailability).map((day) => (
                      <View key={day} style={styles.dayRow}>
                        <TouchableOpacity
                          style={styles.dayCheckbox}
                          onPress={() => updateDayAvailability(day, 'available', !serviceForm.detailedAvailability[day].available)}
                        >
                          <View style={[styles.checkbox, serviceForm.detailedAvailability[day].available && styles.checkboxActive]}>
                            {serviceForm.detailedAvailability[day].available && (
                              <Ionicons name="checkmark" size={16} color="#fff" />
                            )}
                          </View>
                          <Text style={styles.dayLabel}>{day}</Text>
                        </TouchableOpacity>
                        {serviceForm.detailedAvailability[day].available && (
                          <View style={styles.timeInputs}>
                            <TextInput
                              style={styles.timeInput}
                              placeholder="From"
                              value={serviceForm.detailedAvailability[day].from}
                              onChangeText={(text) => updateDayAvailability(day, 'from', text)}
                            />
                            <Text style={styles.timeSeparator}>-</Text>
                            <TextInput
                              style={styles.timeInput}
                              placeholder="To"
                              value={serviceForm.detailedAvailability[day].to}
                              onChangeText={(text) => updateDayAvailability(day, 'to', text)}
                            />
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.postJobButton, isPosting && styles.postJobButtonDisabled]}
                onPress={handlePostService}
                disabled={isPosting}
              >
                <Text style={styles.postJobButtonText}>
                  {isPosting ? 'Posting...' : 'Post Job Offer'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowServiceModal(false)}
                disabled={isPosting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Alert Modal */}
      {customAlert.visible && customAlert.type && (
        <Modal
          visible={customAlert.visible}
          animationType="fade"
          transparent={true}
          onRequestClose={hideAlert}
        >
          <View style={styles.alertOverlay}>
            <View style={styles.alertContainer}>
              <View style={[
                styles.alertIconContainer, 
                customAlert.type === 'success' ? styles.alertSuccessBg : 
                customAlert.type === 'warning' ? styles.alertWarningBg : 
                styles.alertErrorBg
              ]}>
                <Ionicons 
                  name={
                    customAlert.type === 'success' ? 'checkmark-circle' : 
                    customAlert.type === 'warning' ? 'alert-circle' : 
                    'close-circle'
                  } 
                  size={48} 
                  color={
                    customAlert.type === 'success' ? '#10b981' : 
                    customAlert.type === 'warning' ? '#f59e0b' : 
                    '#ef4444'
                  }
                />
              </View>
              <Text style={styles.alertTitle}>
                {customAlert.title}{customAlert.type === 'success' ? ' 🎉' : ''}
              </Text>
              <Text style={styles.alertMessage}>{customAlert.message}</Text>
              <TouchableOpacity style={styles.alertButton} onPress={hideAlert}>
                <Text style={styles.alertButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    backgroundColor: '#1e293b',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoImage: {
    width: 32,
    height: 32,
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  verificationBanner: {
    backgroundColor: '#fff3cd',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
    overflow: 'hidden',
  },
  verificationBannerContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  verificationBannerText: {
    flex: 1,
  },
  verificationBannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  verificationBannerMessage: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  urgentBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  urgentText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16a34a',
  },
  pendingNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  pendingNoticeText: {
    fontSize: 13,
    color: '#f59e0b',
    fontWeight: '500',
  },
  jobDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  jobActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  editButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  jobInfoText: {
    fontSize: 14,
    color: '#64748b',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  budgetText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  postedText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  detailRight: {
    alignItems: 'flex-end',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 12,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  profileInfoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  profileInfoText: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  profileStats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  profileStatDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  menuList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ef4444',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIconContainer: {
    position: 'relative',
  },
  messageBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ef4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },
  navText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  navTextActive: {
    color: '#1e293b',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 500,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
    overflow: 'visible',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  textAreaField: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: '47%',
    alignItems: 'center',
  },
  skillButtonActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  skillButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  skillButtonTextActive: {
    color: '#fff',
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  locationInput: {
    flex: 1,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetInputContainer: {
    flex: 1,
  },
  paymentTypeContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 100,
  },
  paymentTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  paymentTypeText: {
    fontSize: 15,
    color: '#1e293b',
  },
  inlineDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 10000,
  },
  inlineDropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  inlineDropdownItemLast: {
    borderBottomWidth: 0,
  },
  inlineDropdownText: {
    fontSize: 15,
    color: '#1e293b',
  },
  availabilityModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: '#1e293b',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  detailedAvailability: {
    gap: 12,
  },
  dayRow: {
    gap: 8,
  },
  dayCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
    minWidth: 90,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginLeft: 36,
  },
  timeInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#1e293b',
  },
  timeSeparator: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  postJobButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  postJobButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  postJobButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  pickerOptions: {
    paddingVertical: 8,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pickerOptionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 40,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  alertIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  alertIconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    position: 'absolute',
  },
  alertIconInnerError: {
    backgroundColor: '#ef4444',
  },
  alertSuccessBg: {
    backgroundColor: '#d1fae5',
  },
  alertErrorBg: {
    backgroundColor: '#fee2e2',
  },
  alertWarningBg: {
    backgroundColor: '#fef3c7',
  },
  alertTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  alertButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 50,
    width: '100%',
    shadowColor: '#5b8fa3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  alertButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  // Booking Card Styles
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  bookingAvatarImage: {
    width: '100%',
    height: '100%',
  },
  bookingInfo: {
    flex: 1,
  },
  bookingEmployerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  bookingJobTitle: {
    fontSize: 14,
    color: '#64748b',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  bookingDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  bookingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  bookingDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingDetailText: {
    fontSize: 13,
    color: '#64748b',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 12,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
  bookingStatusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  bookingStatusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
});
