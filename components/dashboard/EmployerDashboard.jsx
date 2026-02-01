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
import WorkerDetailsPage from '../employer/WorkerDetailsPage';
import ContactWorkerPage from '../employer/ContactWorkerPage';
import BookingFormPage from '../employer/BookingFormPage';

export default function EmployerDashboard({ onLogout, userName = 'Employer' }) {
  const [selectedTab, setSelectedTab] = useState('home');
  const [showJobPostModal, setShowJobPostModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [customAlert, setCustomAlert] = useState({ visible: false, type: 'success', title: '', message: '' });
  const [showPaymentTypeModal, setShowPaymentTypeModal] = useState(false);
  const [durationMode, setDurationMode] = useState('simple'); // 'simple' or 'detailed'
  const [isVerified, setIsVerified] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [hiredWorkers, setHiredWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedHiredWorker, setSelectedHiredWorker] = useState(null);
  const [showWorkerDetails, setShowWorkerDetails] = useState(false);
  const [showContactWorker, setShowContactWorker] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    requiredSkills: [],
    area: '',
    district: '',
    budget: '',
    paymentType: 'Daily',
    duration: '',
    detailedDuration: {
      Monday: { needed: false, from: '', to: '' },
      Tuesday: { needed: false, from: '', to: '' },
      Wednesday: { needed: false, from: '', to: '' },
      Thursday: { needed: false, from: '', to: '' },
      Friday: { needed: false, from: '', to: '' },
      Saturday: { needed: false, from: '', to: '' },
      Sunday: { needed: false, from: '', to: '' },
    },
    markAsUrgent: false,
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
    fetchAvailableWorkers();
    fetchPostedJobs();
    fetchHiredWorkers();
  }, []);

  // Refresh available workers when switching to home tab
  useEffect(() => {
    if (selectedTab === 'home') {
      fetchAvailableWorkers();
    }
  }, [selectedTab]);

  const fetchProfileData = async () => {
    const firebaseUid = auth.currentUser?.uid;
    if (firebaseUid) {
      const result = await profileService.getEmployerProfile(firebaseUid);
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
      const result = await profileService.checkEmployerVerification(firebaseUid);
      setIsVerified(result.isVerified);
      setProfileExists(result.profileExists);
    }
  };

  const fetchAvailableWorkers = async () => {
    try {
      const result = await jobOfferService.getAllActiveWorkerJobOffers();
      if (result.success && result.data) {
        // Filter only active job offers
        const activeWorkers = result.data.filter(worker => worker.isActive !== false);
        setAvailableWorkers(activeWorkers);
      }
    } catch (error) {
      console.error('Error fetching available workers:', error);
    }
  };

  const fetchPostedJobs = async () => {
    try {
      const firebaseUid = auth.currentUser?.uid;
      if (firebaseUid) {
        const result = await jobOfferService.getEmployerJobOffers(firebaseUid);
        if (result.success && result.data) {
          setPostedJobs(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching posted jobs:', error);
    }
  };

  const fetchHiredWorkers = async () => {
    try {
      const firebaseUid = auth.currentUser?.uid;
      if (firebaseUid) {
        // Fetch all bookings (pending, accepted, in-progress, completed)
        const result = await bookingService.getEmployerBookings(firebaseUid);
        if (result.success && result.data) {
          setHiredWorkers(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching hired workers:', error);
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

  const handleDirectHire = (worker) => {
    setSelectedWorker(worker);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      const firebaseUid = auth.currentUser?.uid;
      if (!firebaseUid || !selectedWorker) return;

      const bookingPayload = {
        workerFirebaseUid: selectedWorker.firebaseUid,
        workerJobOfferId: selectedWorker._id,
        jobTitle: bookingData.jobTitle,
        jobDescription: bookingData.jobDescription,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        workDuration: bookingData.workDuration,
        agreedRate: bookingData.agreedRate,
        rateType: bookingData.rateType,
        totalAmount: bookingData.totalAmount,
        location: {
          area: bookingData.area,
          district: bookingData.district,
        },
        notes: bookingData.notes,
        paymentMethod: bookingData.paymentMethod,
      };

      const result = await bookingService.createBooking(firebaseUid, bookingPayload);

      if (result.success) {
        setShowBookingForm(false);
        
        // Remove worker from available workers list
        setAvailableWorkers(availableWorkers.filter(w => w._id !== selectedWorker._id));
        
        // Refresh hired workers list
        await fetchHiredWorkers();
        
        showAlert('success', 'Booking Sent!', `Your booking request has been sent to ${selectedWorker.workerName}. They will be notified and can accept or reject the booking.`);
        setSelectedWorker(null);
      } else {
        showAlert('error', 'Error', result.message || 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      showAlert('error', 'Error', 'An error occurred while creating the booking.');
    }
  };

  const confirmHire = () => {
    // This function is no longer used - replaced by booking form
    hideAlert();
  };

  const toggleSkill = (skill) => {
    if (jobForm.requiredSkills.includes(skill)) {
      setJobForm({
        ...jobForm,
        requiredSkills: jobForm.requiredSkills.filter(s => s !== skill)
      });
    } else {
      setJobForm({
        ...jobForm,
        requiredSkills: [...jobForm.requiredSkills, skill]
      });
    }
  };

  const updateDayDuration = (day, field, value) => {
    setJobForm({
      ...jobForm,
      detailedDuration: {
        ...jobForm.detailedDuration,
        [day]: {
          ...jobForm.detailedDuration[day],
          [field]: value,
        },
      },
    });
  };

  const handlePostJob = async () => {
    // Validation
    if (!jobForm.title || !jobForm.description || jobForm.requiredSkills.length === 0 || 
        !jobForm.area || !jobForm.district || !jobForm.budget) {
      showAlert('error', 'Error', 'Please fill in all required fields');
      return;
    }

    // Validate duration
    if (durationMode === 'simple' && !jobForm.duration) {
      showAlert('error', 'Error', 'Please specify the job duration');
      return;
    }

    if (durationMode === 'detailed') {
      const hasDuration = Object.values(jobForm.detailedDuration).some(day => day.needed);
      if (!hasDuration) {
        showAlert('error', 'Error', 'Please select at least one day when worker is needed');
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

      // Prepare duration data
      const durationData = durationMode === 'simple' 
        ? jobForm.duration 
        : jobForm.detailedDuration;

      const result = await jobOfferService.createEmployerJobOffer(firebaseUid, {
        ...jobForm,
        duration: durationData,
      });

      if (result.success) {
        showAlert('success', 'Success', 'Job posted successfully!');
        setShowJobPostModal(false);
        setDurationMode('simple');
        setJobForm({
          title: '',
          description: '',
          requiredSkills: [],
          area: '',
          district: '',
          budget: '',
          paymentType: 'Daily',
          duration: '',
          detailedDuration: {
            Monday: { needed: false, from: '', to: '' },
            Tuesday: { needed: false, from: '', to: '' },
            Wednesday: { needed: false, from: '', to: '' },
            Thursday: { needed: false, from: '', to: '' },
            Friday: { needed: false, from: '', to: '' },
            Saturday: { needed: false, from: '', to: '' },
            Sunday: { needed: false, from: '', to: '' },
          },
          markAsUrgent: false,
        });
        // Refresh the posted jobs list and profile data
        fetchPostedJobs();
        fetchProfileData();
      } else {
        showAlert('error', 'Error', result.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      showAlert('error', 'Error', 'An error occurred while posting the job');
    } finally {
      setIsPosting(false);
    }
  };

  const stats = [
    { label: 'Posted Jobs', value: postedJobs.length.toString(), icon: 'briefcase', color: '#3b82f6' },
    { label: 'Available Workers', value: availableWorkers.length.toString(), icon: 'people', color: '#10b981' },
    { label: 'Approved Jobs', value: postedJobs.filter(j => j.isApproved).length.toString(), icon: 'checkmark-circle', color: '#f59e0b' },
    { label: 'Pending Jobs', value: postedJobs.filter(j => !j.isApproved).length.toString(), icon: 'time', color: '#8b5cf6' },
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
          <TouchableOpacity style={styles.iconButton} onPress={() => handleActionWithVerification(() => setShowJobPostModal(true))}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
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

            {/* Available Workers */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Available Workers</Text>
                <TouchableOpacity onPress={() => handleActionWithVerification(() => {
                  // See all logic
                })}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {availableWorkers.map((worker) => (
                <View key={worker._id} style={styles.workerCard}>
                  <View style={styles.workerHeader}>
                    <View style={styles.workerAvatar}>
                      {worker.workerProfile?.profilePhoto ? (
                        <RNImage 
                          source={{ uri: `${API_CONFIG.BASE_URL}${worker.workerProfile.profilePhoto}` }} 
                          style={styles.workerAvatarImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="person" size={32} color="#1e293b" />
                      )}
                    </View>
                    <View style={styles.workerInfo}>
                      <Text style={styles.workerName}>{worker.workerName}</Text>
                      <Text style={styles.workerProfession}>{worker.skills.join(', ')}</Text>
                      {worker.workerProfile?.rating > 0 && (
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={14} color="#f59e0b" />
                          <Text style={styles.ratingText}>{worker.workerProfile.rating.toFixed(1)}</Text>
                          {worker.workerProfile.completedJobs > 0 && (
                            <Text style={styles.experienceText}>• {worker.workerProfile.completedJobs} jobs</Text>
                          )}
                        </View>
                      )}
                    </View>
                    <View style={styles.availableBadge}>
                      <View style={styles.availableDot} />
                      <Text style={styles.availableText}>Available</Text>
                    </View>
                  </View>
                  <Text style={styles.jobTitle}>{worker.title}</Text>
                  <Text style={styles.workerDescription} numberOfLines={2}>{worker.description}</Text>
                  <View style={styles.workerDetails}>
                    <View style={styles.workerDetailItem}>
                      <Ionicons name="location-outline" size={16} color="#64748b" />
                      <Text style={styles.workerDetailText}>{worker.area}, {worker.district}</Text>
                    </View>
                    <View style={styles.workerDetailItem}>
                      <Ionicons name="cash-outline" size={16} color="#10b981" />
                      <Text style={styles.workerRateText}>NPR {worker.rate}/{worker.rateType}</Text>
                    </View>
                  </View>
                  <View style={styles.workerActions}>
                    <TouchableOpacity 
                      style={styles.viewProfileButton}
                      onPress={() => handleActionWithVerification(() => {
                        setSelectedWorker(worker);
                        setShowWorkerDetails(true);
                      })}
                    >
                      <Text style={styles.viewProfileText}>View Details</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.hireButton}
                      onPress={() => handleActionWithVerification(() => handleDirectHire(worker))}
                    >
                      <Text style={styles.hireButtonText}>Hire</Text>
                      <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {selectedTab === 'myJobs' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Posted Jobs</Text>
              <TouchableOpacity 
                style={styles.postJobButton}
                onPress={() => handleActionWithVerification(() => setShowJobPostModal(true))}
              >
                <Ionicons name="add-circle" size={20} color="#fff" />
                <Text style={styles.postJobText}>Post Job</Text>
              </TouchableOpacity>
            </View>
            
            {postedJobs.map((job) => (
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
                {job.isApproved && (
                  <View style={styles.applicantsContainer}>
                    <Ionicons name="people-outline" size={18} color="#3b82f6" />
                    <Text style={styles.applicantsText}>{job.applicants?.length || 0} Applicants</Text>
                  </View>
                )}
                {!job.isApproved && (
                  <View style={styles.pendingNotice}>
                    <Ionicons name="time-outline" size={16} color="#f59e0b" />
                    <Text style={styles.pendingNoticeText}>Waiting for admin approval</Text>
                  </View>
                )}
                <View style={styles.jobActions}>
                  <TouchableOpacity 
                    style={styles.viewApplicantsButton}
                    onPress={() => handleActionWithVerification(() => {
                      // View applicants logic
                    })}
                    disabled={!job.isApproved}
                  >
                    <Text style={[styles.viewApplicantsText, !job.isApproved && styles.disabledText]}>View Applicants</Text>
                  </TouchableOpacity>
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

        {selectedTab === 'hired' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hired Workers</Text>
            
            {hiredWorkers.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#cbd5e1" />
                <Text style={styles.emptyStateTitle}>No Bookings Yet</Text>
                <Text style={styles.emptyStateText}>
                  Your booking requests will appear here. Track their status and contact workers once they accept.
                </Text>
              </View>
            ) : (
              hiredWorkers.map((booking) => {
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
                  <View key={booking._id} style={styles.hiredCard}>
                    <View style={styles.hiredHeader}>
                      <View style={styles.hiredAvatar}>
                        {booking.workerProfile?.profilePhoto ? (
                          <RNImage 
                            source={{ uri: `${API_CONFIG.BASE_URL}${booking.workerProfile.profilePhoto}` }} 
                            style={styles.hiredAvatarImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons name="person" size={28} color="#1e293b" />
                        )}
                      </View>
                      <View style={styles.hiredInfo}>
                        <Text style={styles.hiredName}>{booking.workerName}</Text>
                        <Text style={styles.hiredProfession}>{booking.jobTitle}</Text>
                      </View>
                      <View style={[styles.workingBadge, { backgroundColor: statusColor.bg }]}>
                        <View style={[styles.workingDot, { backgroundColor: statusColor.dot }]} />
                        <Text style={[styles.workingText, { color: statusColor.text }]}>
                          {booking.status === 'accepted' ? 'Accepted' : 
                           booking.status === 'in-progress' ? 'Working' : 
                           booking.status === 'completed' ? 'Completed' : 
                           booking.status === 'rejected' ? 'Rejected' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.hiredJobInfo}>
                      <Text style={styles.hiredJobTitle}>{booking.jobDescription || 'No description'}</Text>
                    </View>
                    <View style={styles.hiredDetails}>
                      <View>
                        <Text style={styles.detailLabel}>Rate</Text>
                        <Text style={styles.detailValue}>NPR {booking.agreedRate}/{booking.rateType}</Text>
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>Payment</Text>
                        <Text style={styles.detailValue}>{booking.paymentMethod === 'cash' ? 'Cash' : 'eSewa'}</Text>
                      </View>
                      <View style={styles.detailRight}>
                        <Text style={styles.detailLabel}>Start Date</Text>
                        <Text style={styles.detailValue}>{new Date(booking.startDate).toLocaleDateString()}</Text>
                      </View>
                    </View>
                    
                    {booking.status === 'pending' && (
                      <View style={styles.pendingNotice}>
                        <Ionicons name="time-outline" size={16} color="#f59e0b" />
                        <Text style={styles.pendingNoticeText}>Waiting for worker to accept</Text>
                      </View>
                    )}
                    
                    <View style={styles.hiredActions}>
                      {booking.status === 'accepted' || booking.status === 'in-progress' || booking.status === 'completed' ? (
                        <TouchableOpacity 
                          style={styles.chatButton}
                          onPress={() => {
                            const workerObj = {
                              _id: booking.workerJobOfferId,
                              firebaseUid: booking.workerFirebaseUid,
                              workerName: booking.workerName,
                              workerProfile: booking.workerProfile,
                              title: booking.jobTitle,
                            };
                            setSelectedHiredWorker(workerObj);
                            setShowContactWorker(true);
                          }}
                        >
                          <Ionicons name="chatbubbles-outline" size={18} color="#fff" />
                          <Text style={styles.chatButtonText}>Contact</Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.disabledButton}>
                          <Ionicons name="chatbubbles-outline" size={18} color="#94a3b8" />
                          <Text style={styles.disabledButtonText}>Contact (Pending)</Text>
                        </View>
                      )}
                      <TouchableOpacity 
                        style={styles.viewDetailsButton}
                        onPress={() => {
                          const details = `Job: ${booking.jobTitle}\n\nDescription: ${booking.jobDescription || 'N/A'}\n\nRate: NPR ${booking.agreedRate}/${booking.rateType}\n\nPayment: ${booking.paymentMethod === 'cash' ? 'Cash on Delivery' : 'eSewa'}\n\nStart: ${new Date(booking.startDate).toLocaleDateString()}\n${booking.endDate ? `End: ${new Date(booking.endDate).toLocaleDateString()}` : ''}\n\nDuration: ${booking.workDuration || 'N/A'}\n\nLocation: ${booking.location?.area || ''}, ${booking.location?.district || ''}\n\nStatus: ${booking.status.toUpperCase()}`;
                          showAlert('info', 'Booking Details', details);
                        }}
                      >
                        <Text style={styles.viewDetailsText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
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
                  <Ionicons name="business" size={48} color="#1e293b" />
                )}
              </View>
              <Text style={styles.profileName}>{profileData?.fullName || userName}</Text>
              <Text style={styles.profileRole}>Employer</Text>
              {isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>

            {profileData && (
              <View style={styles.profileInfoCard}>
                <View style={styles.profileInfoRow}>
                  <Ionicons name="mail-outline" size={20} color="#64748b" />
                  <Text style={styles.profileInfoText}>{profileData.email || 'Not provided'}</Text>
                </View>
                <View style={styles.profileInfoRow}>
                  <Ionicons name="call-outline" size={20} color="#64748b" />
                  <Text style={styles.profileInfoText}>{profileData.phoneNumber || 'Not provided'}</Text>
                </View>
                {profileData.companyName && (
                  <View style={styles.profileInfoRow}>
                    <Ionicons name="business-outline" size={20} color="#64748b" />
                    <Text style={styles.profileInfoText}>{profileData.companyName}</Text>
                  </View>
                )}
                <View style={styles.profileInfoRow}>
                  <Ionicons name="location-outline" size={20} color="#64748b" />
                  <Text style={styles.profileInfoText}>
                    {profileData.address ? `${profileData.address}, ` : ''}{profileData.city || ''}, {profileData.district || ''}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.profileStats}>
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatValue}>{profileData?.totalJobsPosted || 0}</Text>
                <Text style={styles.profileStatLabel}>Posted Jobs</Text>
              </View>
              <View style={styles.profileStatDivider} />
              <View style={styles.profileStatItem}>
                <Text style={styles.profileStatValue}>{profileData?.activeJobs || 0}</Text>
                <Text style={styles.profileStatLabel}>Active Jobs</Text>
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
                  // Payment methods logic
                  showAlert('info', 'Coming Soon', 'Payment methods feature will be available soon!');
                })}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons name="card-outline" size={20} color="#64748b" />
                  <Text style={styles.menuItemText}>Payment Methods</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => handleActionWithVerification(() => {
                  // Settings logic
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
          onPress={() => setSelectedTab('hired')}
        >
          <Ionicons 
            name={selectedTab === 'hired' ? 'people' : 'people-outline'} 
            size={24} 
            color={selectedTab === 'hired' ? '#1e293b' : '#94a3b8'} 
          />
          <Text style={[styles.navText, selectedTab === 'hired' && styles.navTextActive]}>
            Hired
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
              <Text style={styles.messageBadgeText}>2</Text>
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

      {/* Job Posting Modal */}
      <Modal
        visible={showJobPostModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowJobPostModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post a Job</Text>
              <TouchableOpacity onPress={() => setShowJobPostModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>Post a job to find skilled workers for your needs.</Text>

              {/* Mark as Urgent Toggle */}
              <TouchableOpacity 
                style={styles.urgentToggle}
                onPress={() => setJobForm({...jobForm, markAsUrgent: !jobForm.markAsUrgent})}
              >
                <View style={styles.urgentToggleLeft}>
                  <Ionicons name="alert-circle-outline" size={24} color="#ef4444" />
                  <View style={styles.urgentToggleTextContainer}>
                    <Text style={styles.urgentToggleTitle}>Mark as Urgent</Text>
                    <Text style={styles.urgentToggleSubtitle}>Get faster responses from workers</Text>
                  </View>
                </View>
                <View style={[styles.toggleSwitch, jobForm.markAsUrgent && styles.toggleSwitchActive]}>
                  <View style={[styles.toggleKnob, jobForm.markAsUrgent && styles.toggleKnobActive]} />
                </View>
              </TouchableOpacity>

              {/* Job Title */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Job Title *</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g., Emergency Plumbing Repair"
                  value={jobForm.title}
                  onChangeText={(text) => setJobForm({...jobForm, title: text})}
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.inputField, styles.textAreaField]}
                  placeholder="Describe the job requirements..."
                  value={jobForm.description}
                  onChangeText={(text) => setJobForm({...jobForm, description: text})}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Required Skills */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Required Skills *</Text>
                <View style={styles.skillsGrid}>
                  {skillOptions.map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      style={[
                        styles.skillButton,
                        jobForm.requiredSkills.includes(skill) && styles.skillButtonActive
                      ]}
                      onPress={() => toggleSkill(skill)}
                    >
                      <Text style={[
                        styles.skillButtonText,
                        jobForm.requiredSkills.includes(skill) && styles.skillButtonTextActive
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
                    value={jobForm.area}
                    onChangeText={(text) => setJobForm({...jobForm, area: text})}
                  />
                  <TextInput
                    style={[styles.inputField, styles.locationInput]}
                    placeholder="District"
                    value={jobForm.district}
                    onChangeText={(text) => setJobForm({...jobForm, district: text})}
                  />
                </View>
              </View>

              {/* Budget and Payment Type */}
              <View style={[styles.formGroup, { zIndex: 100 }]}>
                <View style={styles.budgetRow}>
                  <View style={styles.budgetInputContainer}>
                    <Text style={styles.label}>
                      <Ionicons name="cash-outline" size={16} color="#64748b" /> Budget (Rs.)
                    </Text>
                    <TextInput
                      style={styles.inputField}
                      placeholder="e.g., 1500"
                      value={jobForm.budget}
                      onChangeText={(text) => setJobForm({...jobForm, budget: text})}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.paymentTypeContainer}>
                    <Text style={styles.label}>Payment Type</Text>
                    <TouchableOpacity 
                      style={styles.paymentTypeButton}
                      onPress={() => setShowPaymentTypeModal(!showPaymentTypeModal)}
                    >
                      <Text style={styles.paymentTypeText}>{jobForm.paymentType}</Text>
                      <Ionicons name={showPaymentTypeModal ? "chevron-up" : "chevron-down"} size={20} color="#64748b" />
                    </TouchableOpacity>
                    {showPaymentTypeModal && (
                      <View style={styles.inlineDropdown}>
                        {['Daily', 'Weekly', 'Monthly', 'Fixed'].map((type, index) => (
                          <TouchableOpacity
                            key={type}
                            style={[
                              styles.inlineDropdownItem,
                              index === 3 && styles.inlineDropdownItemLast,
                            ]}
                            onPress={() => {
                              setJobForm({...jobForm, paymentType: type});
                              setShowPaymentTypeModal(false);
                            }}
                          >
                            <Text style={styles.inlineDropdownText}>{type}</Text>
                            {jobForm.paymentType === type && (
                              <Ionicons name="checkmark" size={20} color="#10b981" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Duration / Timeline */}
              <View style={[styles.formGroup, { zIndex: 1 }]}>
                <Text style={styles.label}>
                  <Ionicons name="time-outline" size={16} color="#64748b" /> Duration / Timeline
                </Text>
                <View style={styles.durationModeToggle}>
                  <TouchableOpacity
                    style={[styles.modeButton, durationMode === 'simple' && styles.modeButtonActive]}
                    onPress={() => setDurationMode('simple')}
                  >
                    <Text style={[styles.modeButtonText, durationMode === 'simple' && styles.modeButtonTextActive]}>
                      Simple
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modeButton, durationMode === 'detailed' && styles.modeButtonActive]}
                    onPress={() => setDurationMode('detailed')}
                  >
                    <Text style={[styles.modeButtonText, durationMode === 'detailed' && styles.modeButtonTextActive]}>
                      Detailed
                    </Text>
                  </TouchableOpacity>
                </View>

                {durationMode === 'simple' ? (
                  <TextInput
                    style={styles.inputField}
                    placeholder="e.g., 1 week, Start ASAP"
                    value={jobForm.duration}
                    onChangeText={(text) => setJobForm({...jobForm, duration: text})}
                  />
                ) : (
                  <View style={styles.detailedDuration}>
                    {Object.keys(jobForm.detailedDuration).map((day) => (
                      <View key={day} style={styles.dayRow}>
                        <TouchableOpacity
                          style={styles.dayCheckbox}
                          onPress={() => updateDayDuration(day, 'needed', !jobForm.detailedDuration[day].needed)}
                        >
                          <View style={[styles.checkbox, jobForm.detailedDuration[day].needed && styles.checkboxActive]}>
                            {jobForm.detailedDuration[day].needed && (
                              <Ionicons name="checkmark" size={16} color="#fff" />
                            )}
                          </View>
                          <Text style={styles.dayLabel}>{day}</Text>
                        </TouchableOpacity>
                        {jobForm.detailedDuration[day].needed && (
                          <View style={styles.timeInputs}>
                            <TextInput
                              style={styles.timeInput}
                              placeholder="From"
                              value={jobForm.detailedDuration[day].from}
                              onChangeText={(text) => updateDayDuration(day, 'from', text)}
                            />
                            <Text style={styles.timeSeparator}>-</Text>
                            <TextInput
                              style={styles.timeInput}
                              placeholder="To"
                              value={jobForm.detailedDuration[day].to}
                              onChangeText={(text) => updateDayDuration(day, 'to', text)}
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
                onPress={handlePostJob}
                disabled={isPosting}
              >
                <Text style={styles.postJobButtonText}>
                  {isPosting ? 'Posting...' : 'Post Job'}
                </Text>
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
                customAlert.type === 'info' ? styles.alertInfoBg :
                styles.alertErrorBg
              ]}>
                <Ionicons 
                  name={
                    customAlert.type === 'success' ? 'checkmark-circle' : 
                    customAlert.type === 'warning' ? 'alert-circle' : 
                    customAlert.type === 'info' ? 'information-circle' :
                    'close-circle'
                  } 
                  size={48} 
                  color={
                    customAlert.type === 'success' ? '#10b981' : 
                    customAlert.type === 'warning' ? '#f59e0b' : 
                    customAlert.type === 'info' ? '#3b82f6' :
                    '#ef4444'
                  }
                />
              </View>
              <Text style={styles.alertTitle}>
                {customAlert.title}{customAlert.type === 'success' ? ' 🎉' : ''}
              </Text>
              <Text style={styles.alertMessage}>{customAlert.message}</Text>
              
              {customAlert.showConfirm ? (
                <View style={styles.alertButtonsRow}>
                  <TouchableOpacity style={styles.alertCancelButton} onPress={hideAlert}>
                    <Text style={styles.alertCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.alertButton} onPress={confirmHire}>
                    <Text style={styles.alertButtonText}>Hire</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.alertButton} onPress={hideAlert}>
                  <Text style={styles.alertButtonText}>Continue</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* Worker Details Page */}
      {showWorkerDetails && (selectedWorker || selectedHiredWorker) && (
        <Modal visible={showWorkerDetails} animationType="slide">
          <WorkerDetailsPage 
            worker={selectedHiredWorker || selectedWorker}
            onBack={() => {
              setShowWorkerDetails(false);
              setSelectedWorker(null);
              setSelectedHiredWorker(null);
            }}
            onHire={(worker) => {
              // Close details page and open booking form
              setShowWorkerDetails(false);
              setSelectedWorker(worker);
              setShowBookingForm(true);
            }}
          />
        </Modal>
      )}

      {/* Contact Worker Page */}
      {showContactWorker && (selectedWorker || selectedHiredWorker) && (
        <Modal visible={showContactWorker} animationType="slide">
          <ContactWorkerPage 
            worker={selectedHiredWorker || selectedWorker}
            employerData={profileData}
            onBack={() => {
              setShowContactWorker(false);
              setSelectedWorker(null);
              setSelectedHiredWorker(null);
            }}
          />
        </Modal>
      )}

      {/* Booking Form Page */}
      {showBookingForm && selectedWorker && (
        <Modal visible={showBookingForm} animationType="slide">
          <BookingFormPage 
            worker={selectedWorker}
            onBack={() => {
              setShowBookingForm(false);
              setSelectedWorker(null);
            }}
            onSubmit={handleBookingSubmit}
          />
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
  workerCard: {
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
  workerHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  workerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  workerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  workerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  workerProfession: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  experienceText: {
    fontSize: 13,
    color: '#64748b',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    height: 28,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  availableText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16a34a',
  },
  workerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  workerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  workerDetailText: {
    fontSize: 13,
    color: '#64748b',
  },
  workerRateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  workerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewProfileButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  hireButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 12,
  },
  hireButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  postJobText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
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
  workerDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  disabledText: {
    opacity: 0.5,
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
    marginBottom: 12,
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
  applicantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  applicantsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  jobActions: {
    flexDirection: 'row',
    gap: 12,
  },
  viewApplicantsButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
  },
  viewApplicantsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fee2e2',
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiredCard: {
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
  hiredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hiredAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  hiredAvatarImage: {
    width: '100%',
    height: '100%',
  },
  hiredInfo: {
    flex: 1,
  },
  hiredName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  hiredProfession: {
    fontSize: 13,
    color: '#64748b',
  },
  workingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  workingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },
  workingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
  hiredJobInfo: {
    marginBottom: 12,
  },
  hiredJobTitle: {
    fontSize: 14,
    color: '#64748b',
  },
  hiredDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 12,
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
  hiredActions: {
    flexDirection: 'row',
    gap: 12,
  },
  chatButton: {
    flex: 1,
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
  disabledButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  disabledButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  viewDetailsButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
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
    alignItems: 'center',
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
  urgentToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  urgentToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 16,
  },
  urgentToggleTextContainer: {
    flex: 1,
  },
  urgentToggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  urgentToggleSubtitle: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#cbd5e1',
    padding: 2,
    justifyContent: 'center',
    flexShrink: 0,
  },
  toggleSwitchActive: {
    backgroundColor: '#10b981',
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  formGroup: {
    marginBottom: 20,
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
  },
  postJobButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  postJobButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
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
  alertSuccessBg: {
    backgroundColor: '#d1fae5',
  },
  alertErrorBg: {
    backgroundColor: '#fee2e2',
  },
  alertWarningBg: {
    backgroundColor: '#fef3c7',
  },
  alertInfoBg: {
    backgroundColor: '#dbeafe',
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
  alertButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
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
  alertCancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 50,
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  alertCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  durationModeToggle: {
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
  detailedDuration: {
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
  durationRow: {
    flexDirection: 'row',
    gap: 12,
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
});
