import { API_CONFIG } from '../config/api.config';
import { Platform } from 'react-native';

const BASE_URL = API_CONFIG.AUTH_ENDPOINT;

export const otpService = {
  sendOTP: async (phoneNumber) => {
    try {
      console.log('Sending OTP to:', phoneNumber);
      console.log('API URL:', `${BASE_URL}/send-otp`);
      
      const res = await fetch(`${BASE_URL}/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });
      
      const data = await res.json();
      console.log('OTP Response:', data);
      return data;
    } catch (error) {
      console.error("Send OTP error:", error);
      return { 
        success: false, 
        message: "Network error. Make sure backend is running on port 8080." 
      };
    }
  },

  verifyOTP: async (phoneNumber, otp, password) => {
    try {
      console.log('📞 OTP Service - Verifying OTP');
      console.log('Phone Number:', phoneNumber);
      console.log('OTP:', otp);
      console.log('Password received:', password ? 'YES (length: ' + password.length + ')' : 'NO - MISSING!');
      
      const payload = { phoneNumber, otp, password };
      console.log('Payload being sent:', JSON.stringify(payload));
      
      const res = await fetch(`${BASE_URL}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      console.log('Verify Response:', data);
      return data;
    } catch (error) {
      console.error("Verify OTP error:", error);
      return { 
        success: false, 
        message: "Network error. Make sure backend is running on port 8080." 
      };
    }
  },

  phoneLogin: async (phoneNumber, password) => {
    try {
      console.log('=== PHONE LOGIN DEBUG ===');
      console.log('Phone Number:', phoneNumber);
      console.log('API URL:', `${BASE_URL}/phone-login`);
      console.log('Platform:', Platform.OS);
      
      const res = await fetch(`${BASE_URL}/phone-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, password }),
      });
      
      console.log('Response Status:', res.status);
      console.log('Response OK:', res.ok);
      
      const data = await res.json();
      console.log('Phone Login Response:', data);
      return data;
    } catch (error) {
      console.error("=== PHONE LOGIN ERROR ===");
      console.error("Error Type:", error.name);
      console.error("Error Message:", error.message);
      console.error("Full Error:", error);
      
      return { 
        success: false, 
        message: `Network error: ${error.message}. Check if backend is running and IP address is correct.`,
        code: 'NETWORK_ERROR'
      };
    }
  },
};
