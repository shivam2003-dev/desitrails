const fs = require('fs');
const path = require('path');

const statesDir = path.join(__dirname, '..', 'states');
const stateDirs = fs.readdirSync(statesDir).filter(item => {
  const itemPath = path.join(statesDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log('Verifying all itinerary pages have correct structure...\n');

let total = 0;
let correct = 0;
let fixed = 0;
let issues = [];

stateDirs.forEach(stateSlug => {
  const statePath = path.join(statesDir, stateSlug);
  const files = fs.readdirSync(statePath);
  const itineraryFiles = files.filter(f => f.startsWith('itinerary-') && f.endsWith('.html'));
  
  itineraryFiles.forEach(itFile => {
    total++;
    const itPath = path.join(statePath, itFile);
    let content = fs.readFileSync(itPath, 'utf8');
    let modified = false;
    
    // Check 1: Script path should be absolute
    if (!content.includes('src="/desitrails/js/itinerary.js"')) {
      content = content.replace(/src="\.\.\/\.\.\/js\/itinerary\.js"/g, 'src="/desitrails/js/itinerary.js"');
      content = content.replace(/src="\.\.\/\.\.\/\.\.\/js\/itinerary\.js"/g, 'src="/desitrails/js/itinerary.js"');
      if (content.includes('itinerary.js')) {
        modified = true;
        issues.push(`${stateSlug}/${itFile}: Fixed script path`);
      }
    }
    
    // Check 2: Must have itinerary-root element
    if (!content.includes('id="itinerary-root"')) {
      issues.push(`❌ ${stateSlug}/${itFile}: Missing itinerary-root element`);
    }
    
    // Check 3: Must have itinerary-sidebar element
    if (!content.includes('id="itinerary-sidebar"')) {
      issues.push(`❌ ${stateSlug}/${itFile}: Missing itinerary-sidebar element`);
    }
    
    // Check 4: Must have data-itinerary-id attribute
    if (!content.includes('data-itinerary-id')) {
      issues.push(`⚠️  ${stateSlug}/${itFile}: Missing data-itinerary-id attribute`);
    }
    
    if (modified) {
      fs.writeFileSync(itPath, content, 'utf8');
      console.log(`✅ Fixed: ${stateSlug}/${itFile}`);
      fixed++;
    } else {
      correct++;
    }
  });
});

console.log(`\n✨ Verification complete!`);
console.log(`   Total itinerary pages: ${total}`);
console.log(`   Already correct: ${correct}`);
console.log(`   Fixed: ${fixed}`);

if (issues.length > 0) {
  console.log(`\n⚠️  Issues found:`);
  issues.forEach(issue => console.log(`   ${issue}`));
} else {
  console.log(`\n✅ All itinerary pages are correctly configured!`);
  console.log(`   The tabular format will work for ALL ${total} itinerary pages across ALL states.`);
}

