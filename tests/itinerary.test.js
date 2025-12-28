/**
 * Tests for itinerary.js - Itinerary page functionality
 */

describe('Itinerary.js', () => {
  let rootElement;
  let sidebarElement;

  beforeEach(() => {
    // Setup DOM for itinerary page
    document.body.innerHTML = `
      <base href="/desitrails/">
      <body data-itinerary-id="kerala-4-days">
        <article id="itinerary-root"></article>
        <aside id="itinerary-sidebar"></aside>
        <span id="year"></span>
      </body>
    `;
    
    rootElement = document.getElementById('itinerary-root');
    sidebarElement = document.getElementById('itinerary-sidebar');
    
    // Mock URL
    window.location.href = 'http://localhost/states/kerala/itinerary-4-days.html';
    window.location.pathname = '/states/kerala/itinerary-4-days.html';
    window.location.search = '';
    
    fetch.mockClear();
  });

  test('should initialize and fetch itinerary data', () => {
    const mockItineraries = {
      itineraries: [
        {
          id: 'kerala-4-days',
          state: 'kerala',
          title: 'Kerala 4 Days',
          summary: 'Beautiful journey',
          durationDays: 4,
          bestTime: 'October to March',
          route: ['Trivandrum', 'Varkala', 'Alleppey', 'Kochi'],
          days: [
            {
              day: 'Day 1',
              theme: 'Arrival',
              morning: 'Arrive in Trivandrum',
              afternoon: 'Explore beaches',
              evening: 'Relax',
              distanceKm: 0,
              driveTime: '0 hours',
              mustSee: ['Kovalam Beach'],
              optional: []
            }
          ]
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockItineraries
    });

    require('../js/itinerary.js');

    return new Promise(resolve => {
      setTimeout(() => {
        expect(fetch).toHaveBeenCalled();
        expect(sidebarElement.innerHTML).not.toBe('');
        expect(rootElement.children.length).toBeGreaterThan(0);
        resolve();
      }, 200);
    });
  });
});
