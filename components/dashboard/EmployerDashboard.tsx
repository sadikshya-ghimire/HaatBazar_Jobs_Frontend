import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmployerDashboardProps {
  onLogout: () => void;
  userName?: string;
}

export default function EmployerDashboard({ onLogout, userName = 'Priya' }: EmployerDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'home' | 'myJobs' | 'messages' | 'profile'>('home');
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [budget, setBudget] = useState('');
  const [paymentType, setPaymentType] = useState('Daily');
  const [duration, setDuration] = useState('');

  const employerName = userName;
  const unreadMessages = 3;

  // Profile data
  const profileData = {
    name: 'Your Name',
    role: 'Employer',
    postedJobs: 2,
    hiredWorkers: 2,
    memberSince: 'Jan 2024',
  };

  // Messages data
  const messages = [
    {
      id: 1,
      workerName: 'Krishna Lama',
      jobTitle: 'House Painting',
      lastMessage: '',
      time: '08:23 AM',
      unreadCount: 1,
      avatar: '👤',
    },
    {
      id: 2,
      workerName: 'Maya Rai',
      jobTitle: 'Office Cleaning',
      lastMessage: '',
      time: '08:20 AM',
      unreadCount: 0,
      avatar: '👤',
    },
  ];

  // My Posted Jobs data
  const myPostedJobs = [
    {
      id: 1,
      title: 'Emergency Plumbing Repair',
      skills: ['Plumber', 'Pipe Fitting'],
      applicants: 12,
      status: 'Active',
      postedDate: 'Posted Dec 28, 2024',
      isUrgent: true,
    },
    {
      id: 2,
      title: 'Carpenter for Kitchen Renovation',
      skills: ['Carpenter', 'Furniture'],
      applicants: 5,
      status: 'Active',
      postedDate: 'Posted Dec 24, 2024',
      isUrgent: false,
    },
    {
      id: 3,
      title: 'Math Tutor Needed',
      skills: ['Tutor', 'Mathematics'],
      applicants: 8,
      status: 'Closed',
      postedDate: 'Posted Dec 22, 2024',
      isUrgent: false,
    },
  ];

  // Hired Workers data
  const hiredWorkers = [
    {
      id: 1,
      name: 'Mohan Bahadur',
      jobTitle: 'House Painting',
      location: 'Thamel, Kathmandu',
      rate: 'Rs. 1600/day',
      status: 'Ongoing',
      hiredDate: 'Hired Dec 26, 2024',
      hasNewMessage: true,
    },
    {
      id: 2,
      name: 'Maya Rai',
      jobTitle: 'Office Cleaning',
      location: 'Durbar Marg, Kathmandu',
      rate: 'Rs. 1200/month',
      status: 'Ongoing',
      hiredDate: 'Hired Dec 25, 2024',
      hasNewMessage: false,
    },
  ];

  // Available workers data
  const availableWorkers = [
    {
      id: 1,
      name: 'Ram Bahadur',
      skills: 'Professional Plumbing Services',
      location: 'Thapathali, Kathmandu',
      rating: 4.8,
      jobs: '45 Jobs',
      experience: '5 years',
      hourlyRate: '1500 Rs./day',
      isAvailable: true,
    },
    {
      id: 2,
      name: 'Hari Shrestha',
      skills: 'Expert Electrician Available',
      location: 'Patan, Lalitpur',
      rating: 4.7,
      jobs: '38 Jobs',
      experience: '4 years',
      hourlyRate: '1400 Rs./day',
      isAvailable: true,
    },
    {
      id: 3,
      name: 'Sita Tamang',
      skills: 'Skilled Carpenter for Custom Furniture',
      location: 'Bhaktapur',
      rating: 4.9,
      jobs: '52 Jobs',
      experience: '6 years',
      hourlyRate: '1600 Rs./day',
      isAvailable: false,
    },
    {
      id: 4,
      name: 'Arjun Sharma',
      skills: 'Mathematics & Science Tutor',
      location: 'Lazimpat, Kathmandu',
      rating: 4.5,
      jobs: '32 Jobs',
      experience: '3 years',
      hourlyRate: '800 Rs./hourly',
      isAvailable: true,
    },
  ];

  const availableSkills = [
    'Plumber', 'Electrician', 'Carpenter', 'Tailor',
    'Tutor', 'Painter', 'Mechanic', 'Cleaner',
    'Gardener', 'Driver', 'Mason', 'Welder',
    'Cook', 'Security Guard', 'Babysitter',
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handlePostJob = () => {
    console.log('Posting job:', {
      jobTitle,
      jobDescription,
      selectedSkills,
      location,
      district,
      budget,
      paymentType,
      duration,
      isUrgent,
    });
    // Reset form
    setJobTitle('');
    setJobDescription('');
    setSelectedSkills([]);
    setLocation('');
    setDistrict('');
    setBudget('');
    setPaymentType('Daily');
    setDuration('');
    setIsUrgent(false);
    setShowPostJobModal(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 shadow-sm" style={{ elevation: 4 }}>
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-gray-600 text-sm">Welcome Back!</Text>
            <Text className="text-gray-900 text-2xl font-bold mt-1">{employerName}</Text>
          </View>
          <View className="flex-row gap-4">
            <Pressable className="relative">
              <Ionicons name="notifications-outline" size={28} color="#0092B8" />
              <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setShowPostJobModal(true)}>
              <Ionicons name="add-circle" size={28} color="#00B8DB" />
            </Pressable>
            <Pressable onPress={onLogout}>
              <Ionicons name="log-out-outline" size={28} color="#0092B8" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Available Workers Section */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {selectedTab === 'home' ? (
          <View className="px-6 py-6">
            <Text className="text-gray-900 text-xl font-bold mb-4">Available Workers</Text>
            
            <View className="gap-4">
              {availableWorkers.map((worker) => (
                <View 
                  key={worker.id} 
                  className="bg-white rounded-2xl p-5 shadow-md" 
                  style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
                >
                  {/* Available Badge */}
                  {worker.isAvailable && (
                    <View className="bg-green-500 self-start px-3 py-1 rounded-full mb-3">
                      <Text className="text-white text-xs font-bold">AVAILABLE NOW</Text>
                    </View>
                  )}

                  {/* Worker Name */}
                  <Text className="text-gray-900 text-lg font-bold mb-2">{worker.name}</Text>

                  {/* Skills */}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="construct-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">{worker.skills}</Text>
                  </View>

                  {/* Location */}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">{worker.location}</Text>
                  </View>

                  {/* Rating and Experience */}
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#FCD34D" />
                      <Text className="text-gray-700 text-sm font-bold ml-1">{worker.rating}</Text>
                      <Text className="text-gray-500 text-sm ml-2">• {worker.jobs}</Text>
                    </View>
                    <Text className="text-gray-600 text-sm">{worker.experience} experience</Text>
                  </View>

                  {/* Hourly Rate */}
                  <View className="flex-row items-center mb-4">
                    <Ionicons name="cash-outline" size={16} color="#00B8DB" />
                    <Text className="text-[#00B8DB] text-base font-bold ml-2">{worker.hourlyRate}</Text>
                  </View>

                  {/* Hire Button */}
                  <Pressable 
                    className="bg-[#00B8DB] py-3 rounded-xl active:bg-[#0092B8]"
                    onPress={() => console.log('Hire worker:', worker.id)}
                  >
                    <Text className="text-white text-center font-bold text-base">Hire Now</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ) : selectedTab === 'myJobs' ? (
          <View className="px-6 py-6">
            {/* My Posted Jobs Section */}
            <Text className="text-gray-900 text-xl font-bold mb-4">My Posted Jobs</Text>
            
            <View className="gap-4 mb-8">
              {myPostedJobs.map((job) => (
                <View 
                  key={job.id} 
                  className="bg-white rounded-2xl p-5 shadow-md" 
                  style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
                >
                  {/* Urgent Badge */}
                  {job.isUrgent && (
                    <View className="bg-red-500 self-start px-3 py-1 rounded-full mb-3">
                      <Text className="text-white text-xs font-bold">URGENT</Text>
                    </View>
                  )}

                  {/* Job Title */}
                  <Text className="text-gray-900 text-lg font-bold mb-3">{job.title}</Text>

                  {/* Skills Tags */}
                  <View className="flex-row flex-wrap gap-2 mb-3">
                    {job.skills.map((skill, index) => (
                      <View key={index} className="bg-[#CEFAFE] px-3 py-1 rounded-full">
                        <Text className="text-[#0092B8] text-xs font-bold">{skill}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Applicants and Status */}
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-gray-600 text-sm">{job.applicants} applicant(s)</Text>
                    <View className={`px-3 py-1 rounded-full ${job.status === 'Active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Text className={`text-xs font-bold ${job.status === 'Active' ? 'text-green-700' : 'text-gray-600'}`}>
                        {job.status}
                      </Text>
                    </View>
                  </View>

                  {/* Posted Date */}
                  <Text className="text-gray-500 text-xs mb-4">{job.postedDate}</Text>

                  {/* View Applicants Button */}
                  <Pressable 
                    className="bg-[#00B8DB] py-3 rounded-xl active:bg-[#0092B8]"
                    onPress={() => console.log('View applicants for job:', job.id)}
                  >
                    <Text className="text-white text-center font-bold text-base">View Applicants</Text>
                  </Pressable>
                </View>
              ))}
            </View>

            {/* Hired Workers Section */}
            <Text className="text-gray-900 text-xl font-bold mb-4">Hired Workers</Text>
            
            <View className="gap-4">
              {hiredWorkers.map((worker) => (
                <View 
                  key={worker.id} 
                  className="bg-white rounded-2xl p-5 shadow-md" 
                  style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
                >
                  {/* Worker Icon and Name */}
                  <View className="flex-row items-center mb-3">
                    <View className="w-12 h-12 rounded-full bg-[#CEFAFE] items-center justify-center mr-3">
                      <Ionicons name="person" size={24} color="#0092B8" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 text-lg font-bold">{worker.name}</Text>
                      <Text className="text-gray-600 text-sm">{worker.jobTitle}</Text>
                    </View>
                    {worker.status === 'Ongoing' && (
                      <View className="bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-green-700 text-xs font-bold">{worker.status}</Text>
                      </View>
                    )}
                  </View>

                  {/* Location */}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">{worker.location}</Text>
                  </View>

                  {/* Rate */}
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="cash-outline" size={16} color="#00B8DB" />
                    <Text className="text-[#00B8DB] text-base font-bold ml-2">{worker.rate}</Text>
                  </View>

                  {/* Hired Date */}
                  <Text className="text-gray-500 text-xs mb-4">{worker.hiredDate}</Text>

                  {/* Chat Button */}
                  <Pressable 
                    className="bg-[#00B8DB] py-3 rounded-xl active:bg-[#0092B8] flex-row items-center justify-center"
                    onPress={() => console.log('Chat with worker:', worker.id)}
                  >
                    <Ionicons name="chatbubbles-outline" size={20} color="#FFFFFF" />
                    <Text className="text-white font-bold text-base ml-2">Chat</Text>
                    {worker.hasNewMessage && (
                      <View className="bg-red-500 w-2 h-2 rounded-full ml-2" />
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ) : selectedTab === 'messages' ? (
          <View className="px-6 py-6">
            <Text className="text-gray-900 text-xl font-bold mb-4">Messages</Text>
            
            <View className="gap-3">
              {messages.map((message) => (
                <Pressable
                  key={message.id}
                  className="bg-white rounded-2xl p-4 shadow-md active:bg-gray-50"
                  style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
                  onPress={() => console.log('Open chat with:', message.workerName)}
                >
                  <View className="flex-row items-center">
                    {/* Avatar */}
                    <View className="w-12 h-12 rounded-full bg-[#CEFAFE] items-center justify-center mr-3">
                      <Text className="text-2xl">{message.avatar}</Text>
                    </View>

                    {/* Message Info */}
                    <View className="flex-1">
                      <Text className="text-gray-900 text-base font-bold mb-1">{message.workerName}</Text>
                      <Text className="text-gray-600 text-sm">{message.jobTitle}</Text>
                    </View>

                    {/* Time and Unread Badge */}
                    <View className="items-end">
                      <Text className="text-gray-500 text-xs mb-2">{message.time}</Text>
                      {message.unreadCount > 0 && (
                        <View className="bg-[#00B8DB] w-6 h-6 rounded-full items-center justify-center">
                          <Text className="text-white text-xs font-bold">{message.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Empty State if no messages */}
            {messages.length === 0 && (
              <View className="items-center justify-center py-20">
                <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
                <Text className="text-gray-500 text-lg mt-4">No Messages Yet</Text>
                <Text className="text-gray-400 text-sm mt-2">Start hiring workers to chat with them</Text>
              </View>
            )}
          </View>
        ) : selectedTab === 'profile' ? (
          <View className="px-6 py-6">
            {/* Profile Header */}
            <View className="items-center mb-8">
              {/* Avatar */}
              <View className="w-24 h-24 rounded-full bg-[#CEFAFE] items-center justify-center mb-4">
                <Ionicons name="briefcase" size={40} color="#0092B8" />
              </View>
              
              {/* Name and Role */}
              <Text className="text-gray-900 text-2xl font-bold mb-1">{profileData.name}</Text>
              <Text className="text-gray-600 text-base">{profileData.role}</Text>
            </View>

            {/* Stats Cards */}
            <View className="gap-3 mb-6">
              {/* Posted Jobs */}
              <Pressable 
                className="bg-white rounded-2xl p-4 shadow-md active:bg-gray-50 flex-row justify-between items-center"
                style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
                onPress={() => console.log('View posted jobs')}
              >
                <Text className="text-gray-700 text-base">Posted Jobs</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-900 text-lg font-bold mr-2">{profileData.postedJobs}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </Pressable>

              {/* Hired Workers */}
              <Pressable 
                className="bg-white rounded-2xl p-4 shadow-md active:bg-gray-50 flex-row justify-between items-center"
                style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
                onPress={() => console.log('View hired workers')}
              >
                <Text className="text-gray-700 text-base">Hired Workers</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-900 text-lg font-bold mr-2">{profileData.hiredWorkers}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </Pressable>

              {/* Member Since */}
              <View 
                className="bg-white rounded-2xl p-4 shadow-md flex-row justify-between items-center"
                style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
              >
                <Text className="text-gray-700 text-base">Member Since</Text>
                <Text className="text-gray-900 text-base font-bold">{profileData.memberSince}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="gap-3 mb-6">
              {/* Edit Profile */}
              <Pressable 
                className="bg-white rounded-2xl p-4 shadow-md active:bg-gray-50 flex-row justify-between items-center"
                style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
                onPress={() => console.log('Edit profile')}
              >
                <Text className="text-gray-700 text-base">Edit Profile</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>

              {/* Settings */}
              <Pressable 
                className="bg-white rounded-2xl p-4 shadow-md active:bg-gray-50 flex-row justify-between items-center"
                style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
                onPress={() => console.log('Open settings')}
              >
                <Text className="text-gray-700 text-base">Settings</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            </View>

            {/* Logout Button */}
            <Pressable 
              className="bg-white rounded-2xl p-4 shadow-md active:bg-gray-50 items-center"
              style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
              onPress={onLogout}
            >
              <Text className="text-red-500 text-base font-bold">Logout</Text>
            </Pressable>
          </View>
        ) : (
          <View className="px-6 py-6 items-center justify-center" style={{ minHeight: 400 }}>
            <Ionicons name="construct-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4">Coming Soon</Text>
            <Text className="text-gray-400 text-sm mt-2">This section is under development</Text>
          </View>
        )}
      </ScrollView>

      {/* Post Job Modal */}
      <Modal
        visible={showPostJobModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPostJobModal(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={() => setShowPostJobModal(false)}
        >
          <Pressable 
            className="bg-white rounded-3xl w-full" 
            style={{ maxWidth: 450, maxHeight: '85%' }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Fixed at top */}
            <View className="bg-[#00B8DB] rounded-t-3xl px-6 py-4 flex-row justify-between items-center">
              <Text className="text-white text-xl font-bold">Post a Job</Text>
              <Pressable onPress={() => setShowPostJobModal(false)}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Scrollable Content */}
            <ScrollView 
              className="px-6 py-4" 
              showsVerticalScrollIndicator={true}
              bounces={false}
            >
              <Text className="text-gray-600 text-sm mb-4">Post a job to find skilled workers for your needs.</Text>

              {/* Mark as Urgent */}
              <View className="flex-row items-center justify-between mb-4 bg-red-50 p-3 rounded-xl">
                <View className="flex-row items-center flex-1">
                  <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
                  <View className="ml-2 flex-1">
                    <Text className="text-gray-900 font-bold text-sm">Mark as Urgent</Text>
                    <Text className="text-gray-600 text-xs">Get faster responses from workers</Text>
                  </View>
                </View>
                <Switch
                  value={isUrgent}
                  onValueChange={setIsUrgent}
                  trackColor={{ false: '#D1D5DB', true: '#00B8DB' }}
                  thumbColor={isUrgent ? '#FFFFFF' : '#F3F4F6'}
                />
              </View>

              {/* Job Title */}
              <Text className="text-gray-900 font-bold text-sm mb-2">Job Title *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-4"
                placeholder="e.g., Emergency Plumbing Repair"
                placeholderTextColor="#9CA3AF"
                value={jobTitle}
                onChangeText={setJobTitle}
              />

              {/* Description */}
              <Text className="text-gray-900 font-bold text-sm mb-2">Description *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-4"
                placeholder="Describe the job requirements..."
                placeholderTextColor="#9CA3AF"
                value={jobDescription}
                onChangeText={setJobDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Required Skills */}
              <Text className="text-gray-900 font-bold text-sm mb-2">Required Skills *</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {availableSkills.map((skill) => (
                  <Pressable
                    key={skill}
                    onPress={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-full border ${
                      selectedSkills.includes(skill)
                        ? 'bg-[#00B8DB] border-[#00B8DB]'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selectedSkills.includes(skill) ? 'text-white' : 'text-gray-700'
                      }`}
                    >
                      {skill}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Location */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-sm mb-2">📍 Location</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                    placeholder="Area"
                    placeholderTextColor="#9CA3AF"
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-sm mb-2">District</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                    placeholder="District"
                    placeholderTextColor="#9CA3AF"
                    value={district}
                    onChangeText={setDistrict}
                  />
                </View>
              </View>

              {/* Budget and Payment Type */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-sm mb-2">💵 Budget (Rs.)</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                    placeholder="e.g., 1500"
                    placeholderTextColor="#9CA3AF"
                    value={budget}
                    onChangeText={setBudget}
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-sm mb-2">Payment Type</Text>
                  <Pressable
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                    onPress={() => {
                      const types = ['Daily', 'Weekly', 'Monthly'];
                      const currentIndex = types.indexOf(paymentType);
                      const nextIndex = (currentIndex + 1) % types.length;
                      setPaymentType(types[nextIndex]);
                    }}
                  >
                    <Text className="text-gray-900">{paymentType}</Text>
                    <Ionicons name="chevron-down" size={20} color="#6B7280" />
                  </Pressable>
                </View>
              </View>

              {/* Duration / Timeline */}
              <Text className="text-gray-900 font-bold text-sm mb-2">⏱️ Duration / Timeline</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-6"
                placeholder="e.g., 1 week, Start ASAP"
                placeholderTextColor="#9CA3AF"
                value={duration}
                onChangeText={setDuration}
              />

              {/* Buttons */}
              <Pressable
                className="bg-[#00B8DB] py-4 rounded-xl active:bg-[#0092B8] mb-3"
                onPress={handlePostJob}
              >
                <Text className="text-white text-center font-bold text-base">Post Job</Text>
              </Pressable>

              <Pressable
                className="py-4 rounded-xl active:bg-gray-100 mb-4"
                onPress={() => setShowPostJobModal(false)}
              >
                <Text className="text-gray-600 text-center font-bold text-base">Cancel</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Bottom Navigation */}
      <View className="bg-white border-t border-gray-200 px-6 py-3 shadow-lg" style={{ elevation: 10 }}>
        <View className="flex-row justify-around items-center">
          <Pressable 
            className="items-center py-2"
            onPress={() => setSelectedTab('home')}
          >
            <Ionicons 
              name={selectedTab === 'home' ? 'home' : 'home-outline'} 
              size={24} 
              color={selectedTab === 'home' ? '#00B8DB' : '#9CA3AF'} 
            />
            <Text className={`text-xs mt-1 ${selectedTab === 'home' ? 'text-[#00B8DB] font-bold' : 'text-gray-500'}`}>
              Home
            </Text>
          </Pressable>

          <Pressable 
            className="items-center py-2"
            onPress={() => setSelectedTab('myJobs')}
          >
            <Ionicons 
              name={selectedTab === 'myJobs' ? 'briefcase' : 'briefcase-outline'} 
              size={24} 
              color={selectedTab === 'myJobs' ? '#00B8DB' : '#9CA3AF'} 
            />
            <Text className={`text-xs mt-1 ${selectedTab === 'myJobs' ? 'text-[#00B8DB] font-bold' : 'text-gray-500'}`}>
              My Jobs
            </Text>
          </Pressable>

          <Pressable 
            className="items-center py-2 relative"
            onPress={() => setSelectedTab('messages')}
          >
            <View>
              <Ionicons 
                name={selectedTab === 'messages' ? 'chatbubbles' : 'chatbubbles-outline'} 
                size={24} 
                color={selectedTab === 'messages' ? '#00B8DB' : '#9CA3AF'} 
              />
              {unreadMessages > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 w-4 h-4 rounded-full items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">{unreadMessages}</Text>
                </View>
              )}
            </View>
            <Text className={`text-xs mt-1 ${selectedTab === 'messages' ? 'text-[#00B8DB] font-bold' : 'text-gray-500'}`}>
              Messages
            </Text>
          </Pressable>

          <Pressable 
            className="items-center py-2"
            onPress={() => setSelectedTab('profile')}
          >
            <Ionicons 
              name={selectedTab === 'profile' ? 'person' : 'person-outline'} 
              size={24} 
              color={selectedTab === 'profile' ? '#00B8DB' : '#9CA3AF'} 
            />
            <Text className={`text-xs mt-1 ${selectedTab === 'profile' ? 'text-[#00B8DB] font-bold' : 'text-gray-500'}`}>
              Profile
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
