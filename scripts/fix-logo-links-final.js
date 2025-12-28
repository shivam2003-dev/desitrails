const fs = require('fs');
const path = require('path');

function fixLogoLinks(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixLogoLinks(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const original = content;
      
      // Fix logo links - replace relative paths with absolute
      content = content.replace(
        /href="\.\.\/\.\." class="text-2xl md:text-3xl font-semibold tracking-tight">DesiTrails<\/a>/g,
        'href="/desitrails/" class="text-2xl md:text-3xl font-semibold tracking-tight">DesiTrails</a>'
      );
      content = content.replace(
        /href="\.\.\/\.\.\/\.\.\/\.\." class="text-2xl md:text-3xl font-semibold tracking-tight">DesiTrails<\/a>/g,
        'href="/desitrails/" class="text-2xl md:text-3xl font-semibold tracking-tight">DesiTrails</a>'
      );
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
      }
    }
  });
}

const statesDir = path.join(__dirname, '..', 'states');
console.log('Fixing logo links in all HTML files...\n');
fixLogoLinks(statesDir);
console.log('\n✨ Done!');

