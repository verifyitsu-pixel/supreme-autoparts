import { useState } from "react";
import { ProfilePictureUpload } from "@/components/ProfilePictureUpload";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Navbar, Footer } from "@/components/NavbarNew";
import {
  User,
  LogOut,
  ShoppingBag,
  RotateCcw,
  Heart,
  Settings,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  items: number;
}

interface ReturnRequest {
  id: string;
  orderId: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "completed";
  date: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "returns" | "cart">("profile");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Mock data - replace with API calls
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      date: "2024-07-01",
      total: 45000,
      status: "delivered",
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2024-06-28",
      total: 28500,
      status: "shipped",
      items: 1,
    },
  ]);

  const [returns] = useState<ReturnRequest[]>([
    {
      id: "RET-001",
      orderId: "ORD-001",
      reason: "Part doesn't fit",
      status: "pending",
      date: "2024-07-05",
    },
  ]);

  const [cartItems] = useState([
    {
      id: "1",
      name: "Bosch Blue Brake Pad Set",
      price: 8500,
      quantity: 1,
      image: "/assets/images/parts/braking/toyota_fielder_pads.webp",
    },
  ]);

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (!user) {
    setLocation("/login");
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
        return <CheckCircle className="text-green-600" size={20} />;
      case "shipped":
      case "processing":
        return <Clock className="text-blue-600" size={20} />;
      case "pending":
        return <AlertCircle className="text-yellow-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#E42933] to-[#a81f24] rounded-full flex items-center justify-center">
                  <User className="text-white" size={40} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900">{user.name}</h1>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-200 bg-white rounded-t-lg">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
              { id: "cart", label: "Saved Cart", icon: Heart },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#E42933] text-[#E42933]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-lg shadow-sm p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-6">Account Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user.name}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E42933]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-black text-gray-900 mb-4">Login Method</h3>
                  <p className="text-gray-600 text-sm capitalize">
                    Signed in via <strong>{user.loginMethod}</strong>
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button className="px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-6">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-semibold text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.date}</p>
                            <p className="text-xs text-gray-500">{order.items} item(s)</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-900">KES {order.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-600 capitalize">{order.status}</p>
                        </div>
                        <ChevronRight className="text-gray-400" size={20} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Returns Tab */}
            {activeTab === "returns" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900">Returns & Refunds</h2>
                  <button className="px-6 py-3 bg-[#E42933] text-white rounded-lg font-semibold hover:bg-[#d41f28] transition-colors flex items-center gap-2">
                    <RotateCcw size={18} />
                    Request Return
                  </button>
                </div>

                {returns.length === 0 ? (
                  <div className="text-center py-12">
                    <RotateCcw className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No return requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {returns.map((ret) => (
                      <div
                        key={ret.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{ret.id}</p>
                            <p className="text-sm text-gray-600">Order: {ret.orderId}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-gray-600 capitalize">
                              {ret.status}
                            </p>
                            <p className="text-xs text-gray-500">{ret.date}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Reason: {ret.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === "cart" && (
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-6">Saved Cart Items</h2>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No saved items</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-gray-900">
                            KES {(item.price * item.quantity).toLocaleString()}
                          </p>
                          <button className="text-sm text-[#E42933] font-semibold hover:underline mt-2">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
