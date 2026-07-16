# Start Keycloak (no Docker) for MyFundraiser
$ErrorActionPreference = "Stop"
$kcHome = "C:\Users\yagna\keycloak\keycloak-26.7.0"

if (-not (Test-Path "$kcHome\bin\kc.bat")) {
  Write-Error "Keycloak not found at $kcHome. Re-run the install steps."
}

$realmSrc = Join-Path $PSScriptRoot "keycloak\realm-myfundraiser.json"
$realmDestDir = Join-Path $kcHome "data\import"
New-Item -ItemType Directory -Force -Path $realmDestDir | Out-Null
Copy-Item $realmSrc (Join-Path $realmDestDir "realm-myfundraiser.json") -Force

$env:KEYCLOAK_ADMIN = "admin"
$env:KEYCLOAK_ADMIN_PASSWORD = "admin"
$env:KC_HTTP_PORT = "8081"
$env:KC_HOSTNAME = "localhost"
$env:KC_HOSTNAME_PORT = "8081"
$env:KC_HOSTNAME_STRICT = "false"
$env:KC_HOSTNAME_STRICT_HTTPS = "false"
$env:KC_HTTP_ENABLED = "true"

Write-Host "Starting Keycloak on http://localhost:8081 ..."
Write-Host "Admin console: admin / admin"
Write-Host "Realm: myfundraiser"
Set-Location $kcHome
& .\bin\kc.bat start-dev --http-port=8081 --hostname-strict=false --import-realm
