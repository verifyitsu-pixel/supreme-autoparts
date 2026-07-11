import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAdmin } from "@/contexts/AdminContext";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Layers, BarChart3,
  Settings, LogOut, Bell, Search, Menu, X, Globe, Percent, RotateCcw,
  CreditCard, FileText, Image, Megaphone, Truck, Shield, ChevronDown,
  ChevronRight, Store, Tag, Zap, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminFetch } from "./lib/useAdminFetch";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  children?: NavItem[];
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", section: "dashboard" },
  {
    id: "catalog", label: "Catalog", icon: Store, path: "#", section: "products",
    children: [
      { id: "products", label: "Products", icon: Package, path: "/admin/products", section: "products" },
      { id: "categories", label: "Categories", icon: Tag, path: "/admin/categories", section: "products" },
      { id: "inventory", label: "Inventory", icon: Layers, path: "/admin/inventory", section: "inventory" },
    ],
  },
  { id: "orders", label: "Orders", icon: ShoppingBag, path: "/admin/orders", section: "orders" },
  { id: "customers", label: "Customers", icon: Users, path: "/admin/customers", section: "customers" },
  {
    id: "finance", label: "Finance", icon: CreditCard, path: "#", section: "payments",
    children: [
      { id: "payments", label: "Payments", icon: CreditCard, path: "/admin/payments", section: "payments" },
      { id: "discounts", label: "Discounts", icon: Percent, path: "/admin/discounts", section: "discounts" },
      { id: "refunds", label: "Refunds", icon: RotateCcw, path: "/admin/refunds", section: "refunds" },
    ],
  },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/admin/analytics", section: "analytics" },
  { id: "shipping", label: "Shipping", icon: Truck, path: "/admin/shipping", section: "shipping" },
  {
    id: "content", label: "Content", icon: FileText, path: "#", section: "cms",
    children: [
      { id: "cms", label: "Website CMS", icon: Globe, path: "/admin/cms", section: "cms" },
      { id: "media", label: "Media Library", icon: Image, path: "/admin/media", section: "media" },
      { id: "pages", label: "Pages", icon: FileText, path: "/admin/pages", section: "cms" },
    ],
  },
  { id: "marketing", label: "Marketing", icon: Megaphone, path: "/admin/marketing", section: "marketing" },
  {
    id: "security", label: "Security", icon: Shield, path: "#", section: "security",
    children: [
      { id: "roles", label: "Roles & Permissions", icon: Shield, path: "/admin/roles", section: "security" },
      { id: "audit-logs", label: "Audit Logs", icon: Activity, path: "/admin/audit-logs", section: "security" },
    ],
  },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings", section: "settings" },
];

function NavItemComponent({
  item,
  currentPath,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  currentPath: string;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const { canAccess } = useAdmin();
  const [expanded, setExpanded] = useState(() => {
    if (!item.children) return false;
    return item.children.some((c) => currentPath.startsWith(c.path));
  });

  if (item.section && !canAccess(item.section)) return null;

  const isActive = item.children
    ? item.children.some((c) => currentPath.startsWith(c.path))
    : currentPath.startsWith(item.path) && item.path !== "#";

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
            isActive
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          )}
        >
          <item.icon size={17} className="shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown
                size={14}
                className={cn("transition-transform", expanded && "rotate-180")}
              />
            </>
          )}
        </button>
        {expanded && !collapsed && (
          <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
            {item.children.map((child) => (
              <NavItemComponent
                key={child.id}
                item={child}
                currentPath={currentPath}
                collapsed={false}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.path}>
      <a
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
          isActive
            ? "bg-[#E42933] text-white shadow-sm"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <item.icon size={17} className="shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="bg-[#E42933] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {item.badge}
              </span>
            ) : null}
          </>
        )}
      </a>
    </Link>
  );
}

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const { admin, logout } = useAdmin();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: alerts } = useAdminFetch<{ lowStock: any[]; outOfStock: any[] }>(
    "/api/admin/inventory/alerts"
  );

  const alertCount = (alerts?.lowStock?.length || 0) + (alerts?.outOfStock?.length || 0);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
  };

  const sidebarWidth = sidebarCollapsed ? "w-16" : "w-64";

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 h-screen bg-[#111827] text-white flex flex-col z-50 transition-all duration-300",
          sidebarWidth,
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between min-h-[64px]">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 bg-[#E42933] rounded-lg flex items-center justify-center shrink-0">
                <Zap size={16} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-white truncate leading-tight">Supreme</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Admin</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-[#E42933] rounded-lg flex items-center justify-center mx-auto">
              <Zap size={16} className="text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Admin Info */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E42933] to-[#c41f28] flex items-center justify-center font-bold text-sm shrink-0">
                {admin?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{admin?.name}</p>
                <p className="text-[11px] text-gray-400 capitalize">{admin?.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map((item) => (
            <NavItemComponent
              key={item.id}
              item={item}
              currentPath={location}
              collapsed={sidebarCollapsed}
              onNavigate={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/10 space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Globe size={17} className="shrink-0" />
            {!sidebarCollapsed && <span>View Store</span>}
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut size={17} className="shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-white/5 hover:text-white transition-all"
          >
            <ChevronRight
              size={17}
              className={cn("shrink-0 transition-transform", sidebarCollapsed && "rotate-180")}
            />
            {!sidebarCollapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div>
              {title && (
                <h1 className="text-base font-black text-gray-900 uppercase tracking-tight leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs text-gray-400 hidden sm:block">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Global Search */}
            <div className="relative hidden md:block">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, orders, customers..."
                    className="w-72 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E42933] focus:ring-1 focus:ring-[#E42933]/20"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }
                    }}
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="p-2 text-gray-400 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Search size={15} />
                  <span className="hidden lg:inline">Search</span>
                  <kbd className="hidden lg:inline text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">
                    ⌘K
                  </kbd>
                </button>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={18} />
                {alertCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E42933] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {alertCount > 9 ? "9+" : alertCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-sm text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {alerts?.outOfStock?.map((p: any) => (
                      <div key={p.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-gray-900">Out of Stock</p>
                            <p className="text-xs text-gray-500 mt-0.5">{p.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {alerts?.lowStock?.map((p: any) => (
                      <div key={p.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-gray-900">Low Stock</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {p.name} — {p.stock} left
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {alertCount === 0 && (
                      <div className="px-4 py-8 text-center text-sm text-gray-400">
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <Link href="/admin/inventory">
                      <a
                        onClick={() => setNotifOpen(false)}
                        className="text-xs text-[#E42933] font-semibold hover:underline"
                      >
                        View all alerts →
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E42933] to-[#c41f28] flex items-center justify-center text-white font-bold text-sm">
              {admin?.name?.[0]?.toUpperCase() || "A"}
            </div>

            {/* Actions */}
            {actions && <div className="flex items-center gap-2 ml-2">{actions}</div>}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
