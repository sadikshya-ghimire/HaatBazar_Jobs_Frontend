import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image as RNImage,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomePage = ({ onLogin, onSignup }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [userType, setUserType] = useState('employer');

  const categories = [
    { icon: 'hammer', title: 'Plumber', jobs: '250+', bgColor: '#eff6ff', iconColor: '#2563eb' },
    { icon: 'flash', title: 'Electrician', jobs: '180+', bgColor: '#fef9c3', iconColor: '#ca8a04' },
    { icon: 'construct', title: 'Carpenter', jobs: '320+', bgColor: '#fef3c7', iconColor: '#f59e0b' },
    { icon: 'school', title: 'Tutor', jobs: '450+', bgColor: '#f3e8ff', iconColor: '#9333ea' },
    { icon: 'cut', title: 'Tailor', jobs: '120+', bgColor: '#fce7f3', iconColor: '#ec4899' },
    { icon: 'color-palette', title: 'Painter', jobs: '200+', bgColor: '#dcfce7', iconColor: '#16a34a' },
    { icon: 'home', title: 'House Help', jobs: '380+', bgColor: '#cffafe', iconColor: '#0891b2' },
    { icon: 'car', title: 'Driver', jobs: '290+', bgColor: '#fee2e2', iconColor: '#dc2626' },
  ];

  const workers = [
    {
      name: 'Ram Bahadur Thapa',
      role: 'Expert Plumber',
      location: 'Thamel, Kathmandu',
      rating: 4.9,
      reviews: 127,
      completedJobs: 145,
      hourlyRate: 'NPR 500/hr',
      image: 'https://images.unsplash.com/photo-1651761490583-2836ff62442a?w=400',
      verified: true,
      skills: ['Plumbing', 'Pipe Repair'],
    },
    {
      name: 'Sita Sharma',
      role: 'Professional Electrician',
      location: 'Patan, Lalitpur',
      rating: 4.8,
      reviews: 98,
      completedJobs: 112,
      hourlyRate: 'NPR 600/hr',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      verified: true,
      skills: ['Wiring', 'Electrical Repair'],
    },
    {
      name: 'Krishna Lama',
      role: 'Master Carpenter',
      location: 'Bhaktapur',
      rating: 4.7,
      reviews: 85,
      completedJobs: 93,
      hourlyRate: 'NPR 550/hr',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verified: true,
      skills: ['Furniture', 'Woodwork'],
    },
    {
      name: 'Maya Tamang',
      role: 'Math & Science Tutor',
      location: 'Baneshwor, Kathmandu',
      rating: 5.0,
      reviews: 156,
      completedJobs: 210,
      hourlyRate: 'NPR 800/hr',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      verified: true,
      skills: ['Mathematics', 'Physics'],
    },
  ];

  const steps = [
    {
      icon: 'person-add',
      title: 'Create Account',
      description: 'Sign up as a worker or employer in just 2 minutes with phone or email verification',
      bgColor: '#eff6ff',
      iconColor: '#2563eb',
      number: '01',
    },
    {
      icon: 'search',
      title: 'Browse & Match',
      description: 'Search for jobs or workers based on skills, location, and ratings',
      bgColor: '#cffafe',
      iconColor: '#0891b2',
      number: '02',
    },
    {
      icon: 'chatbubbles',
      title: 'Connect & Discuss',
      description: 'Chat directly with employers or workers to discuss job details and rates',
      bgColor: '#f3e8ff',
      iconColor: '#9333ea',
      number: '03',
    },
    {
      icon: 'checkmark-circle',
      title: 'Complete & Rate',
      description: 'Finish the job, make payment, and leave reviews to build trust',
      bgColor: '#dcfce7',
      iconColor: '#16a34a',
      number: '04',
    },
  ];

  const features = [
    {
      icon: 'shield-checkmark',
      title: 'Verified Workers',
      description: 'All workers go through NID verification and background checks',
      bgColor: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      icon: 'trophy',
      title: 'Quality Guaranteed',
      description: 'Rating system ensures only quality professionals stay on top',
      bgColor: '#f3e8ff',
      iconColor: '#9333ea',
    },
    {
      icon: 'time',
      title: 'Quick Matching',
      description: 'Find the right worker or job within minutes, not days',
      bgColor: '#cffafe',
      iconColor: '#0891b2',
    },
    {
      icon: 'checkmark-circle',
      title: 'Secure Payments',
      description: 'Safe and transparent payment process for both parties',
      bgColor: '#dcfce7',
      iconColor: '#16a34a',
    },
  ];

  const stats = [
    { number: '5,200+', label: 'Active Workers', icon: 'people' },
    { number: '12,450+', label: 'Jobs Completed', icon: 'checkmark-circle' },
    { number: '4.7/5', label: 'Average Rating', icon: 'trophy' },
    { number: '98%', label: 'Success Rate', icon: 'trending-up' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <View style={styles.logoBadge}>
                <RNImage 
                  source={require('../../assets/Icon.png')} 
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandTitle}>HaatBazar Jobs</Text>
              
              <Text style={styles.heroTitle}>
                Find Your Next{'\n'}
                <Text style={styles.heroTitleAccent}>Opportunity</Text> Today
              </Text>
              <Text style={styles.heroSubtitle}>
                Connecting skilled workers with employers across Nepal. Find local plumbers, electricians, carpenters, tutors, and more.
              </Text>

              <View style={styles.userTypePills}>
                <TouchableOpacity
                  onPress={() => setUserType('employer')}
                  style={[styles.pill, userType === 'employer' && styles.pillActive]}
                  activeOpacity={0.8}
                >
                  <Ionicons name="people" size={16} color={userType === 'employer' ? '#fff' : '#475569'} />
                  <Text style={[styles.pillText, userType === 'employer' && styles.pillTextActive]}>
                    Hire Workers
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setUserType('worker')}
                  style={[styles.pill, userType === 'worker' && styles.pillActive]}
                  activeOpacity={0.8}
                >
                  <Ionicons name="briefcase" size={16} color={userType === 'worker' ? '#fff' : '#475569'} />
                  <Text style={[styles.pillText, userType === 'worker' && styles.pillTextActive]}>
                    Find Jobs
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.searchCard}>
                <View style={styles.searchInputContainer}>
                  <Ionicons name="search" size={18} color="#64748b" />
                  <TextInput
                    placeholder={userType === 'employer' ? 'Search for workers...' : 'Search for jobs...'}
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchInput}
                  />
                </View>
                <View style={styles.searchDivider} />
                <View style={styles.searchInputContainer}>
                  <Ionicons name="location-outline" size={18} color="#64748b" />
                  <TextInput
                    placeholder="Your location"
                    placeholderTextColor="#94a3b8"
                    value={location}
                    onChangeText={setLocation}
                    style={styles.searchInput}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.searchButton} activeOpacity={0.8} onPress={onSignup}>
                <Text style={styles.searchButtonText}>
                  {userType === 'employer' ? 'Search Workers' : 'Search Jobs'}
                </Text>
              </TouchableOpacity>

              <View style={styles.trustIndicators}>
                <View style={styles.trustItem}>
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text style={styles.trustText}>4.7/5 Rating</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.trustItem}>
                  <Ionicons name="people" size={14} color="#64748b" />
                  <Text style={styles.trustText}>5K+ Workers</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.trustItem}>
                  <Ionicons name="briefcase" size={14} color="#64748b" />
                  <Text style={styles.trustText}>12K+ Jobs</Text>
                </View>
              </View>
            </View>

            <View style={styles.heroRight}>
              <RNImage
                source={{ uri: 'https://images.unsplash.com/photo-1690622013290-45168b079709?w=800' }}
                style={styles.heroImage}
              />
            </View>
          </View>
        </View>

        {/* SERVICE CATEGORIES */}
        <View style={styles.section}>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>Popular Categories</Text>
          </View>
          <Text style={styles.sectionTitle}>Browse Jobs by Category</Text>
          <Text style={styles.sectionSubtitle}>
            Explore thousands of job opportunities across various skill categories
          </Text>

          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard} activeOpacity={0.7} onPress={onSignup}>
                <View style={[styles.categoryIcon, { backgroundColor: category.bgColor }]}>
                  <Ionicons name={category.icon} size={28} color={category.iconColor} />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryJobs}>{category.jobs} jobs</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.8} onPress={onSignup}>
            <Text style={styles.viewAllButtonText}>View All Categories</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* HOW IT WORKS */}
        <View style={styles.sectionGray}>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>Simple Process</Text>
          </View>
          <Text style={styles.sectionTitle}>How HaatBazar Works</Text>
          <Text style={styles.sectionSubtitle}>
            Get started in 4 easy steps and connect with the right opportunities
          </Text>

          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <View style={[styles.stepIcon, { backgroundColor: step.bgColor }]}>
                  <Ionicons name={step.icon} size={32} color={step.iconColor} />
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8} onPress={onSignup}>
            <Text style={styles.ctaButtonText}>Get Started Now</Text>
            <Text style={styles.ctaButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* FEATURED WORKERS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>Top Rated</Text>
              </View>
              <Text style={styles.sectionTitle}>Featured Workers</Text>
              <Text style={styles.sectionSubtitleSmall}>
                Hire verified professionals with proven track records
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.workersScroll}
          >
            {workers.map((worker, index) => (
              <View key={index} style={styles.workerCard}>
                <View style={styles.workerImageContainer}>
                  <RNImage source={{ uri: worker.image }} style={styles.workerImage} />
                  {worker.verified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="thumbs-up" size={12} color="#fff" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  )}
                  <View style={styles.rateBadge}>
                    <Text style={styles.rateText}>{worker.hourlyRate}</Text>
                  </View>
                </View>

                <View style={styles.workerContent}>
                  <Text style={styles.workerName}>{worker.name}</Text>
                  <Text style={styles.workerRole}>{worker.role}</Text>
                  <View style={styles.workerLocation}>
                    <Ionicons name="location-outline" size={14} color="#9ca3af" />
                    <Text style={styles.workerLocationText}>{worker.location}</Text>
                  </View>

                  <View style={styles.skillsContainer}>
                    {worker.skills.map((skill, idx) => (
                      <View key={idx} style={styles.skillBadge}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.workerStats}>
                    <View style={styles.workerRating}>
                      <Ionicons name="star" size={14} color="#f59e0b" />
                      <Text style={styles.ratingValue}>{worker.rating}</Text>
                      <Text style={styles.reviewCount}>({worker.reviews})</Text>
                    </View>
                    <View style={styles.jobsCompleted}>
                      <Ionicons name="briefcase" size={14} color="#9ca3af" />
                      <Text style={styles.jobsText}>{worker.completedJobs} jobs</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.hireButton} activeOpacity={0.8} onPress={onSignup}>
                    <Text style={styles.hireButtonText}>Hire Now</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.viewAllButtonSecondary} activeOpacity={0.8} onPress={onSignup}>
            <Text style={styles.viewAllButtonTextSecondary}>View All Workers</Text>
            <Ionicons name="arrow-forward" size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* TRUST SECTION */}
        <View style={styles.sectionGray}>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>Why Choose Us</Text>
          </View>
          <Text style={styles.sectionTitle}>Trusted by Thousands</Text>
          <Text style={styles.sectionSubtitle}>
            We're Nepal's most trusted platform connecting workers with opportunities
          </Text>

          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statIcon}>
                  <Ionicons name={stat.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.bgColor }]}>
                  <Ionicons name={feature.icon} size={28} color={feature.iconColor} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.testimonialCard}>
            <Text style={styles.quoteSymbol}>"</Text>
            <Text style={styles.testimonialText}>
              HaatBazar Jobs helped me find reliable workers within hours. The verification process gives me peace of mind knowing I'm hiring trusted professionals.
            </Text>
            <View style={styles.testimonialAuthor}>
              <RNImage
                source={{ uri: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400' }}
                style={styles.authorImage}
              />
              <View>
                <Text style={styles.authorName}>Rajesh Adhikari</Text>
                <Text style={styles.authorTitle}>Homeowner, Kathmandu</Text>
              </View>
            </View>
          </View>
        </View>

        {/* CALL TO ACTION */}
        <View style={styles.section}>
          <View style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
            <Text style={styles.ctaSubtitle}>
              Join thousands of workers and employers finding the perfect match on HaatBazar Jobs
            </Text>

            <TouchableOpacity style={styles.ctaButtonWhite} activeOpacity={0.8} onPress={onSignup}>
              <Ionicons name="people" size={20} color="#1e293b" />
              <Text style={styles.ctaButtonWhiteText}>Sign Up as Worker</Text>
              <Ionicons name="arrow-forward" size={20} color="#1e293b" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.ctaButtonGreen} activeOpacity={0.8} onPress={onSignup}>
              <Ionicons name="briefcase" size={20} color="#fff" />
              <Text style={styles.ctaButtonGreenText}>Sign Up as Employer</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.ctaTrustIndicators}>
              <View style={styles.ctaTrustItem}>
                <Ionicons name="star" size={20} color="#f59e0b" />
                <Text style={styles.ctaTrustText}>4.7/5 Rating</Text>
              </View>
              <View style={styles.ctaTrustItem}>
                <Ionicons name="people" size={20} color="#cbd5e1" />
                <Text style={styles.ctaTrustText}>5,200+ Active Users</Text>
              </View>
              <View style={styles.ctaTrustItem}>
                <Ionicons name="briefcase" size={20} color="#cbd5e1" />
                <Text style={styles.ctaTrustText}>12,450+ Jobs Done</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoCardIcon}>
                <Ionicons name="people" size={24} color="#fff" />
              </View>
              <Text style={styles.infoCardTitle}>For Workers</Text>
              <Text style={styles.infoCardDescription}>
                Create your profile, showcase your skills, and get hired by local employers. Work on your terms.
              </Text>
              <View style={styles.infoCardList}>
                <View style={styles.infoCardListItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.infoCardListText}>Find local job opportunities</Text>
                </View>
                <View style={styles.infoCardListItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.infoCardListText}>Set your own rates</Text>
                </View>
                <View style={styles.infoCardListItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.infoCardListText}>Build your reputation</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCardGreen}>
              <View style={styles.infoCardIconGreen}>
                <Ionicons name="briefcase" size={24} color="#fff" />
              </View>
              <Text style={styles.infoCardTitle}>For Employers</Text>
              <Text style={styles.infoCardDescription}>
                Post your job requirements and connect with verified skilled workers in your area instantly.
              </Text>
              <View style={styles.infoCardList}>
                <View style={styles.infoCardListItem}>
                  <View style={styles.bulletGreen} />
                  <Text style={styles.infoCardListText}>Hire verified professionals</Text>
                </View>
                <View style={styles.infoCardListItem}>
                  <View style={styles.bulletGreen} />
                  <Text style={styles.infoCardListText}>Compare rates and reviews</Text>
                </View>
                <View style={styles.infoCardListItem}>
                  <View style={styles.bulletGreen} />
                  <Text style={styles.infoCardListText}>Get instant matches</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.footerBrand}>
            <Text style={styles.footerBrandTitle}>HaatBazar Jobs</Text>
            <Text style={styles.footerBrandText}>
              Nepal's leading platform connecting skilled workers with local employers. Building opportunities, one job at a time.
            </Text>
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-facebook" size={18} color="#d1d5db" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-instagram" size={18} color="#d1d5db" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}>
                <Ionicons name="logo-twitter" size={18} color="#d1d5db" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Quick Links</Text>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>About Us</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>How It Works</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Browse Workers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerLink}>
              <Text style={styles.footerLinkText}>Browse Jobs</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Contact Us</Text>
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={18} color="#9ca3af" />
              <Text style={styles.contactText}>Thamel, Kathmandu{'\n'}Nepal</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={18} color="#9ca3af" />
              <Text style={styles.contactText}>+977-1-4567890</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={18} color="#9ca3af" />
              <Text style={styles.contactText}>support@haatbazarjobs.com</Text>
            </View>
          </View>

          <View style={styles.footerBottom}>
            <Text style={styles.footerBottomText}>© 2025 HaatBazar Jobs. All rights reserved.</Text>
            <View style={styles.footerBottomLinks}>
              <TouchableOpacity>
                <Text style={styles.footerBottomLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.footerBottomDivider}>•</Text>
              <TouchableOpacity>
                <Text style={styles.footerBottomLink}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  heroSection: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 60, backgroundColor: '#f8fafc' },
  heroContent: { flexDirection: width > 768 ? 'row' : 'column', gap: 40, alignItems: 'center' },
  heroLeft: { flex: 1, maxWidth: width > 768 ? '50%' : '100%' },
  heroRight: { flex: 1, maxWidth: width > 768 ? '50%' : '100%', width: '100%' },
  logoBadge: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 255, 255, 0.95)', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  logoImage: { width: 70, height: 70 },
  brandTitle: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 24 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f1f5f9', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  heroBadgeText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  heroTitle: { fontSize: 36, fontWeight: 'bold', color: '#111827', marginBottom: 16, lineHeight: 44 },
  heroTitleAccent: { color: '#1e293b' },
  heroSubtitle: { fontSize: 15, color: '#64748b', lineHeight: 22, marginBottom: 24 },
  userTypePills: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
  pillActive: { backgroundColor: '#1e293b', borderColor: '#1e293b' },
  pillText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  pillTextActive: { color: '#fff' },
  searchCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  searchInput: { flex: 1, fontSize: 13, color: '#111827' },
  searchDivider: { height: 1, backgroundColor: '#f1f5f9' },
  searchButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1e293b', paddingVertical: 14, borderRadius: 12, marginBottom: 24 },
  searchButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  trustIndicators: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 16, flexWrap: 'wrap' },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trustText: { fontSize: 13, color: '#64748b' },
  divider: { width: 1, height: 14, backgroundColor: '#cbd5e1' },
  heroImage: { width: '100%', height: 320, borderRadius: 20, resizeMode: 'cover', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
  section: { paddingHorizontal: 20, paddingVertical: 60, backgroundColor: '#fff' },
  sectionGray: { paddingHorizontal: 20, paddingVertical: 60, backgroundColor: '#f8fafc' },
  sectionBadge: { alignSelf: 'center', backgroundColor: '#eff6ff', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, marginBottom: 12 },
  sectionBadgeText: { fontSize: 12, color: '#2563eb', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionTitle: { fontSize: 32, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginBottom: 12, lineHeight: 40 },
  sectionSubtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 40, lineHeight: 24, paddingHorizontal: 20 },
  sectionSubtitleSmall: { fontSize: 15, color: '#64748b', marginTop: 8, lineHeight: 22 },
  sectionHeader: { marginBottom: 32 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  categoryCard: { width: (width - 56) / 2, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  categoryIcon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  categoryTitle: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4, textAlign: 'center' },
  categoryJobs: { fontSize: 13, color: '#64748b', textAlign: 'center' },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1e293b', paddingVertical: 14, borderRadius: 12, shadowColor: '#1e293b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  viewAllButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  viewAllButtonSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 14, borderRadius: 12, marginTop: 24 },
  viewAllButtonTextSecondary: { color: '#1e293b', fontSize: 15, fontWeight: '600' },
  stepsContainer: { gap: 24, marginBottom: 48 },
  stepCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 24, padding: 24, alignItems: 'center', position: 'relative' },
  stepNumber: { position: 'absolute', top: -12, right: -12, width: 40, height: 40, backgroundColor: '#1e293b', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  stepIcon: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  stepTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8, textAlign: 'center' },
  stepDescription: { fontSize: 14, color: '#4b5563', lineHeight: 20, textAlign: 'center' },
  ctaButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1e293b', paddingVertical: 16, borderRadius: 16 },
  ctaButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  ctaButtonArrow: { color: '#fff', fontSize: 20 },
  workersScroll: { paddingRight: 20 },
  workerCard: { width: 280, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 24, overflow: 'hidden', marginRight: 16 },
  workerImageContainer: { position: 'relative' },
  workerImage: { width: '100%', height: 224, resizeMode: 'cover' },
  verifiedBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#059669', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  verifiedText: { color: '#fff', fontSize: 12 },
  rateBadge: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(255, 255, 255, 0.95)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  rateText: { color: '#1e293b', fontSize: 14, fontWeight: '600' },
  workerContent: { padding: 20 },
  workerName: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 },
  workerRole: { fontSize: 14, color: '#64748b', marginBottom: 12 },
  workerLocation: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  workerLocationText: { fontSize: 14, color: '#4b5563' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  skillBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  skillText: { fontSize: 12, color: '#475569' },
  workerStats: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, marginBottom: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  workerRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  reviewCount: { fontSize: 12, color: '#6b7280' },
  jobsCompleted: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  jobsText: { fontSize: 14, color: '#4b5563' },
  hireButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1e293b', paddingVertical: 12, borderRadius: 12 },
  hireButtonText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 64 },
  statCard: { width: (width - 56) / 2, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, padding: 24, alignItems: 'center' },
  statIcon: { width: 48, height: 48, backgroundColor: '#1e293b', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#4b5563', textAlign: 'center' },
  featuresContainer: { gap: 24, marginBottom: 64 },
  featureCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 24, padding: 32, flexDirection: 'row', gap: 16 },
  featureIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  featureDescription: { fontSize: 14, color: '#4b5563', lineHeight: 20 },
  testimonialCard: { backgroundColor: '#1e293b', borderRadius: 24, padding: 32 },
  quoteSymbol: { fontSize: 48, color: 'rgba(255, 255, 255, 0.2)', marginBottom: 16 },
  testimonialText: { fontSize: 16, color: '#fff', lineHeight: 24, marginBottom: 24 },
  testimonialAuthor: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  authorImage: { width: 64, height: 64, borderRadius: 32, borderWidth: 4, borderColor: 'rgba(255, 255, 255, 0.1)' },
  authorName: { fontSize: 16, fontWeight: '500', color: '#fff', marginBottom: 4 },
  authorTitle: { fontSize: 14, color: '#94a3b8' },
  ctaCard: { backgroundColor: '#1e293b', borderRadius: 24, padding: 32, marginBottom: 32, alignItems: 'center' },
  ctaTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 16 },
  ctaSubtitle: { fontSize: 16, color: '#cbd5e1', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  ctaButtonWhite: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, width: '100%', marginBottom: 16 },
  ctaButtonWhiteText: { color: '#1e293b', fontSize: 16, fontWeight: '500' },
  ctaButtonGreen: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#059669', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, width: '100%', marginBottom: 32 },
  ctaButtonGreenText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  ctaTrustIndicators: { gap: 16, alignItems: 'center' },
  ctaTrustItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ctaTrustText: { color: '#cbd5e1', fontSize: 14 },
  infoCardsContainer: { gap: 24 },
  infoCard: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 16, padding: 32 },
  infoCardGreen: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#d1fae5', borderRadius: 16, padding: 32 },
  infoCardIcon: { width: 48, height: 48, backgroundColor: '#1e293b', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  infoCardIconGreen: { width: 48, height: 48, backgroundColor: '#059669', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  infoCardTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 },
  infoCardDescription: { fontSize: 14, color: '#4b5563', lineHeight: 20, marginBottom: 16 },
  infoCardList: { gap: 8 },
  infoCardListItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bullet: { width: 6, height: 6, backgroundColor: '#475569', borderRadius: 3 },
  bulletGreen: { width: 6, height: 6, backgroundColor: '#059669', borderRadius: 3 },
  infoCardListText: { fontSize: 14, color: '#4b5563' },
  footer: { backgroundColor: '#111827', paddingHorizontal: 20, paddingVertical: 64 },
  footerBrand: { marginBottom: 32 },
  footerBrandTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  footerBrandText: { fontSize: 14, color: '#9ca3af', lineHeight: 20, marginBottom: 24 },
  socialIcons: { flexDirection: 'row', gap: 12 },
  socialIcon: { width: 40, height: 40, backgroundColor: '#1f2937', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  footerSection: { marginBottom: 32 },
  footerSectionTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 16 },
  footerLink: { marginBottom: 12 },
  footerLinkText: { fontSize: 14, color: '#d1d5db' },
  contactItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  contactText: { fontSize: 14, color: '#d1d5db', lineHeight: 20 },
  footerBottom: { paddingTop: 24, borderTopWidth: 1, borderTopColor: '#1f2937' },
  footerBottomText: { fontSize: 14, color: '#9ca3af', textAlign: 'center', marginBottom: 16 },
  footerBottomLinks: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  footerBottomLink: { fontSize: 14, color: '#9ca3af' },
  footerBottomDivider: { color: '#9ca3af' },
});

export default HomePage;
