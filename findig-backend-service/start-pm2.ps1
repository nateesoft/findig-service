# =====================================
# PM2 Startup Script for Windows (PowerShell)
# =====================================

Write-Host "Starting Findig Backend Service..." -ForegroundColor Green

# Change to the script directory
Set-Location $PSScriptRoot

try {
    # Start PM2 with ecosystem config
    Write-Host "Starting PM2 with ecosystem config..." -ForegroundColor Yellow
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    Write-Host "Saving PM2 configuration..." -ForegroundColor Yellow
    pm2 save
    
    # Show PM2 status
    Write-Host "Current PM2 Status:" -ForegroundColor Cyan
    pm2 status
    
    Write-Host ""
    Write-Host "Findig Backend Service started successfully!" -ForegroundColor Green
    Write-Host "To view logs: pm2 logs findig-backend-service" -ForegroundColor White
    Write-Host "To stop service: pm2 stop findig-backend-service" -ForegroundColor White
    
} catch {
    Write-Host "Error starting PM2: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Keep window open
Read-Host "Press Enter to exit"