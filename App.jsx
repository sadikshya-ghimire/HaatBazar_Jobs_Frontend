import { useState, useEffect, useRef } from 'react';
import { Platform, Animated, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { auth } from 'components/config/firebase';
import { storage } from 'components/utils/storage';
import { LoadingSpinner } from 'components/common/LoadingSpinner';
import HomePage from 'components/home/HomePage';
import SignUpPage from 'components/auth/SignUpPage';
import LoginPage from 'components/auth/LoginPage';
import VerifyCodePage from 'components/auth/VerifyCodePage';
import EmailVerificationPage from 'components/auth/EmailVerificationPage';
import ForgotPasswordPage from 'components/auth/ForgotPasswordPage';
import ResetPasswordPage from 'components/auth/ResetPasswordPage';
import WorkerRegistrationStep1 from 'components/registration/WorkerRegistrationStep1';
import WorkerRegistrationStep2 from 'components/registration/WorkerRegistrationStep2';
import WorkerRegistrationStep3 from 'components/registration/WorkerRegistrationStep3';
import WorkerRegistrationStep4 from 'components/registration/WorkerRegistrationStep4';
import WorkerRegistrationStep5 from 'components/registration/WorkerRegistrationStep5';
import EmployerRegistrationStep1 from 'components/registration/EmployerRegistrationStep1';
import EmployerRegistrationStep2 from 'components/registration/EmployerRegistrationStep2';
import EmployerRegistrationStep3 from 'components/registration/EmployerRegistrationStep3';
import WorkerDashboard from 'components/dashboard/WorkerDashboard';
import EmployerDashboard from 'components/dashboard/EmployerDashboard';

import './global.css';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState('User');
  const [resetMethod, setResetMethod] = useState('phone');
  const [resetContact, setResetContact] = useState('');
  const [signupMethod, setSignupMethod] = useState('phone');
  const [signupContact, setSignupContact] = useState('');
  const [signupPassword, setSignupPassword] = useState(''); // Store password for phone signup
  const [signupEmail, setSignupEmail] = useState(''); // Store email for verification page
  const [workerRegistrationData, setWorkerRegistrationData] = useState({});
  const [employerRegistrationData, setEmployerRegistrationData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Animation for page transitions - slide effect
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Check authentication state on app load
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check if user is logged in via Firebase
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            console.log('🔐 User is authenticated:', user.uid);
            
            // Get stored user data
            const storedUserType = await storage.getItem('userType');
            const storedUserName = await storage.getItem('userName');
            const storedScreen = await storage.getItem('currentScreen');
            
            if (storedUserType) {
              setUserType(storedUserType);
              setUserName(storedUserName || 'User');
              
              // Restore the screen they were on, or default to dashboard
              if (storedScreen && storedScreen !== 'home' && storedScreen !== 'login' && storedScreen !== 'signup') {
                setCurrentScreen(storedScreen);
              } else {
                setCurrentScreen('dashboard');
              }
            }
          } else {
            console.log('🔓 No authenticated user');
            // Clear stored data
            await storage.removeItem('userType');
            await storage.removeItem('userName');
            await storage.removeItem('currentScreen');
          }
          setIsLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error checking auth state:', error);
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Animate on screen change with slide
  useEffect(() => {
    slideAnim.setValue(50); // Start from right
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 8,
    }).start();
    
    // Persist current screen (except for auth screens)
    if (currentScreen !== 'home' && currentScreen !== 'login' && currentScreen !== 'signup') {
      storage.setItem('currentScreen', currentScreen);
    }
  }, [currentScreen]);

  // Check for email verification on app load (web only)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      
      if (mode === 'verifyEmail') {
        setCurrentScreen('verifyEmail');
      }
    }
  }, []);

  const handleSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleLogin = () => {
    setCurrentScreen('login');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleForgotPassword = () => {
    setCurrentScreen('forgotPassword');
  };

  const handleSendResetCode = (method, contact) => {
    setResetMethod(method);
    setResetContact(contact);
    setCurrentScreen('resetPassword');
  };

  const handleResetSuccess = () => {
    setCurrentScreen('login');
  };

  const handleSignUpSuccess = (selectedUserType, method, contact, password) => {
    console.log('📝 handleSignUpSuccess called');
    console.log('User Type:', selectedUserType);
    console.log('Method:', method);
    console.log('Contact:', contact);
    console.log('Password received:', password ? 'YES (length: ' + password.length + ')' : 'NO - MISSING!');
    
    setUserType(selectedUserType);
    setSignupMethod(method);
    setSignupContact(contact);
    if (password) {
      console.log('✅ Storing password in state');
      setSignupPassword(password);
    } else {
      console.log('⚠️ No password provided!');
    }
    
    // For email signup, go to email verification page
    if (method === 'email') {
      setSignupEmail(contact);
      setCurrentScreen('verifyEmail');
    } else {
      // For phone signup, go to OTP verification page
      console.log('📱 Going to OTP verification with password:', password ? 'YES' : 'NO');
      setCurrentScreen('verifySignup');
    }
  };

  const handleVerifySuccess = () => {
    // After verification, redirect based on user type
    if (userType === 'worker') {
      // Workers go through registration process
      setCurrentScreen('workerReg1');
    } else {
      // Employers go through registration process
      setCurrentScreen('employerReg1');
    }
  };

  const handleEmailVerified = () => {
    // After email verification, go to registration based on user type
    if (userType === 'worker') {
      setCurrentScreen('workerReg1');
    } else {
      setCurrentScreen('employerReg1');
    }
  };

  // Worker Registration Handlers
  const handleWorkerRegistrationStep1Complete = (photoUri) => {
    setWorkerRegistrationData({ ...workerRegistrationData, profilePhoto: photoUri });
    setCurrentScreen('workerReg2');
  };

  const handleWorkerRegistrationStep2Complete = (data) => {
    setWorkerRegistrationData({ ...workerRegistrationData, ...data });
    setCurrentScreen('workerReg3');
  };

  const handleWorkerRegistrationStep3Complete = (skills) => {
    setWorkerRegistrationData({ ...workerRegistrationData, skills });
    setCurrentScreen('workerReg4');
  };

  const handleWorkerRegistrationStep4Complete = (data) => {
    setWorkerRegistrationData({ ...workerRegistrationData, ...data });
    setCurrentScreen('workerReg5');
  };

  const handleWorkerRegistrationStep5Complete = async (data) => {
    setWorkerRegistrationData({ ...workerRegistrationData, ...data });
    console.log('Complete worker registration data:', { ...workerRegistrationData, ...data });
    
    // Mark profile as complete in backend
    const pendingFirebaseUid = await storage.getItem('pendingFirebaseUid');
    const firebaseUid = pendingFirebaseUid || auth.currentUser?.uid;
    if (firebaseUid) {
      console.log('✅ Marking profile as complete...');
      const { userService } = await import('components/services/userService');
      await userService.markProfileComplete(firebaseUid);
      await storage.removeItem('pendingFirebaseUid');
    }
    
    setCurrentScreen('dashboard');
  };

  const handleSkipWorkerRegistration = () => {
    setCurrentScreen('dashboard');
  };

  // Employer Registration Handlers
  const handleEmployerRegistrationStep1Complete = (photoUri) => {
    setEmployerRegistrationData({ ...employerRegistrationData, profilePhoto: photoUri });
    setCurrentScreen('employerReg2');
  };

  const handleEmployerRegistrationStep2Complete = (data) => {
    setEmployerRegistrationData({ ...employerRegistrationData, ...data });
    setCurrentScreen('employerReg3');
  };

  const handleEmployerRegistrationStep3Complete = async (data) => {
    setEmployerRegistrationData({ ...employerRegistrationData, ...data });
    console.log('Complete employer registration data:', { ...employerRegistrationData, ...data });
    
    // Mark profile as complete in backend
    const pendingFirebaseUid = await storage.getItem('pendingFirebaseUid');
    const firebaseUid = pendingFirebaseUid || auth.currentUser?.uid;
    if (firebaseUid) {
      console.log('✅ Marking profile as complete...');
      const { userService } = await import('components/services/userService');
      await userService.markProfileComplete(firebaseUid);
      await storage.removeItem('pendingFirebaseUid');
    }
    
    setCurrentScreen('dashboard');
  };

  const handleSkipEmployerRegistration = () => {
    setCurrentScreen('dashboard');
  };

  const handleLoginSuccess = async (userType, profileComplete, displayName) => {
    console.log('🎯 handleLoginSuccess called');
    console.log('User Type:', userType);
    console.log('Profile Complete:', profileComplete);
    console.log('Display Name:', displayName);
    
    setUserType(userType);
    setUserName(displayName || 'User');
    
    // Store user data for persistence
    await storage.setItem('userType', userType);
    await storage.setItem('userName', displayName || 'User');
    await storage.setItem('currentScreen', 'dashboard');
    
    // Always go to dashboard on login
    console.log('✅ Going to dashboard');
    setCurrentScreen('dashboard');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await storage.removeItem('userType');
      await storage.removeItem('userName');
      await storage.removeItem('currentScreen');
      setUserType(null);
      setCurrentScreen('home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomePage 
            onLogin={handleLogin}
            onSignup={handleSignUp}
          />
        );
      
      case 'signup':
        return (
          <SignUpPage
            onBack={handleBackToHome}
            onLogin={handleLogin}
            onSignUpSuccess={handleSignUpSuccess}
          />
        );
      
      case 'verifySignup':
        return (
          <VerifyCodePage
            onBack={() => setCurrentScreen('signup')}
            onVerifySuccess={handleVerifySuccess}
            onChangeContact={() => setCurrentScreen('signup')}
            contactInfo={signupContact}
            verificationMethod={signupMethod}
            password={signupPassword}
          />
        );
      
      case 'verifyEmail':
        return (
          <EmailVerificationPage
            email={signupEmail}
            userType={userType || 'worker'}
            onVerified={handleEmailVerified}
            onBack={() => setCurrentScreen('signup')}
          />
        );
      
      case 'login':
        return (
          <LoginPage
            onBack={handleBackToHome}
            onSignUp={handleSignUp}
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
          />
        );
      
      case 'forgotPassword':
        return (
          <ForgotPasswordPage
            onBack={handleBackToHome}
            onBackToLogin={handleLogin}
            onSendCode={handleSendResetCode}
          />
        );
      
      case 'resetPassword':
        return (
          <ResetPasswordPage
            onBack={handleBackToHome}
            onBackToLogin={handleLogin}
            onResetSuccess={handleResetSuccess}
            onChangeContact={handleForgotPassword}
            contactInfo={resetContact}
            resetMethod={resetMethod}
          />
        );
      
      case 'workerReg1':
        return (
          <WorkerRegistrationStep1
            onBack={handleBackToHome}
            onContinue={handleWorkerRegistrationStep1Complete}
            onSkip={handleSkipWorkerRegistration}
          />
        );
      
      case 'workerReg2':
        return (
          <WorkerRegistrationStep2
            onBack={() => setCurrentScreen('workerReg1')}
            onContinue={handleWorkerRegistrationStep2Complete}
            onSkip={handleSkipWorkerRegistration}
          />
        );
      
      case 'workerReg3':
        return (
          <WorkerRegistrationStep3
            onBack={() => setCurrentScreen('workerReg2')}
            onContinue={handleWorkerRegistrationStep3Complete}
            onSkip={handleSkipWorkerRegistration}
          />
        );
      
      case 'workerReg4':
        return (
          <WorkerRegistrationStep4
            onBack={() => setCurrentScreen('workerReg3')}
            onContinue={handleWorkerRegistrationStep4Complete}
            onSkip={handleSkipWorkerRegistration}
          />
        );
      
      case 'workerReg5':
        return (
          <WorkerRegistrationStep5
            onBack={() => setCurrentScreen('workerReg4')}
            onSubmit={handleWorkerRegistrationStep5Complete}
          />
        );
      
      case 'employerReg1':
        return (
          <EmployerRegistrationStep1
            onBack={handleBackToHome}
            onContinue={handleEmployerRegistrationStep1Complete}
            onSkip={handleSkipEmployerRegistration}
          />
        );
      
      case 'employerReg2':
        return (
          <EmployerRegistrationStep2
            onBack={() => setCurrentScreen('employerReg1')}
            onContinue={handleEmployerRegistrationStep2Complete}
            onSkip={handleSkipEmployerRegistration}
          />
        );
      
      case 'employerReg3':
        return (
          <EmployerRegistrationStep3
            onBack={() => setCurrentScreen('employerReg2')}
            onSubmit={handleEmployerRegistrationStep3Complete}
          />
        );
      
      case 'dashboard':
        return userType === 'worker' ? (
          <WorkerDashboard onLogout={handleLogout} userName={userName} />
        ) : (
          <EmployerDashboard onLogout={handleLogout} userName={userName} />
        );
      
      default:
        return (
          <HomePage 
            onLogin={handleLogin}
            onSignup={handleSignUp}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <LoadingSpinner size={50} color="#1e293b" />
        </View>
      ) : (
        <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
          {renderScreen()}
        </Animated.View>
      )}
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
