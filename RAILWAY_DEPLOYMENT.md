# Railway Deployment Guide - Supreme Autoparts

This guide provides step-by-step instructions for deploying the Supreme Autoparts application to Railway.

## Prerequisites

- Railway account (https://railway.app)
- GitHub repository access
- Node.js 18+ (for local testing)

## Deployment Steps

### 1. Connect GitHub Repository

1. Log in to your Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize Railway to access your GitHub account
5. Select the `verifyitsu-pixel/supreme-autoparts` repository
6. Select the `main` branch

### 2. Configure Environment Variables

Railway will automatically detect the `package.json` and install dependencies. Add the following environment variables in the Railway dashboard:

```
NODE_ENV=production
VITE_API_URL=https://your-railway-domain.railway.app
```

### 3. Build Configuration

Railway will automatically run:
- `npm install` - Install dependencies
- `npm run build` - Build the application
- `npm start` - Start the production server

The build process includes:
- React 19 compilation
- Vite bundling
- Tailwind CSS compilation
- TypeScript compilation

### 4. Port Configuration

The application runs on port `3000` by default. Railway will automatically expose this port and provide a public URL.

### 5. Deployment

Once configured, Railway will:
1. Clone your repository
2. Install dependencies
3. Build the application
4. Deploy to Railway's infrastructure
5. Provide a public URL (e.g., `https://supreme-autoparts-prod.railway.app`)

## Post-Deployment

### 1. Verify Deployment

- Visit the provided Railway URL
- Test all main features:
  - Navigation and routing
  - Product browsing
  - Authentication flows
  - Shopping cart functionality
  - Checkout process

### 2. Monitor Logs

In Railway dashboard:
1. Go to your project
2. Click "Logs"
3. Monitor for any errors or warnings
4. Check deployment status

### 3. Custom Domain (Optional)

To add a custom domain:
1. Go to your Railway project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Troubleshooting

### Build Fails

**Error: "npm: command not found"**
- Railway should have Node.js pre-installed
- Check Node version: `node --version`
- Ensure `package.json` is in the root directory

**Error: "Port already in use"**
- Railway manages ports automatically
- The application should use the `PORT` environment variable
- Current code uses port 3000, which Railway will expose

### Application Won't Start

1. Check logs in Railway dashboard
2. Verify all environment variables are set
3. Ensure `package.json` has correct start script
4. Check for TypeScript compilation errors

### Performance Issues

1. Monitor CPU and memory usage in Railway dashboard
2. Check for memory leaks in browser console
3. Review bundle size: `npm run build` and check `dist/` folder
4. Enable caching headers for static assets

## Automatic Deployments

Railway automatically deploys when you push to the `main` branch:

1. Push changes to GitHub
2. Railway detects the push
3. Automatic build and deployment starts
4. New version is live within 2-5 minutes

To disable automatic deployments:
1. Go to Railway project settings
2. Disable "Auto-deploy on push"

## Rollback

To rollback to a previous deployment:

1. In Railway dashboard, go to "Deployments"
2. Find the previous deployment
3. Click "Redeploy"
4. Confirm the rollback

## Environment-Specific Configuration

### Development

```
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

### Production (Railway)

```
NODE_ENV=production
VITE_API_URL=https://your-railway-domain.railway.app
```

## Performance Optimization

### Build Size

Current bundle sizes (after build):
- Main bundle: ~150KB (gzipped)
- Vendor bundle: ~200KB (gzipped)
- CSS: ~30KB (gzipped)

### Caching Strategy

Railway automatically caches:
- Static assets (images, fonts, CSS, JS)
- Build artifacts
- Node modules

### Database Connections

If you add a database:
1. Create a database service in Railway
2. Get connection string
3. Add to environment variables
4. Update application code

## Monitoring & Analytics

### Built-in Analytics

Railway provides:
- CPU usage monitoring
- Memory usage monitoring
- Network traffic monitoring
- Deployment history

### Application Monitoring

The application includes:
- Error tracking
- Performance metrics
- User analytics (if configured)

## Support & Resources

- Railway Documentation: https://docs.railway.app
- Railway Support: https://railway.app/support
- GitHub Issues: https://github.com/verifyitsu-pixel/supreme-autoparts/issues

## Next Steps

1. **Set up monitoring** - Configure alerts for errors
2. **Add custom domain** - Point your domain to Railway
3. **Set up CI/CD** - Configure automated testing
4. **Add database** - If needed for production data
5. **Configure backups** - If using a database

## Quick Deployment Checklist

- [ ] GitHub repository connected
- [ ] Environment variables configured
- [ ] Build completes successfully
- [ ] Application starts without errors
- [ ] All routes are accessible
- [ ] Authentication works
- [ ] Shopping cart functions
- [ ] Checkout process works
- [ ] No console errors
- [ ] Performance is acceptable

## Deployment Complete!

Your Supreme Autoparts application is now live on Railway. Any future commits to the `main` branch will automatically deploy.
