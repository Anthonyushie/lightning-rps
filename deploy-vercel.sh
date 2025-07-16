#!/bin/bash

# Lightning Rock Paper Scissors - Vercel Deployment Script

echo "🚀 Deploying Lightning Rock Paper Scissors to Vercel..."

# Step 1: Install Vercel CLI (if not already installed)
echo "📦 Installing Vercel CLI..."
npm install -g vercel

# Step 2: Login to Vercel
echo "🔐 Please login to Vercel..."
vercel login

# Step 3: Build the project
echo "🏗️ Building project..."
npm run build

# Step 4: Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your app should be available at your Vercel URL"
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your database on Neon"
echo "3. Run database migrations"
echo ""
echo "For detailed instructions, see: docs/VERCEL_DEPLOYMENT.md"