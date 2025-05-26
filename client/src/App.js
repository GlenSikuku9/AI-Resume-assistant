import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Navigation from './components/Navigation';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import ResumeEditor from './components/resume/ResumeEditor';
import AdminDashboard from './components/admin/AdminDashboard';
import TemplateSelection from './components/resume/TemplateSelection';
import JobForm from './components/resume/JobForm';
import ProfileForm from './components/resume/ProfileForm';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  return currentUser && isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="container py-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/templates" element={
                <ProtectedRoute>
                  <TemplateSelection />
                </ProtectedRoute>
              } />
              
              <Route path="/job-form" element={
                <ProtectedRoute>
                  <JobForm />
                </ProtectedRoute>
              } />
              
              <Route path="/profile-form" element={
                <ProtectedRoute>
                  <ProfileForm />
                </ProtectedRoute>
              } />
              
              <Route path="/editor/:resumeId" element={
                <ProtectedRoute>
                  <ResumeEditor />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 