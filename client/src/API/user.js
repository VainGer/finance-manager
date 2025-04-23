const API_URL = 'http://localhost:5500/api/user';

export const createProfile = async (username, profileName, pin, parent) => {
  try {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, pin, parent })
    });
    return await response.json();
  } catch (error) {
    console.error('Create profile error:', error);
    throw error;
  }
};

export const getProfiles = async (username) => {
  try {
    const response = await fetch(`${API_URL}/get_profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Get profiles error:', error);
    throw error;
  }
};

export const openProfile = async (username, profileName, pin) => {
  try {
    const response = await fetch(`${API_URL}/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, pin })
    });
    return await response.json();
  } catch (error) {
    console.error('Open profile error:', error);
    throw error;
  }
};

export const deleteProfile = async (username, profileName, pin) => {
  try {
    const response = await fetch(`${API_URL}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, pin })
    });
    return await response.json();
  } catch (error) {
    console.error('Delete profile error:', error);
    throw error;
  }
};

export const renameProfile = async (username, profileName, pin, newProfileName) => {
  try {
    const response = await fetch(`${API_URL}/rename`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, pin, newProfileName })
    });
    return await response.json();
  } catch (error) {
    console.error('Rename profile error:', error);
    throw error;
  }
};

export const changePin = async (username, profileName, pin, newPin) => {
  try {
    const response = await fetch(`${API_URL}/change_pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, pin, newPin })
    });
    return await response.json();
  } catch (error) {
    console.error('Change PIN error:', error);
    throw error;
  }
};