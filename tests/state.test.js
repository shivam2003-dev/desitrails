/**
 * Tests for state.js - State detail page functionality
 */

describe('State.js', () => {
  let routesElement;
  let themesElement;
  let heroImageElement;

  beforeEach(() => {
    // Setup DOM for state page
    document.body.innerHTML = `
      <base href="/desitrails/">
      <body data-state="kerala">
        <img id="hero-img" />
        <div id="routes"></div>
        <div id="themes"></div>
      </body>
    `;
    
    routesElement = document.getElementById('routes');
    themesElement = document.getElementById('themes');
    heroImageElement = document.getElementById('hero-img');
    
    // Mock URL
    window.location.href = 'http://localhost/states/kerala/';
    window.location.pathname = '/states/kerala/';
    window.location.search = '';
    
    fetch.mockClear();
  });

  test('should initialize and fetch state data', () => {
    const mockStates = {
      states: [
        {
          name: 'Kerala',
          slug: 'kerala',
          vibe: 'Backwaters',
          themes: ['Beach', 'Backwaters'],
          places: ['Kochi', 'Alleppey']
        }
      ]
    };

    const mockItineraries = {
      itineraries: [
        {
          id: 'kerala-4-days',
          state: 'kerala',
          title: 'Kerala 4 Days',
          route: ['Trivandrum', 'Varkala']
        }
      ]
    };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStates
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockItineraries
      });

    require('../js/state.js');

    return new Promise(resolve => {
      setTimeout(() => {
        expect(fetch).toHaveBeenCalled();
        resolve();
      }, 200);
    });
  });

  test('should render routes correctly', () => {
    const mockStates = {
      states: [
        {
          name: 'Kerala',
          slug: 'kerala',
          themes: ['Beach']
        }
      ]
    };

    const mockItineraries = {
      itineraries: [
        {
          id: 'kerala-4-days',
          state: 'kerala',
          title: 'Kerala 4 Days',
          route: ['Trivandrum', 'Varkala'],
          durationDays: 4
        }
      ]
    };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStates
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockItineraries
      });

    require('../js/state.js');

    return new Promise(resolve => {
      setTimeout(() => {
        expect(routesElement.innerHTML).toContain('Kerala 4 Days');
        resolve();
      }, 200);
    });
  });

  test('should render themes correctly', () => {
    const mockStates = {
      states: [
        {
          name: 'Kerala',
          slug: 'kerala',
          themes: ['Beach', 'Backwaters', 'Nature']
        }
      ]
    };

    const mockItineraries = {
      itineraries: []
    };

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStates
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockItineraries
      });

    require('../js/state.js');

    return new Promise(resolve => {
      setTimeout(() => {
        expect(themesElement.innerHTML).toContain('Beach');
        expect(themesElement.innerHTML).toContain('Backwaters');
        resolve();
      }, 200);
    });
  });

  test('should handle missing state data gracefully', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ states: [] })
    });

    require('../js/state.js');

    return new Promise(resolve => {
      setTimeout(() => {
        expect(console.error).toHaveBeenCalled();
        resolve();
      }, 200);
    });
  });
});

