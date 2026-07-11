# Supreme Autoparts - Admin Dashboard Rebuild
## Deployment & Migration Guide

The new admin dashboard is a comprehensive, Shopify-level e-commerce management system. This guide covers how to deploy the updated application and migrate your existing data.

### 1. What's Included

The rebuild introduces a completely new modular frontend structure for the admin dashboard and extends the backend API to support it.

#### Frontend Modules
- **Core Infrastructure**: New `AdminLayout` with a collapsible sidebar, `AdminContext` with RBAC support, and `GlobalSearch` overlay.
- **Dashboard**: Real-time overview with KPI cards, revenue charts, and recent activity.
- **Product Management**: Advanced list filtering, bulk status updates, and a comprehensive product creation form.
- **Orders & Customers**: Detailed order timelines, fulfillment tracking, customer profiles, and address management.
- **Inventory & Finance**: Stock adjustment logs, M-Pesa/PayPal/Stripe transaction history, discounts, and refunds.
- **Marketing & Content**: Email campaigns, CMS page builder, hero banner management, and media library.
- **Security & Settings**: Granular custom roles, audit logs, global settings, and automated system notifications.

#### Backend API Extensions
- Added endpoints for `/api/admin/inventory`, `/api/admin/analytics`, `/api/admin/shipping/zones`, `/api/admin/search`, `/api/admin/notifications`, `/api/admin/media`, `/api/admin/cms`, `/api/admin/marketing`, `/api/admin/roles`, and `/api/admin/audit-logs`.
- All routes are protected by the `adminAuthMiddleware`.

### 2. Deployment Instructions (Railway)

Since the application uses a unified server architecture (Express serving both API and the built Vite static files), deployment to Railway is straightforward.

1. **Commit and Push**
   All changes have already been committed and pushed to the `main` branch of your GitHub repository.

2. **Railway Configuration**
   - If your project is already connected to Railway, the push to `main` will automatically trigger a new deployment.
   - The build command `npm run build` will compile the Vite frontend into `dist/public`.
   - The start command `npm start` (or `node dist/index.js` depending on your `package.json`) will launch the Express server.

3. **Environment Variables**
   Ensure the following environment variables are set in your Railway project settings:
   - `NODE_ENV=production`
   - `PORT=3000` (Railway injects this automatically)
   - Any payment gateway keys (e.g., Pesapal, Stripe) if applicable.

### 3. Data Migration

The application uses JSON files for data storage in the `data/` directory. The new features introduce several new data stores that will be created automatically upon first use:

- `shipping_zones.json`
- `notifications.json`
- `cms_banners.json`
- `cms_pages.json`
- `campaigns.json`
- `roles.json`
- `audit_logs.json`
- `categories.json`
- `inventory_logs.json`

**No manual migration of existing data is required.**
Your existing `users.json`, `orders.json`, `products.json`, and `settings.json` will continue to work seamlessly with the new API routes.

### 4. Post-Deployment Verification

After the deployment is live, verify the following:
1. Log in to the admin panel at `/admin` using your superadmin credentials.
2. Check the **Dashboard** to ensure statistics are loading correctly.
3. Open the **Global Search** (Cmd+K / Ctrl+K) and verify it returns products, orders, and customers.
4. Navigate to **Settings > Roles & Permissions** and verify the superadmin account is visible.
5. Check the **Media Library** to ensure image uploads are functioning (ensure Railway volume storage is configured if persistence is required).

---
*Built with ❤️ by Manus*
