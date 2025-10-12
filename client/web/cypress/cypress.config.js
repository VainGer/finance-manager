import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Vite dev server
    supportFile: false, // Disable support file requirement
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    // API base URL for the Finance Manager backend
    API_BASE: 'http://localhost:5500/api'
  }
})