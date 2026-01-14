import { Platform } from 'react-native';

// API Configuration
// Automatically detects platform and uses correct URL

// IMPORTANT: Update this with your computer's IP address for mobile testing
// Find your IP: 
// - Mac/Linux: Run in terminal: ifconfig | grep "inet "
// - Windows: Run in terminal: ipconfig
const YOUR_COMPUTER_IP = "192.168.1.74"; // ⚠️ Update with your computer's IP address

// Automatically use correct URL based on platform
const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    // Web browser can use localhost
    return "http://localhost:8080";
  } else {
    // Mobile devices need your computer's IP address
    return `http://${YOUR_COMPUTER_IP}:8080`;
  }
};

export const API_URL = `${getApiBaseUrl()}/api`;
export const API_BASE_URL = getApiBaseUrl();
