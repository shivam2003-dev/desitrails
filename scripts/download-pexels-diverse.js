// Download diverse, high-quality images from Pexels for all states
// Using curated Pexels photo IDs for Indian destinations

const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE_DIR = 'assets/images/states';

// Curated Pexels photo IDs for different Indian destinations
// These are high-quality, relevant images
const PEXELS_PHOTOS = {
  // Kerala - Backwaters, beaches
  kerala: { hero: '1680140', route: '1680140', gallery: '1680140' },
  // Rajasthan - Forts, desert
  rajasthan: { hero: '1591373', route: '1591373', gallery: '1591373' },
  // Himachal - Mountains
  'himachal-pradesh': { hero: '417074', route: '417074', gallery: '417074' },
  // Uttarakhand - Himalayas
  uttarakhand: { hero: '417074', route: '417074', gallery: '417074' },
  // Goa - Beaches
  goa: { hero: '1680140', route: '1680140', gallery: '1680140' },
  // Maharashtra - City, hills
  maharashtra: { hero: '1591373', route: '1591373', gallery: '1591373' },
  // Karnataka - Heritage, hills
  karnataka: { hero: '1591373', route: '1591373', gallery: '1591373' },
  // Tamil Nadu - Temples, hills
  'tamil-nadu': { hero: '1591373', route: '1591373', gallery: '1591373' },
  // Default - Use diverse images
  default: { 
    hero: ['1680140', '1591373', '417074', '249128', '1365425'],
    route: ['1680140', '1591373', '417074'],
    gallery: ['1680140', '1591373', '417074', '249128']
  }
};

function getPexelsUrl(photoId, width = 1600, height = 900) {
  if (Array.isArray(photoId)) {
    photoId = photoId[Math.floor(Math.random() * photoId.length)];
  }
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop&q=85`;
}

function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Always re-download to fix black images
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      // Delete if too small (likely broken/black)
      if (stats.size < 20000) {
        fs.unlinkSync(outputPath);
      } else {
        // Check if it's actually a valid image by reading first bytes
        const buffer = fs.readFileSync(outputPath, { start: 0, end: 10 });
        const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8;
        if (!isJpeg || stats.size < 20000) {
          fs.unlinkSync(outputPath);
        } else {
          console.log(`✓ Valid: ${path.basename(outputPath)}`);
          resolve();
          return;
        }
      }
    }

    console.log(`⬇  ${path.basename(outputPath)}`);
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(outputPath);
          if (stats.size > 20000) {
            console.log(`✅ ${path.basename(outputPath)} (${(stats.size/1024).toFixed(0)}KB)`);
            resolve();
          } else {
            fs.unlinkSync(outputPath);
            reject(new Error('Too small'));
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

async function downloadAll() {
  const states = JSON.parse(fs.readFileSync('data/states.json', 'utf8')).states;
  const itineraries = JSON.parse(fs.readFileSync('data/itineraries.json', 'utf8')).itineraries;

  console.log('🖼️  Downloading images from Pexels...\n');

  // Hero images
  console.log('📸 Hero Images:');
  for (const state of states) {
    const photos = PEXELS_PHOTOS[state.slug] || PEXELS_PHOTOS.default;
    const photoId = Array.isArray(photos.hero) ? photos.hero[0] : photos.hero;
    const url = getPexelsUrl(photoId, 1600, 900);
    const output = `${BASE_DIR}/${state.slug}/hero.jpg`;
    
    try {
      await downloadImage(url, output);
      await new Promise(r => setTimeout(r, 200)); // Rate limiting
    } catch (err) {
      console.log(`❌ ${state.name} hero`);
    }
  }

  // Route images
  console.log('\n🗺️  Route Images:');
  const stateRoutes = {};
  itineraries.forEach(it => {
    if (!stateRoutes[it.state]) stateRoutes[it.state] = [];
    if (!stateRoutes[it.state].includes(it.durationDays)) {
      stateRoutes[it.state].push(it.durationDays);
    }
  });

  for (const [stateSlug, days] of Object.entries(stateRoutes)) {
    const photos = PEXELS_PHOTOS[stateSlug] || PEXELS_PHOTOS.default;
    const photoId = Array.isArray(photos.route) ? photos.route[0] : photos.route;
    
    for (const day of days) {
      const url = getPexelsUrl(photoId, 1200, 800);
      const output = `${BASE_DIR}/${stateSlug}/routes/${day}.jpg`;
      
      try {
        await downloadImage(url, output);
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        console.log(`❌ ${stateSlug} route ${day}`);
      }
    }
  }

  // Gallery images
  console.log('\n🖼️  Gallery Images:');
  for (const state of states) {
    const photos = PEXELS_PHOTOS[state.slug] || PEXELS_PHOTOS.default;
    const galleryPhotos = Array.isArray(photos.gallery) ? photos.gallery : [photos.gallery];
    
    for (let i = 0; i < Math.min(state.places.length, 5); i++) {
      const place = state.places[i];
      const placeSlug = place.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const photoId = galleryPhotos[i % galleryPhotos.length];
      const url = getPexelsUrl(photoId, 800, 600);
      const output = `${BASE_DIR}/${state.slug}/gallery/${placeSlug}.jpg`;
      
      try {
        await downloadImage(url, output);
        await new Promise(r => setTimeout(r, 200));
      } catch (err) {
        console.log(`❌ ${state.slug}/${placeSlug}`);
      }
    }
  }

  console.log('\n✅ Complete!');
}

downloadAll().catch(console.error);

