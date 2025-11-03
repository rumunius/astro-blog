@echo off
REM genpatch.bat - Generate package-lock.json, run patch-package for each passed package name using bunx, then remove package-lock.json

:: Ensure current directory is script location
cd /d %~dp0

:: If no arguments provided, show usage
if "%~1"=="" (
  echo Usage: genpatch.bat package1 [package2 ...]
  echo Example: genpatch.bat astro-pure "@astrojs/rss"
  goto :eof
)

:: Create package-lock.json only (will trigger postinstall scripts too)
echo Generating package-lock.json
call npm install --package-lock-only --ignore-scripts
echo Generating package-lock.json (without running lifecycle scripts)...
if errorlevel 1 (
  echo npm failed. Aborting.
  goto :cleanup
)

:: Iterate over arguments and run bunx patch-package
:loop
if "%~1"=="" goto :cleanup
  set "pkg=%~1"
  echo Creating patch for %pkg% 
  call bunx patch-package %pkg%
  shift
  goto :loop

:: Cleanup - remove package-lock.json if present
:cleanup
echo Cleaning up package-lock.json if it exists
if exist package-lock.json (
  del /f /q package-lock.json
  if errorlevel 1 echo Failed to remove package-lock.json - please remove it manually.
) else (
  echo No package-lock.json found. Nothing to clean.
)

echo Done.
exit /b 0
