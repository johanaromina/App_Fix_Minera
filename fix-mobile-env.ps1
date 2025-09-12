# fix-mobile-env.ps1
# Ejecutar desde la RAÍZ del repo (App_FIX_MINERA). Requiere PowerShell en modo Admin.

$ErrorActionPreference = "Stop"
$mobilePath = Join-Path $PSScriptRoot "apps\mobile"
Write-Host "==> Repo root: $PSScriptRoot"
Write-Host "==> Mobile path: $mobilePath"

function Kill-Procs {
  Write-Host "==> Cerrando procesos Node/Expo/Java..."
  foreach ($p in @("node.exe","expo.exe","java.exe")) {
    try { taskkill /F /IM $p /T 2>$null | Out-Null } catch {}
  }
}

function Ensure-Rimraf {
  Write-Host "==> Verificando rimraf..."
  try { npx rimraf --version | Out-Null }
  catch {
    Write-Host "   Instalando rimraf global..."
    npm i -g rimraf
  }
}

function Clean-All {
  Write-Host "==> Limpiando node_modules y locks..."
  Ensure-Rimraf
  npx rimraf "$PSScriptRoot\node_modules" "$mobilePath\node_modules"
  Remove-Item -Force -ErrorAction SilentlyContinue "$PSScriptRoot\package-lock.json"
  Remove-Item -Force -ErrorAction SilentlyContinue "$mobilePath\package-lock.json"
  Write-Host "==> Limpiando caché npm..."
  npm cache clean --force | Out-Null
}

function Patch-Mobile-PackageJson {
  Write-Host "==> Ajustando apps/mobile/package.json a Expo SDK 54..."
  $pkgPath = Join-Path $mobilePath "package.json"
  if (!(Test-Path $pkgPath)) { throw "No se encontró $pkgPath" }

  # Backup
  Copy-Item $pkgPath "$pkgPath.bak" -Force

  $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json

  if (!$pkg.main) { $pkg | Add-Member -NotePropertyName main -NotePropertyValue "expo-router/entry" }
  if (!$pkg.dependencies) { $pkg | Add-Member -NotePropertyName dependencies -NotePropertyValue (@{}) }

  $pkg.dependencies.expo          = "^54.0.1"
  $pkg.dependencies."expo-router" = "^3.5.24"
  $pkg.dependencies.react         = "18.2.0"
  $pkg.dependencies."react-dom"   = "18.2.0"
  $pkg.dependencies."react-native"= "0.74.7"

  # Overrides locales para evitar que el workspace suba React 19
  if (-not $pkg.overrides) { $pkg | Add-Member -NotePropertyName overrides -NotePropertyValue (@{}) }
  $pkg.overrides.react         = "18.2.0"
  $pkg.overrides."react-dom"   = "18.2.0"
  $pkg.overrides."react-native"= "0.74.7"
  $pkg.overrides."expo-router" = "^3.5.24"

  ($pkg | ConvertTo-Json -Depth 100) | Set-Content -Path $pkgPath -Encoding UTF8
}

function Ensure-MetroConfig {
  Write-Host "==> Creando/actualizando metro.config.js..."
  $metroPath = Join-Path $mobilePath "metro.config.js"
  @"
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')];
config.watchFolders = [projectRoot];
module.exports = config;
"@ | Set-Content -Path $metroPath -Encoding UTF8
}

function Install-Mobile {
  Write-Host "==> Instalando dependencias del móvil (con legacy peer deps)..."
  npm install -w apps/mobile react@18.2.0 react-dom@18.2.0 react-native@0.74.7 expo-router@^3.5.24 --save --legacy-peer-deps
  npm install -w apps/mobile --legacy-peer-deps
}

function Verify-Tree {
  Write-Host "==> Verificando versiones instaladas..."
  npm ls -w apps/mobile expo react-native react expo-router || Write-Host "(npm ls puede mostrar warnings, es normal)"
}

function Start-Expo {
  Write-Host "==> Iniciando Expo con caché limpio..."
  Set-Location $mobilePath
  npx expo start -c
}

# Run
Kill-Procs
Clean-All
Patch-Mobile-PackageJson
Ensure-MetroConfig
Install-Mobile
Verify-Tree
Start-Expo
