const fs = require('fs');
const path = require('path');

const frontendRoot = path.resolve(__dirname, '..');
const projectRoot = path.resolve(frontendRoot, '..');
const nextDir = path.join(frontendRoot, '.next');
const publicDir = path.join(frontendRoot, 'public');
const outDir = path.join(frontendRoot, 'out');
const rootOutDir = path.join(projectRoot, 'out');
const phpBackendDir = path.join(frontendRoot, 'php-backend');

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

// 5. Package PHP backend & API endpoints for cPanel / LiteSpeed web servers
if (fs.existsSync(phpBackendDir)) {
  const destPhpDir = path.join(outDir, 'php-backend');
  copyDirSync(phpBackendDir, destPhpDir);

  // Copy auth endpoints to out/api/auth/.../index.php for physical fallback
  const endpoints = [
    { src: 'api/auth/login.php', dest: 'api/auth/login/index.php' },
    { src: 'api/auth/verify-dashboard.php', dest: 'api/auth/verify-dashboard/index.php' },
    { src: 'api/auth/me.php', dest: 'api/auth/me/index.php' },
  ];

  for (const ep of endpoints) {
    const fullSrc = path.join(phpBackendDir, ep.src);
    const fullDest = path.join(outDir, ep.dest);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    if (fs.existsSync(fullSrc)) {
      fs.copyFileSync(fullSrc, fullDest);
    }
  }

  console.log('✓ Bundled PHP API endpoints for cPanel / LiteSpeed hosting');
}

// 6. Generate .htaccess for clean URL routing and API proxy on Apache / LiteSpeed
const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Direct API requests to PHP backend
  RewriteRule ^api/auth/login/?$ php-backend/api/auth/login.php [L,QSA]
  RewriteRule ^api/auth/verify-dashboard/?$ php-backend/api/auth/verify-dashboard.php [L,QSA]
  RewriteRule ^api/auth/me/?$ php-backend/api/auth/me.php [L,QSA]
  RewriteRule ^api/events/([^/]+)/?$ php-backend/api/events/details.php?slug=$1 [L,QSA]

  # Serve existing physical files directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Clean URLs fallback for exported HTML routes
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  # Directory fallback
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*)$ $1/index.html [L]

  # Fallback to root index.html
  RewriteRule ^ index.html [L]
</IfModule>
`;
fs.writeFileSync(path.join(outDir, '.htaccess'), htaccessContent);
console.log('✓ Generated .htaccess for Apache / LiteSpeed server routing');

// 7. Mirror to project root out/ as well
try {
  cleanAndCreateDir(rootOutDir);
  copyDirSync(outDir, rootOutDir);
  console.log('✓ Mirrored out/ to project root: ' + rootOutDir);
} catch (e) {
  // Ignore if root cannot be written
}

// 8. Generate Linux/cPanel/DirectAdmin compatible out.zip with forward-slash paths
const { execSync } = require('child_process');
try {
  const rootZipPath = path.join(projectRoot, 'out.zip');
  const frontendZipPath = path.join(frontendRoot, 'out.zip');
  execSync(`tar.exe -a -c -f "${rootZipPath}" *`, { cwd: outDir, stdio: 'ignore' });
  if (fs.existsSync(rootZipPath)) {
    fs.copyFileSync(rootZipPath, frontendZipPath);
    console.log('✓ Created Linux-compatible out.zip deployment archive at: ' + rootZipPath);
  }
} catch (zipErr) {
  console.warn('Note: automatic out.zip creation skipped:', zipErr.message);
}

console.log('🎉 "out" folder successfully generated at: ' + outDir);


