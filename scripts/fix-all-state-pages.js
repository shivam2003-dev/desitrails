const fs = require('fs');
const path = require('path');

const statesDir = path.join(__dirname, '..', 'states');

// Get all state directories
const stateDirs = fs.readdirSync(statesDir).filter(item => {
  const itemPath = path.join(statesDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Found ${stateDirs.length} state directories`);

stateDirs.forEach(stateSlug => {
  const stateIndexPath = path.join(statesDir, stateSlug, 'index.html');
  
  if (!fs.existsSync(stateIndexPath)) {
    console.log(`⚠️  ${stateSlug}: index.html not found`);
    return;
  }
  
  let content = fs.readFileSync(stateIndexPath, 'utf8');
  let modified = false;
  
  // Fix 1: Navigation links - replace absolute paths with relative
  const navPatterns = [
    { from: 'href="/"', to: 'href="../../"' },
    { from: 'href="/states/index.html"', to: 'href="../index.html"' },
    { from: 'href="/about.html"', to: 'href="../../about.html"' },
  ];
  
  navPatterns.forEach(({ from, to }) => {
    if (content.includes(from)) {
      content = content.replace(new RegExp(from.replace('/', '\\/'), 'g'), to);
      modified = true;
    }
  });
  
  // Fix 2: Hero image - ensure it has empty src and is in correct position
  // Check if hero-img exists and has correct structure
  if (content.includes('id="hero-img"')) {
    // Ensure src is empty (let JavaScript set it)
    content = content.replace(
      /<img id="hero-img"[^>]*src="[^"]*"[^>]*>/g,
      '<img id="hero-img" alt="" class="w-full h-full object-cover" src="" />'
    );
    
    // Ensure hero-img is in the hero section, not in Popular Routes
    const heroSectionPattern = /<section class="relative">[\s\S]*?<div class="aspect-video w-full bg-gray-100">[\s\S]*?<\/div>/;
    const popularRoutesPattern = /<section class="max-w-7xl mx-auto px-4 py-10">[\s\S]*?<h2 class="text-2xl font-semibold mb-4">Popular Routes<\/h2>[\s\S]*?<img id="hero-img"/;
    
    if (popularRoutesPattern.test(content)) {
      console.log(`  ⚠️  ${stateSlug}: Hero image found in Popular Routes section - needs manual fix`);
    }
    
    modified = true;
  } else {
    console.log(`  ⚠️  ${stateSlug}: No hero-img element found`);
  }
  
  // Fix 3: Script path - ensure it uses absolute path for GitHub Pages
  if (content.includes('../../js/state.js')) {
    content = content.replace(/src="\.\.\/\.\.\/js\/state\.js"/g, 'src="/desitrails/js/state.js"');
    modified = true;
  }
  
  // Fix 4: Ensure script tag exists
  if (!content.includes('state.js')) {
    console.log(`  ⚠️  ${stateSlug}: No state.js script tag found`);
  }
  
  if (modified) {
    fs.writeFileSync(stateIndexPath, content, 'utf8');
    console.log(`✅ Fixed: ${stateSlug}/index.html`);
  } else {
    console.log(`✓  No changes needed: ${stateSlug}/index.html`);
  }
  
  // Also fix itinerary pages
  const itineraryFiles = fs.readdirSync(path.join(statesDir, stateSlug))
    .filter(f => f.startsWith('itinerary-') && f.endsWith('.html'));
  
  itineraryFiles.forEach(itFile => {
    const itPath = path.join(statesDir, stateSlug, itFile);
    let itContent = fs.readFileSync(itPath, 'utf8');
    let itModified = false;
    
    // Fix navigation links in itinerary pages
    navPatterns.forEach(({ from, to }) => {
      if (itContent.includes(from)) {
        // For itinerary pages, paths are different (one more level deep)
        const itTo = to.replace('../', '../../').replace('../../', '../../../');
        itContent = itContent.replace(new RegExp(from.replace('/', '\\/'), 'g'), itTo);
        itModified = true;
      }
    });
    
    // Fix script path in itinerary pages
    if (itContent.includes('../../js/itinerary.js')) {
      itContent = itContent.replace(/src="\.\.\/\.\.\/js\/itinerary\.js"/g, 'src="/desitrails/js/itinerary.js"');
      itModified = true;
    }
    
    if (itModified) {
      fs.writeFileSync(itPath, itContent, 'utf8');
      console.log(`  ✅ Fixed: ${stateSlug}/${itFile}`);
    }
  });
});

console.log('\n✨ All state pages fixed!');

