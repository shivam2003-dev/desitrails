// Download images for Kerala state only using Unsplash API
// This respects the 50 requests/hour limit

const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE_DIR = 'assets/images/states/kerala';
const UNSPLASH_ACCESS_KEY = 'sf84T2GbranE6BwTmtEokXtAk5HiPu77302GPmcDu94';
const UNSPLASH_API_URL = 'https://api.unsplash.com';

// Kerala-specific queries
const KERALA_QUERIES = {
  hero: 'kerala backwaters houseboat',
  places: {
    'trivandrum': 'trivandrum kerala beach',
    'varkala': 'varkala cliff beach kerala',
    'kovalam': 'kovalam beach kerala',
    'alleppey': 'alleppey backwaters kerala',
    'kumarakom': 'kumarakom backwaters kerala'
  },
  routes: {
    '3': 'kerala travel route 3 days',
    '4': 'kerala travel route 4 days',
    '5': 'kerala travel route 5 days',
    '6': 'kerala travel route 6 days',
    '7': 'kerala travel route 7 days',
    '8': 'kerala travel route 8 days',
    '10': 'kerala travel route 10 days'
  }
};

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
            // Get a random photo from first 10 results for variety
            const randomIndex = Math.floor(Math.random() * Math.min(result.results.length, 10));
            const photo = result.results[randomIndex];
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

function downloadImage(url, outputPath, retries = 3) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const attempt = (retryCount) => {
      const file = fs.createWriteStream(outputPath);
      const request = https.get(url, (response) => {
        if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
          if (response.statusCode === 301 || response.statusCode === 302) {
            file.close();
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            return downloadImage(response.headers.location, outputPath, retryCount).then(resolve).catch(reject);
          }
          
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            const stats = fs.statSync(outputPath);
            if (stats.size > 10000) {
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

async function downloadKeralaImages() {
  console.log('🖼️  Downloading unique images for Kerala state...\n');
  console.log('   Using Unsplash API with Kerala-specific queries\n');

  let downloaded = 0;
  let failed = 0;

  // Hero image
  try {
    console.log('📸 Downloading hero image...');
    const heroUrl = await searchUnsplashPhoto(KERALA_QUERIES.hero, 1600, 900);
    const heroPath = `${BASE_DIR}/hero.jpg`;
    await downloadImage(heroUrl, heroPath);
    console.log('   ✅ Hero image downloaded');
    downloaded++;
    await new Promise(r => setTimeout(r, 1000));
  } catch (err) {
    failed++;
    console.log(`   ❌ Hero: ${err.message}`);
  }

  // Route images
  console.log('\n🗺️  Downloading route images...');
  for (const [days, query] of Object.entries(KERALA_QUERIES.routes)) {
    try {
      const routeUrl = await searchUnsplashPhoto(query, 1200, 800);
      const routePath = `${BASE_DIR}/routes/${days}.jpg`;
      await downloadImage(routeUrl, routePath);
      console.log(`   ✅ Route ${days} days`);
      downloaded++;
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      failed++;
      console.log(`   ❌ Route ${days} days: ${err.message}`);
    }
  }

  // Gallery images
  console.log('\n🖼️  Downloading gallery images...');
  for (const [placeSlug, query] of Object.entries(KERALA_QUERIES.places)) {
    try {
      const galleryUrl = await searchUnsplashPhoto(query, 800, 600);
      const galleryPath = `${BASE_DIR}/gallery/${placeSlug}.jpg`;
      await downloadImage(galleryUrl, galleryPath);
      console.log(`   ✅ Gallery: ${placeSlug}`);
      downloaded++;
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      failed++;
      console.log(`   ❌ Gallery ${placeSlug}: ${err.message}`);
    }
  }

  console.log(`\n\n✅ Complete!`);
  console.log(`   Downloaded: ${downloaded} images`);
  console.log(`   Failed: ${failed} images`);
  console.log(`\n📁 Images saved to: ${BASE_DIR}/`);
  console.log(`\n⚠️  Note: Used ${downloaded} API requests. Remaining: ${50 - downloaded}/hour`);
}

downloadKeralaImages().catch(console.error);

