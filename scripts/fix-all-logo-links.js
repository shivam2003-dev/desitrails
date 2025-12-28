const fs = require('fs');
const path = require('path');

const statesDir = path.join(__dirname, '..', 'states');
const stateDirs = fs.readdirSync(statesDir).filter(item => {
  const itemPath = path.join(statesDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log('Fixing logo links in all state and itinerary pages...\n');

let fixed = 0;

stateDirs.forEach(stateSlug => {
  // Fix state index pages
  const stateIndexPath = path.join(statesDir, stateSlug, 'index.html');
  if (fs.existsSync(stateIndexPath)) {
    let content = fs.readFileSync(stateIndexPath, 'utf8');
    const original = content;
    // Replace ../../ with /desitrails/
    content = content.replace(/href="\.\.\/\.\."/g, 'href="/desitrails/"');
    if (content !== original) {
      fs.writeFileSync(stateIndexPath, content, 'utf8');
      fixed++;
      console.log(`✅ Fixed: ${stateSlug}/index.html`);
    }
  }
  
  // Fix itinerary pages
  const itineraryFiles = fs.readdirSync(path.join(statesDir, stateSlug))
    .filter(f => f.startsWith('itinerary-') && f.endsWith('.html'));
  
  itineraryFiles.forEach(itFile => {
    const itPath = path.join(statesDir, stateSlug, itFile);
    let itContent = fs.readFileSync(itPath, 'utf8');
    const original = itContent;
    // Replace ../../../../ with /desitrails/
    itContent = itContent.replace(/href="\.\.\/\.\.\/\.\.\/\.\."/g, 'href="/desitrails/"');
    if (itContent !== original) {
      fs.writeFileSync(itPath, itContent, 'utf8');
      fixed++;
      console.log(`  ✅ Fixed: ${stateSlug}/${itFile}`);
    }
  });
});

console.log(`\n✨ Fixed ${fixed} files!`);

