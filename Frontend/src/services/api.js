import axios from 'axios';
import Constants from 'expo-constants';

// Get API URL from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL); // For debugging

export const recordsAPI = {
  // Get all records with optional filters
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/records`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching records:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get single record
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching record:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Create new record
  create: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/records`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000 // 30 second timeout for image uploads
      });
      return response.data;
    } catch (error) {
      console.error('Error creating record:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Update record (can include new images)
  update: async (id, formData) => {
    try {
      const response = await axios.put(`${API_URL}/records/${id}`, formData, {
        headers: formData instanceof FormData ? { 
          'Content-Type': 'multipart/form-data'
        } : {},
        timeout: 30000
      });
      return response.data;
    } catch (error) {
      console.error('Error updating record:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Delete record
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting record:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/records/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
      throw error;
    }
  }
};
