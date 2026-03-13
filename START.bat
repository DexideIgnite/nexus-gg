@echo off
echo.
echo  ======================================
echo    NEXUS GG - Gaming Social Platform
echo  ======================================
echo.

IF NOT EXIST "node_modules" (
  echo  Installing dependencies...
  echo  This only runs once, please wait...
  echo.
  npm install
  echo.
)

echo  Starting server...
echo  Open http://localhost:3000 in your browser
echo.
node server/server.js
pause
