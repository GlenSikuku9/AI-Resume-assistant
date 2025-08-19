import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Navigation from '../components/navigation/Navigation.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import Dashboard from '../pages/user/Dashboard.jsx';
import ResumeEditor from '../pages/resume/ResumeEditor.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import TemplateSelection from '../pages/resume/TemplateSelection.jsx';
import JobForm from '../pages/resume/JobForm.jsx';
import ProfileForm from '../pages/resume/ProfileForm.jsx';
import LandingPage from '../pages/landing/LandingPage.jsx';
import AdminTemplates from '../pages/admin/AdminTemplates.jsx';

// Context
import { AuthProvider, useAuth } from '../contexts/AuthContext';

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
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
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
              <Route path="/admin/templates" element={
                <AdminRoute>
                  <AdminTemplates />
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