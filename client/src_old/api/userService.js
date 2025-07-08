/**
 * User Service - Handles user management API calls
 */
import apiClient, { SERVICES } from './apiClient';

export const UserService = {
  /**
   * Get user profile info
   * @param {string} username - Username
   * @returns {Promise<Object>} User data
   */
  getUserInfo: (username) => {
    return apiClient.get(SERVICES.USER, `info/${username}`);
  },
  
  /**
   * Update user information
   * @param {string} username - Username
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Update response
   */
  updateUser: (username, userData) => {
    return apiClient.put(SERVICES.USER, 'update', { username, ...userData });
  },
  
  /**
   * Change user password
   * @param {string} username - Username
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password change response
   */
  changePassword: (username, oldPassword, newPassword) => {
    return apiClient.post(SERVICES.USER, 'change-password', { username, oldPassword, newPassword });
  },
  
  /**
   * Delete user account
   * @param {string} username - Username
   * @param {string} password - Password for verification
   * @returns {Promise<Object>} Delete response
   */
  deleteAccount: (username, password) => {
    return apiClient.delete(SERVICES.USER, 'delete-account', { username, password });
  }
};

export default UserService;
