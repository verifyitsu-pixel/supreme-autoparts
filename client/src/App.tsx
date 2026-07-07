import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { AdminProvider } from "./contexts/AdminContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import Brands from "./pages/Brands";
import Order from "./pages/Order";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LoginNew from "./pages/LoginNew";
import RegisterNew from "./pages/RegisterNew";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Returns from "./pages/Returns";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CheckoutNew from "./pages/CheckoutNew";
import AdminDashboard from "./pages/AdminDashboard";
// New Shop Flow Pages
import BrandSelection from "./pages/BrandSelection";
import ModelSelection from "./pages/ModelSelection";
import CategorySelection from "./pages/CategorySelection";
import PartsListing from "./pages/PartsListing";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/products" component={Products} />
      <Route path="/order" component={Order} />
      <Route path="/brands" component={Brands} />
      {/* ── New Shop Flow: Brand → Model → Category → Parts ── */}
      <Route path="/shop/brands" component={BrandSelection} />
      <Route path="/shop/brand/:brandId" component={ModelSelection} />
      <Route path="/shop/brand/:brandId/model/:modelId" component={CategorySelection} />
      <Route path="/shop/brand/:brandId/model/:modelId/category/:categoryId" component={PartsListing} />
      {/* ─────────────────────────────────────────────────── */}
      <Route path="/login" component={LoginNew} />
      <Route path="/register" component={RegisterNew} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/cart" component={Cart} />
      <Route path="/returns" component={Returns} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/checkout" component={CheckoutNew} />
      <Route path="/terms-and-conditions" component={Terms} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/:rest*" component={AdminDashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider defaultTheme="light">
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </AdminProvider>
    </ErrorBoundary>
  );
}

export default App;
