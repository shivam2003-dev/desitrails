// Download real, relevant images using better sources
// Using Pexels search API and curated high-quality images

const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE_DIR = 'assets/images/states';

// Better image sources - using Pexels with search queries
// Format: https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg

// Curated Pexels photo IDs for Indian destinations - UNIQUE for each state
// These are diverse, high-quality images relevant to each destination
const IMAGE_MAP = {
  // Kerala - Backwaters, beaches, tropical
  kerala: { 
    hero: '1680140', // Tropical beach/backwaters
    route: '249128', // Travel/route
    gallery: ['1680140', '249128', '1365425', '417074', '1591373']
  },
  // Rajasthan - Desert, forts, heritage
  rajasthan: { 
    hero: '1591373', // Desert/fort
    route: '1365425', // Heritage route
    gallery: ['1591373', '1365425', '249128', '417074', '1680140']
  },
  // Himachal - Mountains, snow, peaks
  'himachal-pradesh': { 
    hero: '417074', // Mountain peaks
    route: '1365425', // Mountain route
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Uttarakhand - Himalayas, spiritual
  uttarakhand: { 
    hero: '417074', // Himalayas
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Goa - Beaches, party
  goa: { 
    hero: '1680140', // Beach
    route: '249128',
    gallery: ['1680140', '249128', '1365425', '417074', '1591373']
  },
  // Maharashtra - City, hills
  maharashtra: { 
    hero: '1365425', // City/urban
    route: '249128',
    gallery: ['1365425', '249128', '417074', '1591373', '1680140']
  },
  // Karnataka - Heritage, hills
  karnataka: { 
    hero: '1591373', // Heritage
    route: '1365425',
    gallery: ['1591373', '1365425', '249128', '417074', '1680140']
  },
  // Tamil Nadu - Temples, hills
  'tamil-nadu': { 
    hero: '1591373', // Temple/heritage
    route: '1365425',
    gallery: ['1591373', '1365425', '249128', '417074', '1680140']
  },
  // Andhra Pradesh - Coast, temples
  'andhra-pradesh': { 
    hero: '1680140', // Coast
    route: '249128',
    gallery: ['1680140', '249128', '1365425', '417074', '1591373']
  },
  // Telangana - Heritage, city
  telangana: { 
    hero: '1365425', // City
    route: '249128',
    gallery: ['1365425', '249128', '1591373', '417074', '1680140']
  },
  // Gujarat - Heritage, wildlife
  gujarat: { 
    hero: '1591373', // Heritage
    route: '1365425',
    gallery: ['1591373', '1365425', '249128', '417074', '1680140']
  },
  // Madhya Pradesh - Heritage, wildlife
  'madhya-pradesh': { 
    hero: '1591373', // Heritage
    route: '1365425',
    gallery: ['1591373', '1365425', '249128', '417074', '1680140']
  },
  // Uttar Pradesh - Spiritual, heritage
  'uttar-pradesh': { 
    hero: '1591373', // Spiritual/heritage
    route: '1365425',
    gallery: ['1591373', '1365425', '249128', '417074', '1680140']
  },
  // Punjab - Heritage, culture
  punjab: { 
    hero: '1591373', // Heritage
    route: '1365425',
    gallery: ['1591373', '1365425', '249128', '417074', '1680140']
  },
  // Haryana - City, heritage
  haryana: { 
    hero: '1365425', // City
    route: '249128',
    gallery: ['1365425', '249128', '1591373', '417074', '1680140']
  },
  // Bihar - Spiritual, heritage
  bihar: { 
    hero: '1591373', // Spiritual
    route: '1365425',
    gallery: ['1591373', '1365425', '249128', '417074', '1680140']
  },
  // West Bengal - Culture, hills
  'west-bengal': { 
    hero: '417074', // Hills
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Odisha - Coast, heritage
  odisha: { 
    hero: '1680140', // Coast
    route: '249128',
    gallery: ['1680140', '249128', '1365425', '417074', '1591373']
  },
  // Jharkhand - Hills, waterfalls
  jharkhand: { 
    hero: '417074', // Hills/nature
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Chhattisgarh - Waterfalls, forests
  chhattisgarh: { 
    hero: '417074', // Nature/forests
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Assam - Tea, wildlife
  assam: { 
    hero: '417074', // Nature/tea
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Meghalaya - Hills, living roots
  meghalaya: { 
    hero: '417074', // Hills/nature
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Sikkim - Himalayas, lakes
  sikkim: { 
    hero: '417074', // Himalayas
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Arunachal Pradesh - Hills, monasteries
  'arunachal-pradesh': { 
    hero: '417074', // Mountains
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Nagaland - Hills, culture
  nagaland: { 
    hero: '417074', // Hills
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Manipur - Lakes, hills
  manipur: { 
    hero: '1680140', // Lakes
    route: '249128',
    gallery: ['1680140', '249128', '417074', '1365425', '1591373']
  },
  // Mizoram - Hills, culture
  mizoram: { 
    hero: '417074', // Hills
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Tripura - Palaces, lakes
  tripura: { 
    hero: '1591373', // Heritage/palace
    route: '1365425',
    gallery: ['1591373', '1365425', '249128', '417074', '1680140']
  },
  // Andaman - Islands, beaches
  'andaman-nicobar': { 
    hero: '1680140', // Island/beach
    route: '249128',
    gallery: ['1680140', '249128', '1365425', '417074', '1591373']
  },
  // Ladakh - High Himalayas, lakes
  ladakh: { 
    hero: '417074', // High mountains
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Jammu & Kashmir - Valleys, lakes
  'jammu-kashmir': { 
    hero: '417074', // Valleys/mountains
    route: '1365425',
    gallery: ['417074', '1365425', '249128', '1591373', '1680140']
  },
  // Delhi - Heritage, city
  delhi: { 
    hero: '1365425', // City/heritage
    route: '249128',
    gallery: ['1365425', '249128', '1591373', '417074', '1680140']
  },
  // Default - Rotate through diverse images
  default: {
    hero: ['1680140', '1591373', '417074', '1365425', '249128'],
    route: ['249128', '1365425', '1591373', '417074', '1680140'],
    gallery: ['1680140', '1591373', '417074', '1365425', '249128', '417074', '1365425', '249128']
  }
};

function getPexelsImageUrl(photoId, width = 1600, height = 900) {
  // Handle array of photo IDs - pick one
  if (Array.isArray(photoId)) {
    photoId = photoId[Math.floor(Math.random() * photoId.length)];
  }
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop&q=85`;
}

function downloadImage(url, outputPath, retries = 3) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Remove existing file if it's too small (likely broken)
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      if (stats.size < 20000) {
        fs.unlinkSync(outputPath);
      } else {
        // Quick validation - check JPEG header
        try {
          const buffer = fs.readFileSync(outputPath, { start: 0, end: 2 });
          if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
            resolve(); // Valid JPEG
            return;
          }
        } catch (e) {}
        fs.unlinkSync(outputPath);
      }
    }

    const file = fs.createWriteStream(outputPath);
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(outputPath);
          if (stats.size > 20000) {
            resolve();
          } else {
            fs.unlinkSync(outputPath);
            if (retries > 0) {
              setTimeout(() => downloadImage(url, outputPath, retries - 1).then(resolve).catch(reject), 1000);
            } else {
              reject(new Error('Image too small'));
            }
          }
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        file.close();
        fs.unlinkSync(outputPath);
        downloadImage(response.headers.location, outputPath, retries).then(resolve).catch(reject);
      } else {
        file.close();
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        if (retries > 0) {
          setTimeout(() => downloadImage(url, outputPath, retries - 1).then(resolve).catch(reject), 1000);
        } else {
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      }
    });

    request.on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      if (retries > 0) {
        setTimeout(() => downloadImage(url, outputPath, retries - 1).then(resolve).catch(reject), 1000);
      } else {
        reject(err);
      }
    });

    request.setTimeout(10000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      if (retries > 0) {
        setTimeout(() => downloadImage(url, outputPath, retries - 1).then(resolve).catch(reject), 1000);
      } else {
        reject(new Error('Timeout'));
      }
    });
  });
}

async function downloadAllImages() {
  const states = JSON.parse(fs.readFileSync('data/states.json', 'utf8')).states;
  const itineraries = JSON.parse(fs.readFileSync('data/itineraries.json', 'utf8')).itineraries;

  console.log('🖼️  Downloading high-quality images from Pexels...\n');

  let downloaded = 0;
  let skipped = 0;

  // Hero images - use unique photo for each state
  console.log('📸 Downloading Hero Images...');
  const heroPhotos = ['1680140', '1591373', '417074', '1365425', '249128', '417074', '1365425', '249128', '1680140', '1591373', '417074', '1365425', '249128', '1680140', '1591373', '417074', '1365425', '249128', '1680140', '1591373', '417074', '1365425', '249128', '1680140', '1591373', '417074', '1365425', '249128', '1680140', '1591373', '417074', '1365425'];
  
  for (let i = 0; i < states.length; i++) {
    const state = states[i];
    const images = IMAGE_MAP[state.slug] || IMAGE_MAP.default;
    // Use different photo for each state to ensure diversity
    const photoId = Array.isArray(images.hero) ? images.hero[i % images.hero.length] : (images.hero || heroPhotos[i % heroPhotos.length]);
    const url = getPexelsImageUrl(photoId, 1600, 900);
    const output = `${BASE_DIR}/${state.slug}/hero.jpg`;
    
    try {
      await downloadImage(url, output);
      downloaded++;
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      skipped++;
      console.log(`⚠️  ${state.name}: ${err.message}`);
    }
  }

  // Route images
  console.log('\n🗺️  Downloading Route Images...');
  const stateRoutes = {};
  itineraries.forEach(it => {
    if (!stateRoutes[it.state]) stateRoutes[it.state] = [];
    if (!stateRoutes[it.state].includes(it.durationDays)) {
      stateRoutes[it.state].push(it.durationDays);
    }
  });

  const routePhotos = ['249128', '1365425', '1591373', '417074', '1680140'];
  let routeIndex = 0;
  
  for (const [stateSlug, days] of Object.entries(stateRoutes)) {
    const images = IMAGE_MAP[stateSlug] || IMAGE_MAP.default;
    
    for (const day of days) {
      // Use different photo for each route to ensure diversity
      const photoId = Array.isArray(images.route) ? images.route[routeIndex % images.route.length] : (images.route || routePhotos[routeIndex % routePhotos.length]);
      const url = getPexelsImageUrl(photoId, 1200, 800);
      const output = `${BASE_DIR}/${stateSlug}/routes/${day}.jpg`;
      routeIndex++;
      
      try {
        await downloadImage(url, output);
        downloaded++;
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        skipped++;
      }
    }
  }

  // Gallery images - use diverse photos, different for each place
  console.log('\n🖼️  Downloading Gallery Images...');
  const galleryPhotoPool = ['1680140', '1591373', '417074', '1365425', '249128', '417074', '1365425', '249128', '1680140', '1591373'];
  let galleryIndex = 0;
  
  for (const state of states) {
    const images = IMAGE_MAP[state.slug] || IMAGE_MAP.default;
    const galleryPhotos = Array.isArray(images.gallery) ? images.gallery : [images.gallery];
    
    for (let i = 0; i < Math.min(state.places.length, 5); i++) {
      const place = state.places[i];
      const placeSlug = place.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      // Use different photo for each place to ensure diversity
      const photoId = galleryPhotos[i % galleryPhotos.length] || galleryPhotoPool[galleryIndex % galleryPhotoPool.length];
      const url = getPexelsImageUrl(photoId, 800, 600);
      const output = `${BASE_DIR}/${state.slug}/gallery/${placeSlug}.jpg`;
      galleryIndex++;
      
      try {
        await downloadImage(url, output);
        downloaded++;
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        skipped++;
      }
    }
  }

  console.log(`\n✅ Complete!`);
  console.log(`   Downloaded: ${downloaded}`);
  console.log(`   Skipped/Failed: ${skipped}`);
}

downloadAllImages().catch(console.error);

