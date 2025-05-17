const API_URL = 'http://localhost:5500/api/transactions';

export const addTransaction = async (username, profileName, category, business, price, date, description = '') => {
  try {
    const response = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, category, business, price, date, description })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Add transaction error:', error);
    throw error;
  }
};

export const editTransactionPrice = async (username, profileName, category, business, id, newPrice) => {
  try {
    const response = await fetch(`${API_URL}/edit-price`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, category, business, id, newPrice })
    });
    return await response.json();
  } catch (error) {
    console.error('Edit transaction price error:', error);
    throw error;
  }
};

export const editTransactionDate = async (username, profileName, category, business, id, newDate) => {
  try {
    const response = await fetch(`${API_URL}/edit-date`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, category, business, id, newDate })
    });
    return await response.json();
  } catch (error) {
    console.error('Edit transaction date error:', error);
    throw error;
  }
};

export const deleteTransaction = async (username, profileName, category, business, id) => {
  try {
    const response = await fetch(`${API_URL}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, profileName, category, business, id })
    });
    return await response.json();
  } catch (error) {
    console.error('Delete transaction error:', error);
    throw error;
  }
};