# PowerShell script to test database connection
# This avoids the && syntax issues in PowerShell

Write-Host "Testing database connection..." -ForegroundColor Green

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "Running database test..." -ForegroundColor Yellow
    node test-database-connection.js
} else {
    Write-Host "Installing dependencies first..." -ForegroundColor Yellow
    npm install
    Write-Host "Dependencies installed. Running database test..." -ForegroundColor Yellow
    node test-database-connection.js
}
