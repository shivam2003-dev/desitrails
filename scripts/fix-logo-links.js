const fs = require('fs');
const path = require('path');

// Fix logo links to use absolute path for GitHub Pages
const filesToFix = [
  { file: 'index.html', logoPath: '/desitrails/' },
  { file: 'about.html', logoPath: '/desitrails/' },
  { file: 'states/index.html', logoPath: '/desitrails/' },
];

// Fix all state pages
const statesDir = path.join(__dirname, '..', 'states');
const stateDirs = fs.readdirSync(statesDir).filter(item => {
  const itemPath = path.join(statesDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log('Fixing logo links...\n');

// Fix root pages
filesToFix.forEach(({ file, logoPath }) => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace relative logo links with absolute
    content = content.replace(
      /<a href="\.\.?\/?" class="text-2xl md:text-3xl font-semibold tracking-tight">DesiTrails<\/a>/g,
      `<a href="${logoPath}" class="text-2xl md:text-3xl font-semibold tracking-tight">DesiTrails</a>`
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  }
});

// Fix state pages
stateDirs.forEach(stateSlug => {
  const stateIndexPath = path.join(statesDir, stateSlug, 'index.html');
  if (fs.existsSync(stateIndexPath)) {
    let content = fs.readFileSync(stateIndexPath, 'utf8');
    content = content.replace(
      /<a href="\.\.\/\.\." class="text-2xl md:text-3xl font-semibold tracking-tight">DesiTrails<\/a>/g,
      '<a href="/desitrails/" class="text-2xl md:text-3xl font-semibold tracking-tight">DesiTrails</a>'
    );
    fs.writeFileSync(stateIndexPath, content, 'utf8');
  }
  
  // Fix itinerary pages
  const itineraryFiles = fs.readdirSync(path.join(statesDir, stateSlug))
    .filter(f => f.startsWith('itinerary-') && f.endsWith('.html'));
  
  itineraryFiles.forEach(itFile => {
    const itPath = path.join(statesDir, stateSlug, itFile);
    let itContent = fs.readFileSync(itPath, 'utf8');
    itContent = itContent.replace(
      /<a href="\.\.\/\.\.\/\.\.\/\.\." class="text-2xl md:text-3xl font-semibold tracking-tight">DesiTrails<\/a>/g,
      '<a href="/desitrails/" class="text-2xl md:text-3xl font-semibold tracking-tight">DesiTrails</a>'
    );
    fs.writeFileSync(itPath, itContent, 'utf8');
  });
});

console.log('\n✨ All logo links fixed!');

