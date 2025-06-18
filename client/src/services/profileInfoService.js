import { getAuth } from 'firebase/auth';

const API_BASE_URL = '/api/job-seeker-info';

class JobSeekerInfoService {
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

  async createJobSeekerInfo(profileData) {
    try {
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

      return await response.json();
    } catch (error) {
      console.error('Error creating job seeker information:', error);
      throw error;
    }
  }

  async getJobSeekerInfoList() {
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
        throw new Error(errorData.error || 'Failed to fetch job seeker information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job seeker information list:', error);
      throw error;
    }
  }

  async getJobSeekerInfoById(id) {
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
        throw new Error(errorData.error || 'Failed to fetch job seeker information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job seeker information:', error);
      throw error;
    }
  }

  async updateJobSeekerInfo(id, profileData) {
    try {
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

      return await response.json();
    } catch (error) {
      console.error('Error updating job seeker information:', error);
      throw error;
    }
  }

  async deleteJobSeekerInfo(id) {
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
        throw new Error(errorData.error || 'Failed to delete job seeker information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting job seeker information:', error);
      throw error;
    }
  }
}

export default new JobSeekerInfoService(); 