const API_URL = 'http://localhost:5500/api/business';

export const addBusiness = async (username, profileName, categoryName, businessName) => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pName: profileName, categoryName, businessName })
    });
    return await response.json();
  } catch (error) {
    console.error('Add business error:', error);
    throw error;
  }
};

export const renameBusiness = async (username, profileName, categoryName, businessName, newName) => {
  try {
    const response = await fetch(`${API_URL}/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pName: profileName, categoryName, businessName, newName })
    });
    return await response.json();
  } catch (error) {
    console.error('Rename business error:', error);
    throw error;
  }
};

export const migrateBusiness = async (username, profileName, currentCategoryName, nextCategoryName, businessName) => {
  try {
    const response = await fetch(`${API_URL}/migrate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pName: profileName, currentCategoryName, nextCategoryName, businessName })
    });
    return await response.json();
  } catch (error) {
    console.error('Migrate business error:', error);
    throw error;
  }
};

export const removeBusinessFromCategory = async (username, profileName, categoryName, businessName) => {
  try {
    const response = await fetch(`${API_URL}/remove`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pName: profileName, categoryName, businessName })
    });
    return await response.json();
  } catch (error) {
    console.error('Remove business error:', error);
    throw error;
  }
};

export const getBusinessNames = async (username, profileName, categoryName) => {
  try {
    const response = await fetch(`${API_URL}/names`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, pName: profileName, categoryName })
    });
    const res = await response.json();
    return res;
  } catch (error) {
    console.error('Get business names error:', error);
    throw error;
  }
};