// config/firebase.js
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

let isInitialized = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeFirebase = () => {
  if (!isInitialized) {
    const serviceAccountPath = path.join(__dirname, 'ai-resume-assistant-3ca9c-firebase-adminsdk-fbsvc-8e1f5e49db.json');
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    isInitialized = true;
  }
};

export { admin, initializeFirebase };
