# Start both server and client simultaneously
Write-Host "Starting Share Dish application..." -ForegroundColor Green

# Start the server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npm run dev"

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Start the client in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\client'; npm start"

Write-Host "Both servers are starting in separate windows..." -ForegroundColor Yellow
Write-Host "Server will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Client will be available at: http://localhost:3000" -ForegroundColor Cyan 