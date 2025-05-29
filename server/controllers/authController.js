const { admin } = require('../config/firebase');

const getProfile = async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    const userProfile = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .get();

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      ...userProfile.data()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .set(req.body, { merge: true });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile
}; 