// jest.setup.js
import { jest } from '@jest/globals';

// Mock timeout for Jest async tests
jest.setTimeout(10000);

// Set NODE_ENV to test for proper test environment detection
process.env.NODE_ENV = 'test';
process.env.MPDB_AUTH_TOKEN = 'test-token';

// Mock console.log to prevent noisy logs during tests
const originalConsoleLog = console.log;
console.log = (...args) => {
  // Filter out some noisy logs if needed
  if (args[0] === '[MPDB Client]') {
    return; // Suppress API client logs
  }
  originalConsoleLog(...args);
};

// Global cleanup to handle any potential async leaks
afterAll(() => {
  // Restore console.log
  console.log = originalConsoleLog;
  
  // Add a small delay to ensure background processes complete
  return new Promise(resolve => setTimeout(resolve, 100));
});

// Set up a global mock for the API client
jest.mock('./src/apiClient.js', () => {
  const mockFunctions = {
    getDatabases: jest.fn().mockResolvedValue({ databases: ['db1', 'db2'] }),
    createDatabase: jest.fn().mockResolvedValue({ success: true }),
    getCollections: jest.fn().mockResolvedValue({ collections: ['col1', 'col2'] }),
    createCollection: jest.fn().mockResolvedValue({ success: true }),
    getDocuments: jest.fn().mockResolvedValue({ documents: [] }),
    getDocument: jest.fn().mockResolvedValue({ document: {} }),
    insertDocument: jest.fn().mockResolvedValue({ success: true, documentId: 'doc123' }),
    updateDocument: jest.fn().mockResolvedValue({ success: true }),
    deleteDocument: jest.fn().mockResolvedValue({ success: true }),
    queryDocuments: jest.fn().mockResolvedValue({ documents: [] }),
    getCurrentEndpoint: jest.fn().mockReturnValue('http://test-endpoint:5000'),
    getHealth: jest.fn().mockResolvedValue({ status: 'ok' }),
    discoverApiEndpoint: jest.fn().mockResolvedValue('http://localhost:5000'),
    getConnectionInfo: jest.fn().mockResolvedValue({}),
    rediscoverEndpoint: jest.fn().mockResolvedValue(true),
    testDaemonConnection: jest.fn().mockResolvedValue({ success: true })
  };
  
  return {
    __esModule: true,
    ...mockFunctions,
    default: mockFunctions
  };
});