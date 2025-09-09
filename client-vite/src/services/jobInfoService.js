import { getAuth } from 'firebase/auth';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/job-description`;

class JobDescriptionService {
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

  async createJobDescription(jobData) {
    const token = await this.getAuthToken();
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create job description');
    }
    return response.json();
  }

  async getJobDescriptionList() {
    const token = await this.getAuthToken();
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch job descriptions');
    }
    return response.json();
  }

  async getJobDescriptionById(id) {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch job description');
    }
    return response.json();
  }

  async updateJobDescription(id, jobData) {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update job description');
    }
    return response.json();
  }

  async deleteJobDescription(id) {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete job description');
    }
    return response.json();
  }
}

export default new JobDescriptionService();
