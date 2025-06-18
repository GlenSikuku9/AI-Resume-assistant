import { getAuth } from 'firebase/auth';

const API_BASE_URL = '/api/job-description';

class JobDescriptionService {
  constructor() {
    // Don't initialize auth immediately - lazy load it
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
    try {
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

      return await response.json();
    } catch (error) {
      console.error('Error creating job description:', error);
      throw error;
    }
  }

  async getJobDescriptionList() {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch job descriptions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job description list:', error);
      throw error;
    }
  }

  async getJobDescriptionById(id) {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch job description');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job description:', error);
      throw error;
    }
  }

  async updateJobDescription(id, jobData) {
    try {
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

      return await response.json();
    } catch (error) {
      console.error('Error updating job description:', error);
      throw error;
    }
  }

  async deleteJobDescription(id) {
    try {
      const token = await this.getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete job description');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting job description:', error);
      throw error;
    }
  }
}

export default new JobDescriptionService(); 