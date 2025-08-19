import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AIContext = createContext();

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Send message to AI
  const sendMessage = async (message, resumeId, section) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post('/api/ai/edit-section', {
        resumeId,
        section,
        instruction: message
      });

      const newMessage = {
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };

      const aiResponse = {
        type: 'ai',
        content: response.data.content,
        suggestions: response.data.suggestions,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, newMessage, aiResponse]);
      setSuggestions(response.data.suggestions || []);

      return response.data;
    } catch (err) {
      setError('Failed to process AI request');
      console.error('Error processing AI request:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Get keyword suggestions
  const getKeywordSuggestions = async (jobDescription, section) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post('/api/ai/keywords', {
        jobDescription,
        section
      });

      setSuggestions(response.data.keywords || []);
      return response.data.keywords;
    } catch (err) {
      setError('Failed to get keyword suggestions');
      console.error('Error getting keywords:', err);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setChatHistory([]);
    setSuggestions([]);
  };

  const value = {
    chatHistory,
    suggestions,
    isProcessing,
    error,
    sendMessage,
    getKeywordSuggestions,
    clearChat
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export default AIContext; 