/**
 * Tests for app.js - Main page functionality
 */

describe('App.js', () => {
  let baseElement;
  let stateGridElement;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <base href="/desitrails/">
      <div id="state-grid"></div>
      <span id="year"></span>
    `;
    
    baseElement = document.querySelector('base');
    stateGridElement = document.getElementById('state-grid');
    
    // Reset fetch mock
    fetch.mockClear();
  });

  test('should initialize when DOM is ready', () => {
    // Mock states data
    const mockStates = {
      states: [
        {
          name: 'Kerala',
          slug: 'kerala',
          vibe: 'Backwaters',
          heroQuery: 'kerala backwaters'
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStates
    });

    // Load app.js
    require('../js/app.js');

    // Wait for async operations
    return new Promise(resolve => {
      setTimeout(() => {
        expect(fetch).toHaveBeenCalled();
        expect(stateGridElement.innerHTML).not.toBe('');
        resolve();
      }, 100);
    });
  });

  test('should handle fetch errors gracefully', () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    require('../js/app.js');

    return new Promise(resolve => {
      setTimeout(() => {
        expect(fetch).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
        resolve();
      }, 100);
    });
  });
});
