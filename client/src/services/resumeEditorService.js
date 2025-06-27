// Service for ResumeEditor-related API calls

import { getAuth } from 'firebase/auth';

const API_BASE_URL = '/api';

class ResumeEditorService {
  constructor() {
    this._auth = null;
  }

  get auth() {
    if (!this._auth) {
      this._auth = getAuth();
    }
    return this._auth;
  }

  async getAuthToken() {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  async fetchResume(resumeId) {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch resume');
    }
    return response.json();
  }

  async saveResume(resumeId, content, version, userId) {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content, version, userId })
    });
    if (!response.ok) {
      throw new Error('Failed to save resume');
    }
    return response.json();
  }

  async fetchChatMessages(resumeId) {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/ai/chat-messages/${resumeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch chat messages');
    }
    return response.json();
  }

  async editSectionAI({ userId, resumeId, content, instruction }) {
    try {
      const token = await this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/ai/edit-section`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, resumeId, content, instruction }),
      });
      if (!response.ok) {
        throw new Error('Failed to edit section with AI');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
}

export default new ResumeEditorService();

// Optionally, you can add a utility for exporting as PDF if you want to centralize it
// export function exportResumeAsPDF(content, filename) { ... } 