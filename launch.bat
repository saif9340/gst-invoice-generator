@echo off
title GST Invoice Generator
cd /d "C:\Users\Welcome\lead-finder\gst-invoice-generator"

echo Stopping any existing server...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak > nul

echo Starting server, please wait...
start /min "NextJS" cmd /c "npm run dev"

timeout /t 10 /nobreak > nul

echo Opening GST Invoice Generator...
start "" "dist\win-unpacked\GST Invoice Generator.exe"

exit