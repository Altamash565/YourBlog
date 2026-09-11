import { Client } from 'appwrite';
import config from './config/config';

function testAppwriteConnection() {
  try {
    if (config.appwriteUrl && config.appwriteProjectId) {
      new Client().setEndpoint(config.appwriteUrl).setProject(config.appwriteProjectId);

      console.log('✅ Appwrite client initialized:');
      console.log('Endpoint:', config.appwriteUrl);
      console.log('Project ID:', config.appwriteProjectId);
    } else {
      console.warn(
        '⚠️ Appwrite client not initialized: Missing environment variables in .env'
      );
    }
  } catch (error) {
    console.error('❌ Appwrite connection failed:', error);
  }
}

testAppwriteConnection();
