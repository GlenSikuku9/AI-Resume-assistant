import { admin, initializeFirebase } from '../config/firebase.js';

initializeFirebase();

const db = admin.firestore();

// Sample AI chat messages
const aiChats = [
  // User references a section
  {
    userId: 'user_123',
    resumeId: 'resume_abc',
    role: 'user',
    content: 'Work experience at Company X, 2018-2020.', // Referenced section
    referenced: 'Work experience at Company X, 2018-2020.',
    instruction: 'Make it more concise and impactful.',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  },
  // AI responds to referenced section
  {
    userId: 'user_123',
    resumeId: 'resume_abc',
    role: 'ai',
    content: '<p>Revised: Led a team at Company X, achieving 30% growth in 2 years.</p>',
    referenced: 'Work experience at Company X, 2018-2020.',
    instruction: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  },
  // User sends entire resume (no reference)
  {
    userId: 'user_123',
    resumeId: 'resume_abc',
    role: 'user',
    content: '<div>Full resume HTML here...</div>', // Entire resume
    referenced: null,
    instruction: 'Review my entire resume for grammar.',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  },
  // AI responds to entire resume
  {
    userId: 'user_123',
    resumeId: 'resume_abc',
    role: 'ai',
    content: '<div>Corrected resume HTML here...</div>',
    referenced: null,
    instruction: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  },
  // Another user message with reference
  {
    userId: 'user_456',
    resumeId: 'resume_xyz',
    role: 'user',
    content: 'Education: BSc Computer Science, 2015-2019.',
    referenced: 'Education: BSc Computer Science, 2015-2019.',
    instruction: 'Rewrite to highlight academic achievements.',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  },
  // AI responds to education section
  {
    userId: 'user_456',
    resumeId: 'resume_xyz',
    role: 'ai',
    content: "<p>Graduated with honors in Computer Science, 2019. Dean's List 2017-2019.</p>",
    referenced: 'Education: BSc Computer Science, 2015-2019.',
    instruction: null,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function seedAIChats() {
  for (const chat of aiChats) {
    try {
      const docRef = await db.collection('aiChats').add(chat);
      console.log(`✅ Seeded aiChats message with ID: ${docRef.id} | Role: ${chat.role} | Content: ${chat.content.slice(0, 30)}`);
    } catch (err) {
      console.error('❌ Failed to seed aiChats message:', err);
    }
  }
}

console.log('🌱 Starting aiChats seeding...');
seedAIChats(); 