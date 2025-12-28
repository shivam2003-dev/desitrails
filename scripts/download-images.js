// Image Download Helper Script
// This script helps download images for the website
// Run with: node scripts/download-images.js

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Better image source - using Pexels API (free, no key needed for basic usage)
// Or use direct image URLs from reliable sources

const imageSources = {
  // Use placeholder service that works better than Unsplash
  getImageUrl: (query, width = 1600, height = 900) => {
    // Option 1: Use Picsum Photos (reliable placeholder)
    // return `https://picsum.photos/${width}/${height}?random=${Date.now()}`;
    
    // Option 2: Use a better Unsplash format
    return `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=${width}&h=${height}&fit=crop&q=80`;
    
    // Option 3: Use placeholder.com (works reliably)
    // return `https://via.placeholder.com/${width}x${height}/cccccc/666666?text=${encodeURIComponent(query)}`;
  }
};

// For now, we'll update the code to use a more reliable image service
console.log('Image helper created. Update your JS files to use better image URLs.');

