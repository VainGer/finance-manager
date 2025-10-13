import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Vite dev server
    supportFile: false, // Disable support file requirement
    
    // Enhanced stability configuration
    retries: { runMode: 2, openMode: 0 }, // Stability in CI, no retries in dev
    defaultCommandTimeout: 8000,          // Handle DB/server latency
    requestTimeout: 10000,               // API request timeout
    responseTimeout: 10000,              // API response timeout
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    // API base URL for the SmartFinance backend
    API_BASE: 'http://localhost:5500/api'
  }
})