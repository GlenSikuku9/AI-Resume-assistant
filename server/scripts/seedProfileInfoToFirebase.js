import { admin, initializeFirebase } from '../config/firebase.js';
initializeFirebase();

const db = admin.firestore();

// Sample job seeker information data
const sampleJobSeekerInfo = {
  personalInfo: {
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/johnsmith',
    portfolio: 'https://johnsmith.dev',
    summary: 'Experienced software engineer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and leading development teams.'
  },
  education: [
    {
      school: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-06',
      gpa: '3.8/4.0',
      achievements: 'Dean\'s List, Computer Science Honor Society, Graduated with Distinction'
    }
  ],
  experience: [
    {
      company: 'TechCorp Inc.',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2020-07',
      endDate: '',
      current: true,
      description: 'Led development of microservices architecture serving 1M+ users. Mentored junior developers and implemented CI/CD pipelines reducing deployment time by 60%.'
    },
    {
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'Palo Alto, CA',
      startDate: '2018-06',
      endDate: '2020-06',
      current: false,
      description: 'Built and maintained web applications using React and Node.js. Collaborated with cross-functional teams to deliver features on time and within scope.'
    }
  ],
  skills: {
    technical: 'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, Git, REST APIs, GraphQL, MongoDB, PostgreSQL',
    soft: 'Leadership, Team Management, Problem Solving, Communication, Agile Methodologies, Project Planning',
    languages: 'English (Native), Spanish (Conversational)',
    certifications: 'AWS Certified Developer, Google Cloud Professional Developer'
  },
  userId: 'sample-user-id', // This should be replaced with actual user ID
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function seedJobSeekerInfo() {
  try {
    const docRef = await db.collection('JobSeekerInfo').add(sampleJobSeekerInfo);
    console.log(`✅ Job seeker information seeded with ID: ${docRef.id}`);
  } catch (err) {
    console.error('❌ Failed to seed job seeker information:', err);
  }
}

// Run the seeding function
console.log('🌱 Starting job seeker information seeding...');
seedJobSeekerInfo(); 