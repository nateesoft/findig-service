@echo off
REM =====================================
REM PM2 Startup Script for Windows
REM =====================================

echo Starting Findig Backend Service...

REM Change to the project directory
cd /d "%~dp0"

REM Start PM2 with ecosystem config
pm2 start ecosystem.config.js

REM Save PM2 configuration
pm2 save

REM Show PM2 status
pm2 status

echo.
echo Findig Backend Service started successfully!
echo To view logs: pm2 logs findig-backend-service
echo To stop service: pm2 stop findig-backend-service
pause