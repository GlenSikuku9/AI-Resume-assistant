import { admin, initializeFirebase } from '../config/firebase.js';
initializeFirebase();

const db = admin.firestore();

// Sample job information data
const sampleJobInfo = {
  title: 'Senior Software Engineer',
  company: 'Tech Corp Inc.',
  description: 'We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for developing high-quality software solutions and collaborating with cross-functional teams.',
  requirements: [
    'Bachelor\'s degree in Computer Science or related field',
    '5+ years of experience in software development',
    'Proficiency in JavaScript, Python, and React',
    'Experience with cloud platforms (AWS, Azure, or GCP)',
    'Strong problem-solving and analytical skills',
    'Excellent communication and teamwork abilities'
  ],
  responsibilities: [
    'Design and implement scalable software solutions',
    'Collaborate with product managers and designers',
    'Write clean, maintainable, and well-documented code',
    'Participate in code reviews and technical discussions',
    'Mentor junior developers and share knowledge',
    'Contribute to architectural decisions and system design'
  ],
  keySkills: [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'AWS',
    'Docker',
    'Git',
    'REST APIs',
    'Microservices',
    'Agile/Scrum'
  ],
  userId: 'sample-user-id', // This should be replaced with actual user ID
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

async function seedJobInfo() {
  try {
    const docRef = await db.collection('jobInfo').add(sampleJobInfo);
    console.log(`✅ Job information seeded with ID: ${docRef.id}`);
  } catch (err) {
    console.error('❌ Failed to seed job information:', err);
  }
}

// Function to seed multiple job entries for testing
async function seedMultipleJobEntries() {
  const jobEntries = [
    {
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      description: 'Join our fast-growing startup as a Frontend Developer. You will work on cutting-edge web applications and help shape our product.',
      requirements: [
        '3+ years of frontend development experience',
        'Strong knowledge of HTML, CSS, and JavaScript',
        'Experience with modern frameworks (React, Vue, or Angular)',
        'Understanding of responsive design principles',
        'Familiarity with version control systems'
      ],
      responsibilities: [
        'Build responsive and interactive user interfaces',
        'Optimize applications for maximum speed and scalability',
        'Collaborate with backend developers and designers',
        'Ensure cross-browser compatibility',
        'Write unit tests and maintain code quality'
      ],
      keySkills: [
        'HTML5',
        'CSS3',
        'JavaScript',
        'React',
        'TypeScript',
        'Webpack',
        'Jest',
        'Git'
      ],
      userId: 'sample-user-id-2'
    },
    {
      title: 'Data Scientist',
      company: 'Analytics Corp',
      description: 'We are seeking a Data Scientist to help us extract insights from large datasets and build predictive models.',
      requirements: [
        'Master\'s degree in Statistics, Mathematics, or related field',
        '3+ years of experience in data science',
        'Proficiency in Python and R',
        'Experience with machine learning algorithms',
        'Strong statistical analysis skills'
      ],
      responsibilities: [
        'Analyze large datasets to identify trends and patterns',
        'Develop and implement machine learning models',
        'Create data visualizations and reports',
        'Collaborate with business stakeholders',
        'Present findings to technical and non-technical audiences'
      ],
      keySkills: [
        'Python',
        'R',
        'SQL',
        'TensorFlow',
        'PyTorch',
        'Pandas',
        'NumPy',
        'Scikit-learn',
        'Tableau',
        'Jupyter'
      ],
      userId: 'sample-user-id-3'
    }
  ];

  for (const jobEntry of jobEntries) {
    try {
      const jobData = {
        ...jobEntry,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await db.collection('jobInfo').add(jobData);
      console.log(`✅ Job information seeded with ID: ${docRef.id} for ${jobEntry.title} at ${jobEntry.company}`);
    } catch (err) {
      console.error(`❌ Failed to seed job information for ${jobEntry.title}:`, err);
    }
  }
}

// Run the seeding functions
console.log('🌱 Starting job information seeding...');
seedJobInfo();
seedMultipleJobEntries(); 