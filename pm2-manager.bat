@echo off
REM =====================================================
REM PM2 Manager for realtime-service + realtime-web (Windows)
REM
REM Usage:
REM   pm2-manager.bat                -> interactive menu
REM   pm2-manager.bat start   [all|service|web]
REM   pm2-manager.bat stop    [all|service|web]
REM   pm2-manager.bat restart [all|service|web]
REM   pm2-manager.bat delete  [all|service|web]
REM   pm2-manager.bat logs    [all|service|web]
REM   pm2-manager.bat status
REM   pm2-manager.bat build          -> npm run build (realtime-web)
REM   pm2-manager.bat startup        -> auto start PM2 on Windows boot
REM
REM Note: pm2 / npm are .cmd files, so they must be invoked with "call"
REM       otherwise this script stops after the first command.
REM =====================================================
setlocal EnableExtensions

set "ROOT=%~dp0"
set "SERVICE_DIR=%ROOT%realtime-service"
set "WEB_DIR=%ROOT%realtime-web"
set "SERVICE_NAME=realtime-service"
set "WEB_NAME=realtime-web"

title PM2 Manager - Findig Realtime

where pm2 >nul 2>nul
if errorlevel 1 (
    echo [ERROR] PM2 is not installed or not in PATH
    echo         Install with: npm install -g pm2
    goto :end_pause
)

set "ACTION=%~1"
set "TARGET=%~2"
if "%TARGET%"=="" set "TARGET=all"
if /i not "%TARGET%"=="all" if /i not "%TARGET%"=="service" if /i not "%TARGET%"=="web" (
    echo [ERROR] Unknown target: %TARGET% ^(use all, service or web^)
    exit /b 1
)
if "%ACTION%"=="" goto :menu
set "NO_PAUSE=1"
goto :dispatch

REM -----------------------------------------------------
:menu
echo.
echo ===============================================
echo   PM2 Manager - Findig Realtime
echo ===============================================
echo   1. Start all
echo   2. Stop all
echo   3. Restart all
echo   4. Status
echo   5. Logs (all)
echo   6. Build realtime-web
echo   7. Build realtime-web + restart web
echo   8. Delete all from PM2
echo   9. Setup auto start on Windows boot
echo   0. Exit
echo ===============================================
set "CHOICE="
set /p "CHOICE=Select [0-9]: "
set "TARGET=all"
if "%CHOICE%"=="1" set "ACTION=start"
if "%CHOICE%"=="2" set "ACTION=stop"
if "%CHOICE%"=="3" set "ACTION=restart"
if "%CHOICE%"=="4" set "ACTION=status"
if "%CHOICE%"=="5" set "ACTION=logs"
if "%CHOICE%"=="6" set "ACTION=build"
if "%CHOICE%"=="7" set "ACTION=rebuild"
if "%CHOICE%"=="8" set "ACTION=delete"
if "%CHOICE%"=="9" set "ACTION=startup"
if "%CHOICE%"=="0" goto :eof
if "%ACTION%"=="" (
    echo Invalid choice
    goto :menu
)
call :dispatch_one
set "ACTION="
goto :menu

REM -----------------------------------------------------
:dispatch
call :dispatch_one
goto :end_pause

:dispatch_one
if /i "%ACTION%"=="start"   goto :do_start
if /i "%ACTION%"=="stop"    goto :do_simple
if /i "%ACTION%"=="restart" goto :do_simple
if /i "%ACTION%"=="delete"  goto :do_simple
if /i "%ACTION%"=="logs"    goto :do_logs
if /i "%ACTION%"=="status"  goto :do_status
if /i "%ACTION%"=="build"   goto :do_build
if /i "%ACTION%"=="rebuild" goto :do_rebuild
if /i "%ACTION%"=="startup" goto :do_startup
echo [ERROR] Unknown action: %ACTION%
echo Usage: %~nx0 [start^|stop^|restart^|delete^|logs^|status^|build^|startup] [all^|service^|web]
exit /b 1

REM -----------------------------------------------------
:do_start
if /i "%TARGET%"=="all"     (call :start_app "%SERVICE_DIR%" %SERVICE_NAME% & call :start_app "%WEB_DIR%" %WEB_NAME%)
if /i "%TARGET%"=="service" call :start_app "%SERVICE_DIR%" %SERVICE_NAME%
if /i "%TARGET%"=="web"     call :start_app "%WEB_DIR%" %WEB_NAME%
call pm2 save
call pm2 status
exit /b 0

:start_app
REM %1 = app directory, %2 = pm2 app name
if not exist "%~1\ecosystem.config.js" (
    echo [ERROR] %~1\ecosystem.config.js not found
    echo         Copy _ecosystem.config.js to ecosystem.config.js and fill in the values
    exit /b 1
)
if not exist "%~1\node_modules" (
    echo [WARN] %~1\node_modules not found - run "npm install" in that folder first
)
if /i "%~2"=="%WEB_NAME%" if not exist "%~1\build\index.html" (
    echo [WARN] realtime-web\build not found - run "%~nx0 build" first
)
echo.
echo Starting %~2 ...
pushd "%~1"
call pm2 describe %~2 >nul 2>nul
if errorlevel 1 (
    call pm2 start ecosystem.config.js
) else (
    REM already registered: reload env from ecosystem file
    call pm2 restart ecosystem.config.js --update-env
)
popd
exit /b 0

REM -----------------------------------------------------
:do_simple
if /i "%TARGET%"=="all"     call pm2 %ACTION% %SERVICE_NAME% %WEB_NAME%
if /i "%TARGET%"=="service" call pm2 %ACTION% %SERVICE_NAME%
if /i "%TARGET%"=="web"     call pm2 %ACTION% %WEB_NAME%
call pm2 save --force
call pm2 status
exit /b 0

:do_logs
if /i "%TARGET%"=="all"     call pm2 logs --lines 100
if /i "%TARGET%"=="service" call pm2 logs %SERVICE_NAME% --lines 100
if /i "%TARGET%"=="web"     call pm2 logs %WEB_NAME% --lines 100
exit /b 0

:do_status
call pm2 status
exit /b 0

REM -----------------------------------------------------
:do_build
echo.
echo Building realtime-web ...
pushd "%WEB_DIR%"
call npm run build
set "BUILD_RC=%errorlevel%"
popd
if not "%BUILD_RC%"=="0" (
    echo [ERROR] Build failed
    exit /b 1
)
echo Build completed
exit /b 0

:do_rebuild
call :do_build
if errorlevel 1 exit /b 1
set "TARGET=web"
goto :do_start

REM -----------------------------------------------------
:do_startup
REM "pm2 startup" does not support Windows; use pm2-windows-startup instead
where pm2-startup >nul 2>nul
if errorlevel 1 (
    echo Installing pm2-windows-startup ...
    call npm install -g pm2-windows-startup
)
call pm2-startup install
call pm2 save --force
echo.
echo PM2 will resurrect saved processes on next Windows login
exit /b 0

REM -----------------------------------------------------
:end_pause
if not defined NO_PAUSE pause
endlocal
