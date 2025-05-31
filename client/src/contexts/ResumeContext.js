import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const ResumeContext = createContext();

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider = ({ children }) => {
  const [resume, setResume] = useState(null);
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load resume data
  const loadResume = async (resumeId) => {
    try {
      const response = await axios.get(`/api/resume/${resumeId}`);
      setResume(response.data);
      setVersions(response.data.versions || []);
    } catch (err) {
      setError('Failed to load resume');
      console.error('Error loading resume:', err);
    }
  };

  // Save resume with debounce
  const saveResume = debounce(async (content) => {
    if (!resume?.id) return;

    setIsSaving(true);
    try {
      await axios.put(`/api/resume/${resume.id}`, {
        content,
        version: {
          timestamp: new Date().toISOString(),
          content
        }
      });
      
      // Update versions list
      const newVersion = {
        timestamp: new Date().toISOString(),
        content
      };
      setVersions(prev => [newVersion, ...prev]);
      
    } catch (err) {
      setError('Failed to save resume');
      console.error('Error saving resume:', err);
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  // Update resume content
  const updateContent = (content) => {
    setResume(prev => ({ ...prev, content }));
    saveResume(content);
  };

  // Restore previous version
  const restoreVersion = (content, versionIndex) => {
    setCurrentVersion(versionIndex);
    updateContent(content);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      saveResume.cancel();
    };
  }, []);

  const value = {
    resume,
    versions,
    currentVersion,
    isSaving,
    error,
    loadResume,
    updateContent,
    restoreVersion
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};

export default ResumeContext; 