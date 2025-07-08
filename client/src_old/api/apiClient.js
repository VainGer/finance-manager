/**
 * API Client for Finance Manager Application
 * A modular and abstract service client to handle all API communications
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500/api';

/**
 * HTTP request methods
 */
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

/**
 * Service endpoints used in the application
 */
const SERVICES = {
  AUTH: 'auth',
  PROFILE: 'profile',
  EXPENSES: 'expenses',
  BUSINESS: 'business',
  CATEGORY: 'category',
  TRANSACTION: 'transactions',
  USER: 'user'
};

class ApiClient {
  /**
   * Create a new API client instance
   * @param {string} baseUrl - Base URL for the API
   */
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = null;
  }
  
  /**
   * Set the authentication token for API calls
   * @param {string} token - JWT token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }
  
  /**
   * Load token from local storage
   */
  loadToken() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.token = token;
    }
    return this.token;
  }
  
  /**
   * Clear the authentication token
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }
  
  /**
   * Get default headers for API calls
   * @returns {Object} Headers object
   */
  getHeaders() {
    const headers = { 
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }
  
  /**
   * Universal API call method
   * @param {string} service - Service name (auth, profile, expenses, etc.)
   * @param {string} endpoint - API endpoint
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {Object} data - Request payload
   * @param {Object} queryParams - URL query parameters
   * @returns {Promise<any>} - Response data
   */
  async call(service, endpoint, method = HTTP_METHODS.GET, data = null, queryParams = {}) {
    try {
      // Construct the URL with query parameters
      let url = `${this.baseUrl}/${service}/${endpoint}`;
      
      // Add query parameters if they exist
      if (Object.keys(queryParams).length > 0) {
        const queryString = new URLSearchParams(queryParams).toString();
        url = `${url}?${queryString}`;
      }
      
      // Configure the request options
      const options = {
        method,
        headers: this.getHeaders(),
      };
      
      // Add request body for non-GET requests
      if (method !== HTTP_METHODS.GET && data) {
        options.body = JSON.stringify(data);
      }
      
      // Make the fetch request
      const response = await fetch(url, options);
      const responseData = await response.json();
      
      // Handle error responses
      if (!response.ok) {
        throw new ApiError(
          responseData.message || response.statusText,
          response.status,
          responseData
        );
      }
      
      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw new ApiError(
          'Network or server error occurred',
          500,
          { originalError: error.message }
        );
      }
    }
  }
  
  /**
   * Shorthand method for GET requests
   */
  async get(service, endpoint, queryParams = {}) {
    return this.call(service, endpoint, HTTP_METHODS.GET, null, queryParams);
  }
  
  /**
   * Shorthand method for POST requests
   */
  async post(service, endpoint, data = {}) {
    return this.call(service, endpoint, HTTP_METHODS.POST, data);
  }
  
  /**
   * Shorthand method for PUT requests
   */
  async put(service, endpoint, data = {}) {
    return this.call(service, endpoint, HTTP_METHODS.PUT, data);
  }
  
  /**
   * Shorthand method for DELETE requests
   */
  async delete(service, endpoint, data = {}) {
    return this.call(service, endpoint, HTTP_METHODS.DELETE, data);
  }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Export the constants and client
export { HTTP_METHODS, SERVICES, ApiError };

// Create and export a singleton instance for app-wide use
const apiClient = new ApiClient();
export default apiClient;
