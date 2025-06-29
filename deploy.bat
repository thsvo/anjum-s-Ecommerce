@echo off
REM Vercel Deployment Script for Windows
REM Run this script to prepare and deploy your app to Vercel

echo 🚀 Starting Vercel Deployment Process...

REM Step 1: Install Vercel CLI
echo 📦 Installing Vercel CLI...
npm install -g vercel

REM Step 2: Build the project locally to check for errors
echo 🔨 Building project locally...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please fix the errors before deploying.
    pause
    exit /b 1
)

echo ✅ Local build successful!

REM Step 3: Deploy to Vercel
echo 🌐 Deploying to Vercel...
vercel --prod

echo 🎉 Deployment complete!
echo.
echo 📝 Don't forget to:
echo 1. Set up your production database
echo 2. Configure environment variables in Vercel dashboard
echo 3. Run database migrations: npx prisma migrate deploy
echo 4. Test all functionality on your live site
pause
