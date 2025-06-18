import { getAuth } from 'firebase/auth';

const API_BASE_URL = '/api/job-info';

class JobInfoService {
  constructor() {
    // Get auth instance - Firebase v9+ will use the default app
    this.auth = getAuth();
  }

  async getAuthToken() {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  async createJobInfo(jobData) {
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
        throw new Error(errorData.error || 'Failed to create job information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating job information:', error);
      throw error;
    }
  }

  async getJobInfoList() {
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
        throw new Error(errorData.error || 'Failed to fetch job information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job information list:', error);
      throw error;
    }
  }

  async getJobInfoById(id) {
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
        throw new Error(errorData.error || 'Failed to fetch job information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching job information:', error);
      throw error;
    }
  }

  async updateJobInfo(id, jobData) {
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
        throw new Error(errorData.error || 'Failed to update job information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating job information:', error);
      throw error;
    }
  }

  async deleteJobInfo(id) {
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
        throw new Error(errorData.error || 'Failed to delete job information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting job information:', error);
      throw error;
    }
  }
}

export default new JobInfoService(); 