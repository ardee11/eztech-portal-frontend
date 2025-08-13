# Clear CSS Cache Script for EZTech Portal Frontend
# Run this script when you experience text-2xs sizing issues after branch switches

Write-Host "🧹 Clearing CSS cache and rebuilding..." -ForegroundColor Yellow

# Stop the dev server if it's running
Write-Host "Stopping dev server..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# Clear node_modules cache
Write-Host "Clearing node_modules cache..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}

# Clear package-lock.json
Write-Host "Clearing package-lock.json..." -ForegroundColor Cyan
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json"
}

# Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Cyan
npm install

# Start dev server
Write-Host "Starting dev server..." -ForegroundColor Green
npm run dev

Write-Host "CSS cache cleared and dependencies reinstalled!" -ForegroundColor Green
Write-Host "The text-2xs issue should now be resolved." -ForegroundColor Green
