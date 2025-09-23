# PowerShell script to start Findig Sale Online Service with PM2
# Run this script as Administrator for best results

$Host.UI.RawUI.WindowTitle = "Starting Findig Sale Online Service"

Write-Host "===============================================" -ForegroundColor Green
Write-Host "Starting Findig Sale Online Service with PM2" -ForegroundColor Green  
Write-Host "===============================================" -ForegroundColor Green
Write-Host

# Change to script directory
Set-Location -Path $PSScriptRoot

Write-Host "Checking PM2 installation..." -ForegroundColor Yellow
try {
    $pm2Version = pm2 --version 2>$null
    if ($pm2Version) {
        Write-Host "PM2 version: $pm2Version" -ForegroundColor Green
    } else {
        throw "PM2 not found"
    }
} catch {
    Write-Host "Error: PM2 is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PM2 globally: npm install -g pm2" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Starting application with PM2..." -ForegroundColor Yellow
try {
    pm2 start ecosystem.config.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host
        Write-Host "===============================================" -ForegroundColor Green
        Write-Host "Service started successfully!" -ForegroundColor Green
        Write-Host "===============================================" -ForegroundColor Green
        Write-Host
        Write-Host "Useful PM2 commands:" -ForegroundColor Cyan
        Write-Host "  View logs:       pm2 logs findig-sale-online" -ForegroundColor White
        Write-Host "  Stop service:    pm2 stop findig-sale-online" -ForegroundColor White
        Write-Host "  Restart service: pm2 restart findig-sale-online" -ForegroundColor White
        Write-Host "  View status:     pm2 status" -ForegroundColor White
        Write-Host "  Save PM2 list:   pm2 save" -ForegroundColor White
        Write-Host "  Startup script:  pm2 startup" -ForegroundColor White
        Write-Host
    } else {
        throw "Failed to start service"
    }
} catch {
    Write-Host
    Write-Host "===============================================" -ForegroundColor Red
    Write-Host "Error: Failed to start the service" -ForegroundColor Red
    Write-Host "===============================================" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception.Message)" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit"