import { admin, initializeFirebase } from '../config/firebase.js';
initializeFirebase();

const db = admin.firestore();

const firstTemplate = {
  name: 'Modern Professional',
  category: 'balanced-combination',
  description: 'A clean, ATS-optimized layout with centered header and left-aligned sections. Best for design, product, and general professional roles.',
  previewImage: '/Images/template1.png', // Replace with actual preview URL
  sections: [
    { name: 'contact', required: true },
    { name: 'summary', required: true },
    { name: 'education', required: true },
    { name: 'projects', required: false },
    { name: 'experience', required: true },
    { name: 'skills', required: false }
  ],
  defaultOrder: [
    'contact',
    'summary',
    'education',
    'projects',
    'experience',
    'skills'
  ],
  styling: {
    fontFamily: 'Inter',
    primaryColor: '#212121',
    spacing: '1.5em',
    alignments: {
      name: 'center',
      title: 'center',
      contact: 'center',
      sectionTitle: 'left',
      contentText: 'left',
      date: 'right'
    },
    sectionStyles: {
      sectionTitleFontSize: '16px',
      sectionTitleFontWeight: '600',
      contentFontSize: '14px',
      contentLineHeight: '1.5',
      bulletStyle: 'disc'
    },
    layout: {
      summary: 'full-width',
      experience: 'block',
      education: 'block',
      projects: 'block',
      skills: 'inline-list'
    }
  },
  isActive: true,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function seedFirstTemplate() {
  try {
    const docRef = await db.collection('templates').add(firstTemplate);
    console.log(`✅ Template seeded with ID: ${docRef.id}`);
  } catch (err) {
    console.error('❌ Failed to seed template:', err);
  }
}

seedFirstTemplate();

const secondTemplate = {
  name: 'Executive Minimalist',
  category: 'timeline-driven',
  description: 'Designed for professionals with strong experience backgrounds. Timeline-style layout with right-aligned contact info and bold section titles.',
  previewImage: '/Images/template2.png', // Replace with actual image link
  sections: [
    { name: 'contact', required: true },
    { name: 'summary', required: true },
    { name: 'experience', required: true },
    { name: 'projects', required: false },
    { name: 'skills', required: false },
    { name: 'education', required: true }
  ],
  defaultOrder: [
    'contact',
    'summary',
    'experience',
    'projects',
    'skills',
    'education'
  ],
  styling: {
    fontFamily: 'Georgia',
    primaryColor: '#000000',
    spacing: '1.2em',
    alignments: {
      name: 'left',
      title: 'left',
      contact: 'right',
      sectionTitle: 'left',
      contentText: 'left',
      date: 'right'
    },
    sectionStyles: {
      sectionTitleFontSize: '15px',
      sectionTitleFontWeight: '700',
      contentFontSize: '13.5px',
      contentLineHeight: '1.4',
      bulletStyle: 'circle'
    },
    layout: {
      summary: 'full-width',
      experience: 'block',
      education: 'block',
      projects: 'block',
      skills: 'inline-list'
    }
  },
  isActive: true,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function seedSecondTemplate() {
  try {
    const docRef = await db.collection('templates').add(secondTemplate);
    console.log(`✅ Second template seeded with ID: ${docRef.id}`);
  } catch (err) {
    console.error('❌ Failed to seed second template:', err);
  }
}

seedSecondTemplate();

const thirdTemplate = {
  name: 'Skills Showcase',
  category: 'skills-focused',
  description: 'A modern layout designed to highlight skills, featuring a right-aligned header, a centered summary, and clear, left-aligned sections for detailed experience.',
  previewImage: '/Images/template3.png', // Replace with actual preview URL
  sections: [
    { name: 'contact', required: true },
    { name: 'summary', required: true },
    { name: 'skills', required: true },
    { name: 'experience', required: true },
    { name: 'projects', required: false },
    { name: 'education', required: true }
  ],
  defaultOrder: [
    'contact',
    'summary',
    'skills',
    'experience',
    'projects',
    'education'
  ],
  styling: {
    fontFamily: 'Helvetica', // A clean, professional sans-serif font
    primaryColor: '#222222',
    spacing: '1.4em',
    alignments: {
      name: 'right',
      title: 'right',
      contact: 'right',
      summary: 'center', // As per your specific instruction
      sectionTitle: 'left',
      contentText: 'left',
      date: 'right'
    },
    sectionStyles: {
      sectionTitleFontSize: '17px',
      sectionTitleFontWeight: '600',
      contentFontSize: '14px',
      contentLineHeight: '1.5',
      bulletStyle: 'disc'
    },
    layout: {
      summary: 'full-width',
      skills: 'inline-list', // Important for a skills-focused layout
      experience: 'block',
      projects: 'block',
      education: 'block'
    }
  },
  isActive: true,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function seedThirdTemplate() {
  try {
    const docRef = await db.collection('templates').add(thirdTemplate);
    console.log(`✅ Third template seeded with ID: ${docRef.id}`);
  } catch (err) {
    console.error('❌ Failed to seed third template:', err);
  }
}

// Make sure to call the function to seed the template
seedThirdTemplate();