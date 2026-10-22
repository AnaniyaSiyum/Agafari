const fs = require('fs');
const path = require('path');

const frontendRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(frontendRoot, '..');
const nextDir = path.join(frontendRoot, '.next');
const publicDir = path.join(frontendRoot, 'public');
const outDir = path.join(frontendRoot, 'out');
const rootOutDir = path.join(projectRoot, 'out');

console.log('📦 Preparing static "out" distribution for landing page & static routes...');

function cleanAndCreateDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

// 1. Clean / create out directories
cleanAndCreateDir(outDir);

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 2. Copy all public assets to out/
if (fs.existsSync(publicDir)) {
  copyDirSync(publicDir, outDir);
  console.log('✓ Copied public assets to out/');
}

// 3. Copy .next/static to out/_next/static
const nextStaticSrc = path.join(nextDir, 'static');
const nextStaticDest = path.join(outDir, '_next', 'static');
if (fs.existsSync(nextStaticSrc)) {
  copyDirSync(nextStaticSrc, nextStaticDest);
  console.log('✓ Copied Next.js static JS/CSS bundles to out/_next/static');
}

// 4. Copy landing page (index.html) and other prerendered pages
const serverAppDir = path.join(nextDir, 'server', 'app');
if (fs.existsSync(serverAppDir)) {
  // Copy index.html
  const indexPath = path.join(serverAppDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, path.join(outDir, 'index.html'));
    console.log('✓ Copied landing page index.html to out/index.html');
  }

  // Copy other prerendered HTML pages
  const files = fs.readdirSync(serverAppDir, { withFileTypes: true });
  for (const file of files) {
    if (!file.isDirectory() && file.name.endsWith('.html') && file.name !== 'index.html') {
      fs.copyFileSync(path.join(serverAppDir, file.name), path.join(outDir, file.name));
      const routeName = file.name.replace('.html', '');
      const routeDir = path.join(outDir, routeName);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      fs.copyFileSync(path.join(serverAppDir, file.name), path.join(routeDir, 'index.html'));
    }
  }
  console.log('✓ Copied prerendered static pages to out/');
}

// 5. Mirror to project root out/ as well
try {
  cleanAndCreateDir(rootOutDir);
  copyDirSync(outDir, rootOutDir);
  console.log('✓ Mirrored out/ to project root: ' + rootOutDir);
} catch (e) {
  // Ignore if root cannot be written
}

console.log('🎉 "out" folder successfully generated at: ' + outDir);
