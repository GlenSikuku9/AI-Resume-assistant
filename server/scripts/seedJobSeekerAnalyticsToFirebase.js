import { admin, initializeFirebase } from '../config/firebase.js';
initializeFirebase();

const db = admin.firestore();

// Sample analytics data for demonstration
const sampleAnalytics = {
  userId: 'sample-user-id',
  totalResumesCreated: 5,
  totalApiCalls: 120 ,
  totalPDFDownloads: 15,
  totalAITokensUsed: 3500,
  templateUsageCount: {
    'template1': 3,
    'template2': 1,
    'template3': 1
  },
  mostUsedTemplate: 'template1',
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function seedAdminAnalytics() {
  try {
    const docRef = await db.collection('Admin').add(sampleAnalytics);
    console.log(`✅ Admin analytics seeded with ID: ${docRef.id}`);
  } catch (err) {
    console.error('❌ Failed to seed Admin analytics:', err);
  }
}

// Run the seeding function
console.log('🌱 Starting Admin analytics seeding...');
seedAdminAnalytics(); 