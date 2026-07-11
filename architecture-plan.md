# Admin Dashboard Architecture & Implementation Plan

## 1. Current State Analysis
The existing application (`supreme-autoparts`) is a React SPA built with Vite, TypeScript, Tailwind CSS, and `wouter` for routing. The backend is an Express server running in Node.js, storing data in JSON files within the `data/` directory (e.g., `products.json`, `orders.json`, `users.json`). The current admin dashboard (`AdminDashboard.tsx`) is a monolithic component over 2,500 lines long, managing all state locally without proper routing for individual admin sections.

## 2. Proposed Architecture

### 2.1 Routing & Layout Strategy
We will break down the monolithic `AdminDashboard.tsx` into a modular routing structure using `wouter` nested routes under `/admin`.
- `/admin` - Redirects to `/admin/dashboard`
- `/admin/dashboard` - Overview statistics and charts
- `/admin/products` - Product list, search, and filtering
- `/admin/products/new` - Create new product
- `/admin/products/:id` - Edit product
- `/admin/orders` - Order list
- `/admin/orders/:id` - Order details
- `/admin/customers` - Customer list
- `/admin/customers/:id` - Customer profile
- `/admin/inventory` - Inventory tracking
- `/admin/payments` - Payment logs and settings
- `/admin/settings` - Store configuration
- `/admin/cms` - Content Management System (Homepage, Banners)
- `/admin/media` - Media Library

### 2.2 Component Structure
We will create a new directory `client/src/pages/admin/` containing the modularized components.
- `AdminLayout.tsx`: Sidebar navigation, top header, and mobile menu wrapper.
- `Dashboard.tsx`: Charts, recent activity, and overview stats.
- `products/ProductList.tsx`, `products/ProductForm.tsx`
- `orders/OrderList.tsx`, `orders/OrderDetail.tsx`
- `customers/CustomerList.tsx`, `customers/CustomerProfile.tsx`
- `settings/SettingsLayout.tsx`, `settings/GeneralSettings.tsx`, `settings/PaymentSettings.tsx`

### 2.3 Database Schema Extensions
Since the backend uses JSON files, we will extend the existing interfaces in `server/index.ts`.

**CMS & Pages (`cms.json`)**
```typescript
interface StoredPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HomepageConfig {
  heroBanners: { id: string; image: string; title: string; link: string }[];
  promotionalBanners: { id: string; image: string; link: string }[];
}
```

**Media Library (`media.json`)**
```typescript
interface StoredMedia {
  id: string;
  filename: string;
  url: string;
  type: "image" | "document" | "pdf";
  size: number;
  folder: string;
  uploadedAt: string;
}
```

**Marketing & SEO (`marketing.json`)**
```typescript
interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  openGraphImage: string;
}
```

**Roles & Permissions (`admins.json` extension)**
Update `StoredAdmin` to include specific permissions.
```typescript
interface StoredAdmin {
  id: string;
  email: string;
  name: string;
  password: string;
  role: "superadmin" | "admin" | "manager" | "staff";
  permissions: string[]; // e.g., ["manage_products", "view_orders"]
  createdAt: string;
  lastLogin?: string;
}
```

## 3. Execution Plan
1. **Infrastructure**: Create `AdminLayout`, configure `wouter` nested routes, and update `AdminContext` for RBAC.
2. **Dashboard & Analytics**: Build overview components using `recharts`.
3. **Products Module**: Implement list, pagination, filtering, and the detailed product creation/edit form (including variants and image galleries).
4. **Orders & Customers**: Implement order details (timeline, invoices) and customer profiles.
5. **Inventory & Payments**: Move existing payment logic into modular components and add inventory adjustment tracking.
6. **CMS & Media**: Build the media uploader and homepage banner manager.
7. **Settings & Security**: Implement role management, audit logs, and global settings.
8. **Backend Integration**: Add necessary Express routes in `server/index.ts` to support the new features.

This plan ensures a scalable, maintainable, and professional admin dashboard that integrates seamlessly with the existing JSON-based backend and Railway deployment structure.
