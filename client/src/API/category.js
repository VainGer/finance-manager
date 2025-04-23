const API_URL = 'http://localhost:5500/api/category';

export const addCategory = async (username, profileName, category, privacy) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, category, privacy })
    });
    return await response.json();
  } catch (error) {
    console.error('Add category error:', error);
    throw error;
  }
};

export const removeCategory = async (username, profileName, category) => {
  try {
    const response = await fetch(`${API_URL}/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, category })
    });
    return await response.json();
  } catch (error) {
    console.error('Remove category error:', error);
    throw error;
  }
};

export const removeCategoryAndSaveBusinesses = async (username, profileName, category, nextCat) => {
  try {
    const response = await fetch(`${API_URL}/remove-save-businesses`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, category, nextCat })
    });
    return await response.json();
  } catch (error) {
    console.error('Remove category and save businesses error:', error);
    throw error;
  }
};

export const renameCategory = async (username, profileName, category, newName) => {
  try {
    const response = await fetch(`${API_URL}/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, category, newName })
    });
    return await response.json();
  } catch (error) {
    console.error('Rename category error:', error);
    throw error;
  }
};

export const setCategoryPrivacy = async (username, profileName, category, privacy) => {
  try {
    const response = await fetch(`${API_URL}/set-privacy`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, category, privacy })
    });
    return await response.json();
  } catch (error) {
    console.error('Set category privacy error:', error);
    throw error;
  }
};

export const getProfileCategories = async (username, profileName) => {
  try {
    const response = await fetch(`${API_URL}/profile?username=${encodeURIComponent(username)}&profileName=${encodeURIComponent(profileName)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    console.error('Get profile categories error:', error);
    throw error;
  }
};

export const getAccountCategories = async (username, profileName) => {
  try {
    const response = await fetch(`${API_URL}/account?username=${encodeURIComponent(username)}&profileName=${encodeURIComponent(profileName)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    console.error('Get account categories error:', error);
    throw error;
  }
};

export const getCategoryNames = async (username, profileName) => {
  try {
    const response = await fetch(`${API_URL}/names?username=${encodeURIComponent(username)}&profileName=${encodeURIComponent(profileName)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    console.error('Get category names error:', error);
    throw error;
  }
};

export const getAccountCategoryNames = async (username, profileName) => {
  try {
    const response = await fetch(`${API_URL}/account-names?username=${encodeURIComponent(username)}&profileName=${encodeURIComponent(profileName)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    console.error('Get account category names error:', error);
    throw error;
  }
};