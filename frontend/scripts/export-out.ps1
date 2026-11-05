# =============================================================================
# AGAFARI - DIRECTADMIN / APACHE STATIC & PHP DISTRIBUTION PACKAGER
# =============================================================================

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendRoot = (Resolve-Path "$scriptDir\..").Path
$projectRoot = (Resolve-Path "$frontendRoot\..").Path
$nextDir = "$frontendRoot\.next"
$publicDir = "$frontendRoot\public"
$outDir = "$frontendRoot\out"
$rootOutDir = "$projectRoot\out"
$phpBackendDir = "$frontendRoot\php-backend"

Write-Host "[1/8] Preparing out directory..."

# 1. Clean and create out directory
if (Test-Path $outDir) {
    Remove-Item -Path $outDir -Recurse -Force
}
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

# 2. Copy public assets
if (Test-Path $publicDir) {
    Copy-Item -Path "$publicDir\*" -Destination $outDir -Recurse -Force
    Write-Host "[2/8] Copied public assets to out/"
}

# 3. Copy .next/static to out/_next/static
$nextStaticSrc = "$nextDir\static"
$nextStaticDest = "$outDir\_next\static"
if (Test-Path $nextStaticSrc) {
    New-Item -ItemType Directory -Path "$outDir\_next" -Force | Out-Null
    Copy-Item -Path $nextStaticSrc -Destination "$outDir\_next" -Recurse -Force
    Write-Host "[3/8] Copied Next.js static JS/CSS bundles to out/_next/static"
}

# 4. Copy landing page (index.html) and all prerendered pages
$serverAppDir = "$nextDir\server\app"
if (Test-Path $serverAppDir) {
    $htmlFiles = Get-ChildItem -Path $serverAppDir -Filter "*.html" -Recurse
    $copiedCount = 0
    foreach ($file in $htmlFiles) {
        $relPath = $file.FullName.Substring($serverAppDir.Length).TrimStart('\', '/')
        $destFile = Join-Path $outDir $relPath
        $destParent = Split-Path -Parent $destFile
        if (!(Test-Path $destParent)) {
            New-Item -ItemType Directory -Path $destParent -Force | Out-Null
        }
        Copy-Item -Path $file.FullName -Destination $destFile -Force

        # Also create directory/index.html fallback for clean URLs
        if ($file.Name -ne "index.html") {
            $routeBase = $relPath -replace '\.html$', ''
            $routeDirIndex = Join-Path $outDir "$routeBase\index.html"
            $routeParent = Split-Path -Parent $routeDirIndex
            if (!(Test-Path $routeParent)) {
                New-Item -ItemType Directory -Path $routeParent -Force | Out-Null
            }
            Copy-Item -Path $file.FullName -Destination $routeDirIndex -Force
        }
        $copiedCount++
    }

    # Ensure event control route entry exists from couple dashboard template
    $coupleDashPath = Join-Path $outDir "couple\dashboard.html"
    if (Test-Path $coupleDashPath) {
        $eventControlDir = Join-Path $outDir "event\control"
        if (!(Test-Path $eventControlDir)) {
            New-Item -ItemType Directory -Path $eventControlDir -Force | Out-Null
        }
        Copy-Item -Path $coupleDashPath -Destination (Join-Path $outDir "event\control.html") -Force
        Copy-Item -Path $coupleDashPath -Destination (Join-Path $eventControlDir "index.html") -Force
    }

    Write-Host "[4/8] Copied $copiedCount prerendered static HTML pages to out/"
}

# 5. Package PHP backend directly into out/api/, out/php-backend/, out/config/, out/lib/
if (Test-Path $phpBackendDir) {
    # php-backend
    $destPhpDir = "$outDir\php-backend"
    Copy-Item -Path $phpBackendDir -Destination $outDir -Recurse -Force

    # api/
    $phpApiSrc = "$phpBackendDir\api"
    $destApiDir = "$outDir\api"
    if (Test-Path $phpApiSrc) {
        New-Item -ItemType Directory -Path $destApiDir -Force | Out-Null
        Copy-Item -Path "$phpApiSrc\*" -Destination $destApiDir -Recurse -Force
    }

    # config/ into api/config/ and root out/config/
    $phpConfigSrc = "$phpBackendDir\config"
    if (Test-Path $phpConfigSrc) {
        New-Item -ItemType Directory -Path "$destApiDir\config" -Force | Out-Null
        Copy-Item -Path "$phpConfigSrc\*" -Destination "$destApiDir\config" -Recurse -Force

        New-Item -ItemType Directory -Path "$outDir\config" -Force | Out-Null
        Copy-Item -Path "$phpConfigSrc\*" -Destination "$outDir\config" -Recurse -Force
    }

    # lib/ into api/lib/ and root out/lib/
    $phpLibSrc = "$phpBackendDir\lib"
    if (Test-Path $phpLibSrc) {
        New-Item -ItemType Directory -Path "$destApiDir\lib" -Force | Out-Null
        Copy-Item -Path "$phpLibSrc\*" -Destination "$destApiDir\lib" -Recurse -Force

        New-Item -ItemType Directory -Path "$outDir\lib" -Force | Out-Null
        Copy-Item -Path "$phpLibSrc\*" -Destination "$outDir\lib" -Recurse -Force
    }

    Write-Host "[5/8] Bundled PHP API microservices into out/api/, out/php-backend/, out/config, and out/lib/"
}

# 6. Generate .htaccess
$htaccessContent = @'
<IfModule mod_rewrite.c>
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

  # 6. Dedicated Wedding Event Dashboard (matches /org-xxx/event-yyy or any agency wedding clean URL)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/(api|admin|organizer|couple|scanner|live-streamer|moderation|select-access|docs|_next|assets|branding|audio) [NC]
  RewriteRule ^([a-zA-Z0-9_-]+)/([a-zA-Z0-9_-]+)/?$ couple/dashboard.html?org=$1&slug=$2 [L,QSA]

  # 7. Sub-routes for staff & crew:
  RewriteRule ^([a-zA-Z0-9_-]+)/([a-zA-Z0-9_-]+)/couple/?$ couple/dashboard.html?org=$1&slug=$2 [L,QSA]
  RewriteRule ^([a-zA-Z0-9_-]+)/([a-zA-Z0-9_-]+)/scanner/?$ scanner/index.html?org=$1&slug=$2 [L,QSA]
  RewriteRule ^([a-zA-Z0-9_-]+)/([a-zA-Z0-9_-]+)/live-streamer/?$ live-streamer/index.html?org=$1&slug=$2 [L,QSA]
  RewriteRule ^([a-zA-Z0-9_-]+)/([a-zA-Z0-9_-]+)/moderation/?$ moderation/index.html?org=$1&slug=$2 [L,QSA]

  # 8. Fallback: rewrite all other routes to index.html
  RewriteRule . /index.html [L]
</IfModule>
'@

[System.IO.File]::WriteAllText("$outDir\.htaccess", $htaccessContent, [System.Text.Encoding]::ASCII)
Write-Host "[6/8] Generated .htaccess for Apache / LiteSpeed server routing"

# 7. Mirror to project root out/
if (Test-Path $rootOutDir) {
    Remove-Item -Path $rootOutDir -Recurse -Force
}
New-Item -ItemType Directory -Path $rootOutDir -Force | Out-Null
Copy-Item -Path "$outDir\*" -Destination $rootOutDir -Recurse -Force
Copy-Item -Path "$outDir\.htaccess" -Destination $rootOutDir -Force
Write-Host "[7/8] Mirrored out/ to project root: $rootOutDir"

# 8. Create Linux/cPanel/DirectAdmin compatible out.zip
$rootZip = "$projectRoot\out.zip"
$frontendZip = "$frontendRoot\out.zip"
if (Test-Path $rootZip) { Remove-Item $rootZip -Force }
if (Test-Path $frontendZip) { Remove-Item $frontendZip -Force }

Push-Location $outDir
& tar.exe -a -c -f $rootZip * .htaccess
Pop-Location

if (Test-Path $rootZip) {
    Copy-Item -Path $rootZip -Destination $frontendZip -Force
    $zipBytes = (Get-Item $rootZip).Length
    $zipMb = [math]::Round($zipBytes / 1MB, 2)
    Write-Host "[8/8] Successfully created out.zip ($zipMb MB) at: $rootZip"
}
