import { Platform } from 'react-native';

// 🚀 DYNAMIC IP CONFIGURATION
// This will try to auto-detect your IP, but you can also set it manually
// Auto-detection works when running through Expo CLI
// Manual IP is used as fallback for direct device connections

// MANUAL IP (Update this if auto-detection doesn't work)
const MANUAL_IP = '192.168.1.74'; // ⚠️ Update with your current IP
// Common IPs: WiFi (192.168.x.x), Hotspot iPhone (172.20.10.x), Hotspot Android (192.168.43.x)

// Try to auto-detect IP from Expo (works if expo-constants is installed)
const getAutoDetectedIP = () => {
  try {
    // Try to import expo-constants dynamically
    const Constants = require('expo-constants').default;
    
    if (Constants && Constants.manifest) {
      const { debuggerHost, hostUri } = Constants.manifest;
      
      if (debuggerHost) {
        const ip = debuggerHost.split(':')[0];
        console.log('✅ Auto-detected IP from debuggerHost:', ip);
        return ip;
      }
      
      if (hostUri) {
        const ip = hostUri.split(':')[0];
        console.log('✅ Auto-detected IP from hostUri:', ip);
        return ip;
      }
    }
  } catch (error) {
    console.log('ℹ️ expo-constants not available, using manual IP');
  }
  
  return null;
};

const getApiBaseUrl = () => {
  // For web, use localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }
  
  // For mobile, try auto-detection first, then fall back to manual IP
  const autoIP = getAutoDetectedIP();
  const ip = autoIP || MANUAL_IP;
  
  console.log('📡 Using IP:', ip, autoIP ? '(auto-detected)' : '(manual)');
  return `http://${ip}:8080`;
};

const BASE_URL = getApiBaseUrl();

console.log('🌐 API Configuration:');
console.log('   Platform:', Platform.OS);
console.log('   Base URL:', BASE_URL);
console.log('   Backend should be running at:', BASE_URL);

export const API_CONFIG = {
  BASE_URL: BASE_URL,
  AUTH_ENDPOINT: `${BASE_URL}/api/auth`,
  WORKER_PROFILE_ENDPOINT: `${BASE_URL}/api/worker-profile`,
  EMPLOYER_PROFILE_ENDPOINT: `${BASE_URL}/api/employer-profile`,
  WORKER_JOB_OFFER_ENDPOINT: `${BASE_URL}/api/worker-job-offers`,
  EMPLOYER_JOB_OFFER_ENDPOINT: `${BASE_URL}/api/employer-job-offers`,
  BOOKING_ENDPOINT: `${BASE_URL}/api/bookings`,
  CHAT_ENDPOINT: `${BASE_URL}/api/chats`,
  UPLOAD_ENDPOINT: `${BASE_URL}/api/upload`,
};

// Export for backward compatibility
export default API_CONFIG;
