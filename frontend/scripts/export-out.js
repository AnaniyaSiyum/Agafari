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

// 4. Copy landing page (index.html) and all prerendered pages recursively
const serverAppDir = path.join(nextDir, 'server', 'app');
if (fs.existsSync(serverAppDir)) {
  let copiedCount = 0;

  function copyPrerendered(dir, relPath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullSrc = path.join(dir, entry.name);
      const currentRel = path.join(relPath, entry.name);

      if (entry.isDirectory()) {
        copyPrerendered(fullSrc, currentRel);
      } else if (entry.name.endsWith('.html')) {
        // Destination in outDir
        const destFile = path.join(outDir, currentRel);
        fs.mkdirSync(path.dirname(destFile), { recursive: true });
        fs.copyFileSync(fullSrc, destFile);

        // Also create directory/index.html fallback for clean URLs
        if (entry.name !== 'index.html') {
          const routeBase = currentRel.replace(/\.html$/, '');
          const routeDirIndex = path.join(outDir, routeBase, 'index.html');
          fs.mkdirSync(path.dirname(routeDirIndex), { recursive: true });
          fs.copyFileSync(fullSrc, routeDirIndex);
        }
        copiedCount++;
      }
    }
  }

  copyPrerendered(serverAppDir);
  console.log(`✓ Copied ${copiedCount} prerendered static HTML pages to out/`);
  if (copiedCount === 0) {
    console.error('⚠️ WARNING: No HTML pages found in .next/server/app! Run "next build" first.');
  }
} else {
  console.error('❌ ERROR: .next/server/app does not exist! Run "npm run build" before exporting.');
}

// 5. Package PHP backend & API endpoints for cPanel / LiteSpeed web servers
if (fs.existsSync(phpBackendDir)) {
  const destPhpDir = path.join(outDir, 'php-backend');
  copyDirSync(phpBackendDir, destPhpDir);

  // Copy auth and API endpoints for physical fallback
  const endpoints = [
    { src: 'api/auth/login.php', dest: 'api/auth/login/index.php' },
    { src: 'api/auth/verify-dashboard.php', dest: 'api/auth/verify-dashboard/index.php' },
    { src: 'api/auth/me.php', dest: 'api/auth/me/index.php' },
    { src: 'api/admin/events.php', dest: 'api/admin/events/index.php' },
    { src: 'api/admin/users.php', dest: 'api/admin/users/index.php' },
    { src: 'api/organizer/events.php', dest: 'api/organizer/events/index.php' },
    { src: 'api/organizer/media.php', dest: 'api/organizer/media/index.php' },
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
  RewriteRule ^api/admin/events/?$ php-backend/api/admin/events.php [L,QSA]
  RewriteRule ^api/admin/users/?$ php-backend/api/admin/users.php [L,QSA]
  RewriteRule ^api/organizer/events/?$ php-backend/api/organizer/events.php [L,QSA]
  RewriteRule ^api/organizer/media/?$ php-backend/api/organizer/media.php [L,QSA]
  RewriteRule ^api/events/([^/]+)/team/?$ php-backend/api/events/team.php?slug=$1 [L,QSA]
  RewriteRule ^api/events/([^/]+)/invitations/?$ php-backend/api/events/invitations.php?slug=$1 [L,QSA]
  RewriteRule ^api/events/([^/]+)/?$ php-backend/api/events/details.php?slug=$1 [L,QSA]
  RewriteRule ^api/qr/([^/]+)/?$ php-backend/api/qr/scan.php?code=$1 [L,QSA]

  # Block direct web access to sensitive files
  <FilesMatch "(db_config\.php|\.env|\.sql|\.log|\.ini)$">
    Order allow,deny
    Deny from all
  </FilesMatch>

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


