@echo off
set N8N_PORT=567
set WEBHOOK_URL=https://unhitched-renewably-trembling.ngrok-free.dev

echo Starting Next.js frontend on port 3000...
start cmd /k "npm run dev"

echo Waiting for ports to stabilize...
timeout /t 5

echo Starting n8n server on port 567...
call npx n8n@1
