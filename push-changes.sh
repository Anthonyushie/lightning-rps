#!/bin/bash

# Script to push YakiHonne SDK integration changes to GitHub

echo "🚀 Pushing YakiHonne SDK integration changes to GitHub..."

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: integrate YakiHonne SDK for Nostr compatibility

- Added smart-widget-handler dependency
- Created YakiHonne context provider for authentication
- Integrated Nostr event publishing for game results
- Replaced manual wallet connection with YakiHonne auth
- Updated game component to use YakiHonne SDK
- Fixed ethereum property redefinition errors
- Updated documentation in replit.md

Features:
- Seamless YakiHonne platform integration
- Secure parent-child iframe communication
- Nostr social features for game results
- Real-time game mechanics with Lightning theming"

# Push to main branch
git push origin main

echo "✅ Changes pushed successfully to GitHub!"
echo "🔗 Repository: https://github.com/Anthonyushie/lightning-rps"