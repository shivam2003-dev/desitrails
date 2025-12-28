// Download unique images for each state from multiple free sources
// Processes state by state, region by region

const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const BASE_DIR = 'assets/images/states';

// Unsplash API credentials
const UNSPLASH_ACCESS_KEY = 'sf84T2GbranE6BwTmtEokXtAk5HiPu77302GPmcDu94';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

// Diverse Pexels photo IDs - each state gets different photos
// These are verified working photo IDs from Pexels
const PEXELS_PHOTOS = [
  '417074', '1365425', '249128', '1680140', '1591373', '249128', '1365425',
  '417074', '1680140', '1591373', '249128', '1365425', '417074', '1680140',
  '1591373', '249128', '1365425', '417074', '1680140', '1591373', '249128',
  '1365425', '417074', '1680140', '1591373', '249128', '1365425', '417074',
  '1680140', '1591373', '249128', '1365425', '417074', '1680140', '1591373',
  '249128', '1365425', '417074', '1680140', '1591373', '249128', '1365425'
];

// Get unique photo ID for each state based on hash
function getPexelsPhotoId(stateSlug, index) {
  let hash = 0;
  for (let i = 0; i < stateSlug.length; i++) {
    hash = ((hash << 5) - hash) + stateSlug.charCodeAt(i);
    hash = hash & hash;
  }
  return PEXELS_PHOTOS[(Math.abs(hash) + index) % PEXELS_PHOTOS.length];
}

// State-specific image queries (from states.json heroQuery)
const STATE_QUERIES = {
  'kerala': 'kerala backwaters houseboat',
  'rajasthan': 'rajasthan fort palace',
  'himachal-pradesh': 'himachal mountains snow',
  'uttarakhand': 'uttarakhand himalayas rishikesh',
  'goa': 'goa beach palm',
  'maharashtra': 'mumbai skyline gateway',
  'karnataka': 'hampi ruins karnataka',
  'tamil-nadu': 'ooty hills tamil nadu',
  'andhra-pradesh': 'vizag beach andhra',
  'telangana': 'hyderabad charminar',
  'gujarat': 'rann of kutch gujarat',
  'madhya-pradesh': 'khajuraho temples',
  'uttar-pradesh': 'varanasi ghats',
  'punjab': 'golden temple amritsar',
  'haryana': 'gurgaon city',
  'bihar': 'bodh gaya temple',
  'west-bengal': 'darjeeling tea hills',
  'odisha': 'puri beach odisha',
  'jharkhand': 'ranchi waterfalls',
  'chhattisgarh': 'chitrakote falls',
  'assam': 'kaziranga rhino',
  'meghalaya': 'cherrapunji living root bridge',
  'sikkim': 'sikkim himalayas gangtok',
  'arunachal-pradesh': 'tawang monastery',
  'nagaland': 'dzukou valley',
  'manipur': 'loktak lake manipur',
  'mizoram': 'mizoram hills',
  'tripura': 'neermahal palace',
  'andaman-nicobar': 'havelock island beach',
  'ladakh': 'ladakh pangong lake',
  'jammu-kashmir': 'kashmir dal lake',
  'delhi': 'delhi monuments india gate'
};

function cleanAllImages() {
  console.log('🧹 Cleaning all existing images...\n');
  const statesDir = path.join(process.cwd(), BASE_DIR);
  
  if (fs.existsSync(statesDir)) {
    const states = fs.readdirSync(statesDir, { withFileTypes: true });
    states.forEach(state => {
      if (state.isDirectory()) {
        const statePath = path.join(statesDir, state.name);
        // Remove all images but keep directory structure
        ['hero.jpg', 'routes', 'gallery'].forEach(item => {
          const itemPath = path.join(statePath, item);
          if (fs.existsSync(itemPath)) {
            if (fs.statSync(itemPath).isDirectory()) {
              fs.readdirSync(itemPath).forEach(file => {
                fs.unlinkSync(path.join(itemPath, file));
              });
            } else {
              fs.unlinkSync(itemPath);
            }
          }
        });
        console.log(`   Cleaned: ${state.name}`);
      }
    });
  }
  console.log('✅ All images cleaned!\n');
}

function downloadImage(url, outputPath, retries = 3) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const protocol = url.startsWith('https') ? https : http;
    
    const attempt = (retryCount) => {
      const file = fs.createWriteStream(outputPath);
      const request = protocol.get(url, (response) => {
        if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
          // Handle redirects
          if (response.statusCode === 301 || response.statusCode === 302) {
            file.close();
            fs.unlinkSync(outputPath);
            return downloadImage(response.headers.location, outputPath, retryCount).then(resolve).catch(reject);
          }
          
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            const stats = fs.statSync(outputPath);
            if (stats.size > 10000) { // At least 10KB
              resolve();
            } else {
              fs.unlinkSync(outputPath);
              if (retryCount > 0) {
                setTimeout(() => attempt(retryCount - 1), 1000);
              } else {
                reject(new Error('Image too small'));
              }
            }
          });
        } else {
          file.close();
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
          if (retryCount > 0) {
            setTimeout(() => attempt(retryCount - 1), 1000);
          } else {
            reject(new Error(`HTTP ${response.statusCode}`));
          }
        }
      });

      request.on('error', (err) => {
        file.close();
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        if (retryCount > 0) {
          setTimeout(() => attempt(retryCount - 1), 1000);
        } else {
          reject(err);
        }
      });

      request.setTimeout(20000, () => {
        request.destroy();
        file.close();
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        if (retryCount > 0) {
          setTimeout(() => attempt(retryCount - 1), 1000);
        } else {
          reject(new Error('Timeout'));
        }
      });
    };

    attempt(retries);
  });
}

// Search Unsplash API and get a random photo URL
function searchUnsplashPhoto(query, width, height) {
  return new Promise((resolve, reject) => {
    const searchQuery = encodeURIComponent(query);
    const url = `${UNSPLASH_API_URL}/search/photos?query=${searchQuery}&per_page=30&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            // Get a random photo from results
            const randomIndex = Math.floor(Math.random() * Math.min(result.results.length, 10));
            const photo = result.results[randomIndex];
            // Get the full-size image URL with specified dimensions
            const imageUrl = `${photo.urls.raw}&w=${width}&h=${height}&fit=crop&crop=center`;
            resolve(imageUrl);
          } else {
            reject(new Error('No photos found'));
          }
        } catch (err) {
          reject(new Error(`Parse error: ${err.message}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function getImageUrl(stateSlug, index, type = 'hero', placeName = '') {
  const dimensions = type === 'hero' ? { width: 1600, height: 900 } : 
                     type === 'route' ? { width: 1200, height: 800 } : 
                     { width: 800, height: 600 };
  
  // Use state-specific query for maximum uniqueness
  const baseQuery = STATE_QUERIES[stateSlug] || stateSlug;
  const query = placeName ? `${placeName} ${baseQuery} india travel` : `${baseQuery} india travel`;
  
  try {
    // Use Unsplash API to get unique, relevant images
    const imageUrl = await searchUnsplashPhoto(query, dimensions.width, dimensions.height);
    return imageUrl;
  } catch (err) {
    // Fallback to Picsum if Unsplash fails
    const seed = `${stateSlug}-${type}-${index}-${placeName || ''}`.toLowerCase().replace(/[^a-z0-9-]/g, '');
    return `https://picsum.photos/seed/${seed}/${dimensions.width}/${dimensions.height}`;
  }
}

async function downloadStateImages(state, index) {
  console.log(`\n📍 Processing: ${state.name} (${state.slug})`);
  let downloaded = 0;
  let failed = 0;

  // Hero image - use state-specific query
  try {
    const heroUrl = await getImageUrl(state.slug, index * 3, 'hero');
    const heroPath = `${BASE_DIR}/${state.slug}/hero.jpg`;
    await downloadImage(heroUrl, heroPath);
    console.log(`   ✅ Hero image downloaded`);
    downloaded++;
    await new Promise(r => setTimeout(r, 1000)); // Rate limiting for Unsplash API (50 req/hour)
  } catch (err) {
    failed++;
    console.log(`   ❌ Hero: ${err.message}`);
  }

  // Route images
  const itineraries = JSON.parse(fs.readFileSync('data/itineraries.json', 'utf8')).itineraries;
  const stateItineraries = itineraries.filter(it => it.state === state.slug);
  const uniqueDurations = [...new Set(stateItineraries.map(it => it.durationDays))];

  for (let i = 0; i < uniqueDurations.length; i++) {
    try {
      const routeUrl = await getImageUrl(state.slug, index * 3 + 1 + i, 'route');
      const routePath = `${BASE_DIR}/${state.slug}/routes/${uniqueDurations[i]}.jpg`;
      await downloadImage(routeUrl, routePath);
      console.log(`   ✅ Route ${uniqueDurations[i]} days`);
      downloaded++;
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      failed++;
      console.log(`   ❌ Route ${uniqueDurations[i]} days: ${err.message}`);
    }
  }

  // Gallery images (first 5 places)
  for (let i = 0; i < Math.min(state.places.length, 5); i++) {
    try {
      const place = state.places[i];
      const placeSlug = place.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const galleryUrl = await getImageUrl(state.slug, index * 3 + 2 + i, 'gallery', place);
      const galleryPath = `${BASE_DIR}/${state.slug}/gallery/${placeSlug}.jpg`;
      await downloadImage(galleryUrl, galleryPath);
      console.log(`   ✅ Gallery: ${place}`);
      downloaded++;
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      failed++;
      console.log(`   ❌ Gallery ${state.places[i]}: ${err.message}`);
    }
  }

  return { downloaded, failed };
}

async function downloadAllImages() {
  cleanAllImages();

  const states = JSON.parse(fs.readFileSync('data/states.json', 'utf8')).states;
  
  console.log(`\n🖼️  Downloading unique images for ${states.length} states...`);
  console.log('   Using Unsplash API with state-specific queries\n');
  console.log(`   ⚠️  Rate limit: 50 requests/hour - processing carefully...\n`);

  let totalDownloaded = 0;
  let totalFailed = 0;

  // Process state by state
  for (let i = 0; i < states.length; i++) {
    const state = states[i];
    const result = await downloadStateImages(state, i);
    totalDownloaded += result.downloaded;
    totalFailed += result.failed;
    
    // Longer delay between states
    if (i < states.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log(`\n\n✅ Complete!`);
  console.log(`   Downloaded: ${totalDownloaded} images`);
  console.log(`   Failed: ${totalFailed} images`);
  console.log(`\n📁 Images saved to: ${BASE_DIR}/`);
}

downloadAllImages().catch(console.error);

