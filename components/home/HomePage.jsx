import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  SafeAreaView,
  Animated,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HomePageProps {
  onLogin?: () => void;
  onSignup?: () => void;
}

const HomePage = ({ onLogin, onSignup }: HomePageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'workers' | 'jobs'>('workers');
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const workersOpacity = useRef(new Animated.Value(1)).current;
  const jobsOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: activeTab === 'workers' ? 0 : 1,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(workersOpacity, {
        toValue: activeTab === 'workers' ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(jobsOpacity, {
        toValue: activeTab === 'jobs' ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section with Gradient */}
        <LinearGradient
          colors={['#447788', '#628BB5', '#B5DBE1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-4 pt-6 pb-8"
        >
          {/* Top Navigation */}
          <View className="flex-row justify-end items-center mb-6 gap-2">
            <Pressable 
              className="px-4 py-1.5 rounded-full active:opacity-90"
              style={{
                backgroundColor: '#ffffff',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Text className="font-semibold text-xs" style={{ color: '#447788' }}>
                Home
              </Text>
            </Pressable>
            <Pressable 
              onPress={onLogin}
              className="px-4 py-1.5 rounded-full active:opacity-90"
              style={{
                backgroundColor: '#ffffff',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Text className="font-semibold text-xs" style={{ color: '#447788' }}>Login</Text>
            </Pressable>
            <Pressable 
              onPress={onSignup}
              className="px-4 py-1.5 rounded-full active:opacity-90"
              style={{
                backgroundColor: '#ffffff',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Text className="font-semibold text-xs" style={{ color: '#447788' }}>Sign Up</Text>
            </Pressable>
          </View>

          {/* Title */}
          <Text className="text-white text-xl font-bold text-center mb-2">
            HaatBazar Jobs
          </Text>
          <Text className="text-white text-xs text-center mb-6">
            Connecting local workers with daily job opportunities across Nepal
          </Text>

          {/* Toggle Buttons */}
          <View className="flex-row justify-center mb-6 px-2">
            <View 
              className="flex-row rounded-full overflow-hidden relative"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: 3,
              }}
            >
              {/* Animated Background Slider */}
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 3,
                  left: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [3, 145],
                  }),
                  width: 140,
                  height: 38,
                  backgroundColor: '#ffffff',
                  borderRadius: 100,
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              />
              
              <Pressable
                onPress={() => setActiveTab('workers')}
                className="px-8 py-3 rounded-full z-10"
              >
                <Animated.Text
                  className="font-bold text-sm"
                  style={{
                    color: activeTab === 'workers' ? '#447788' : 'rgba(255, 255, 255, 0.7)',
                    opacity: workersOpacity,
                  }}
                >
                  Find Workers
                </Animated.Text>
              </Pressable>
              
              <Pressable
                onPress={() => setActiveTab('jobs')}
                className="px-8 py-3 rounded-full z-10"
              >
                <Animated.Text
                  className="font-bold text-sm"
                  style={{
                    color: activeTab === 'jobs' ? '#447788' : 'rgba(255, 255, 255, 0.7)',
                    opacity: jobsOpacity,
                  }}
                >
                  Find Jobs
                </Animated.Text>
              </Pressable>
            </View>
          </View>

          {/* Search Section */}
          <View className="gap-3 mb-6">
            <View 
              className="bg-white rounded-xl px-4 py-3 flex-row items-center"
              style={{
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <Ionicons name="search" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder={activeTab === 'workers' ? 'Search for workers...' : 'Search for jobs...'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 text-gray-700 text-sm"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View 
              className="bg-white rounded-xl px-4 py-3 flex-row items-center"
              style={{
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <Ionicons name="location-outline" size={18} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Your location"
                value={locationQuery}
                onChangeText={setLocationQuery}
                className="flex-1 text-gray-700 text-sm"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <Pressable 
              className="py-3 rounded-xl active:scale-95"
              onPress={onSignup}
              style={{ 
                backgroundColor: '#ffffff',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text className="text-center font-bold text-sm" style={{ color: '#447788' }}>
                {activeTab === 'workers' ? 'Find Workers' : 'Find Jobs'}
              </Text>
            </Pressable>
          </View>

          {/* Stats */}
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">5K+</Text>
              <Text className="text-xs mt-1" style={{ color: '#ffffff' }}>
                Active Workers
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">12K+</Text>
              <Text className="text-xs mt-1" style={{ color: '#ffffff' }}>
                Jobs Posted
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">4.7★</Text>
              <Text className="text-xs mt-1" style={{ color: '#ffffff' }}>
                Average Rating
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Popular Skills */}
        <View className="px-4 py-6 bg-white">
          <Text className="text-gray-900 text-lg font-bold mb-1">Popular Skills</Text>
          <Text className="text-gray-600 text-xs mb-4">Browse workers by their skills</Text>

          <View className="flex-row flex-wrap gap-2">
            {[
              { icon: 'water', name: 'Plumber' },
              { icon: 'flash', name: 'Electrician' },
              { icon: 'cut', name: 'Tailor' },
              { icon: 'school', name: 'Tutor' },
              { icon: 'brush', name: 'Painter' },
              { icon: 'construct', name: 'Mechanic' },
              { icon: 'home', name: 'Cleaner' },
              { icon: 'leaf', name: 'Gardener' },
            ].map((skill, index) => (
              <Pressable
                key={index}
                className="bg-gray-50 rounded-xl p-3 items-center active:bg-gray-100"
                style={{ 
                  width: '23%',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <Ionicons name={skill.icon as any} size={20} color="#447788" />
                </View>
                <Text className="text-gray-900 text-xs font-medium text-center">
                  {skill.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View className="px-4 py-6 bg-gray-50">
          <Text className="text-gray-900 text-lg font-bold mb-1">How It Works</Text>
          <Text className="text-gray-600 text-xs mb-4">
            Simple process for workers and employers
          </Text>

          {/* For Workers */}
          <Text className="font-bold mb-3 text-sm" style={{ color: '#447788' }}>
            For Workers
          </Text>

          <View className="flex-row flex-wrap gap-3 mb-6">
            {[
              {
                number: '1',
                icon: 'person-add',
                title: 'Register',
                description: 'Sign up with your skills and location',
              },
              {
                number: '2',
                icon: 'document-text',
                title: 'Get Matched',
                description: 'Receive job notifications that match your skills',
              },
              {
                number: '3',
                icon: 'people',
                title: 'Connect',
                description: 'Connect with local employers',
              },
              {
                number: '4',
                icon: 'checkmark-circle',
                title: 'Work & Earn',
                description: 'Complete jobs and build your rating',
              },
            ].map((step, index) => (
              <View
                key={index}
                className="bg-white rounded-xl p-3"
                style={{
                  width: '48%',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View className="relative mb-2">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: '#447788' }}
                  >
                    <Ionicons name={step.icon as any} size={20} color="#ffffff" />
                  </View>
                  <View
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <Text className="font-bold text-xs" style={{ color: '#447788' }}>
                      {step.number}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-900 font-bold text-sm mb-1">
                  {step.title}
                </Text>
                <Text className="text-gray-600 text-xs leading-4">
                  {step.description}
                </Text>
              </View>
            ))}
          </View>

          {/* For Employers */}
          <Text className="font-bold mb-3 text-sm" style={{ color: '#447788' }}>
            For Employers
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {[
              {
                number: '1',
                icon: 'document-text',
                title: 'Post Job',
                description: 'Describe the task you need done',
              },
              {
                number: '2',
                icon: 'people',
                title: 'View Workers',
                description: 'See recommended workers nearby',
              },
              {
                number: '3',
                icon: 'checkmark-circle',
                title: 'Hire',
                description: 'Choose the right worker for your job',
              },
              {
                number: '4',
                icon: 'star',
                title: 'Rate',
                description: 'Rate the worker after job completion',
              },
            ].map((step, index) => (
              <View
                key={index}
                className="bg-white rounded-xl p-3"
                style={{
                  width: '48%',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View className="relative mb-2">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: '#447788' }}
                  >
                    <Ionicons name={step.icon as any} size={20} color="#ffffff" />
                  </View>
                  <View
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <Text className="font-bold text-xs" style={{ color: '#447788' }}>
                      {step.number}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-900 font-bold text-sm mb-1">
                  {step.title}
                </Text>
                <Text className="text-gray-600 text-xs leading-4">
                  {step.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Featured Workers */}
        <View className="px-4 py-6 bg-white">
          <Text className="text-gray-900 text-lg font-bold mb-1">Featured Workers</Text>
          <Text className="text-gray-600 text-xs mb-4">
            Top-rated skilled workers in your area
          </Text>

          <View className="gap-2">
            {[
              {
                name: 'Ram Bahadur',
                skill: 'Plumber',
                rating: '4.8',
                reviews: '45',
                jobs: '89',
                location: 'Kathmandu',
                rate: 'Rs. 800/day',
                verified: true,
                available: true,
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLb2Rk3-Bu-WJaHejwSb1fNYcwNZqE7TIbsQ&s',
              },
              {
                name: 'Sita Sharma',
                skill: 'Tailor',
                rating: '4.9',
                reviews: '67',
                jobs: '124',
                location: 'Pokhara',
                rate: 'Rs. 600/day',
                verified: true,
                available: true,
                image: 'https://media.istockphoto.com/id/1147299980/photo/indian-women-stitching-cloths-by-machine-at-home-stock-image.jpg?s=612x612&w=0&k=20&c=jxsZcW88QrmhLame4ChJ4UpvimJMoJZWHUGtfYA0f5c=',
              },
              {
                name: 'Krishna Thapa',
                skill: 'Electrician',
                rating: '4.7',
                reviews: '52',
                jobs: '98',
                location: 'Lalitpur',
                rate: 'Rs. 900/day',
                verified: true,
                available: false,
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiq9Bl6Lk7aCQ69psIT1lMGNg_XJfoJ5RmEQ&s',
              },
              {
                name: 'Lakshmi Gurung',
                skill: 'Tutor',
                rating: '5',
                reviews: '83',
                jobs: '156',
                location: 'Bhaktapur',
                rate: 'Rs. 500/hr',
                verified: true,
                available: true,
                image: 'https://www.pmt.education/wp-content/uploads/2025/06/female-online-tutor-1.jpg',
              },
            ].map((worker, index) => (
              <View
                key={index}
                className="bg-white rounded-xl p-3 flex-row items-center"
                style={{
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: '#f3f4f6',
                }}
              >
                {/* Profile Image */}
                <View className="relative mr-3">
                  <Image
                    source={{ uri: worker.image }}
                    className="w-14 h-14 rounded-lg"
                    style={{ backgroundColor: '#e5e7eb' }}
                  />
                  {worker.verified && (
                    <View
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                      style={{ backgroundColor: '#447788' }}
                    >
                      <Ionicons name="checkmark" size={12} color="#ffffff" />
                    </View>
                  )}
                </View>

                {/* Worker Info */}
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-sm mb-0.5">
                    {worker.name}
                  </Text>
                  <Text className="text-gray-600 text-xs mb-1">{worker.skill}</Text>
                  
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text className="text-gray-700 font-semibold text-xs ml-1">
                      {worker.rating}
                    </Text>
                    <Text className="text-gray-500 text-xs ml-1">
                      ({worker.reviews})
                    </Text>
                    <Ionicons name="briefcase" size={10} color="#9ca3af" style={{ marginLeft: 6 }} />
                    <Text className="text-gray-500 text-xs ml-1">
                      {worker.jobs} jobs
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons name="location" size={10} color="#9ca3af" />
                    <Text className="text-gray-500 text-xs ml-1">{worker.location}</Text>
                  </View>
                </View>

                {/* Rate and Hire Button */}
                <View className="items-end">
                  <Text className="font-bold text-xs mb-2" style={{ color: '#447788' }}>
                    {worker.rate}
                  </Text>
                  {worker.available ? (
                    <Pressable
                      onPress={onSignup}
                      className="px-4 py-1.5 rounded-lg active:opacity-90"
                      style={{
                        backgroundColor: '#447788',
                        shadowColor: '#447788',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      <Text className="text-white font-bold text-xs">Hire</Text>
                    </Pressable>
                  ) : (
                    <View className="px-4 py-1.5 rounded-lg bg-gray-200">
                      <Text className="text-gray-500 font-semibold text-xs">Unavailable</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* View All Button */}
          <Pressable 
            onPress={onSignup}
            className="mt-4 py-2.5 rounded-lg items-center active:opacity-80"
            style={{
              borderWidth: 2,
              borderColor: '#447788',
              backgroundColor: '#ffffff20',
            }}
          >
            <Text className="font-bold text-sm" style={{ color: '#447788' }}>
              View All Workers
            </Text>
          </Pressable>
        </View>

        {/* Why HaatBazar Jobs */}
        <View className="px-4 py-6 bg-gray-50">
          <Text className="text-gray-900 text-lg font-bold mb-1">Why HaatBazar Jobs</Text>
          <Text className="text-gray-600 text-xs mb-4">
            Supporting local employment in Nepal
          </Text>

          <View className="flex-row flex-wrap gap-3">
            {[
              {
                icon: 'location',
                title: 'Location Based',
                description: 'Find workers and jobs nearby',
              },
              {
                icon: 'star',
                title: 'Rating System',
                description: 'Transparent worker ratings and reviews',
              },
              {
                icon: 'flash',
                title: 'Quick Matching',
                description: 'Smart matching based on skills',
              },
              {
                icon: 'shield-checkmark',
                title: 'Verified Workers',
                description: 'All workers are verified',
              },
            ].map((feature, index) => (
              <View
                key={index}
                className="bg-white rounded-xl p-4 items-center"
                style={{
                  width: '48%',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <Ionicons name={feature.icon as any} size={22} color="#447788" />
                </View>
                <Text className="text-gray-900 font-bold text-sm mb-1 text-center">
                  {feature.title}
                </Text>
                <Text className="text-gray-600 text-xs text-center leading-4">
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Join HaatBazar Jobs CTA with Gradient */}
        <LinearGradient
          colors={['#447788', '#628BB5', '#B5DBE1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-4 py-8"
        >
          <Text className="text-white text-xl font-bold text-center mb-2">
            Join HaatBazar Jobs Today
          </Text>
          <Text className="text-center mb-6 text-xs" style={{ color: '#ffffff' }}>
            Connecting daily wage earners with local job opportunities across Nepal
          </Text>

          <View className="gap-2">
            <Pressable
              onPress={onSignup}
              className="bg-white py-3 rounded-lg active:opacity-90"
              style={{
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              <Text className="text-center font-bold text-sm" style={{ color: '#447788' }}>
                Register as Worker
              </Text>
            </Pressable>

            <Pressable
              onPress={onSignup}
              className="border-2 py-3 rounded-lg active:bg-white/10"
              style={{ borderColor: '#ffffff' }}
            >
              <Text className="text-white text-center font-bold text-sm">
                Post a Job
              </Text>
            </Pressable>
          </View>

          <Text className="text-center text-xs mt-4" style={{ color: '#ffffff' }}>
            Reducing unemployment, one connection at a time
          </Text>
        </LinearGradient>

        {/* Footer */}
        <View className="bg-gray-900 px-4 py-6">
          <View className="mb-4">
            <Text className="text-white text-lg font-bold mb-2">HaatBazar Jobs</Text>
            <Text className="text-gray-400 text-xs">
              Connecting informal workers with local employers across Nepal.
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-6 mb-6">
            <View className="flex-1" style={{ minWidth: '45%' }}>
              <Text className="text-white font-bold mb-2 text-xs">For Workers</Text>
              <Text className="text-gray-400 text-xs mb-1">Register</Text>
              <Text className="text-gray-400 text-xs mb-1">Find Jobs</Text>
              <Text className="text-gray-400 text-xs mb-1">How It Works</Text>
              <Text className="text-gray-400 text-xs">Help</Text>
            </View>

            <View className="flex-1" style={{ minWidth: '45%' }}>
              <Text className="text-white font-bold mb-2 text-xs">For Employers</Text>
              <Text className="text-gray-400 text-xs mb-1">Post a Job</Text>
              <Text className="text-gray-400 text-xs mb-1">Find Workers</Text>
              <Text className="text-gray-400 text-xs mb-1">Pricing</Text>
              <Text className="text-gray-400 text-xs">Support</Text>
            </View>

            <View className="flex-1" style={{ minWidth: '45%' }}>
              <Text className="text-white font-bold mb-2 text-xs">About</Text>
              <Text className="text-gray-400 text-xs mb-1">About Us</Text>
              <Text className="text-gray-400 text-xs mb-1">Contact</Text>
              <Text className="text-gray-400 text-xs mb-1">Privacy Policy</Text>
              <Text className="text-gray-400 text-xs">Terms of Service</Text>
            </View>
          </View>

          <View className="border-t border-gray-800 pt-4">
            <View className="flex-row justify-center items-center gap-4 mb-3">
              <Pressable className="active:opacity-70">
                <Ionicons name="logo-facebook" size={18} color="#9ca3af" />
              </Pressable>
              <Pressable className="active:opacity-70">
                <Ionicons name="logo-twitter" size={18} color="#9ca3af" />
              </Pressable>
              <Pressable className="active:opacity-70">
                <Ionicons name="logo-instagram" size={18} color="#9ca3af" />
              </Pressable>
              <Pressable className="active:opacity-70">
                <Ionicons name="logo-linkedin" size={18} color="#9ca3af" />
              </Pressable>
            </View>

            <Text className="text-gray-500 text-xs text-center">
              © 2025 HaatBazar Jobs. Supporting local employment in Nepal.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
