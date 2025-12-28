const fs = require('fs');
const path = require('path');

const statesDir = path.join(__dirname, '..', 'states');
const stateDirs = fs.readdirSync(statesDir).filter(item => {
  const itemPath = path.join(statesDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log('Adding loading indicators to all state pages...\n');

stateDirs.forEach(stateSlug => {
  const stateIndexPath = path.join(statesDir, stateSlug, 'index.html');
  
  if (!fs.existsSync(stateIndexPath)) {
    return;
  }
  
  let content = fs.readFileSync(stateIndexPath, 'utf8');
  let modified = false;
  
  // Add loading indicator to routes section
  if (content.includes('<div id="routes" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">') && 
      !content.includes('routes-status')) {
    content = content.replace(
      /<div id="routes" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">\s*<!-- Filled by JS -->\s*<\/div>/g,
      '<div id="routes" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><div class="col-span-full text-gray-500" id="routes-status">Loading routes...</div></div>'
    );
    modified = true;
  }
  
  // Add loading indicator to themes section
  if (content.includes('<div id="themes" class="flex flex-wrap gap-3">') && 
      !content.includes('themes-status')) {
    content = content.replace(
      /<div id="themes" class="flex flex-wrap gap-3">\s*<!-- Filled by JS -->\s*<\/div>/g,
      '<div id="themes" class="flex flex-wrap gap-3"><div class="text-gray-500" id="themes-status">Loading themes...</div></div>'
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(stateIndexPath, content, 'utf8');
    console.log(`✅ Fixed: ${stateSlug}/index.html`);
  }
});

console.log('\n✨ Done!');

