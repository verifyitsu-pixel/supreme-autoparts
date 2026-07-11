import { useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import AdminLogin from "./admin/AdminLogin";
import { lazy, Suspense } from "react";

// Core pages
const AdminOverview = lazy(() => import("./admin/Dashboard"));

// Products
const ProductList = lazy(() => import("./admin/products/ProductList"));
const ProductForm = lazy(() => import("./admin/products/ProductForm"));
const CategoriesPage = lazy(() => import("./admin/products/CategoriesPage"));

// Orders
const OrderList = lazy(() => import("./admin/orders/OrderList"));
const OrderDetail = lazy(() => import("./admin/orders/OrderDetail"));

// Customers
const CustomerList = lazy(() => import("./admin/customers/CustomerList"));
const CustomerProfile = lazy(() => import("./admin/customers/CustomerProfile"));

// Inventory & Payments
const InventoryPage = lazy(() => import("./admin/inventory/InventoryPage"));
const PaymentsPage = lazy(() => import("./admin/payments/PaymentsPage"));

// Discounts & Refunds
const DiscountsPage = lazy(() => import("./admin/discounts/DiscountsPage"));
const RefundsPage = lazy(() => import("./admin/discounts/RefundsPage"));

// Analytics
const AnalyticsPage = lazy(() => import("./admin/analytics/AnalyticsPage"));

// CMS & Media
const CmsPage = lazy(() => import("./admin/cms/CmsPage"));
const PagesManager = lazy(() => import("./admin/cms/PagesManager"));
const MediaLibrary = lazy(() => import("./admin/media/MediaLibrary"));

// Marketing
const MarketingPage = lazy(() => import("./admin/marketing/MarketingPage"));

// Settings & Security
const SettingsPage = lazy(() => import("./admin/settings/SettingsPage"));
const ShippingPage = lazy(() => import("./admin/settings/ShippingPage"));
const RolesPage = lazy(() => import("./admin/settings/RolesPage"));
const AuditLogsPage = lazy(() => import("./admin/settings/AuditLogsPage"));

// Notifications
const NotificationsPage = lazy(() => import("./admin/NotificationsPage"));

// Global Search (overlay component, loaded inline)
import GlobalSearch from "./admin/GlobalSearch";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#E42933]/20 border-t-[#E42933] rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isAuthenticated, loading } = useAdmin();
  const [location, setLocation] = useLocation();
  const [showSearch, setShowSearch] = useState(false);

  // Redirect /admin to /admin/dashboard
  useEffect(() => {
    if (isAuthenticated && (location === "/admin" || location === "/admin/")) {
      setLocation("/admin/dashboard");
    }
  }, [isAuthenticated, location, setLocation]);

  // Global keyboard shortcut for search: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-[#E42933]/20 border-t-[#E42933] rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <>
      {/* Global Search Overlay */}
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}

      <Suspense fallback={<LoadingSpinner />}>
        <Switch>
          {/* Dashboard */}
          <Route path="/admin/dashboard" component={AdminOverview} />

          {/* Products */}
          <Route path="/admin/products/new">{() => <ProductForm />}</Route>
          <Route path="/admin/products/:id/edit">
            {(params) => <ProductForm productId={params.id} />}
          </Route>
          <Route path="/admin/products" component={ProductList} />
          <Route path="/admin/categories" component={CategoriesPage} />

          {/* Orders */}
          <Route path="/admin/orders/:id">
            {(params) => <OrderDetail orderId={params.id} />}
          </Route>
          <Route path="/admin/orders" component={OrderList} />

          {/* Customers */}
          <Route path="/admin/customers/:id">
            {(params) => <CustomerProfile customerId={params.id} />}
          </Route>
          <Route path="/admin/customers" component={CustomerList} />

          {/* Inventory */}
          <Route path="/admin/inventory" component={InventoryPage} />

          {/* Payments */}
          <Route path="/admin/payments" component={PaymentsPage} />

          {/* Discounts & Refunds */}
          <Route path="/admin/discounts" component={DiscountsPage} />
          <Route path="/admin/refunds" component={RefundsPage} />

          {/* Analytics */}
          <Route path="/admin/analytics" component={AnalyticsPage} />

          {/* Shipping */}
          <Route path="/admin/shipping" component={ShippingPage} />

          {/* CMS */}
          <Route path="/admin/cms" component={CmsPage} />
          <Route path="/admin/pages" component={PagesManager} />

          {/* Media */}
          <Route path="/admin/media" component={MediaLibrary} />

          {/* Marketing */}
          <Route path="/admin/marketing" component={MarketingPage} />

          {/* Settings */}
          <Route path="/admin/settings" component={SettingsPage} />
          <Route path="/admin/roles" component={RolesPage} />
          <Route path="/admin/audit-logs" component={AuditLogsPage} />

          {/* Notifications */}
          <Route path="/admin/notifications" component={NotificationsPage} />

          {/* Catch-all: redirect to dashboard */}
          <Route path="/admin">
            {() => {
              setLocation("/admin/dashboard");
              return null;
            }}
          </Route>
        </Switch>
      </Suspense>
    </>
  );
}
