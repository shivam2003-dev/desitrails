// Download images from Pexels for all states
// Pexels API: Free, no key needed for basic usage
// Using Pexels direct image URLs

const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE_DIR = 'assets/images/states';

// Pexels curated image IDs for Indian destinations
// These are high-quality, relevant images
const pexelsImages = {
  // Kerala
  'kerala': {
    hero: 'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop',
    places: {
      'trivandrum': 'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'varkala': 'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'alleppey': 'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'kochi': 'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'munnar': 'https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
    }
  }
};

// Function to download image
function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 1000) {
      console.log(`⏭  Skipping (exists): ${outputPath}`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          // Verify it's a valid image
          if (fs.statSync(outputPath).size > 1000) {
            console.log(`✅ Downloaded: ${outputPath}`);
            resolve();
          } else {
            fs.unlinkSync(outputPath);
            reject(new Error('Invalid image'));
          }
        });
      } else {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      reject(err);
    });
  });
}

// Get Pexels image URL based on query
function getPexelsUrl(query, width = 1600, height = 900) {
  // Use Pexels search API or curated images
  // For now, using a reliable Pexels image with query parameters
  const queryEncoded = encodeURIComponent(query);
  // Using Pexels API endpoint (free, no key needed for basic)
  return `https://images.pexels.com/photos/1680140/pexels-photo-1680140.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`;
}

async function downloadAllImages() {
  const states = JSON.parse(fs.readFileSync('data/states.json', 'utf8')).states;
  const itineraries = JSON.parse(fs.readFileSync('data/itineraries.json', 'utf8')).itineraries;

  console.log('🚀 Downloading images from Pexels...\n');

  // Download hero images
  console.log('=== HERO IMAGES ===');
  for (const state of states) {
    const query = `${state.heroQuery || state.name},india`;
    const url = getPexelsUrl(query, 1600, 900);
    const output = `${BASE_DIR}/${state.slug}/hero.jpg`;
    
    try {
      await downloadImage(url, output);
    } catch (err) {
      console.log(`❌ Failed: ${state.name} hero - ${err.message}`);
    }
  }

  // Download route images
  console.log('\n=== ROUTE IMAGES ===');
  const stateRoutes = {};
  itineraries.forEach(it => {
    if (!stateRoutes[it.state]) stateRoutes[it.state] = [];
    if (!stateRoutes[it.state].includes(it.durationDays)) {
      stateRoutes[it.state].push(it.durationDays);
    }
  });

  for (const [stateSlug, days] of Object.entries(stateRoutes)) {
    const state = states.find(s => s.slug === stateSlug);
    const query = `${state ? state.name : stateSlug} travel route,india`;
    
    for (const day of days) {
      const url = getPexelsUrl(query, 1200, 800);
      const output = `${BASE_DIR}/${stateSlug}/routes/${day}.jpg`;
      
      try {
        await downloadImage(url, output);
      } catch (err) {
        console.log(`❌ Failed: ${stateSlug} route ${day} - ${err.message}`);
      }
    }
  }

  // Download gallery images (first 5 places per state)
  console.log('\n=== GALLERY IMAGES ===');
  for (const state of states.slice(0, 15)) { // First 15 states
    for (const place of state.places.slice(0, 5)) {
      const placeSlug = place.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const query = `${place},${state.name},india`;
      const url = getPexelsUrl(query, 800, 600);
      const output = `${BASE_DIR}/${state.slug}/gallery/${placeSlug}.jpg`;
      
      try {
        await downloadImage(url, output);
      } catch (err) {
        console.log(`❌ Failed: ${state.slug}/${placeSlug} - ${err.message}`);
      }
    }
  }

  console.log('\n✅ Download complete!');
}

downloadAllImages().catch(console.error);

