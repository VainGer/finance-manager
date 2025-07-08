/**
 * Profile Service - Handles profile-related API calls
 */
import apiClient, { SERVICES } from './apiClient';

export const ProfileService = {
  /**
   * Create a new profile
   * @param {string} username - Username
   * @param {string} profileName - Profile name
   * @param {boolean} parent - Is parent profile
   * @param {string} pin - Profile PIN
   * @returns {Promise<Object>} Create profile response
   */
  createProfile: (username, profileName, parent, pin) => {
    return apiClient.post(SERVICES.PROFILE, 'create-profile', { username, profileName, parent, pin });
  },
}
  /**
   * Validate a profile (login to profile)
   * @param {string} username - Username
   * @param {string} profileName - Profile name
   * @param {string} pin - Profile PIN
   * @returns {Promise<Object>} Profile validation response
   */
  validateProfile: (username, profileName, pin) => {
    return apiClient.post(SERVICES.PROFILE, 'validate-profile', { username, profileName, pin });
  },
  
  /**
   * Fetch all profiles for a user
   * @param {string} username - Username
   * @returns {Promise<Object>} Profiles list
   */
  getAllProfiles: (username) => {
    return apiClient.get(SERVICES.PROFILE, 'get-profiles', { username });
  },
  
  /**
   * Rename a profile
   * @param {string} username - Username
   * @param {string} oldProfileName - Current profile name
   * @param {string} newProfileName - New profile name
   * @returns {Promise<Object>} Rename response
   */
  renameProfile: (username, oldProfileName, newProfileName) => {
    return apiClient.post(SERVICES.PROFILE, 'rename-profile', { username, oldProfileName, newProfileName });
  },
  
  /**
   * Change profile PIN
   * @param {string} username - Username
   * @param {string} profileName - Profile name
   * @param {string} oldPin - Current PIN
   * @param {string} newPin - New PIN
   * @returns {Promise<Object>} Change PIN response
   */
  changePin: (username, profileName, oldPin, newPin) => {
    return apiClient.post(SERVICES.PROFILE, 'change-pin', { username, profileName, oldPin, newPin });
  },
  
  /**
   * Delete a profile
   * @param {string} username - Username
   * @param {string} profileName - Profile name
   * @param {string} pin - Profile PIN for verification
   * @returns {Promise<Object>} Delete response
   */
  deleteProfile: (username, profileName, pin) => {
    return apiClient.post(SERVICES.PROFILE, 'delete-profile', { username, profileName, pin });
  },
  
  /**
   * Set profile avatar
   * @param {string} username - Username
   * @param {string} profileName - Profile name
   * @param {string} avatar - Avatar data (Base64 or URL)
   * @returns {Promise<Object>} Avatar update response
   */
  setAvatar: (username, profileName, avatar) => {
    return apiClient.post(SERVICES.PROFILE, 'set-avatar', { username, profileName, avatar });
  }
};

export default ProfileService;
