# PowerShell script to verify the admin dashboard fix
Write-Host "Verifying admin dashboard fix..." -ForegroundColor Green

if (Test-Path "node_modules") {
    Write-Host "Running verification test..." -ForegroundColor Yellow
    node verify-fix.js
} else {
    Write-Host "Installing dependencies first..." -ForegroundColor Yellow
    npm install
    Write-Host "Dependencies installed. Running verification test..." -ForegroundColor Yellow
    node verify-fix.js
}
