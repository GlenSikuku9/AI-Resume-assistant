import { getAuth } from 'firebase/auth';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/job-seeker-info`;

class JobSeekerInfoService {
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

  async createJobSeekerInfo(profileData) {
    const token = await this.getAuthToken();
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create job seeker information');
    }
    return response.json();
  }

  async getJobSeekerInfoList() {
    const token = await this.getAuthToken();
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch job seeker information');
    }
    return response.json();
  }

  async getJobSeekerInfoById(id) {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch job seeker information');
    }
    return response.json();
  }

  async updateJobSeekerInfo(id, profileData) {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update job seeker information');
    }
    return response.json();
  }

  async deleteJobSeekerInfo(id) {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete job seeker information');
    }
    return response.json();
  }
}

export default new JobSeekerInfoService();
