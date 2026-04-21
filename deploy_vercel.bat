@echo off
echo Executing Vercel Deployment for the Frontend...
cd frontend
call npx vercel --prod
pause
