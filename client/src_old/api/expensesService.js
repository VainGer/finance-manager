/**
 * Expenses Service - Handles expenses, categories, businesses and transactions
 */
import apiClient, { SERVICES } from './apiClient';

export const ExpensesService = {
  // Category methods
  /**
   * Create a new expense category
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} name - Category name
   * @returns {Promise<Object>} Create category response
   */
  createCategory: (refId, name) => {
    return apiClient.post(SERVICES.EXPENSES, 'create-category', { refId, name });
  },
  
  /**
   * Create a budget for a category
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @param {Object} budget - Budget object with amount, dates, etc.
   * @returns {Promise<Object>} Create budget response
   */
  createBudget: (refId, catName, budget) => {
    return apiClient.post(SERVICES.EXPENSES, 'create-budget', { refId, catName, budget });
  },
  
  /**
   * Get all category names
   * @param {string} refId - Reference ID (expenses document ID)
   * @returns {Promise<Object>} Categories data
   */
  getCategoriesNames: (refId) => {
    return apiClient.get(SERVICES.EXPENSES, `categories/${refId}`);
  },
  
  /**
   * Rename a category
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} oldName - Current category name
   * @param {string} newName - New category name
   * @returns {Promise<Object>} Rename response
   */
  renameCategory: (refId, oldName, newName) => {
    return apiClient.put(SERVICES.EXPENSES, 'rename-category', { refId, oldName, newName });
  },
  
  /**
   * Delete a category
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @returns {Promise<Object>} Delete response
   */
  deleteCategory: (refId, catName) => {
    return apiClient.delete(SERVICES.EXPENSES, 'delete-category', { refId, catName });
  },
  
  // Business methods
  /**
   * Add a business to a category
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @param {string} name - Business name
   * @returns {Promise<Object>} Add business response
   */
  addBusiness: (refId, catName, name) => {
    return apiClient.post(SERVICES.EXPENSES, 'add-business', { refId, catName, name });
  },
  
  /**
   * Rename a business
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @param {string} oldName - Current business name
   * @param {string} newName - New business name
   * @returns {Promise<Object>} Rename response
   */
  renameBusiness: (refId, catName, oldName, newName) => {
    return apiClient.put(SERVICES.EXPENSES, 'rename-business', { refId, catName, oldName, newName });
  },
  
  /**
   * Get all businesses for a category
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @returns {Promise<Object>} Businesses data
   */
  getBusinessesByCategory: (refId, catName) => {
    return apiClient.get(SERVICES.EXPENSES, `businesses/${refId}/${catName}`);
  },
  
  /**
   * Delete a business
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @param {string} busName - Business name
   * @returns {Promise<Object>} Delete response
   */
  deleteBusiness: (refId, catName, busName) => {
    return apiClient.delete(SERVICES.EXPENSES, 'delete-business', { refId, catName, busName });
  },
  
  // Transaction methods
  /**
   * Create a new transaction
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @param {string} busName - Business name
   * @param {Object} transaction - Transaction data
   * @returns {Promise<Object>} Create transaction response
   */
  createTransaction: (refId, catName, busName, transaction) => {
    return apiClient.post(SERVICES.EXPENSES, 'create-transaction', { refId, catName, busName, transaction });
  },
  
  /**
   * Change transaction amount
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @param {string} busName - Business name
   * @param {string} transactionId - Transaction ID
   * @param {number} newAmount - New amount
   * @returns {Promise<Object>} Update response
   */
  changeTransactionAmount: (refId, catName, busName, transactionId, newAmount) => {
    return apiClient.put(SERVICES.EXPENSES, 'change-transaction-amount', {
      refId, catName, busName, transactionId, newAmount
    });
  },
  
  /**
   * Get all transactions for a business
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @param {string} busName - Business name
   * @returns {Promise<Object>} Transactions data
   */
  getTransactionsByBusiness: (refId, catName, busName) => {
    return apiClient.get(SERVICES.EXPENSES, `transactions/${refId}/${catName}/${busName}`);
  },
  
  /**
   * Get a specific transaction
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @param {string} busName - Business name
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction data
   */
  getTransactionById: (refId, catName, busName, transactionId) => {
    return apiClient.get(SERVICES.EXPENSES, `transaction/${refId}/${catName}/${busName}/${transactionId}`);
  },
  
  /**
   * Delete a transaction
   * @param {string} refId - Reference ID (expenses document ID)
   * @param {string} catName - Category name
   * @param {string} busName - Business name
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Delete response
   */
  deleteTransaction: (refId, catName, busName, transactionId) => {
    return apiClient.delete(SERVICES.EXPENSES, 'delete-transaction', { refId, catName, busName, transactionId });
  },
  
  /**
   * Get all expenses for a profile
   * @param {string} refId - Reference ID (expenses document ID)
   * @returns {Promise<Object>} Profile expenses data
   */
  getProfileExpenses: (refId) => {
    return apiClient.get(SERVICES.EXPENSES, `profile-expenses/${refId}`);
  }
};

export default ExpensesService;
