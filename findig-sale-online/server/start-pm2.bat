@echo off
title Starting Findig Sale Online Service
echo ===============================================
echo Starting Findig Sale Online Service with PM2
echo ===============================================

cd /d "%~dp0"

echo Checking PM2 installation...
where pm2 >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: PM2 is not installed or not in PATH
    echo Please install PM2 globally: npm install -g pm2
    pause
    exit /b 1
)

echo Starting application with PM2...
pm2 start ecosystem.config.js

if %errorlevel% equ 0 (
    echo.
    echo ===============================================
    echo Service started successfully!
    echo ===============================================
    echo.
    echo To view logs: pm2 logs findig-sale-online
    echo To stop service: pm2 stop findig-sale-online
    echo To restart service: pm2 restart findig-sale-online
    echo To view status: pm2 status
    echo.
) else (
    echo.
    echo ===============================================
    echo Error: Failed to start the service
    echo ===============================================
    pause
    exit /b 1
)

pause