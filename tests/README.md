# DesiTrails Test Suite

Automated testing for DesiTrails website functionality.

## Setup

Install dependencies:
```bash
npm install
```

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode (for development):
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Test Structure

- `setup.js` - Jest configuration and global mocks
- `app.test.js` - Tests for main page (app.js)
- `itinerary.test.js` - Tests for itinerary pages (itinerary.js)

## Test Coverage

Tests cover:
- ✅ DOM manipulation and rendering
- ✅ Data fetching and error handling
- ✅ Base path extraction for GitHub Pages
- ✅ State card creation
- ✅ Itinerary timeline rendering
- ✅ Error handling and edge cases

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Manual workflow triggers

See `.github/workflows/test.yml` for CI configuration.
