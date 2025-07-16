#!/bin/bash

# Lightning Rock Paper Scissors - 100% FREE Deployment Script
# No credit card required, no hidden costs!

echo "🚀 Deploying Lightning Rock Paper Scissors for FREE!"
echo "💰 Total cost: $0 (using free tiers only)"
echo ""

# Step 1: Check if we have the code ready
echo "📁 Checking repository status..."
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run this in your project directory."
    exit 1
fi

# Step 2: Push changes to GitHub (free)
echo "📤 Pushing changes to GitHub (free)..."
git add .
git commit -m "feat: ready for free deployment with YakiHonne SDK"
git push origin main

# Step 3: Install Vercel CLI (free)
echo "📦 Installing Vercel CLI (free)..."
npm install -g vercel

# Step 4: Login to Vercel
echo "🔐 Please login to Vercel (free account)..."
echo "💡 No credit card required for free tier!"
vercel login

# Step 5: Deploy to Vercel (free)
echo "🚀 Deploying to Vercel free tier..."
echo "📊 Free tier includes:"
echo "   • 100GB bandwidth/month"
echo "   • Unlimited deployments"
echo "   • Custom domains"
echo "   • SSL certificates"
echo "   • Analytics"
vercel --prod

echo ""
echo "✅ FREE deployment complete!"
echo "🎉 Your Lightning Rock Paper Scissors app is live!"
echo ""
echo "💡 Next steps (all free):"
echo "1. Set up free Neon database: https://console.neon.tech"
echo "2. Add environment variables in Vercel dashboard"
echo "3. Run database migration"
echo ""
echo "📖 For detailed instructions: docs/FREE_DEPLOYMENT.md"
echo "💰 Total monthly cost: $0"