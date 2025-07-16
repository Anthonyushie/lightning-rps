# Vercel Deployment Guide for Lightning Rock Paper Scissors

This guide will walk you through deploying your Lightning Rock Paper Scissors application with YakiHonne SDK integration to Vercel.

## Prerequisites

- Your code must be pushed to GitHub repository
- Vercel account (free tier available)
- PostgreSQL database (we'll use Neon for this guide)

## Step 1: Prepare Your Repository

1. **Push your changes to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "feat: integrate YakiHonne SDK for Nostr compatibility"
   git push origin main
   ```

2. **Verify your repository** at: https://github.com/Anthonyushie/lightning-rps

## Step 2: Set Up Database on Neon

1. **Go to Neon Console**: https://console.neon.tech/
2. **Create a new project**:
   - Click "New Project"
   - Choose a name: "lightning-rps"
   - Select region closest to your users
   - Click "Create Project"

3. **Get connection string**:
   - In your Neon dashboard, go to "Connection Details"
   - Copy the connection string (it looks like: `postgresql://username:password@host/database`)
   - Save this for later - you'll need it for Vercel environment variables

## Step 3: Create Vercel Configuration

Create a `vercel.json` file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["dist/**"]
      }
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "../dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ],
  "functions": {
    "server/index.ts": {
      "maxDuration": 30
    }
  }
}
```

## Step 4: Update Build Configuration

Update your `package.json` scripts for Vercel:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push",
    "vercel-build": "npm run build"
  }
}
```

## Step 5: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Method 2: Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "New Project"**
3. **Import Git Repository**:
   - Select "Continue with GitHub"
   - Choose your repository: `Anthonyushie/lightning-rps`
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

## Step 6: Configure Environment Variables

1. **In Vercel Dashboard**, go to your project settings
2. **Navigate to "Environment Variables"**
3. **Add the following variables**:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `DATABASE_URL` | Your Neon connection string | Production, Preview, Development |
   | `NODE_ENV` | `production` | Production |
   | `SESSION_SECRET` | Generate a random string | Production, Preview, Development |

   **To generate SESSION_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Step 7: Run Database Migrations

1. **Install dependencies locally**:
   ```bash
   npm install
   ```

2. **Push database schema**:
   ```bash
   DATABASE_URL="your_neon_connection_string" npm run db:push
   ```

## Step 8: Deploy and Test

1. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

2. **Test your deployment**:
   - Visit your Vercel URL (e.g., `https://lightning-rps.vercel.app`)
   - Test the YakiHonne integration
   - Verify game functionality
   - Check Nostr event publishing

## Step 9: Domain Configuration (Optional)

1. **In Vercel Dashboard**, go to your project
2. **Navigate to "Domains"**
3. **Add your custom domain**:
   - Enter your domain name
   - Follow DNS configuration instructions
   - Vercel will automatically handle SSL certificates

## Common Issues and Solutions

### Build Errors

**Issue**: TypeScript errors during build
**Solution**: 
```bash
# Run type checking locally
npm run check

# Fix any TypeScript errors before deploying
```

**Issue**: Missing environment variables
**Solution**: Ensure all required environment variables are set in Vercel dashboard

### Database Connection Issues

**Issue**: Database connection fails
**Solution**: 
- Verify your Neon connection string is correct
- Ensure DATABASE_URL is set in Vercel environment variables
- Check that your database schema is pushed

### YakiHonne Integration Issues

**Issue**: YakiHonne SDK not working
**Solution**: 
- Ensure `smart-widget-handler` is installed
- Verify iframe communication is properly configured
- Check console for JavaScript errors

## Monitoring and Logs

1. **View deployment logs**:
   ```bash
   vercel logs
   ```

2. **Monitor function execution**:
   - Go to Vercel Dashboard
   - Navigate to "Functions" tab
   - View real-time logs and metrics

## Updating Your Deployment

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "your commit message"
   git push origin main
   ```

2. **Vercel will automatically redeploy** when you push to main branch

## Performance Optimization

1. **Enable Analytics**: In Vercel Dashboard > Analytics
2. **Configure Edge Functions**: For better global performance
3. **Optimize Images**: Use Vercel's image optimization
4. **Enable Caching**: Configure appropriate cache headers

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **Database Security**: Use connection pooling and proper authentication
3. **CORS Configuration**: Ensure proper CORS settings for YakiHonne integration
4. **Rate Limiting**: Implement rate limiting for API endpoints

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **YakiHonne SDK**: https://yakihonne.com/docs/sw/smart-widget-handler
- **Neon Database**: https://neon.tech/docs

Your Lightning Rock Paper Scissors application with YakiHonne SDK integration should now be successfully deployed on Vercel!