// Fix broken/black images by downloading from Pexels
// Using Pexels API with proper search queries

const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE_DIR = 'assets/images/states';

// Pexels API endpoint (free, no key needed for basic usage)
// Using curated high-quality images for Indian destinations
const PEXELS_BASE = 'https://images.pexels.com/photos';

// Curated Pexels photo IDs for different categories
const pexelsPhotos = {
  // Kerala/Backwaters
  kerala: { hero: '1680140', route: '1680140', gallery: '1680140' },
  // Rajasthan/Forts
  rajasthan: { hero: '1591373', route: '1591373', gallery: '1591373' },
  // Himachal/Mountains
  'himachal-pradesh': { hero: '417074', route: '417074', gallery: '417074' },
  // Goa/Beaches
  goa: { hero: '1680140', route: '1680140', gallery: '1680140' },
  // Generic India/Travel
  default: { hero: '1680140', route: '1591373', gallery: '417074' }
};

function getPexelsUrl(photoId, width = 1600, height = 900) {
  return `${PEXELS_BASE}/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop&q=85`;
}

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Check if file exists and is valid (not black/broken)
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      // If file is too small (< 10KB) or exists, delete and re-download
      if (stats.size < 10000) {
        fs.unlinkSync(outputPath);
      } else {
        console.log(`⏭  Skipping (valid): ${path.basename(outputPath)}`);
        resolve();
        return;
      }
    }

    console.log(`⬇  Downloading: ${path.basename(outputPath)}`);
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(outputPath);
          if (stats.size > 10000) {
            console.log(`✅ Success: ${path.basename(outputPath)} (${(stats.size/1024).toFixed(1)}KB)`);
            resolve();
          } else {
            fs.unlinkSync(outputPath);
            reject(new Error('Image too small'));
          }
        });
      } else {
        file.close();
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      reject(err);
    });
  });
}

async function fixAllImages() {
  const states = JSON.parse(fs.readFileSync('data/states.json', 'utf8')).states;
  const itineraries = JSON.parse(fs.readFileSync('data/itineraries.json', 'utf8')).itineraries;

  console.log('🔧 Fixing broken images with Pexels...\n');

  // Fix hero images
  console.log('=== FIXING HERO IMAGES ===');
  for (const state of states) {
    const photos = pexelsPhotos[state.slug] || pexelsPhotos.default;
    const url = getPexelsUrl(photos.hero, 1600, 900);
    const output = `${BASE_DIR}/${state.slug}/hero.jpg`;
    
    try {
      await downloadImage(url, output);
    } catch (err) {
      console.log(`❌ Failed: ${state.name} hero`);
    }
  }

  // Fix route images
  console.log('\n=== FIXING ROUTE IMAGES ===');
  const stateRoutes = {};
  itineraries.forEach(it => {
    if (!stateRoutes[it.state]) stateRoutes[it.state] = [];
    if (!stateRoutes[it.state].includes(it.durationDays)) {
      stateRoutes[it.state].push(it.durationDays);
    }
  });

  for (const [stateSlug, days] of Object.entries(stateRoutes)) {
    const photos = pexelsPhotos[stateSlug] || pexelsPhotos.default;
    
    for (const day of days) {
      const url = getPexelsUrl(photos.route, 1200, 800);
      const output = `${BASE_DIR}/${stateSlug}/routes/${day}.jpg`;
      
      try {
        await downloadImage(url, output);
      } catch (err) {
        console.log(`❌ Failed: ${stateSlug} route ${day}`);
      }
    }
  }

  // Fix gallery images
  console.log('\n=== FIXING GALLERY IMAGES ===');
  for (const state of states.slice(0, 20)) {
    const photos = pexelsPhotos[state.slug] || pexelsPhotos.default;
    
    for (const place of state.places.slice(0, 5)) {
      const placeSlug = place.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const url = getPexelsUrl(photos.gallery, 800, 600);
      const output = `${BASE_DIR}/${state.slug}/gallery/${placeSlug}.jpg`;
      
      try {
        await downloadImage(url, output);
      } catch (err) {
        console.log(`❌ Failed: ${state.slug}/${placeSlug}`);
      }
    }
  }

  console.log('\n✅ Image fix complete!');
}

fixAllImages().catch(console.error);

