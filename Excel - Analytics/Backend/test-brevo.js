// test-brevo.js - COMPLETE FILE - Create this in your Backend folder
import dotenv from 'dotenv';
import { testBrevoConnection } from './mailtrap/brevo.config.js';

// Load environment variables from parent directory
dotenv.config({ path: '../.env' });

console.log('🧪 Testing Brevo configuration...');
console.log('Current directory:', process.cwd());
console.log('Looking for: ./mailtrap/brevo.config.js');
console.log('Environment check:');
console.log('- BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
console.log('- SENDER_EMAIL exists:', !!process.env.SENDER_EMAIL);
console.log('- SENDER_NAME exists:', !!process.env.SENDER_NAME);

testBrevoConnection().then(success => {
    if (success) {
        console.log('🎉 Brevo is working correctly!');
        process.exit(0);
    } else {
        console.log('❌ Brevo test failed - check the logs above');
        process.exit(1);
    }
}).catch(error => {
    console.error('❌ Test failed with error:', error.message);
    process.exit(1);
});