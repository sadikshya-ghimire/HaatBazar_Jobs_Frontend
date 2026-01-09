// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { otpService } from "../services/otpService";


// interface SignUpPageProps {
//   onBack?: () => void;
//   onLogin?: () => void;
//   onSignUpSuccess?: (userType: 'worker' | 'employer', method: 'phone' | 'email', contact: string) => void;
// }

// const SignUpPage = ({ onBack, onLogin, onSignUpSuccess }: SignUpPageProps) => {
//   const [userType, setUserType] = useState<'worker' | 'employer'>('worker');
//   const [signUpMethod, setSignUpMethod] = useState<'phone' | 'email'>('phone');
//   const [fullName, setFullName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [agreedToTerms, setAgreedToTerms] = useState(false);

// const handleSignUp = async () => {
//   if (!agreedToTerms) {
//     alert("Please agree to the terms and conditions");
//     return;
//   }

//   if (!fullName) {
//     alert("Please enter your full name");
//     return;
//   }

//   if (signUpMethod === "phone") {
//     if (!phoneNumber) {
//       alert("Please enter phone number");
//       return;
//     }

//     // Nepal formatting
//     const formattedPhone = phoneNumber.startsWith("+")
//       ? phoneNumber
//       : `+977${phoneNumber}`;

//     const result = await otpService.sendOTP(formattedPhone);

//     if (result.success) {
//       onSignUpSuccess?.(
//         userType,
//         "phone",
//         formattedPhone
//       );
//     } else {
//       alert(result.message || "Failed to send OTP");
//     }
//   }

//   if (signUpMethod === "email") {
//     alert("Email signup will be added next");
//   }
// };


//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View className="px-6 py-6" style={{ backgroundColor: '#00B8DB' }}>
//           <View className="flex-row items-center mb-4">
//             <Pressable onPress={onBack} className="mr-4">
//               <Ionicons name="arrow-back" size={24} color="#ffffff" />
//             </Pressable>
//             <Text className="text-white text-xl font-bold">Sign Up</Text>
//           </View>
//           <Text className="text-white text-sm">Join HaatBazar Jobs today</Text>
//         </View>

//         {/* Content - Centered Card */}
//         <View className="items-center px-6 py-8">
//           <View className="w-full" style={{ maxWidth: 500 }}>
//             {/* User Type Selection */}
//             <Text className="text-gray-700 text-sm mb-3">I want to:</Text>
//             <View className="flex-row gap-3 mb-6">
//               <Pressable
//                 onPress={() => setUserType('worker')}
//                 className="flex-1 py-4 rounded-xl items-center"
//                 style={{
//                   backgroundColor: userType === 'worker' ? '#00B8DB' : '#ffffff',
//                   borderWidth: 1,
//                   borderColor: userType === 'worker' ? '#00B8DB' : '#e5e7eb',
//                   shadowColor: '#000000',
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.05,
//                   shadowRadius: 4,
//                   elevation: 2,
//                 }}
//               >
//                 <Ionicons
//                   name="briefcase"
//                   size={24}
//                   color={userType === 'worker' ? '#ffffff' : '#9ca3af'}
//                   style={{ marginBottom: 4 }}
//                 />
//                 <Text
//                   className="font-semibold"
//                   style={{ color: userType === 'worker' ? '#ffffff' : '#6b7280' }}
//                 >
//                   Find Jobs
//                 </Text>
//               </Pressable>

//               <Pressable
//                 onPress={() => setUserType('employer')}
//                 className="flex-1 py-4 rounded-xl items-center"
//                 style={{
//                   backgroundColor: userType === 'employer' ? '#00B8DB' : '#ffffff',
//                   borderWidth: 1,
//                   borderColor: userType === 'employer' ? '#00B8DB' : '#e5e7eb',
//                   shadowColor: '#000000',
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.05,
//                   shadowRadius: 4,
//                   elevation: 2,
//                 }}
//               >
//                 <Ionicons
//                   name="people"
//                   size={24}
//                   color={userType === 'employer' ? '#ffffff' : '#9ca3af'}
//                   style={{ marginBottom: 4 }}
//                 />
//                 <Text
//                   className="font-semibold"
//                   style={{ color: userType === 'employer' ? '#ffffff' : '#6b7280' }}
//                 >
//                   Hire Workers
//                 </Text>
//               </Pressable>
//             </View>

//             {/* Sign Up Method */}
//             <Text className="text-gray-700 text-sm mb-3">Sign up with:</Text>
//             <View className="flex-row gap-3 mb-6">
//               <Pressable
//                 onPress={() => setSignUpMethod('phone')}
//                 className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
//                 style={{
//                   backgroundColor: signUpMethod === 'phone' ? '#00B8DB' : '#ffffff',
//                   borderWidth: 1,
//                   borderColor: signUpMethod === 'phone' ? '#00B8DB' : '#e5e7eb',
//                   shadowColor: '#000000',
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.05,
//                   shadowRadius: 4,
//                   elevation: 2,
//                 }}
//               >
//                 <Ionicons
//                   name="call"
//                   size={18}
//                   color={signUpMethod === 'phone' ? '#ffffff' : '#6b7280'}
//                   style={{ marginRight: 6 }}
//                 />
//                 <Text
//                   className="font-semibold"
//                   style={{ color: signUpMethod === 'phone' ? '#ffffff' : '#6b7280' }}
//                 >
//                   Phone
//                 </Text>
//               </Pressable>

//               <Pressable
//                 onPress={() => setSignUpMethod('email')}
//                 className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
//                 style={{
//                   backgroundColor: signUpMethod === 'email' ? '#00B8DB' : '#ffffff',
//                   borderWidth: 1,
//                   borderColor: signUpMethod === 'email' ? '#00B8DB' : '#e5e7eb',
//                   shadowColor: '#000000',
//                   shadowOffset: { width: 0, height: 2 },
//                   shadowOpacity: 0.05,
//                   shadowRadius: 4,
//                   elevation: 2,
//                 }}
//               >
//                 <Ionicons
//                   name="mail"
//                   size={18}
//                   color={signUpMethod === 'email' ? '#ffffff' : '#6b7280'}
//                   style={{ marginRight: 6 }}
//                 />
//                 <Text
//                   className="font-semibold"
//                   style={{ color: signUpMethod === 'email' ? '#ffffff' : '#6b7280' }}
//                 >
//                   Email
//                 </Text>
//               </Pressable>
//             </View>

//             {/* Full Name */}
//             <Text className="text-gray-700 text-sm mb-2">Full Name</Text>
//             <View
//               className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
//               style={{
//                 borderWidth: 1,
//                 borderColor: '#e5e7eb',
//                 shadowColor: '#000000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.05,
//                 shadowRadius: 2,
//                 elevation: 1,
//               }}
//             >
//               <Ionicons name="person-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
//               <TextInput
//                 placeholder="Enter your full name"
//                 value={fullName}
//                 onChangeText={setFullName}
//                 className="flex-1 text-gray-700"
//                 placeholderTextColor="#9ca3af"
//               />
//             </View>

//             {/* Phone Number or Email */}
//             {signUpMethod === 'phone' ? (
//               <>
//                 <Text className="text-gray-700 text-sm mb-2">Phone Number</Text>
//                 <View
//                   className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
//                   style={{
//                     borderWidth: 1,
//                     borderColor: '#e5e7eb',
//                     shadowColor: '#000000',
//                     shadowOffset: { width: 0, height: 1 },
//                     shadowOpacity: 0.05,
//                     shadowRadius: 2,
//                     elevation: 1,
//                   }}
//                 >
//                   <Ionicons name="call-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
//                   <TextInput
//                     placeholder="98XXXXXXXX"
//                     value={phoneNumber}
//                     onChangeText={setPhoneNumber}
//                     className="flex-1 text-gray-700"
//                     placeholderTextColor="#9ca3af"
//                     keyboardType="phone-pad"
//                   />
//                 </View>
//               </>
//             ) : (
//               <>
//                 <Text className="text-gray-700 text-sm mb-2">Email</Text>
//                 <View
//                   className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
//                   style={{
//                     borderWidth: 1,
//                     borderColor: '#e5e7eb',
//                     shadowColor: '#000000',
//                     shadowOffset: { width: 0, height: 1 },
//                     shadowOpacity: 0.05,
//                     shadowRadius: 2,
//                     elevation: 1,
//                   }}
//                 >
//                   <Ionicons name="mail-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
//                   <TextInput
//                     placeholder="Enter your email"
//                     value={email}
//                     onChangeText={setEmail}
//                     className="flex-1 text-gray-700"
//                     placeholderTextColor="#9ca3af"
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                   />
//                 </View>
//               </>
//             )}

//             {/* Password */}
//             <Text className="text-gray-700 text-sm mb-2">Password</Text>
//             <View
//               className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4"
//               style={{
//                 borderWidth: 1,
//                 borderColor: '#e5e7eb',
//                 shadowColor: '#000000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.05,
//                 shadowRadius: 2,
//                 elevation: 1,
//               }}
//             >
//               <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
//               <TextInput
//                 placeholder="Create a password"
//                 value={password}
//                 onChangeText={setPassword}
//                 className="flex-1 text-gray-700"
//                 placeholderTextColor="#9ca3af"
//                 secureTextEntry
//               />
//             </View>

//             {/* Confirm Password */}
//             <Text className="text-gray-700 text-sm mb-2">Confirm Password</Text>
//             <View
//               className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-6"
//               style={{
//                 borderWidth: 1,
//                 borderColor: '#e5e7eb',
//                 shadowColor: '#000000',
//                 shadowOffset: { width: 0, height: 1 },
//                 shadowOpacity: 0.05,
//                 shadowRadius: 2,
//                 elevation: 1,
//               }}
//             >
//               <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
//               <TextInput
//                 placeholder="Confirm your password"
//                 value={confirmPassword}
//                 onChangeText={setConfirmPassword}
//                 className="flex-1 text-gray-700"
//                 placeholderTextColor="#9ca3af"
//                 secureTextEntry
//               />
//             </View>

//             {/* Terms and Conditions */}
//             <Pressable
//               onPress={() => setAgreedToTerms(!agreedToTerms)}
//               className="flex-row items-start mb-6"
//             >
//               <View
//                 className="w-5 h-5 rounded mr-3 items-center justify-center"
//                 style={{
//                   borderWidth: 2,
//                   borderColor: agreedToTerms ? '#00B8DB' : '#d1d5db',
//                   backgroundColor: agreedToTerms ? '#00B8DB' : '#ffffff',
//                 }}
//               >
//                 {agreedToTerms && <Ionicons name="checkmark" size={14} color="#ffffff" />}
//               </View>
//               <Text className="text-gray-600 text-sm flex-1">
//                 I agree to the{' '}
//                 <Text style={{ color: '#00B8DB' }}>Terms & Conditions</Text> and{' '}
//                 <Text style={{ color: '#00B8DB' }}>Privacy Policy</Text>
//               </Text>
//             </Pressable>

//             {/* Create Account Button */}
//             <Pressable
//               onPress={handleSignUp}
//               className="py-4 rounded-xl active:opacity-90"
//               style={{
//                 backgroundColor: '#00B8DB',
//                 shadowColor: '#000000',
//                 shadowOffset: { width: 0, height: 4 },
//                 shadowOpacity: 0.2,
//                 shadowRadius: 8,
//                 elevation: 6,
//               }}
//             >
//               <Text className="text-white text-center font-bold text-base">
//                 Create Account
//               </Text>
//             </Pressable>

//             {/* Divider */}
//             <View className="flex-row items-center my-6">
//               <View className="flex-1 h-px bg-gray-300" />
//               <Text className="text-gray-500 text-sm mx-4">OR</Text>
//               <View className="flex-1 h-px bg-gray-300" />
//             </View>

//             {/* Login Link */}
//             <View className="flex-row justify-center">
//               <Text className="text-gray-600 text-sm">Already have an account? </Text>
//               <Pressable onPress={onLogin}>
//                 <Text className="font-bold text-sm" style={{ color: '#00B8DB' }}>
//                   Login
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SignUpPage;



import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { otpService } from "../services/otpService";
import { userService } from "../services/userService";
import { auth } from '../config/firebase'; 
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { CustomAlert } from '../common/CustomAlert';
import { storage } from '../utils/storage';

interface SignUpPageProps {
  onBack?: () => void;
  onLogin?: () => void;
  onSignUpSuccess?: (userType: 'worker' | 'employer', method: 'phone' | 'email', contact: string, password?: string) => void;
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  buttons: Array<{
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }>;
}

const SignUpPage = ({ onBack, onLogin, onSignUpSuccess }: SignUpPageProps) => {
  const [userType, setUserType] = useState<'worker' | 'employer'>('worker');
  const [signUpMethod, setSignUpMethod] = useState<'phone' | 'email'>('phone');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    buttons: [],
  });

  const showCustomAlert = (title: string, message: string, buttons?: AlertState['buttons']) => {
    setAlertState({
      visible: true,
      title,
      message,
      buttons: buttons || [{ text: 'OK' }],
    });
  };

  const hideAlert = () => {
    setAlertState({ ...alertState, visible: false });
  };

  const handleSignUp = async () => {
    console.log('=== CREATE ACCOUNT BUTTON CLICKED ===');
    console.log('User Type:', userType);
    console.log('Signup Method:', signUpMethod);
    console.log('Full Name:', fullName);
    console.log('Agreed to Terms:', agreedToTerms);
    
    // Prevent double submission
    if (isLoading) {
      console.log('Already loading, returning...');
      return;
    }

    // Basic validation BEFORE setting loading state
    if (!agreedToTerms) {
      console.log('Terms not agreed');
      showCustomAlert("Terms Required", "Please agree to the terms and conditions");
      return;
    }

    if (!fullName.trim()) {
      console.log('Name is empty');
      showCustomAlert("Name Required", "Please enter your full name");
      return;
    }

    try {
      setIsLoading(true);
      console.log('Loading state set to true');

      if (signUpMethod === 'phone') {
        if (!phoneNumber.trim()) {
          setIsLoading(false);
          showCustomAlert("Phone Required", "Please enter your phone number");
          return;
        }

        if (!password || password.length < 6) {
          setIsLoading(false);
          showCustomAlert("Password Too Short", "Password must be at least 6 characters");
          return;
        }

        if (password !== confirmPassword) {
          setIsLoading(false);
          showCustomAlert("Passwords Don't Match", "Please confirm your password correctly");
          return;
        }

        const formattedPhone = phoneNumber.startsWith("+")
          ? phoneNumber
          : `+977${phoneNumber}`;

        console.log('Sending OTP to:', formattedPhone);
        const result = await otpService.sendOTP(formattedPhone);
        console.log('OTP Result:', result);

        if (result.success) {
          console.log('OTP sent successfully, calling onSignUpSuccess');
          onSignUpSuccess?.(userType, "phone", formattedPhone, password);
        } else {
          setIsLoading(false);
          
          // Check if phone number is already registered
          if (result.code === 'PHONE_ALREADY_REGISTERED') {
            showCustomAlert(
              "Phone Number Already Registered",
              "This phone number is already registered. Would you like to login instead?",
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                {
                  text: "Go to Login",
                  onPress: () => onLogin?.()
                }
              ]
            );
          } else {
            showCustomAlert("OTP Failed", result.message || "Failed to send OTP");
          }
        }
      }

      if (signUpMethod === 'email') {
        if (!email.trim()) {
          setIsLoading(false);
          showCustomAlert("Email Required", "Please enter your email");
          return;
        }
        if (!password || password.length < 6) {
          setIsLoading(false);
          showCustomAlert("Password Too Short", "Password must be at least 6 characters");
          return;
        }
        if (password !== confirmPassword) {
          setIsLoading(false);
          showCustomAlert("Passwords Don't Match", "Please confirm your password correctly");
          return;
        }

        console.log('📧 Starting email signup...');
        console.log('Email:', email.trim().toLowerCase());
        console.log('Password length:', password.length);
        console.log('Auth object:', auth ? 'exists' : 'null');
        console.log('Auth config:', auth?.config);
        
        try {
          console.log('🔥 Calling createUserWithEmailAndPassword...');
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.trim().toLowerCase(),
            password
          );

          const user = userCredential.user;
          console.log('✅ User created successfully:', user.uid);
          console.log('User email:', user.email);
          
          // Update Firebase user profile with displayName
          console.log('💾 Updating Firebase profile...');
          console.log('🔍 UserType being saved:', userType);
          console.log('🔍 FullName being saved:', fullName);
          
          await updateProfile(user, {
            displayName: fullName || email.trim().toLowerCase(),
          });
          
          // Save user profile to backend (for additional data)
          const saveResult = await userService.saveUserProfile(
            user.uid,
            email.trim().toLowerCase(),
            userType,
            fullName || email.trim().toLowerCase()
          );
          console.log('✅ User profile saved');
          console.log('📊 Save result:', saveResult);
          
          // Store user type for after email verification
          await storage.setItem('pendingUserType', userType);
          await storage.setItem('pendingEmail', email.trim().toLowerCase());
          await storage.setItem('pendingFirebaseUid', user.uid);
          
          console.log('📨 Sending verification email...');
          
          // Send verification email with redirect URL
          // Only use actionCodeSettings on web (window.location is not available on mobile)
          if (Platform.OS === 'web') {
            const actionCodeSettings = {
              url: window.location.origin, // Redirect back to your app
              handleCodeInApp: true,
            };
            await sendEmailVerification(user, actionCodeSettings);
          } else {
            // On mobile, send without actionCodeSettings
            await sendEmailVerification(user);
          }
          console.log('✅ Verification email sent');

          setIsLoading(false);
          
          // Navigate to verification page instead of showing alert
          console.log('✅ Going to email verification page');
          onSignUpSuccess?.(userType, 'email', email.trim().toLowerCase());
          
        } catch (emailError: any) {
          console.error('❌ Email signup error:', emailError);
          console.error('Error code:', emailError.code);
          console.error('Error message:', emailError.message);
          console.error('Full error:', JSON.stringify(emailError, null, 2));
          throw emailError; // Re-throw to be caught by outer catch
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      setIsLoading(false);
      
      if (error.code === 'auth/email-already-in-use') {
        showCustomAlert(
          "Email Already Registered",
          "This email is already registered. Would you like to login instead?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Go to Login",
              onPress: () => onLogin?.()
            }
          ]
        );
        return;
      }
      
      let message = "Sign up failed. Please try again.";
      
      if (error.code === 'auth/invalid-email') {
        message = "Invalid email address. Please check and try again.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password is too weak. Use at least 6 characters.";
      } else if (error.code === 'auth/network-request-failed') {
        message = "Network error. Please check your connection.";
      } else if (error.code === 'auth/api-key-not-valid') {
        message = "Firebase configuration error. Please clear cache and restart:\n\nnpx expo start -c";
      } else if (error.message) {
        message = error.message;
      }

      showCustomAlert("Error", message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6" style={{ backgroundColor: '#00B8DB' }}>
          <View className="flex-row items-center mb-4">
            <Pressable onPress={onBack} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <Text className="text-white text-xl font-bold">Sign Up</Text>
          </View>
          <Text className="text-white text-sm">Join HaatBazar Jobs today</Text>
        </View>

        {/* Content */}
        <View className="items-center px-6 py-8">
          <View className="w-full" style={{ maxWidth: 500 }}>
            {/* User Type Selection */}
            <Text className="text-gray-700 text-sm mb-3">I want to:</Text>
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => setUserType('worker')}
                className="flex-1 py-4 rounded-xl items-center"
                style={{
                  backgroundColor: userType === 'worker' ? '#00B8DB' : '#ffffff',
                  borderWidth: 1,
                  borderColor: userType === 'worker' ? '#00B8DB' : '#e5e7eb',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons
                  name="briefcase"
                  size={24}
                  color={userType === 'worker' ? '#ffffff' : '#9ca3af'}
                  style={{ marginBottom: 4 }}
                />
                <Text className="font-semibold" style={{ color: userType === 'worker' ? '#ffffff' : '#6b7280' }}>
                  Find Jobs
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setUserType('employer')}
                className="flex-1 py-4 rounded-xl items-center"
                style={{
                  backgroundColor: userType === 'employer' ? '#00B8DB' : '#ffffff',
                  borderWidth: 1,
                  borderColor: userType === 'employer' ? '#00B8DB' : '#e5e7eb',
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons
                  name="people"
                  size={24}
                  color={userType === 'employer' ? '#ffffff' : '#9ca3af'}
                  style={{ marginBottom: 4 }}
                />
                <Text className="font-semibold" style={{ color: userType === 'employer' ? '#ffffff' : '#6b7280' }}>
                  Hire Workers
                </Text>
              </Pressable>
            </View>

            {/* Sign Up Method */}
            <Text className="text-gray-700 text-sm mb-3">Sign up with:</Text>
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => setSignUpMethod('phone')}
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                style={{
                  backgroundColor: signUpMethod === 'phone' ? '#00B8DB' : '#ffffff',
                  borderWidth: 1,
                  borderColor: signUpMethod === 'phone' ? '#00B8DB' : '#e5e7eb',
                }}
              >
                <Ionicons name="call" size={18} color={signUpMethod === 'phone' ? '#ffffff' : '#6b7280'} style={{ marginRight: 6 }} />
                <Text className="font-semibold" style={{ color: signUpMethod === 'phone' ? '#ffffff' : '#6b7280' }}>Phone</Text>
              </Pressable>

              <Pressable
                onPress={() => setSignUpMethod('email')}
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                style={{
                  backgroundColor: signUpMethod === 'email' ? '#00B8DB' : '#ffffff',
                  borderWidth: 1,
                  borderColor: signUpMethod === 'email' ? '#00B8DB' : '#e5e7eb',
                }}
              >
                <Ionicons name="mail" size={18} color={signUpMethod === 'email' ? '#ffffff' : '#6b7280'} style={{ marginRight: 6 }} />
                <Text className="font-semibold" style={{ color: signUpMethod === 'email' ? '#ffffff' : '#6b7280' }}>Email</Text>
              </Pressable>
            </View>

            {/* Full Name */}
            <Text className="text-gray-700 text-sm mb-2">Full Name</Text>
            <View className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
              <Ionicons name="person-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
              <TextInput
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                className="flex-1 text-gray-700"
                placeholderTextColor="#9ca3af"
              />
            </View>

            {/* Phone or Email */}
            {signUpMethod === 'phone' ? (
              <>
                <Text className="text-gray-700 text-sm mb-2">Phone Number</Text>
                <View className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                  <Ionicons name="call-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="98XXXXXXXX"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    className="flex-1 text-gray-700"
                    placeholderTextColor="#9ca3af"
                    keyboardType="phone-pad"
                  />
                </View>

                <Text className="text-gray-700 text-sm mb-2">Password</Text>
                <View className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Create a password (min 6 chars)"
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 text-gray-700"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </Pressable>
                </View>

                <Text className="text-gray-700 text-sm mb-2">Confirm Password</Text>
                <View className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-6" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    className="flex-1 text-gray-700"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons 
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text className="text-gray-700 text-sm mb-2">Email</Text>
                <View className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                  <Ionicons name="mail-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    className="flex-1 text-gray-700"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <Text className="text-gray-700 text-sm mb-2">Password</Text>
                <View className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Create a password (min 6 chars)"
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 text-gray-700"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </Pressable>
                </View>

                <Text className="text-gray-700 text-sm mb-2">Confirm Password</Text>
                <View className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-6" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    className="flex-1 text-gray-700"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons 
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </Pressable>
                </View>
              </>
            )}

            {/* Terms */}
            <Pressable onPress={() => setAgreedToTerms(!agreedToTerms)} className="flex-row items-start mb-6">
              <View className="w-5 h-5 rounded mr-3 items-center justify-center" style={{ borderWidth: 2, borderColor: agreedToTerms ? '#00B8DB' : '#d1d5db', backgroundColor: agreedToTerms ? '#00B8DB' : '#ffffff' }}>
                {agreedToTerms && <Ionicons name="checkmark" size={14} color="#ffffff" />}
              </View>
              <Text className="text-gray-600 text-sm flex-1">
                I agree to the <Text style={{ color: '#00B8DB' }}>Terms & Conditions</Text> and <Text style={{ color: '#00B8DB' }}>Privacy Policy</Text>
              </Text>
            </Pressable>

            {/* Create Account Button */}
            <Pressable
              onPress={() => {
                console.log('Button pressed!');
                handleSignUp();
              }}
              disabled={isLoading}
              className="py-4 rounded-xl active:opacity-90 mb-6"
              style={{ backgroundColor: isLoading ? '#9ca3af' : '#00B8DB', elevation: 6 }}
            >
              <Text className="text-white text-center font-bold text-base">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Pressable>

            {/* Login Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600 text-sm">Already have an account? </Text>
              <Pressable onPress={onLogin}>
                <Text className="font-bold text-sm" style={{ color: '#00B8DB' }}>Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Custom Alert Modal */}
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onDismiss={hideAlert}
      />
    </SafeAreaView>
  );
};

export default SignUpPage;
