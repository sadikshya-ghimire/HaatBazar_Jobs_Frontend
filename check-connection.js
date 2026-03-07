// Quick script to test if backend is reachable
const testConnection = async () => {
  const IP = '172.20.10.4'; // Update with your IP
  const PORT = 8080;
  const url = `http://${IP}:${PORT}/api/auth/profile/test`;
  
  console.log('🔍 Testing connection to backend...');
  console.log('📡 URL:', url);
  console.log('');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log('✅ Backend is reachable!');
    console.log('   Status:', response.status);
    console.log('   OK:', response.ok);
    console.log('');
    console.log('👍 Your backend is working!');
  } catch (error) {
    console.log('❌ Cannot reach backend');
    console.log('   Error:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   1. Is backend running? Run: cd backend && node src/server.js');
    console.log('   2. Is IP correct? Your IP:', IP);
    console.log('   3. Are you on the same network?');
    console.log('   4. Check firewall settings');
  }
};

testConnection();
