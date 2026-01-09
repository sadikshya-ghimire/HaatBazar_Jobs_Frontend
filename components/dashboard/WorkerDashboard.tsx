import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WorkerDashboardProps {
  onLogout: () => void;
  userName?: string;
}

export default function WorkerDashboard({ onLogout, userName = 'Rajesh' }: WorkerDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'home' | 'myJobs' | 'messages' | 'profile'>('home');
  const [showPostOfferModal, setShowPostOfferModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [rate, setRate] = useState('');
  const [rateType, setRateType] = useState('Daily');
  const [availability, setAvailability] = useState('');

  const workerName = userName;
  const unreadMessages = 3;

  // Profile data
  const profileData = {
    name: 'Your Name',
    skills: 'Plumber, Electrician',
    completedJobs: 24,
    successRate: '96%',
    memberSince: 'Jan 2024',
    icon: '🔧',
  };

  // Messages data
  const messages = [
    {
      id: 1,
      employerName: 'Rajesh Thapa',
      jobTitle: 'House Painting Project',
      time: '10:30 AM',
      unreadCount: 1,
      icon: '🎨',
    },
    {
      id: 2,
      employerName: 'Kopila Enterprises',
      jobTitle: 'Office Cleaning',
      time: '10:30 AM',
      unreadCount: 0,
      icon: '🧹',
    },
  ];

  // Accepted jobs data
  const acceptedJobs = [
    {
      id: 1,
      title: 'House Painting Project',
      employer: 'Rajesh Thapa',
      location: 'Baneshwor, Kathmandu',
      salary: 'Rs. 1500/day',
      startDate: 'Dec 28, 2024',
      status: 'Ongoing',
      hasNewMessage: true,
      icon: '🎨',
    },
    {
      id: 2,
      title: 'Office Cleaning',
      employer: 'Kopila Enterprises',
      location: 'Durbar Marg, Kathmandu',
      salary: 'Rs. 12000/month',
      startDate: 'Dec 20, 2024',
      status: 'Ongoing',
      hasNewMessage: false,
      icon: '🧹',
    },
  ];

  // Available jobs data
  const availableJobs = [
    {
      id: 1,
      title: 'Plumber Needed',
      employer: 'Priya Sharma',
      location: 'Sector 18, Noida',
      budget: '₹600/day',
      posted: '10 mins ago',
      isUrgent: true,
    },
    {
      id: 2,
      title: 'Electrician Required',
      employer: 'Amit Kumar',
      location: 'Sector 22, Noida',
      budget: '₹500/day',
      posted: '30 mins ago',
      isUrgent: false,
    },
    {
      id: 3,
      title: 'Carpenter for Furniture',
      employer: 'Rajesh Gupta',
      location: 'Sector 15, Delhi',
      budget: '₹700/day',
      posted: '2 hours ago',
      isUrgent: true,
    },
    {
      id: 4,
      title: 'House Painter',
      employer: 'Sunita Devi',
      location: 'Sector 10, Noida',
      budget: '₹550/day',
      posted: '5 hours ago',
      isUrgent: false,
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

  const handlePostOffer = () => {
    console.log('Posting job offer:', {
      jobTitle,
      jobDescription,
      selectedSkills,
      location,
      district,
      rate,
      rateType,
      availability,
    });
    // Reset form
    setJobTitle('');
    setJobDescription('');
    setSelectedSkills([]);
    setLocation('');
    setDistrict('');
    setRate('');
    setRateType('Daily');
    setAvailability('');
    setShowPostOfferModal(false);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 shadow-sm" style={{ elevation: 4 }}>
        <View className="flex-row justify-between items-center mb-2">
          <View>
            <Text className="text-gray-600 text-sm">Welcome back</Text>
            <Text className="text-gray-900 text-2xl font-bold mt-1">{workerName}</Text>
          </View>
          <View className="flex-row gap-4">
            <Pressable className="relative">
              <Ionicons name="notifications-outline" size={28} color="#0092B8" />
              <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setShowPostOfferModal(true)}>
              <Ionicons name="add-circle" size={28} color="#00B8DB" />
            </Pressable>
            <Pressable onPress={onLogout}>
              <Ionicons name="log-out-outline" size={28} color="#0092B8" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {selectedTab === 'home' ? (
          <View className="px-6 py-6">
            <Text className="text-gray-900 text-xl font-bold mb-4">Available Jobs</Text>
            
            <View className="gap-4">
              {availableJobs.map((job) => (
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
                  <Text className="text-gray-900 text-lg font-bold mb-2">{job.title}</Text>

                  {/* Employer */}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="person-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">{job.employer}</Text>
                  </View>

                  {/* Location */}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">{job.location}</Text>
                  </View>

                  {/* Budget and Posted Time */}
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center">
                      <Ionicons name="cash-outline" size={16} color="#00B8DB" />
                      <Text className="text-[#00B8DB] text-base font-bold ml-2">{job.budget}</Text>
                    </View>
                    <Text className="text-gray-500 text-xs">{job.posted}</Text>
                  </View>

                  {/* Apply Button */}
                  <Pressable 
                    className="bg-[#00B8DB] py-3 rounded-xl active:bg-[#0092B8]"
                    onPress={() => console.log('Apply to job:', job.id)}
                  >
                    <Text className="text-white text-center font-bold text-base">Apply Now</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ) : selectedTab === 'myJobs' ? (
          <View className="px-6 py-6">
            <Text className="text-gray-900 text-xl font-bold mb-4">Accepted Jobs</Text>
            
            <View className="gap-4">
              {acceptedJobs.map((job) => (
                <View 
                  key={job.id} 
                  className="bg-white rounded-2xl p-5 shadow-md" 
                  style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
                >
                  {/* Job Icon and Status */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="w-12 h-12 rounded-full bg-[#CEFAFE] items-center justify-center">
                      <Text className="text-2xl">{job.icon}</Text>
                    </View>
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-green-700 text-xs font-bold">{job.status}</Text>
                    </View>
                  </View>

                  {/* Job Title */}
                  <Text className="text-gray-900 text-lg font-bold mb-2">{job.title}</Text>

                  {/* Employer */}
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="person-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">{job.employer}</Text>
                  </View>

                  {/* Location */}
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text className="text-gray-600 text-sm ml-2">{job.location}</Text>
                  </View>

                  {/* Salary and Start Date */}
                  <View className="flex-row justify-between items-center mb-4">
                    <View>
                      <Text className="text-gray-500 text-xs mb-1">Salary</Text>
                      <Text className="text-[#00B8DB] text-base font-bold">{job.salary}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-500 text-xs mb-1">Start Date</Text>
                      <Text className="text-gray-900 text-sm font-bold">{job.startDate}</Text>
                    </View>
                  </View>

                  {/* Chat Button */}
                  <Pressable 
                    className="bg-[#00B8DB] py-3 rounded-xl active:bg-[#0092B8] flex-row items-center justify-center"
                    onPress={() => console.log('Chat with employer:', job.id)}
                  >
                    <Ionicons name="chatbubbles-outline" size={20} color="#FFFFFF" />
                    <Text className="text-white font-bold text-base ml-2">Chat</Text>
                    {job.hasNewMessage && (
                      <View className="bg-red-500 w-2 h-2 rounded-full ml-2" />
                    )}
                  </Pressable>

                  {/* Call Button */}
                  <Pressable 
                    className="mt-2 flex-row items-center justify-center py-2"
                    onPress={() => console.log('Call employer:', job.id)}
                  >
                    <Ionicons name="call-outline" size={18} color="#6B7280" />
                  </Pressable>
                </View>
              ))}
            </View>

            {/* Empty State */}
            {acceptedJobs.length === 0 && (
              <View className="items-center justify-center py-20">
                <Ionicons name="briefcase-outline" size={64} color="#D1D5DB" />
                <Text className="text-gray-500 text-lg mt-4">No Accepted Jobs Yet</Text>
                <Text className="text-gray-400 text-sm mt-2">Start applying to jobs to see them here</Text>
              </View>
            )}
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
                  onPress={() => console.log('Open chat with:', message.employerName)}
                >
                  <View className="flex-row items-center">
                    {/* Icon */}
                    <View className="w-12 h-12 rounded-full bg-[#CEFAFE] items-center justify-center mr-3">
                      <Text className="text-2xl">{message.icon}</Text>
                    </View>

                    {/* Message Info */}
                    <View className="flex-1">
                      <Text className="text-gray-900 text-base font-bold mb-1">{message.employerName}</Text>
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

            {/* Empty State */}
            {messages.length === 0 && (
              <View className="items-center justify-center py-20">
                <Ionicons name="chatbubbles-outline" size={64} color="#D1D5DB" />
                <Text className="text-gray-500 text-lg mt-4">No Messages Yet</Text>
                <Text className="text-gray-400 text-sm mt-2">Start accepting jobs to chat with employers</Text>
              </View>
            )}
          </View>
        ) : selectedTab === 'profile' ? (
          <View className="px-6 py-6">
            {/* Profile Header */}
            <View className="items-center mb-8">
              {/* Avatar */}
              <View className="w-24 h-24 rounded-full bg-[#CEFAFE] items-center justify-center mb-4">
                <Text className="text-4xl">{profileData.icon}</Text>
              </View>
              
              {/* Name and Skills */}
              <Text className="text-gray-900 text-2xl font-bold mb-1">{profileData.name}</Text>
              <Text className="text-gray-600 text-base">{profileData.skills}</Text>
            </View>

            {/* Stats Cards */}
            <View className="gap-3 mb-6">
              {/* Completed Jobs */}
              <View 
                className="bg-white rounded-2xl p-4 shadow-md flex-row justify-between items-center"
                style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
              >
                <Text className="text-gray-700 text-base">Completed Jobs</Text>
                <Text className="text-gray-900 text-lg font-bold">{profileData.completedJobs}</Text>
              </View>

              {/* Success Rate */}
              <View 
                className="bg-white rounded-2xl p-4 shadow-md flex-row justify-between items-center"
                style={{ elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 }}
              >
                <Text className="text-gray-700 text-base">Success Rate</Text>
                <Text className="text-green-600 text-lg font-bold">{profileData.successRate}</Text>
              </View>

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

      {/* Post Job Offer Modal */}
      <Modal
        visible={showPostOfferModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPostOfferModal(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center px-4"
          onPress={() => setShowPostOfferModal(false)}
        >
          <Pressable 
            className="bg-white rounded-3xl w-full" 
            style={{ maxWidth: 450, maxHeight: '85%' }}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <View className="bg-[#00B8DB] rounded-t-3xl px-6 py-4 flex-row justify-between items-center">
              <Text className="text-white text-xl font-bold">Post Your Job Offer</Text>
              <Pressable onPress={() => setShowPostOfferModal(false)}>
                <Ionicons name="close" size={28} color="#FFFFFF" />
              </Pressable>
            </View>

            {/* Scrollable Content */}
            <ScrollView 
              className="px-6 py-4" 
              showsVerticalScrollIndicator={true}
              bounces={false}
            >
              <Text className="text-gray-600 text-sm mb-4">Create a job offer to advertise your services to employers.</Text>

              {/* Job Title */}
              <Text className="text-gray-900 font-bold text-sm mb-2">Job Title *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-4"
                placeholder="e.g., Professional Plumbing Services"
                placeholderTextColor="#9CA3AF"
                value={jobTitle}
                onChangeText={setJobTitle}
              />

              {/* Description */}
              <Text className="text-gray-900 font-bold text-sm mb-2">Description *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-4"
                placeholder="Describe your services and experience..."
                placeholderTextColor="#9CA3AF"
                value={jobDescription}
                onChangeText={setJobDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* Your Skills */}
              <Text className="text-gray-900 font-bold text-sm mb-2">Your Skills *</Text>
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

              {/* Rate and Rate Type */}
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-sm mb-2">💵 Rate (Rs.)</Text>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                    placeholder="e.g., 1500"
                    placeholderTextColor="#9CA3AF"
                    value={rate}
                    onChangeText={setRate}
                    keyboardType="numeric"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-sm mb-2">Rate Type</Text>
                  <Pressable
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                    onPress={() => {
                      const types = ['Daily', 'Weekly', 'Monthly'];
                      const currentIndex = types.indexOf(rateType);
                      const nextIndex = (currentIndex + 1) % types.length;
                      setRateType(types[nextIndex]);
                    }}
                  >
                    <Text className="text-gray-900">{rateType}</Text>
                    <Ionicons name="chevron-down" size={20} color="#6B7280" />
                  </Pressable>
                </View>
              </View>

              {/* Availability */}
              <Text className="text-gray-900 font-bold text-sm mb-2">⏱️ Availability</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 mb-6"
                placeholder="e.g., Monday to Friday, 9 AM - 5 PM"
                placeholderTextColor="#9CA3AF"
                value={availability}
                onChangeText={setAvailability}
              />

              {/* Buttons */}
              <Pressable
                className="bg-[#00B8DB] py-4 rounded-xl active:bg-[#0092B8] mb-3"
                onPress={handlePostOffer}
              >
                <Text className="text-white text-center font-bold text-base">Post Job Offer</Text>
              </Pressable>

              <Pressable
                className="py-4 rounded-xl active:bg-gray-100 mb-4"
                onPress={() => setShowPostOfferModal(false)}
              >
                <Text className="text-gray-600 text-center font-bold text-base">Cancel</Text>
              </Pressable>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
