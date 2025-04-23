const API_URL = 'http://localhost:5500/api/auth';

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (username, password, email) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};