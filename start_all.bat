@echo off
set N8N_PORT=567
set WEBHOOK_URL=https://unhitched-renewably-trembling.ngrok-free.dev
set GOOGLE_SHEET_ID=1b9Nkj4Mt3jLSDG6BCwLKdQFw3W9WHjCQM2v18JlSHis

echo Starting Next.js frontend on port 3000...
start cmd /k "npm run dev"

echo Starting ngrok tunnel...
start cmd /k "ngrok http --url=unhitched-renewably-trembling.ngrok-free.dev 567"

echo Waiting for ports to stabilize...
timeout /t 5

echo Starting n8n server on port 567...
call npx n8n@1
