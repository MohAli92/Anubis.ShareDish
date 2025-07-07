@echo off
echo Starting Share Dish application...
echo.

echo Starting server on port 5000...
start "Server" cmd /k "cd server && npm run dev"

echo Waiting 3 seconds for server to start...
timeout /t 3 /nobreak > nul

echo Starting client on port 3000...
start "Client" cmd /k "cd client && npm start"

echo.
echo Both servers are starting in separate windows!
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
pause 