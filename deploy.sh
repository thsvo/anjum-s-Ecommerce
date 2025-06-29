#!/bin/bash

# Vercel Deployment Script
# Run this script to prepare and deploy your app to Vercel

echo "🚀 Starting Vercel Deployment Process..."

# Step 1: Install Vercel CLI
echo "📦 Installing Vercel CLI..."
npm install -g vercel

# Step 2: Build the project locally to check for errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"

# Step 3: Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment complete!"
echo ""
echo "📝 Don't forget to:"
echo "1. Set up your production database"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Run database migrations: npx prisma migrate deploy"
echo "4. Test all functionality on your live site"
