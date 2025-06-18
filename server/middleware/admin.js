// admin.js
import { admin } from '../config/firebase.js'; // Added .js extension

export const isAdmin = async (req, res, next) => { // Changed to named export
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.data()?.isAdmin) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
