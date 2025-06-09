import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Initialize Firebase using the imported configuration
      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      const db = getFirestore(app);

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Get user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();
            
            // Create a user object with both auth and Firestore data
            const userWithData = {
              ...user,
              name: userData?.name || 'User',
              isAdmin: userData?.isAdmin || false
            };
            
            setCurrentUser(userWithData);
            setIsAdmin(userData?.isAdmin || false);
          } catch (err) {
            console.error('Error fetching user data:', err);
            setCurrentUser(user);
            setIsAdmin(false);
          }
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      console.error('Firebase initialization error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Sign up function
  const signup = async (email, password) => {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login function
  const login = async (email, password) => {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const db = getFirestore();
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();
    
    // Return user with Firestore data
    return {
      ...user,
      name: userData?.name || 'User',
      isAdmin: userData?.isAdmin || false
    };
  };

  // Logout function
  const logout = async () => {
    const auth = getAuth();
    return signOut(auth);
  };

  const value = {
    currentUser,
    isAdmin,
    error,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </AuthContext.Provider>
  );
}