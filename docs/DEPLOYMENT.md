# Deployment Guide

## Overview

This guide covers deploying the Lightning Rock Paper Scissors application to production environments. The application requires a PostgreSQL database and can be deployed to various platforms.

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 14 or higher
- Domain name (for HTTPS/Lightning payments)
- SSL certificate (required for Lightning Network)

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Server
NODE_ENV=production
PORT=5000

# Optional: Session secret
SESSION_SECRET=your-super-secret-session-key

# Optional: CORS origins
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Production Build

1. Install dependencies:
```bash
npm ci --only=production
```

2. Build the application:
```bash
npm run build
```

3. Run database migrations:
```bash
npm run db:push
```

4. Start the production server:
```bash
npm start
```

## Deployment Options

### 1. Replit Deployment (Recommended)

The application is optimized for Replit deployment:

1. Connect your GitHub repository to Replit
2. Set environment variables in Replit Secrets
3. Click "Deploy" to create a production deployment
4. Your app will be available at `https://your-app-name.replit.app`

### 2. Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t lightning-rps .
docker run -p 5000:5000 -e DATABASE_URL=your_db_url lightning-rps
```

### 3. Heroku Deployment

1. Create a Heroku app:
```bash
heroku create your-app-name
```

2. Add PostgreSQL addon:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. Set environment variables:
```bash
heroku config:set NODE_ENV=production
```

4. Deploy:
```bash
git push heroku main
```

### 4. DigitalOcean App Platform

1. Create a new app on DigitalOcean
2. Connect your GitHub repository
3. Set environment variables in the dashboard
4. Deploy with automatic builds

### 5. AWS EC2 Deployment

1. Launch an EC2 instance with Ubuntu 22.04
2. Install Node.js and PostgreSQL
3. Clone your repository
4. Set up environment variables
5. Use PM2 for process management:

```bash
npm install -g pm2
pm2 start npm --name "lightning-rps" -- start
pm2 save
pm2 startup
```

## Database Setup

### PostgreSQL Configuration

For production, ensure your PostgreSQL instance:

1. Has connection pooling enabled
2. Uses SSL connections
3. Has appropriate backup strategy
4. Monitors performance metrics

### Database Migration

Run migrations in production:

```bash
npm run db:push
```

For zero-downtime deployments, consider:
- Database migrations before code deployment
- Backward-compatible schema changes
- Rollback procedures

## SSL/HTTPS Setup

Lightning Network requires HTTPS. Options:

### 1. Let's Encrypt (Free)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 2. Cloudflare (Recommended)

1. Add your domain to Cloudflare
2. Enable "Full (strict)" SSL mode
3. Enable "Always Use HTTPS"
4. Configure firewall rules

### 3. Load Balancer SSL

Use your cloud provider's load balancer with SSL termination.

## Performance Optimization

### 1. Enable Gzip Compression

```javascript
// server/index.ts
import compression from 'compression';
app.use(compression());
```

### 2. Static Asset Caching

```javascript
// Serve static files with caching
app.use(express.static('dist/public', {
  maxAge: '1y',
  etag: true
}));
```

### 3. Database Connection Pooling

```javascript
// server/db.ts
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

## Monitoring

### 1. Health Checks

Add a health check endpoint:

```javascript
// server/routes.ts
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### 2. Error Logging

Use a logging service like LogRocket or Sentry:

```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### 3. Performance Monitoring

Monitor key metrics:
- Response times
- Database query performance
- Lightning payment success rates
- User session duration

## Security Considerations

### 1. Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. CORS Configuration

```javascript
import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true
}));
```

### 3. Security Headers

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      scriptSrc: ["'self'"]
    }
  }
}));
```

## Lightning Network Configuration

### 1. Alby NWC Setup

Ensure your application supports:
- Secure WebSocket connections (WSS)
- Proper CORS for Lightning domains
- Error handling for payment failures

### 2. Payment Processing

```javascript
// Handle Lightning payments securely
const processPayment = async (amount, recipient) => {
  try {
    // Validate amount and recipient
    if (amount <= 0 || !recipient) {
      throw new Error('Invalid payment parameters');
    }
    
    // Process payment via NWC
    const result = await lightning.pay(amount, recipient);
    
    // Log transaction
    await db.insert(transactions).values({
      amount,
      recipient,
      status: 'completed',
      txHash: result.hash
    });
    
    return result;
  } catch (error) {
    // Log error and handle gracefully
    console.error('Payment failed:', error);
    throw error;
  }
};
```

## Backup Strategy

### 1. Database Backups

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### 2. Application Backups

- Code is backed up in Git repository
- Environment variables stored securely
- SSL certificates backed up
- Configuration files versioned

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check connection string format
   - Verify database is running
   - Check firewall settings

2. **Lightning payment failures**
   - Verify HTTPS is enabled
   - Check Alby wallet connection
   - Validate payment amounts

3. **Performance issues**
   - Monitor database queries
   - Check memory usage
   - Optimize static asset delivery

### Debugging

Enable debug logging:

```bash
DEBUG=* npm start
```

Check application logs:
```bash
# PM2 logs
pm2 logs lightning-rps

# Docker logs
docker logs container_name

# Heroku logs
heroku logs --tail
```

## Scaling

### Horizontal Scaling

1. Use a load balancer
2. Run multiple application instances
3. Implement session storage (Redis)
4. Use CDN for static assets

### Database Scaling

1. Read replicas for analytics
2. Connection pooling
3. Query optimization
4. Proper indexing

## Maintenance

### Regular Tasks

1. Update dependencies monthly
2. Monitor security advisories
3. Review application logs
4. Test backup/restore procedures
5. Update SSL certificates

### Performance Reviews

1. Monitor response times
2. Check database performance
3. Review Lightning payment success rates
4. Analyze user behavior patterns

## Rollback Procedures

### Quick Rollback

```bash
# Revert to previous version
git checkout previous_version_tag
npm run build
pm2 restart lightning-rps
```

### Database Rollback

```bash
# Restore from backup
pg_restore -d $DATABASE_URL backup_file.sql
```

## Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Verify environment variables
4. Test Lightning Network connectivity
5. Contact support if needed

---

Remember: Lightning Network requires HTTPS in production. Test thoroughly before going live!