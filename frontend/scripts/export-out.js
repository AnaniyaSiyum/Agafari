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

// 5. Package PHP backend directly into out/api/ and out/php-backend/ and out/
if (fs.existsSync(phpBackendDir)) {
  const destPhpDir = path.join(outDir, 'php-backend');
  copyDirSync(phpBackendDir, destPhpDir);

  // Copy all php-backend/api into out/api/
  const phpApiSrc = path.join(phpBackendDir, 'api');
  const destApiDir = path.join(outDir, 'api');
  if (fs.existsSync(phpApiSrc)) {
    copyDirSync(phpApiSrc, destApiDir);
  }

  // Copy config/ and lib/ into out/api/ as well for direct relative requires
  const phpConfigSrc = path.join(phpBackendDir, 'config');
  const destApiConfig = path.join(destApiDir, 'config');
  if (fs.existsSync(phpConfigSrc)) {
    copyDirSync(phpConfigSrc, destApiConfig);
    // Also copy config to root out/config for universal fallback
    copyDirSync(phpConfigSrc, path.join(outDir, 'config'));
  }

  const phpLibSrc = path.join(phpBackendDir, 'lib');
  const destApiLib = path.join(destApiDir, 'lib');
  if (fs.existsSync(phpLibSrc)) {
    copyDirSync(phpLibSrc, destApiLib);
    // Also copy lib to root out/lib for universal fallback
    copyDirSync(phpLibSrc, path.join(outDir, 'lib'));
  }

  console.log('✓ Bundled PHP API microservices into out/api/, out/php-backend/, out/config, and out/lib/');
}

// 6. Generate .htaccess matching Next.js static export + PHP backend architecture
const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # 1. API clean URL rewrites (support both /api/path and /api/path.php)
  RewriteRule ^api/auth/login/?$ api/auth/login.php [L,QSA]
  RewriteRule ^api/auth/verify-dashboard/?$ api/auth/verify-dashboard.php [L,QSA]
  RewriteRule ^api/auth/me/?$ api/auth/me.php [L,QSA]
  RewriteRule ^api/admin/events/?$ api/admin/events.php [L,QSA]
  RewriteRule ^api/admin/users/?$ api/admin/users.php [L,QSA]
  RewriteRule ^api/organizer/events/?$ api/organizer/events.php [L,QSA]
  RewriteRule ^api/organizer/media/?$ api/organizer/media.php [L,QSA]
  RewriteRule ^api/cms/?$ api/cms.php [L,QSA]
  RewriteRule ^api/events/([^/]+)/team/?$ api/events/team.php?slug=$1 [L,QSA]
  RewriteRule ^api/events/([^/]+)/invitations/?$ api/events/invitations.php?slug=$1 [L,QSA]
  RewriteRule ^api/events/([^/]+)/?$ api/events/details.php?slug=$1 [L,QSA]
  RewriteRule ^api/qr/([^/]+)/?$ api/qr/scan.php?code=$1 [L,QSA]

  # 2. Do NOT rewrite any /api/ requests to index.html (allow PHP to handle them directly)
  RewriteCond %{REQUEST_URI} ^/api/ [NC]
  RewriteRule ^ - [L]

  # 3. Block direct web access to sensitive config files
  <FilesMatch "(db_config\.php|\.env|\.sql|\.log|\.ini)$">
    Order allow,deny
    Deny from all
  </FilesMatch>

  # 4. Serve existing physical files directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # 5. Clean URLs fallback for exported HTML routes
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.*)$ $1.html [L]

  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*)$ $1/index.html [L]

  # 6. Fallback: rewrite all client routes to index.html
  RewriteRule . /index.html [L]
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


