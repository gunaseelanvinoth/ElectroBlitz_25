# PowerShell script to start the React app
# This avoids the && syntax issues in PowerShell

Write-Host "Starting ElectroBlitz React App..." -ForegroundColor Green

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "Dependencies found. Starting development server..." -ForegroundColor Yellow
    npm start
} else {
    Write-Host "Installing dependencies first..." -ForegroundColor Yellow
    npm install
    Write-Host "Dependencies installed. Starting development server..." -ForegroundColor Yellow
    npm start
}
