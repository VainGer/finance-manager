/**
 * Auth Service - Handles authentication-related API calls
 */
import apiClient, { SERVICES } from './apiClient';

export const AuthService = {
  /**
   * User login
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<Object>} Login response with token
   */
  login: async (username, password) => {
    const response = await apiClient.post(SERVICES.AUTH, 'login', { username, password });
    
    if (response.token) {
      apiClient.setToken(response.token);
    }
    
    return response;
  },
  
  /**
   * User registration
   * @param {string} username - Username
   * @param {string} email - Email
   * @param {string} password - Password
   * @returns {Promise<Object>} Registration response
   */
  register: (username, email, password) => {
    return apiClient.post(SERVICES.AUTH, 'register', { username, email, password });
  },
  
  /**
   * User logout
   */
  logout: () => {
    apiClient.clearToken();
    // Additional cleanup if necessary
  },
  
  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return !!apiClient.loadToken();
  }
};

export default AuthService;
