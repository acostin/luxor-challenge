// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables for testing
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.NODE_ENV = 'test'

// Suppress console.error for expected test errors
const originalError = console.error;
console.error = (...args) => {
  // Only suppress errors that are part of our test scenarios
  const message = args[0];
  if (typeof message === 'string' && 
      (message.includes('Error fetching users:') || 
       message.includes('Error fetching collections:'))) {
    return; // Suppress expected test errors
  }
  originalError(...args);
}; 