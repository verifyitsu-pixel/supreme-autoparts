# Performance Optimization Guide

This document outlines the performance optimizations implemented in Supreme Autoparts.

## Image Optimization

### Lazy Loading
- All product images use the `LazyImage` component which implements Intersection Observer API
- Images load only when they enter the viewport, reducing initial page load time
- Placeholder images can be provided for better UX

### Image Formats
- WebP format is preferred for modern browsers (smaller file size)
- JPEG fallback for older browsers
- All images should be optimized before upload (max 500KB per image)

### Image Sizes
- Product thumbnails: 300x300px
- Product detail: 600x600px
- Category images: 400x300px
- Brand logos: 100x100px

## Code Splitting

### Dynamic Imports
- Pages are lazy-loaded using React.lazy() and Suspense
- Reduces initial bundle size
- Improves time to interactive (TTI)

### Route-based Code Splitting
- Each route loads only the necessary components
- Shared components are bundled together

## Performance Metrics

### Target Metrics
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

### Monitoring
- Use Lighthouse for regular audits
- Monitor Core Web Vitals in production
- Track performance metrics with analytics

## Caching Strategy

### Browser Caching
- Static assets: 1 year cache
- HTML: No cache (always fresh)
- API responses: 5 minutes cache

### Service Worker
- Offline support for critical pages
- Cache-first strategy for assets
- Network-first strategy for API calls

## Bundle Analysis

### Current Bundle Size
- Main bundle: ~150KB (gzipped)
- Vendor bundle: ~200KB (gzipped)
- CSS: ~30KB (gzipped)

### Optimization Techniques
1. Tree shaking: Remove unused code
2. Minification: Compress all assets
3. Compression: Use gzip/brotli
4. Code splitting: Split by route

## Best Practices

### For Developers
1. Use LazyImage component for all product images
2. Implement pagination for large lists
3. Use React.memo for expensive components
4. Avoid inline styles and use CSS classes
5. Profile components with React DevTools Profiler

### For Content
1. Optimize images before upload
2. Use descriptive alt text
3. Avoid large video files
4. Use CDN for static assets
5. Implement proper caching headers

## Tools & Commands

### Lighthouse Audit
```bash
npm run build
npm run preview
# Open Chrome DevTools > Lighthouse
```

### Bundle Analysis
```bash
npm run build
# Check dist/ folder size
```

### Performance Profiling
- React DevTools Profiler
- Chrome DevTools Performance tab
- WebPageTest.org

## Future Optimizations

1. Implement HTTP/2 Server Push
2. Add Progressive Web App (PWA) features
3. Implement critical CSS inlining
4. Add image optimization API
5. Implement advanced caching strategies
6. Add performance monitoring dashboard
