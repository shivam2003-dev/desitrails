/**
 * Jest setup file for DesiTrails tests
 * Configures testing environment and global mocks
 */

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    hostname: 'localhost',
    pathname: '/',
    search: '',
    searchParams: new URLSearchParams()
  },
  writable: true
});

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Setup DOM structure
beforeEach(() => {
  document.body.innerHTML = '';
  fetch.mockClear();
  console.log.mockClear();
  console.error.mockClear();
});
