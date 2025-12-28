const fs = require('fs');
const path = require('path');

const statesDir = path.join(__dirname, '..', 'states');
const stateDirs = fs.readdirSync(statesDir).filter(item => {
  const itemPath = path.join(statesDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log('Verifying all itinerary pages...\n');

let fixed = 0;
let alreadyCorrect = 0;

stateDirs.forEach(stateSlug => {
  const statePath = path.join(statesDir, stateSlug);
  const files = fs.readdirSync(statePath);
  const itineraryFiles = files.filter(f => f.startsWith('itinerary-') && f.endsWith('.html'));
  
  itineraryFiles.forEach(itFile => {
    const itPath = path.join(statePath, itFile);
    let content = fs.readFileSync(itPath, 'utf8');
    let modified = false;
    
    // Ensure script path is correct
    if (!content.includes('src="/desitrails/js/itinerary.js"')) {
      // Fix any relative paths
      content = content.replace(/src="\.\.\/\.\.\/js\/itinerary\.js"/g, 'src="/desitrails/js/itinerary.js"');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/js\/itinerary\.js"/g, 'src="/desitrails/js/itinerary.js"');
      modified = true;
    }
    
    // Ensure sidebar element exists in HTML
    if (!content.includes('id="itinerary-sidebar"')) {
      console.error(`  ❌ Missing sidebar element: ${stateSlug}/${itFile}`);
    }
    
    // Ensure root element exists
    if (!content.includes('id="itinerary-root"')) {
      console.error(`  ❌ Missing root element: ${stateSlug}/${itFile}`);
    }
    
    if (modified) {
      fs.writeFileSync(itPath, content, 'utf8');
      console.log(`  ✅ Fixed: ${stateSlug}/${itFile}`);
      fixed++;
    } else {
      alreadyCorrect++;
    }
  });
});

console.log(`\n✨ Verification complete!`);
console.log(`   Fixed: ${fixed} files`);
console.log(`   Already correct: ${alreadyCorrect} files`);
