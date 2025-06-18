import { getAuth } from 'firebase/auth';

const API_BASE_URL = '/api/profile-info';

class ProfileInfoService {
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

  async createProfileInfo(profileData) {
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
        throw new Error(errorData.error || 'Failed to create profile information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating profile information:', error);
      throw error;
    }
  }

  async getProfileInfoList() {
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
        throw new Error(errorData.error || 'Failed to fetch profile information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching profile information list:', error);
      throw error;
    }
  }

  async getProfileInfoById(id) {
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
        throw new Error(errorData.error || 'Failed to fetch profile information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching profile information:', error);
      throw error;
    }
  }

  async updateProfileInfo(id, profileData) {
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
        throw new Error(errorData.error || 'Failed to update profile information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating profile information:', error);
      throw error;
    }
  }

  async deleteProfileInfo(id) {
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
        throw new Error(errorData.error || 'Failed to delete profile information');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting profile information:', error);
      throw error;
    }
  }
}

export default new ProfileInfoService(); 