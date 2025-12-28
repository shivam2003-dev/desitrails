/**
 * Download images for Kerala 10-day itinerary using Unsplash API
 * Uses the provided API credentials
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Unsplash API credentials
const UNSPLASH_ACCESS_KEY = 'sf84T2GbranE6BwTmtEokXtAk5HiPu77302GPmcDu94';
const UNSPLASH_APP_ID = '849122';

// Locations for Kerala 10-day itinerary
const locations = [
  { name: 'Trivandrum', query: 'Trivandrum Kerala India', folder: 'trivandrum' },
  { name: 'Kovalam', query: 'Kovalam beach Kerala', folder: 'kovalam' },
  { name: 'Varkala', query: 'Varkala cliff beach Kerala', folder: 'varkala' },
  { name: 'Alleppey', query: 'Alleppey backwaters Kerala houseboat', folder: 'alleppey' },
  { name: 'Kumarakom', query: 'Kumarakom backwaters Kerala', folder: 'kumarakom' },
  { name: 'Kochi', query: 'Fort Kochi Chinese fishing nets Kerala', folder: 'kochi' },
  { name: 'Munnar', query: 'Munnar tea gardens Kerala hills', folder: 'munnar' },
  { name: 'Thekkady', query: 'Thekkady Periyar wildlife Kerala', folder: 'thekkady' },
  { name: 'Wayanad', query: 'Wayanad hills Kerala nature', folder: 'wayanad' },
  { name: 'Calicut', query: 'Calicut Kozhikode Kerala beach', folder: 'calicut' }
];

// Base directory
const baseDir = path.join(__dirname, '../assets/images/states/kerala/gallery');

// Ensure directory exists
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Function to search Unsplash and get image URL
function searchUnsplash(query, callback) {
  const encodedQuery = encodeURIComponent(query);
  const url = `https://api.unsplash.com/search/photos?query=${encodedQuery}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`;
  
  https.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.results && json.results.length > 0) {
          const imageUrl = json.results[0].urls.regular; // Use 'regular' size (1080px width)
          callback(null, imageUrl);
        } else {
          callback(new Error('No images found'), null);
        }
      } catch (error) {
        callback(error, null);
      }
    });
  }).on('error', (error) => {
    callback(error, null);
  });
}

// Function to download image
function downloadImage(url, outputPath, callback) {
  https.get(url, (res) => {
    if (res.statusCode === 302 || res.statusCode === 301) {
      // Follow redirect
      return downloadImage(res.headers.location, outputPath, callback);
    }
    
    if (res.statusCode !== 200) {
      return callback(new Error(`Failed to download: ${res.statusCode}`));
    }
    
    const fileStream = fs.createWriteStream(outputPath);
    res.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      callback(null);
    });
    
    fileStream.on('error', (error) => {
      fs.unlink(outputPath, () => {});
      callback(error);
    });
  }).on('error', (error) => {
    callback(error);
  });
}

// Main function
async function downloadAllImages() {
  console.log('🖼️  Downloading images for Kerala 10-day itinerary...\n');
  
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    const outputPath = path.join(baseDir, `${location.folder}.jpg`);
    
    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${location.name} - already exists`);
      continue;
    }
    
    console.log(`📥 Downloading ${location.name}...`);
    
    // Search Unsplash
    searchUnsplash(location.query, (error, imageUrl) => {
      if (error) {
        console.error(`❌ Error searching for ${location.name}:`, error.message);
        return;
      }
      
      // Download image
      downloadImage(imageUrl, outputPath, (downloadError) => {
        if (downloadError) {
          console.error(`❌ Error downloading ${location.name}:`, downloadError.message);
        } else {
          console.log(`✅ Downloaded ${location.name} → ${outputPath}`);
        }
      });
    });
    
    // Rate limit: 50 requests/hour, so wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✅ Download complete!');
  console.log(`📁 Images saved to: ${baseDir}`);
}

// Run
downloadAllImages().catch(console.error);

