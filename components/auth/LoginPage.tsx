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

// interface LoginPageProps {
//   onBack?: () => void;
//   onSignUp?: () => void;
//   onLoginSuccess?: () => void;
//   onForgotPassword?: () => void;
// }

// const LoginPage = ({ onBack, onSignUp, onLoginSuccess, onForgotPassword }: LoginPageProps) => {
//   const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = () => {
//     // Handle login logic
//     if (onLoginSuccess) {
//       onLoginSuccess();
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View className="px-6 py-6" style={{ backgroundColor: '#447788' }}>
//           <View className="flex-row items-center mb-4">
//             <Pressable onPress={onBack} className="mr-4">
//               <Ionicons name="arrow-back" size={24} color="#ffffff" />
//             </Pressable>
//             <Text className="text-white text-xl font-bold">Login</Text>
//           </View>
//           <Text className="text-white text-sm">Welcome back to HaatBazar Jobs</Text>
//         </View>

//         {/* Content - Centered Card */}
//         <View className="items-center px-6 py-8">
//           <View className="w-full" style={{ maxWidth: 500 }}>
//             {/* Login Method */}
//             <View className="flex-row gap-3 mb-6">
//               <Pressable
//                 onPress={() => setLoginMethod('phone')}
//                 className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
//                 style={{
//                   backgroundColor: loginMethod === 'phone' ? '#447788' : '#ffffff',
//                   borderWidth: 1,
//                   borderColor: loginMethod === 'phone' ? '#447788' : '#e5e7eb',
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
//                   color={loginMethod === 'phone' ? '#ffffff' : '#6b7280'}
//                   style={{ marginRight: 6 }}
//                 />
//                 <Text
//                   className="font-semibold"
//                   style={{ color: loginMethod === 'phone' ? '#ffffff' : '#6b7280' }}
//                 >
//                   Phone
//                 </Text>
//               </Pressable>

//               <Pressable
//                 onPress={() => setLoginMethod('email')}
//                 className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
//                 style={{
//                   backgroundColor: loginMethod === 'email' ? '#447788' : '#ffffff',
//                   borderWidth: 1,
//                   borderColor: loginMethod === 'email' ? '#447788' : '#e5e7eb',
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
//                   color={loginMethod === 'email' ? '#ffffff' : '#6b7280'}
//                   style={{ marginRight: 6 }}
//                 />
//                 <Text
//                   className="font-semibold"
//                   style={{ color: loginMethod === 'email' ? '#ffffff' : '#6b7280' }}
//                 >
//                   Email
//                 </Text>
//               </Pressable>
//             </View>

//             {/* Phone Number or Email */}
//             {loginMethod === 'phone' ? (
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
//               className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-2"
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
//                 placeholder="Enter your password"
//                 value={password}
//                 onChangeText={setPassword}
//                 className="flex-1 text-gray-700"
//                 placeholderTextColor="#9ca3af"
//                 secureTextEntry
//               />
//             </View>

//             {/* Forgot Password */}
//             <View className="items-end mb-6">
//               <Pressable onPress={onForgotPassword}>
//                 <Text className="text-sm" style={{ color: '#447788' }}>
//                   Forgot Password?
//                 </Text>
//               </Pressable>
//             </View>

//             {/* Login Button */}
//             <Pressable
//               onPress={handleLogin}
//               className="py-4 rounded-xl active:opacity-90"
//               style={{
//                 backgroundColor: '#447788',
//                 shadowColor: '#000000',
//                 shadowOffset: { width: 0, height: 4 },
//                 shadowOpacity: 0.2,
//                 shadowRadius: 8,
//                 elevation: 6,
//               }}
//             >
//               <Text className="text-white text-center font-bold text-base">
//                 Login
//               </Text>
//             </Pressable>

//             {/* Divider */}
//             <View className="flex-row items-center my-6">
//               <View className="flex-1 h-px bg-gray-300" />
//               <Text className="text-gray-500 text-sm mx-4">OR</Text>
//               <View className="flex-1 h-px bg-gray-300" />
//             </View>

//             {/* Sign Up Link */}
//             <View className="flex-row justify-center">
//               <Text className="text-gray-600 text-sm">Don't have an account? </Text>
//               <Pressable onPress={onSignUp}>
//                 <Text className="font-bold text-sm" style={{ color: '#447788' }}>
//                   Sign Up
//                 </Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default LoginPage;




import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase'; 
import { signInWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { CustomAlert } from '../common/CustomAlert';
import { otpService } from '../services/otpService';
import { userService } from '../services/userService.js';
import { storage } from '../utils/storage';

interface LoginPageProps {
  onBack?: () => void;
  onSignUp?: () => void;
  onLoginSuccess?: (userType: 'worker' | 'employer', profileComplete: boolean, displayName?: string) => void;
  onForgotPassword?: () => void;
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

const LoginPage = ({ onBack, onSignUp, onLoginSuccess, onForgotPassword }: LoginPageProps) => {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogin = async () => {
    if (isLoading) return;

    if (loginMethod === 'phone') {
      if (!phoneNumber.trim()) {
        showCustomAlert("Phone Number Required", "Please enter your phone number");
        return;
      }
      
      if (!password) {
        showCustomAlert("Password Required", "Please enter your password");
        return;
      }

      try {
        setIsLoading(true);
        console.log('🔐 Attempting phone login...');
        
        const formattedPhone = phoneNumber.startsWith("+")
          ? phoneNumber
          : `+977${phoneNumber}`;
        
        console.log('Phone:', formattedPhone);

        const result = await otpService.phoneLogin(formattedPhone, password);
        console.log('Phone login result:', result);

        if (result.success) {
          setIsLoading(false);
          const userType = result.user.userType || 'worker';
          const profileComplete = result.user.profileComplete || false;
          const displayName = result.user.displayName || 'User';
          
          showCustomAlert(
            "Welcome Back! 🎉",
            "Login successful",
            [
              {
                text: "Continue",
                onPress: () => onLoginSuccess?.(userType, profileComplete, displayName)
              }
            ]
          );
        } else {
          setIsLoading(false);
          
          let title = "Login Failed";
          let message = result.message || "Unable to login. Please try again.";
          
          if (result.code === 'PHONE_NOT_FOUND') {
            title = "Phone Number Not Registered";
            message = `No account found with this phone number.\n\nPlease check your number or sign up for a new account.`;
            showCustomAlert(title, message, [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "Sign Up",
                onPress: () => onSignUp?.()
              }
            ]);
          } else if (result.code === 'WRONG_PASSWORD') {
            title = "Incorrect Password";
            message = "The password you entered is incorrect. Please try again or use 'Forgot Password' to reset it.";
            showCustomAlert(title, message);
          } else {
            showCustomAlert(title, message);
          }
        }
      } catch (error: any) {
        setIsLoading(false);
        console.error('❌ Phone login error:', error);
        showCustomAlert("Error", "Unable to login. Please try again.");
      }
      return;
    }

    if (loginMethod === 'email') {
      if (!email.trim()) {
        showCustomAlert("Email Required", "Please enter your email address");
        return;
      }
      
      if (!password) {
        showCustomAlert("Password Required", "Please enter your password");
        return;
      }

      try {
        setIsLoading(true);
        console.log('🔐 Attempting email login...');
        console.log('Email:', email.trim().toLowerCase());

        // Skip the email existence check - just try to login
        // Firebase will give us proper error messages
        console.log('🔥 Signing in with Firebase...');
        
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email.trim().toLowerCase(),
          password
        );

        const user = userCredential.user;
        console.log('✅ Login successful:', user.uid);
        console.log('Email verified:', user.emailVerified);

        if (user.emailVerified) {
          // First, try to get userType from storage (if just verified)
          let userType = await storage.getItem('pendingUserType') as 'worker' | 'employer' | null;
          let displayName = user.displayName || 'User';
          
          console.log('🔍 UserType from storage:', userType);
          console.log('🔍 DisplayName from Firebase:', displayName);
          
          // If not in storage, try to get from backend
          if (!userType) {
            console.log('📥 Fetching user profile from backend...');
            const profileResult = await userService.getUserProfile(user.uid);
            
            if (profileResult.success) {
              userType = profileResult.user.userType || null;
              displayName = profileResult.user.displayName || displayName;
              
              console.log('📊 Profile Result:', profileResult);
              console.log('🔍 Retrieved User Type:', profileResult.user.userType);
              console.log('🔍 Final User Type (after default):', userType);
              console.log('Profile Complete:', profileResult.user.profileComplete);
              console.log('Display Name:', displayName);
            } else {
              console.log('⚠️ Profile not found in backend');
            }
          }
          
          // Default to worker if still no userType
          const finalUserType = userType || 'worker';
          const profileComplete = false; // Will be set during registration
          
          console.log('✅ Final login data:');
          console.log('  UserType:', finalUserType);
          console.log('  DisplayName:', displayName);
          
          // Clear storage
          await storage.removeItem('pendingUserType');
          
          setIsLoading(false);
          showCustomAlert(
            "Welcome Back! 🎉",
            "Login successful",
            [
              {
                text: "Continue",
                onPress: () => onLoginSuccess?.(finalUserType, profileComplete, displayName)
              }
            ]
          );
        } else {
          setIsLoading(false);
          showCustomAlert(
            "Email Not Verified",
            "Please check your email and click the verification link before logging in.\n\nCheck your spam folder if you don't see it."
          );
        }
      } catch (error: any) {
        setIsLoading(false);
        console.error('❌ Login error:', error);
        console.error('Error code:', error.code);
        
        let title = "Login Failed";
        let message = "Unable to login. Please try again.";
        let buttons: any[] = [{ text: "OK" }];
        
        if (error.code === 'auth/wrong-password') {
          title = "Incorrect Password";
          message = "The password you entered is incorrect. Please try again or use 'Forgot Password' to reset it.";
        } else if (error.code === 'auth/user-not-found') {
          title = "Email Not Registered";
          message = "No account found with this email address. Would you like to sign up?";
          buttons = [
            { text: "Cancel", style: "cancel" },
            { text: "Sign Up", onPress: () => onSignUp?.() }
          ];
        } else if (error.code === 'auth/invalid-email') {
          title = "Invalid Email";
          message = "Please enter a valid email address.";
        } else if (error.code === 'auth/too-many-requests') {
          title = "Too Many Attempts";
          message = "Too many failed login attempts. Please try again later or reset your password.";
        } else if (error.code === 'auth/network-request-failed') {
          title = "Network Error";
          message = "Please check your internet connection and try again.";
        } else if (error.code === 'auth/invalid-credential') {
          title = "Incorrect Email or Password";
          message = "The email or password you entered is incorrect. Please check and try again.";
          buttons = [
            { text: "Try Again" },
            { text: "Sign Up Instead", onPress: () => onSignUp?.() }
          ];
        }
        
        showCustomAlert(title, message, buttons);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#447788', '#628BB5', '#B5DBE1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-6 py-6"
        >
          <View className="flex-row items-center mb-4">
            <Pressable onPress={onBack} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <Text className="text-white text-xl font-bold">Login</Text>
          </View>
          <Text className="text-white text-sm">Welcome back to HaatBazar Jobs</Text>
        </LinearGradient>

        {/* Content */}
        <View className="items-center px-6 py-8">
          <View className="w-full" style={{ maxWidth: 500 }}>
            {/* Login Method */}
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => setLoginMethod('phone')}
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                style={{
                  backgroundColor: loginMethod === 'phone' ? '#447788' : '#ffffff',
                  borderWidth: 1,
                  borderColor: loginMethod === 'phone' ? '#447788' : '#e5e7eb',
                }}
              >
                <Ionicons name="call" size={18} color={loginMethod === 'phone' ? '#ffffff' : '#6b7280'} style={{ marginRight: 6 }} />
                <Text className="font-semibold" style={{ color: loginMethod === 'phone' ? '#ffffff' : '#6b7280' }}>Phone</Text>
              </Pressable>

              <Pressable
                onPress={() => setLoginMethod('email')}
                className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                style={{
                  backgroundColor: loginMethod === 'email' ? '#447788' : '#ffffff',
                  borderWidth: 1,
                  borderColor: loginMethod === 'email' ? '#447788' : '#e5e7eb',
                }}
              >
                <Ionicons name="mail" size={18} color={loginMethod === 'email' ? '#ffffff' : '#6b7280'} style={{ marginRight: 6 }} />
                <Text className="font-semibold" style={{ color: loginMethod === 'email' ? '#ffffff' : '#6b7280' }}>Email</Text>
              </Pressable>
            </View>

            {/* Email or Phone */}
            {loginMethod === 'phone' ? (
              <>
                <Text className="text-gray-700 text-sm mb-2">Phone Number</Text>
                <View className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-4" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                  <Ionicons name="call-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="98XXXXXXXX"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    className="flex-1 text-gray-700"
                    keyboardType="phone-pad"
                  />
                </View>

                <Text className="text-gray-700 text-sm mb-2">Password</Text>
                <View className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-2" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 text-gray-700"
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

                <View className="items-end mb-6">
                  <Pressable onPress={onForgotPassword}>
                    <Text className="text-sm" style={{ color: '#447788' }}>Forgot Password?</Text>
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
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <Text className="text-gray-700 text-sm mb-2">Password</Text>
                <View className="bg-white rounded-xl px-4 py-4 flex-row items-center mb-2" style={{ borderWidth: 1, borderColor: '#e5e7eb' }}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 text-gray-700"
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

                <View className="items-end mb-6">
                  <Pressable onPress={onForgotPassword}>
                    <Text className="text-sm" style={{ color: '#447788' }}>Forgot Password?</Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              className="py-4 rounded-xl active:opacity-90 mb-6"
              style={{ backgroundColor: isLoading ? '#9ca3af' : '#447788', elevation: 6 }}
            >
              <Text className="text-white text-center font-bold text-base">
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </Pressable>

            {/* Sign Up Link */}
            <View className="flex-row justify-center">
              <Text className="text-gray-600 text-sm">Don't have an account? </Text>
              <Pressable onPress={onSignUp}>
                <Text className="font-bold text-sm" style={{ color: '#447788' }}>Sign Up</Text>
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

export default LoginPage;
