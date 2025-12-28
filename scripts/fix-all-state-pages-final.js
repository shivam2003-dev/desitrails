const fs = require('fs');
const path = require('path');

const statesDir = path.join(__dirname, '..', 'states');
const stateDirs = fs.readdirSync(statesDir).filter(item => {
  const itemPath = path.join(statesDir, item);
  return fs.statSync(itemPath).isDirectory();
});

console.log(`Fixing ${stateDirs.length} state pages...\n`);

stateDirs.forEach(stateSlug => {
  const stateIndexPath = path.join(statesDir, stateSlug, 'index.html');
  
  if (!fs.existsSync(stateIndexPath)) {
    return;
  }
  
  let content = fs.readFileSync(stateIndexPath, 'utf8');
  let modified = false;
  
  // Fix 1: Remove defer from script tag
  if (content.includes('defer src="/desitrails/js/state.js"')) {
    content = content.replace('defer src="/desitrails/js/state.js"', 'src="/desitrails/js/state.js"');
    modified = true;
  }
  if (content.includes('defer src="../../js/state.js"')) {
    content = content.replace('defer src="../../js/state.js"', 'src="/desitrails/js/state.js"');
    modified = true;
  }
  
  // Fix 2: Ensure script tag uses absolute path
  if (content.includes('src="../../js/state.js"')) {
    content = content.replace('src="../../js/state.js"', 'src="/desitrails/js/state.js"');
    modified = true;
  }
  
  // Fix 3: Fix logo link
  if (content.includes('href="../../"')) {
    content = content.replace(/href="\.\.\/\.\."/g, 'href="/desitrails/"');
    modified = true;
  }
  
  // Fix 4: Fix navigation links
  if (content.includes('href="../index.html"')) {
    content = content.replace('href="../index.html"', 'href="/desitrails/states/index.html"');
    modified = true;
  }
  if (content.includes('href="../../about.html"')) {
    content = content.replace('href="../../about.html"', 'href="/desitrails/about.html"');
    modified = true;
  }
  if (content.includes('href="../../"')) {
    content = content.replace(/href="\.\.\/\.\."(?![^<]*>)/g, 'href="/desitrails/"');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(stateIndexPath, content, 'utf8');
    console.log(`✅ Fixed: ${stateSlug}/index.html`);
  }
});

console.log('\n✨ All state pages fixed!');

