import { admin, initializeFirebase } from '../config/firebase.js';
initializeFirebase();

const db = admin.firestore();

// Example chat messages to seed
const chatMessages = [
  {
    userId: 'USER_ID_1',
    resumeId: 'RESUME_ID_1',
    role: 'user',
    section: 'summary',
    content: 'Can you make my summary more concise?',
    timestamp: null
  },
  {
    userId: 'USER_ID_1',
    resumeId: 'RESUME_ID_1',
    role: 'ai',
    section: 'summary',
    content: '<h2>Summary</h2><p>Concise summary here...</p>',
    timestamp: null
  },
  {
    userId: 'USER_ID_2',
    resumeId: 'RESUME_ID_2',
    role: 'user',
    section: 'experience',
    content: 'Rewrite my experience to focus on leadership.',
    timestamp: null
  },
  {
    userId: 'USER_ID_2',
    resumeId: 'RESUME_ID_2',
    role: 'ai',
    section: 'experience',
    content: '<h2>Experience</h2><ul><li>Led a team of developers to deliver projects on time...</li></ul>',
    timestamp: null
  }
];

async function seedChatMessages() {
  console.log('🌱 Starting chat message seeding...');
  for (const msg of chatMessages) {
    const { userId, resumeId, ...rest } = msg;
    const chatRef = db
      .collection('resumes')
      .doc(resumeId)
      .collection('aiChats')
      .doc();
    await chatRef.set({
      userId,
      resumeId,
      ...rest,
      timestamp: rest.timestamp || admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`✅ Seeded chat message for user ${userId}, resume ${resumeId}`);
  }
  console.log('🌱 Chat message seeding complete.');
}

seedChatMessages()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error seeding chat messages:', err);
    process.exit(1);
  }); 