/**
 * Tests for data files - JSON structure validation
 */

const fs = require('fs');
const path = require('path');

describe('Data Files', () => {
  let statesData;
  let itinerariesData;

  beforeAll(() => {
    // Load data files
    const statesPath = path.join(__dirname, '../data/states.json');
    const itinerariesPath = path.join(__dirname, '../data/itineraries.json');
    
    statesData = JSON.parse(fs.readFileSync(statesPath, 'utf8'));
    itinerariesData = JSON.parse(fs.readFileSync(itinerariesPath, 'utf8'));
  });

  describe('states.json', () => {
    test('should be valid JSON', () => {
      expect(statesData).toBeDefined();
      expect(Array.isArray(statesData.states)).toBe(true);
    });

    test('should have required fields for each state', () => {
      statesData.states.forEach(state => {
        expect(state).toHaveProperty('name');
        expect(state).toHaveProperty('slug');
        expect(state).toHaveProperty('vibe');
        expect(typeof state.name).toBe('string');
        expect(typeof state.slug).toBe('string');
      });
    });

    test('should have unique slugs', () => {
      const slugs = statesData.states.map(s => s.slug);
      const uniqueSlugs = new Set(slugs);
      expect(slugs.length).toBe(uniqueSlugs.size);
    });

    test('should have valid state count (all states + UTs)', () => {
      // India has 28 states + 8 UTs = 36 total
      expect(statesData.states.length).toBeGreaterThanOrEqual(30);
    });
  });

  describe('itineraries.json', () => {
    test('should be valid JSON', () => {
      expect(itinerariesData).toBeDefined();
      expect(Array.isArray(itinerariesData.itineraries)).toBe(true);
    });

    test('should have required fields for each itinerary', () => {
      itinerariesData.itineraries.forEach(itinerary => {
        expect(itinerary).toHaveProperty('id');
        expect(itinerary).toHaveProperty('state');
        expect(itinerary).toHaveProperty('title');
        expect(itinerary).toHaveProperty('durationDays');
        expect(itinerary).toHaveProperty('route');
        expect(itinerary).toHaveProperty('days');
        expect(Array.isArray(itinerary.days)).toBe(true);
        expect(itinerary.days.length).toBeGreaterThan(0);
      });
    });

    test('should have valid day structure', () => {
      itinerariesData.itineraries.forEach(itinerary => {
        itinerary.days.forEach(day => {
          expect(day).toHaveProperty('day');
          expect(day).toHaveProperty('theme');
          expect(day).toHaveProperty('morning');
          expect(day).toHaveProperty('afternoon');
          expect(day).toHaveProperty('evening');
          expect(day).toHaveProperty('distanceKm');
          expect(day).toHaveProperty('driveTime');
          expect(day).toHaveProperty('mustSee');
          expect(Array.isArray(day.mustSee)).toBe(true);
        });
      });
    });

    test('should have unique itinerary IDs', () => {
      const ids = itinerariesData.itineraries.map(i => i.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    test('should reference valid states', () => {
      const validStates = statesData.states.map(s => s.slug);
      itinerariesData.itineraries.forEach(itinerary => {
        expect(validStates).toContain(itinerary.state);
      });
    });

    test('should have route matching number of days', () => {
      itinerariesData.itineraries.forEach(itinerary => {
        // Route should have at least 2 places (start and end)
        expect(itinerary.route.length).toBeGreaterThanOrEqual(2);
        // Number of route segments should match days (or be close)
        expect(itinerary.route.length - 1).toBeLessThanOrEqual(itinerary.days.length + 1);
      });
    });
  });
});

