// CORS Test Script
// This script tests the CORS configuration by making requests to the backend API

const API_BASE_URL = 'https://ride-neobize.onrender.com';
const FRONTEND_ORIGIN = 'https://ride.neobize.com';

async function testCORS() {
  console.log('🧪 Testing CORS Configuration...\n');
  
  // Test 1: Health check endpoint
  console.log('1. Testing health check endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Health check successful:', data);
    } else {
      console.log('❌ Health check failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
  }
  
  console.log('\n');
  
  // Test 2: OPTIONS preflight request
  console.log('2. Testing OPTIONS preflight request...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/reservations`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ OPTIONS request status:', response.status);
    console.log('📋 CORS headers:');
    console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    console.log('  Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'));
    console.log('  Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'));
    console.log('  Access-Control-Allow-Credentials:', response.headers.get('Access-Control-Allow-Credentials'));
  } catch (error) {
    console.log('❌ OPTIONS request error:', error.message);
  }
  
  console.log('\n');
  
  // Test 3: Test with invalid origin
  console.log('3. Testing with invalid origin...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Origin': 'https://invalid-domain.com',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      console.log('⚠️ Request with invalid origin was allowed (this might be unexpected)');
    } else {
      console.log('✅ Request with invalid origin was blocked as expected');
    }
  } catch (error) {
    console.log('✅ Request with invalid origin was blocked:', error.message);
  }
  
  console.log('\n🏁 CORS testing completed!');
}

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  testCORS();
} else {
  // Browser environment
  testCORS();
}

module.exports = { testCORS };
