import express, { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Data Store ───────────────────────────────────────────────────────────────
const DATA_DIR = path.resolve(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const UPLOADS_DIR = path.resolve(__dirname, "..", "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function readStore<T>(file: string, defaultVal: T): T {
  const p = path.join(DATA_DIR, file);
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {}
  return defaultVal;
}
function writeStore(file: string, data: unknown) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface StoredUser {
  id: string;
  email: string;
  name: string;
  password?: string;
  phone?: string;
  avatar?: string;
  loginMethod: "email" | "google" | "apple";
  createdAt: string;
  addresses?: Address[];
  totalOrders?: number;
  totalSpent?: number;
  status?: "active" | "blocked";
}

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  address: string;
  county: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
  brand?: string;
  model?: string;
  category?: string;
  sku?: string;
}

interface StoredOrder {
  id: string;
  orderNumber: string;
  userId: string;
  customerName?: string;
  customerEmail?: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    county: string;
    country: string;
    postalCode: string;
  };
  trackingNumber?: string;
  notes?: string;
  paidAt?: string;
  deliveredAt?: string;
}

interface StoredRefund {
  id: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  customerName?: string;
  reason: string;
  reasonDetail: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "completed";
  refundAmount: number;
  date: string;
  resolvedAt?: string;
  adminNote?: string;
}

interface StoredProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  description: string;
  condition: "New" | "Used" | "Refurbished";
  status: "active" | "draft" | "archived";
  tags: string[];
  weight?: number;
  partNumber?: string;
  compatibility?: string[];
  createdAt: string;
  updatedAt: string;
  sales?: number;
}

interface StoredAdmin {
  id: string;
  email: string;
  name: string;
  password: string;
  role: "superadmin" | "admin" | "staff";
  createdAt: string;
  lastLogin?: string;
}

interface StoredSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  whatsappNumber: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  announcementBar: string;
  announcementBarEnabled: boolean;
  maintenanceMode: boolean;
  metaTitle: string;
  metaDescription: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
  };
}

// ─── Load stores ─────────────────────────────────────────────────────────────
let users: Map<string, StoredUser> = new Map(
  Object.entries(readStore<Record<string, StoredUser>>("users.json", {}))
);
let tokens: Map<string, string> = new Map(
  Object.entries(readStore<Record<string, string>>("tokens.json", {}))
);
let orders: Map<string, StoredOrder> = new Map(
  Object.entries(readStore<Record<string, StoredOrder>>("orders.json", {}))
);
let refunds: Map<string, StoredRefund> = new Map(
  Object.entries(readStore<Record<string, StoredRefund>>("refunds.json", {}))
);
let products: Map<string, StoredProduct> = new Map(
  Object.entries(readStore<Record<string, StoredProduct>>("products.json", {}))
);
let admins: Map<string, StoredAdmin> = new Map(
  Object.entries(readStore<Record<string, StoredAdmin>>("admins.json", {}))
);
let adminTokens: Map<string, string> = new Map(
  Object.entries(readStore<Record<string, string>>("admin_tokens.json", {}))
);
let discounts: Map<string, any> = new Map(
  Object.entries(readStore<Record<string, any>>("discounts.json", {}))
);

const DEFAULT_SETTINGS: StoredSettings = {
  storeName: "Supreme Autoparts",
  storeEmail: "info@supremeautoparts.co.ke",
  storePhone: "+254 700 000 000",
  storeAddress: "Nairobi, Kenya",
  currency: "KES",
  taxRate: 16,
  shippingFee: 500,
  freeShippingThreshold: 10000,
  whatsappNumber: "+254700000000",
  heroTitle: "Precision Engineering. Real Parts.",
  heroSubtitle: "Genuine OEM components for all vehicle makes and models. Fast nationwide delivery across Kenya.",
  heroImage: "/assets/images/products/brake-pads-brembo.jpg",
  announcementBar: "🚚 Free shipping on orders over KES 10,000 | 🛞 New: Premium Tyres from Bridgestone, Michelin, Continental | +254 700 000 000",
  announcementBarEnabled: true,
  maintenanceMode: false,
  metaTitle: "Supreme Autoparts - Kenya's #1 Auto Parts Store | Genuine OEM Parts & Tyres",
  metaDescription: "Genuine OEM auto parts and premium tyres for Toyota, BMW, Mercedes, Honda, Nissan and more. Real product photos, real pricing, fast delivery across Kenya.",
  socialLinks: {
    facebook: "https://facebook.com/supremeautoparts",
    instagram: "https://instagram.com/supremeautoparts",
    whatsapp: "https://wa.me/254700000000",
  }
};

let settings: StoredSettings = readStore<StoredSettings>("settings.json", DEFAULT_SETTINGS);

function saveUsers() { writeStore("users.json", Object.fromEntries(users)); }
function saveTokens() { writeStore("tokens.json", Object.fromEntries(tokens)); }
function saveOrders() { writeStore("orders.json", Object.fromEntries(orders)); }
function saveRefunds() { writeStore("refunds.json", Object.fromEntries(refunds)); }
function saveProducts() { writeStore("products.json", Object.fromEntries(products)); }
function saveAdmins() { writeStore("admins.json", Object.fromEntries(admins)); }
function saveAdminTokens() { writeStore("admin_tokens.json", Object.fromEntries(adminTokens)); }
function saveSettings() { writeStore("settings.json", settings); }
function saveDiscounts() { writeStore("discounts.json", Object.fromEntries(discounts)); }

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateToken() { return crypto.randomBytes(32).toString("hex"); }
function hashPassword(p: string) { return crypto.createHash("sha256").update(p).digest("hex"); }
function verifyToken(token: string) { return tokens.get(token) || null; }
function verifyAdminToken(token: string) { return adminTokens.get(token) || null; }
function generateOrderNumber() {
  const d = new Date();
  return `SA-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}
function generateSKU(brand: string, category: string) {
  const b = brand.substring(0, 3).toUpperCase();
  const c = category.substring(0, 3).toUpperCase();
  return `${b}-${c}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

// ─── Seed default admin ───────────────────────────────────────────────────────
function seedDefaultAdmin() {
  if (admins.size === 0) {
    const adminId = crypto.randomUUID();
    const admin: StoredAdmin = {
      id: adminId,
      email: "admin@supremeautoparts.co.ke",
      name: "Super Admin",
      password: hashPassword("Admin@2024"),
      role: "superadmin",
      createdAt: new Date().toISOString(),
    };
    admins.set(adminId, admin);
    saveAdmins();
    console.log("✅ Default admin created: admin@supremeautoparts.co.ke / Admin@2024");
  }
}

// ─── Seed sample products ─────────────────────────────────────────────────────
function seedSampleProducts() {
  if (products.size === 0) {
    const sampleProducts: Omit<StoredProduct, "id" | "createdAt" | "updatedAt">[] = [
      // TOYOTA - Hilux
      { name: "Toyota Hilux Brake Pads - Premium OEM", sku: "TOY-HLX-BRK-001", category: "Braking Systems", subcategory: "Brake Pads", brand: "Toyota", model: "Hilux (Vigo/Revo)", price: 15500, comparePrice: 18000, cost: 9000, stock: 25, lowStockThreshold: 5, images: ["/assets/images/products/brake-pads-brembo.jpg"], description: "Genuine OEM brake pads for Toyota Hilux Vigo and Revo models.", condition: "New", status: "active", tags: ["toyota", "hilux", "brake pads"], partNumber: "04465-0K230", compatibility: ["Toyota Hilux Vigo", "Toyota Hilux Revo"], sales: 45 },
      { name: "Toyota Hilux Brake Discs - Front Pair", sku: "TOY-HLX-BRK-002", category: "Braking Systems", subcategory: "Brake Discs", brand: "Toyota", model: "Hilux (Vigo/Revo)", price: 28000, comparePrice: 32000, cost: 17000, stock: 12, lowStockThreshold: 3, images: ["/assets/images/products/brake-pads-brembo.jpg"], description: "OEM brake discs for Hilux.", condition: "New", status: "active", tags: ["toyota", "hilux", "brake disc"], partNumber: "43512-0K080", compatibility: ["Toyota Hilux Vigo", "Toyota Hilux Revo"], sales: 22 },
      { name: "Toyota Hilux Oil Filter", sku: "TOY-HLX-ENG-001", category: "Engine Components", subcategory: "Oil Filters", brand: "Toyota", model: "Hilux (Vigo/Revo)", price: 3500, comparePrice: 4500, cost: 2000, stock: 50, lowStockThreshold: 10, images: ["/assets/images/models/hyundai-tucson.jpg"], description: "Original Toyota oil filter for Hilux.", condition: "New", status: "active", tags: ["toyota", "hilux", "oil filter"], partNumber: "90915-20001", compatibility: ["Toyota Hilux Vigo", "Toyota Hilux Revo"], sales: 88 },
      
      // TOYOTA - Fielder
      { name: "Toyota Fielder Brake Pads", sku: "TOY-FLD-BRK-001", category: "Braking Systems", subcategory: "Brake Pads", brand: "Toyota", model: "Fielder", price: 12000, comparePrice: 15000, cost: 7000, stock: 30, lowStockThreshold: 8, images: ["/assets/images/products/brake-pads-brembo.jpg"], description: "OEM brake pads for Toyota Fielder.", condition: "New", status: "active", tags: ["toyota", "fielder", "brake pads"], partNumber: "04465-12F50", compatibility: ["Toyota Fielder NZE161"], sales: 42 },
      { name: "Toyota Fielder Headlight Assembly", sku: "TOY-FLD-BOD-001", category: "Body Kits & Styling", subcategory: "Headlights", brand: "Toyota", model: "Fielder", price: 22000, comparePrice: 28000, cost: 13000, stock: 12, lowStockThreshold: 3, images: ["/assets/images/models/hyundai-tucson.jpg"], description: "Complete headlight assembly for Toyota Fielder.", condition: "New", status: "active", tags: ["toyota", "fielder", "headlight"], partNumber: "81150-12F60", compatibility: ["Toyota Fielder NZE161"], sales: 33 },
      
      // TOYOTA - Prado
      { name: "Toyota Prado J150 Shock Absorber", sku: "TOY-PRD-SUS-001", category: "Suspension & Chassis", subcategory: "Shock Absorbers", brand: "Toyota", model: "Prado (J120/J150)", price: 25000, comparePrice: 30000, cost: 15000, stock: 15, lowStockThreshold: 4, images: ["/assets/images/products/brake-pads-brembo.jpg"], description: "Heavy duty shock absorber for Prado J150.", condition: "New", status: "active", tags: ["toyota", "prado", "shock"], partNumber: "48510-60260", compatibility: ["Toyota Prado J150"], sales: 25 },
      
      // BMW - 3 Series
      { name: "BMW 3 Series Oil Filter Kit", sku: "BMW-3S-ENG-001", category: "Engine Components", subcategory: "Oil Filters", brand: "BMW", model: "3 Series (E90/F30/G20)", price: 8500, comparePrice: 10000, cost: 4500, stock: 40, lowStockThreshold: 8, images: ["/assets/images/models/hyundai-tucson.jpg"], description: "Original BMW oil filter kit for 3 Series models.", condition: "New", status: "active", tags: ["bmw", "3 series", "oil filter"], partNumber: "11427566327", compatibility: ["BMW F30", "BMW G20"], sales: 62 },
      { name: "BMW 3 Series Brake Pads", sku: "BMW-3S-BRK-001", category: "Braking Systems", subcategory: "Brake Pads", brand: "BMW", model: "3 Series (E90/F30/G20)", price: 16000, comparePrice: 19000, cost: 9500, stock: 22, lowStockThreshold: 5, images: ["/assets/images/products/brake-pads-brembo.jpg"], description: "Premium brake pads for BMW 3 Series.", condition: "New", status: "active", tags: ["bmw", "3 series", "brake pads"], partNumber: "34116792868", compatibility: ["BMW F30", "BMW G20"], sales: 38 },
      
      // BMW - X5
      { name: "BMW X5 Front Air Spring", sku: "BMW-X5-SUS-001", category: "Suspension & Chassis", subcategory: "Struts", brand: "BMW", model: "X5 (E70/F15/G05)", price: 45000, comparePrice: 55000, cost: 28000, stock: 5, lowStockThreshold: 2, images: ["/assets/images/products/brake-pads-brembo.jpg"], description: "OEM air spring for BMW X5 suspension.", condition: "New", status: "active", tags: ["bmw", "x5", "air spring"], partNumber: "37116794447", compatibility: ["BMW X5 F15", "BMW X5 G05"], sales: 12 },
      
      // MERCEDES - C-Class
      { name: "Mercedes C-Class Brake Pads", sku: "MER-C-BRK-001", category: "Braking Systems", subcategory: "Brake Pads", brand: "Mercedes-Benz", model: "C-Class (W204/W205/W206)", price: 14000, comparePrice: 17000, cost: 8500, stock: 25, lowStockThreshold: 6, images: ["/assets/images/products/brake-pads-brembo.jpg"], description: "OEM brake pads for Mercedes C-Class.", condition: "New", status: "active", tags: ["mercedes", "c-class", "brake pads"], partNumber: "0044204320", compatibility: ["Mercedes W205"], sales: 41 },
      
      // HONDA - Civic
      { name: "Honda Civic Alternator", sku: "HON-CIV-ELC-001", category: "Electrical & Sensors", subcategory: "Alternators", brand: "Honda", model: "Civic (FD/FB/FC)", price: 28000, comparePrice: 35000, cost: 17000, stock: 6, lowStockThreshold: 2, images: ["/assets/images/models/hyundai-tucson.jpg"], description: "High-output alternator for Honda Civic.", condition: "New", status: "active", tags: ["honda", "civic", "alternator"], partNumber: "31100-RNA-A01", compatibility: ["Honda Civic FC"], sales: 27 },
      
      // FORD - Ranger
      { name: "Ford Ranger T6 Turbocharger", sku: "FOR-RAN-ENG-001", category: "Engine Components", subcategory: "Fuel Injectors", brand: "Ford", model: "Ranger (T6/T7/T8)", price: 65000, comparePrice: 75000, cost: 40000, stock: 4, lowStockThreshold: 1, images: ["/assets/images/models/hyundai-tucson.jpg"], description: "Genuine turbocharger for Ford Ranger 2.2/3.2.", condition: "New", status: "active", tags: ["ford", "ranger", "turbo"], partNumber: "BK3Q-6K682-RC", compatibility: ["Ford Ranger T6"], sales: 15 },
      
      // SUZUKI - Swift
      { name: "Suzuki Swift Clutch Kit", sku: "SUZ-SWF-TRN-001", category: "Transmission & Gear", subcategory: "Clutch Kits", brand: "Suzuki", model: "Swift", price: 18000, comparePrice: 22000, cost: 11000, stock: 12, lowStockThreshold: 3, images: ["/assets/images/products/brake-pads-brembo.jpg"], description: "Complete clutch kit for Suzuki Swift.", condition: "New", status: "active", tags: ["suzuki", "swift", "clutch"], partNumber: "22100-71L00", compatibility: ["Suzuki Swift"], sales: 22 },
      
      // LEXUS - RX350
      { name: "Lexus RX350 Air Filter", sku: "LEX-RX-ENG-001", category: "Engine Components", subcategory: "Air Filters", brand: "Lexus", model: "RX350", price: 5500, comparePrice: 7000, cost: 3000, stock: 30, lowStockThreshold: 5, images: ["/assets/images/models/hyundai-tucson.jpg"], description: "Genuine air filter for Lexus RX350.", condition: "New", status: "active", tags: ["lexus", "rx350", "air filter"], partNumber: "17801-31110", compatibility: ["Lexus RX350"], sales: 45 },
    ];

    for (const p of sampleProducts) {
      const id = crypto.randomUUID();
      products.set(id, {
        ...p,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    saveProducts();
    console.log(`✅ Seeded ${sampleProducts.length} sample products`);
  }
}

// ─── Multer setup for image uploads ──────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Seed data
  seedDefaultAdmin();
  seedSampleProducts();

  // ─── Auth Middleware ────────────────────────────────────────────────────────
  const authMiddleware = (req: any, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.slice(7);
    const userId = verifyToken(token);
    if (!userId) return res.status(401).json({ error: "Invalid or expired token" });
    req.userId = userId;
    next();
  };

  const adminAuthMiddleware = (req: any, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.slice(7);
    const adminId = verifyAdminToken(token);
    if (!adminId) return res.status(401).json({ error: "Invalid or expired admin token" });
    const admin = admins.get(adminId);
    if (!admin) return res.status(401).json({ error: "Admin not found" });
    req.adminId = adminId;
    req.admin = admin;
    next();
  };

  // ─── CUSTOMER AUTH ROUTES ──────────────────────────────────────────────────
  app.post("/api/auth/register", (req: Request, res: Response) => {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: "Name, email and password are required" });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });
    const existing = Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(409).json({ error: "An account with this email already exists" });
    const userId = crypto.randomUUID();
    const token = generateToken();
    const user: StoredUser = { id: userId, email: email.toLowerCase(), name, phone: phone || "", password: hashPassword(password), loginMethod: "email", createdAt: new Date().toISOString(), addresses: [], totalOrders: 0, totalSpent: 0, status: "active" };
    users.set(userId, user); tokens.set(token, userId);
    saveUsers(); saveTokens();
    res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone, loginMethod: user.loginMethod, createdAt: user.createdAt }, token });
  });

  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    const user = Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !user.password) return res.status(401).json({ error: "Invalid email or password" });
    if (user.password !== hashPassword(password)) return res.status(401).json({ error: "Invalid email or password" });
    if (user.status === "blocked") return res.status(403).json({ error: "Your account has been suspended. Please contact support." });
    const token = generateToken();
    tokens.set(token, user.id); saveTokens();
    res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone, loginMethod: user.loginMethod, createdAt: user.createdAt }, token });
  });

  app.get("/api/auth/me", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ id: user.id, email: user.email, name: user.name, phone: user.phone, loginMethod: user.loginMethod, createdAt: user.createdAt });
  });

  app.put("/api/auth/profile", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { name, phone } = req.body;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    users.set(req.userId, user); saveUsers();
    res.json({ id: user.id, email: user.email, name: user.name, phone: user.phone, loginMethod: user.loginMethod, createdAt: user.createdAt });
  });

  app.put("/api/auth/password", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Both passwords required" });
    if (user.password !== hashPassword(currentPassword)) return res.status(401).json({ error: "Current password is incorrect" });
    if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters" });
    user.password = hashPassword(newPassword); users.set(req.userId, user); saveUsers();
    res.json({ success: true });
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) { tokens.delete(authHeader.slice(7)); saveTokens(); }
    res.json({ success: true });
  });

  app.get("/api/auth/google", (req: Request, res: Response) => {
    const email = `google-${crypto.randomBytes(4).toString("hex")}@gmail.com`;
    const userId = crypto.randomUUID(); const token = generateToken();
    const user: StoredUser = { id: userId, email, name: "Google User", loginMethod: "google", createdAt: new Date().toISOString(), addresses: [], status: "active" };
    users.set(userId, user); tokens.set(token, userId); saveUsers(); saveTokens();
    res.redirect(`/?auth_token=${token}`);
  });

  app.get("/api/auth/apple", (req: Request, res: Response) => {
    const email = `apple-${crypto.randomBytes(4).toString("hex")}@icloud.com`;
    const userId = crypto.randomUUID(); const token = generateToken();
    const user: StoredUser = { id: userId, email, name: "Apple User", loginMethod: "apple", createdAt: new Date().toISOString(), addresses: [], status: "active" };
    users.set(userId, user); tokens.set(token, userId); saveUsers(); saveTokens();
    res.redirect(`/?auth_token=${token}`);
  });

  // ─── ADDRESS ROUTES ────────────────────────────────────────────────────────
  app.get("/api/addresses", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    res.json(user?.addresses || []);
  });

  app.post("/api/addresses", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const addr: Address = { id: crypto.randomUUID(), ...req.body, isDefault: !user.addresses?.length };
    if (!user.addresses) user.addresses = [];
    if (addr.isDefault) user.addresses.forEach(a => a.isDefault = false);
    user.addresses.push(addr); users.set(req.userId, user); saveUsers();
    res.status(201).json(addr);
  });

  app.put("/api/addresses/:id", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    if (!user || !user.addresses) return res.status(404).json({ error: "Not found" });
    const idx = user.addresses.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Address not found" });
    if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
    user.addresses[idx] = { ...user.addresses[idx], ...req.body };
    users.set(req.userId, user); saveUsers();
    res.json(user.addresses[idx]);
  });

  app.delete("/api/addresses/:id", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    if (!user || !user.addresses) return res.status(404).json({ error: "Not found" });
    user.addresses = user.addresses.filter(a => a.id !== req.params.id);
    users.set(req.userId, user); saveUsers();
    res.json({ success: true });
  });

  // ─── ORDER ROUTES ──────────────────────────────────────────────────────────
  app.post("/api/orders", authMiddleware, (req: any, res: Response) => {
    const { items, subtotal, tax, shipping, total, shippingAddress, paymentMethod } = req.body;
    if (!items?.length) return res.status(400).json({ error: "No items in order" });
    const user = users.get(req.userId);
    const order: StoredOrder = {
      id: crypto.randomUUID(), orderNumber: generateOrderNumber(), userId: req.userId,
      customerName: user?.name, customerEmail: user?.email,
      date: new Date().toISOString(), items, subtotal, tax, shipping: shipping || 0, total,
      status: "pending", paymentStatus: "unpaid", paymentMethod: paymentMethod || "mpesa", shippingAddress,
    };
    orders.set(order.id, order); saveOrders();
    // Update user stats
    if (user) {
      user.totalOrders = (user.totalOrders || 0) + 1;
      user.totalSpent = (user.totalSpent || 0) + total;
      users.set(req.userId, user); saveUsers();
    }
    // Update product sales
    for (const item of items) {
      const product = Array.from(products.values()).find(p => p.name === item.name || p.sku === item.sku);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        product.sales = (product.sales || 0) + item.quantity;
        product.updatedAt = new Date().toISOString();
        products.set(product.id, product); saveProducts();
      }
    }
    res.status(201).json(order);
  });

  app.get("/api/orders", authMiddleware, (req: any, res: Response) => {
    const userOrders = Array.from(orders.values()).filter(o => o.userId === req.userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(userOrders);
  });

  app.get("/api/orders/:id", authMiddleware, (req: any, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order || order.userId !== req.userId) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });

  app.put("/api/orders/:id/mark-paid", (req: Request, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.paymentStatus = "paid"; order.paidAt = new Date().toISOString(); order.status = "processing";
    orders.set(order.id, order); saveOrders();
    res.json(order);
  });

  app.put("/api/orders/:id/status", (req: Request, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const { status, trackingNumber } = req.body;
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === "delivered") order.deliveredAt = new Date().toISOString();
    orders.set(order.id, order); saveOrders();
    res.json(order);
  });

  // ─── REFUND ROUTES ─────────────────────────────────────────────────────────
  app.post("/api/refunds", authMiddleware, (req: any, res: Response) => {
    const { orderId, reason, reasonDetail, description, refundAmount } = req.body;
    const order = orders.get(orderId);
    if (!order || order.userId !== req.userId) return res.status(404).json({ error: "Order not found" });
    const user = users.get(req.userId);
    const refund: StoredRefund = {
      id: crypto.randomUUID(), orderId, orderNumber: order.orderNumber, userId: req.userId,
      customerName: user?.name, reason, reasonDetail: reasonDetail || "", description: description || "",
      status: "pending", refundAmount: refundAmount || order.total, date: new Date().toISOString(),
    };
    refunds.set(refund.id, refund); saveRefunds();
    res.status(201).json(refund);
  });

  app.get("/api/refunds", authMiddleware, (req: any, res: Response) => {
    const userRefunds = Array.from(refunds.values()).filter(r => r.userId === req.userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(userRefunds);
  });

  // ─── PUBLIC PRODUCT ROUTES ─────────────────────────────────────────────────
  app.get("/api/products", (req: Request, res: Response) => {
    const { category, subcategory, brand, model, search, status } = req.query;
    let allProducts = Array.from(products.values()).filter(p => p.status === "active");
    if (category) allProducts = allProducts.filter(p => p.category === category);
    if (subcategory) allProducts = allProducts.filter(p => p.subcategory === subcategory);
    if (brand) allProducts = allProducts.filter(p => p.brand.toLowerCase() === String(brand).toLowerCase());
    if (model) allProducts = allProducts.filter(p => p.model.toLowerCase().includes(String(model).toLowerCase()));
    if (search) {
      const s = String(search).toLowerCase();
      allProducts = allProducts.filter(p => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) || p.model.toLowerCase().includes(s) || p.category.toLowerCase().includes(s) || p.tags.some(t => t.includes(s)));
    }
    res.json(allProducts);
  });

  app.get("/api/products/:id", (req: Request, res: Response) => {
    const product = products.get(req.params.id);
    if (!product || product.status === "archived") return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  // ─── PUBLIC SETTINGS ROUTE ─────────────────────────────────────────────────
  app.get("/api/settings/public", (req: Request, res: Response) => {
    res.json({
      storeName: settings.storeName,
      storePhone: settings.storePhone,
      currency: settings.currency,
      shippingFee: settings.shippingFee,
      freeShippingThreshold: settings.freeShippingThreshold,
      whatsappNumber: settings.whatsappNumber,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      heroImage: settings.heroImage,
      announcementBar: settings.announcementBar,
      announcementBarEnabled: settings.announcementBarEnabled,
      maintenanceMode: settings.maintenanceMode,
      socialLinks: settings.socialLinks,
    });
  });

  // ─── ADMIN AUTH ROUTES ─────────────────────────────────────────────────────
  app.post("/api/admin/auth/login", (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    const admin = Array.from(admins.values()).find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!admin || admin.password !== hashPassword(password)) return res.status(401).json({ error: "Invalid credentials" });
    const token = generateToken();
    adminTokens.set(token, admin.id); saveAdminTokens();
    admin.lastLogin = new Date().toISOString(); admins.set(admin.id, admin); saveAdmins();
    res.json({ admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role }, token });
  });

  app.post("/api/admin/auth/logout", adminAuthMiddleware, (req: any, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) { adminTokens.delete(authHeader.slice(7)); saveAdminTokens(); }
    res.json({ success: true });
  });

  app.get("/api/admin/auth/me", adminAuthMiddleware, (req: any, res: Response) => {
    res.json({ id: req.admin.id, email: req.admin.email, name: req.admin.name, role: req.admin.role });
  });

  // ─── ADMIN DASHBOARD STATS ─────────────────────────────────────────────────
  app.get("/api/admin/stats", adminAuthMiddleware, (req: any, res: Response) => {
    const allOrders = Array.from(orders.values());
    const allProducts = Array.from(products.values());
    const allUsers = Array.from(users.values());
    const allRefunds = Array.from(refunds.values());

    const totalRevenue = allOrders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0);
    const pendingOrders = allOrders.filter(o => o.status === "pending").length;
    const lowStockProducts = allProducts.filter(p => p.stock <= p.lowStockThreshold && p.status === "active").length;
    const pendingRefunds = allRefunds.filter(r => r.status === "pending").length;

    // Revenue by month (last 6 months)
    const now = new Date();
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const month = d.toLocaleString("default", { month: "short" });
      const revenue = allOrders
        .filter(o => o.paymentStatus === "paid" && new Date(o.date).getMonth() === d.getMonth() && new Date(o.date).getFullYear() === d.getFullYear())
        .reduce((s, o) => s + o.total, 0);
      return { month, revenue };
    });

    // Top products by sales
    const topProducts = allProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0)).slice(0, 5).map(p => ({ name: p.name, sales: p.sales || 0, revenue: (p.sales || 0) * p.price }));

    // Order status breakdown
    const orderStatusBreakdown = {
      pending: allOrders.filter(o => o.status === "pending").length,
      processing: allOrders.filter(o => o.status === "processing").length,
      shipped: allOrders.filter(o => o.status === "shipped").length,
      delivered: allOrders.filter(o => o.status === "delivered").length,
      cancelled: allOrders.filter(o => o.status === "cancelled").length,
    };

    res.json({
      totalRevenue,
      totalOrders: allOrders.length,
      totalCustomers: allUsers.length,
      totalProducts: allProducts.filter(p => p.status === "active").length,
      pendingOrders,
      lowStockProducts,
      pendingRefunds,
      monthlyRevenue,
      topProducts,
      orderStatusBreakdown,
      recentOrders: allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10),
    });
  });

  // ─── ADMIN PRODUCT ROUTES ──────────────────────────────────────────────────
  app.get("/api/admin/products", adminAuthMiddleware, (req: any, res: Response) => {
    const { search, category, status, brand } = req.query;
    let allProducts = Array.from(products.values());
    if (search) { const s = String(search).toLowerCase(); allProducts = allProducts.filter(p => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)); }
    if (category) allProducts = allProducts.filter(p => p.category === category);
    if (status) allProducts = allProducts.filter(p => p.status === status);
    if (brand) allProducts = allProducts.filter(p => p.brand.toLowerCase() === String(brand).toLowerCase());
    res.json(allProducts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  });

  app.post("/api/admin/products", adminAuthMiddleware, (req: any, res: Response) => {
    const data = req.body;
    if (!data.name || !data.price || !data.category) return res.status(400).json({ error: "Name, price, and category are required" });
    const id = crypto.randomUUID();
    const product: StoredProduct = {
      id, sku: data.sku || generateSKU(data.brand || "GEN", data.category),
      name: data.name, category: data.category, subcategory: data.subcategory || "",
      brand: data.brand || "", model: data.model || "", price: Number(data.price),
      comparePrice: data.comparePrice ? Number(data.comparePrice) : undefined,
      cost: data.cost ? Number(data.cost) : undefined,
      stock: Number(data.stock) || 0, lowStockThreshold: Number(data.lowStockThreshold) || 5,
      images: data.images || [], description: data.description || "",
      condition: data.condition || "New", status: data.status || "active",
      tags: data.tags || [], weight: data.weight, partNumber: data.partNumber,
      compatibility: data.compatibility || [], sales: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    products.set(id, product); saveProducts();
    res.status(201).json(product);
  });

  app.put("/api/admin/products/:id", adminAuthMiddleware, (req: any, res: Response) => {
    const product = products.get(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    const updated = { ...product, ...req.body, id: product.id, updatedAt: new Date().toISOString() };
    products.set(product.id, updated); saveProducts();
    res.json(updated);
  });

  app.delete("/api/admin/products/:id", adminAuthMiddleware, (req: any, res: Response) => {
    if (!products.has(req.params.id)) return res.status(404).json({ error: "Product not found" });
    products.delete(req.params.id); saveProducts();
    res.json({ success: true });
  });

  // Bulk update product status
  app.put("/api/admin/products/bulk/status", adminAuthMiddleware, (req: any, res: Response) => {
    const { ids, status } = req.body;
    if (!ids?.length || !status) return res.status(400).json({ error: "ids and status required" });
    for (const id of ids) {
      const p = products.get(id);
      if (p) { p.status = status; p.updatedAt = new Date().toISOString(); products.set(id, p); }
    }
    saveProducts();
    res.json({ success: true, updated: ids.length });
  });

  // ─── ADMIN ORDER ROUTES ────────────────────────────────────────────────────
  app.get("/api/admin/orders", adminAuthMiddleware, (req: any, res: Response) => {
    const { search, status, paymentStatus, page = "1", limit = "20" } = req.query;
    let allOrders = Array.from(orders.values());
    if (search) { const s = String(search).toLowerCase(); allOrders = allOrders.filter(o => o.orderNumber.toLowerCase().includes(s) || (o.customerName || "").toLowerCase().includes(s) || (o.customerEmail || "").toLowerCase().includes(s)); }
    if (status) allOrders = allOrders.filter(o => o.status === status);
    if (paymentStatus) allOrders = allOrders.filter(o => o.paymentStatus === paymentStatus);
    allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const total = allOrders.length;
    const p = parseInt(String(page)); const l = parseInt(String(limit));
    const paginated = allOrders.slice((p - 1) * l, p * l);
    res.json({ orders: paginated, total, page: p, totalPages: Math.ceil(total / l) });
  });

  app.get("/api/admin/orders/:id", adminAuthMiddleware, (req: any, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const customer = users.get(order.userId);
    res.json({ ...order, customer: customer ? { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone } : null });
  });

  app.put("/api/admin/orders/:id", adminAuthMiddleware, (req: any, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const { status, paymentStatus, trackingNumber, notes } = req.body;
    if (status) { order.status = status; if (status === "delivered") order.deliveredAt = new Date().toISOString(); }
    if (paymentStatus) { order.paymentStatus = paymentStatus; if (paymentStatus === "paid" && !order.paidAt) order.paidAt = new Date().toISOString(); }
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (notes !== undefined) order.notes = notes;
    orders.set(order.id, order); saveOrders();
    res.json(order);
  });

  // ─── ADMIN CUSTOMER ROUTES ─────────────────────────────────────────────────
  app.get("/api/admin/customers", adminAuthMiddleware, (req: any, res: Response) => {
    const { search, status, page = "1", limit = "20" } = req.query;
    let allUsers = Array.from(users.values());
    if (search) { const s = String(search).toLowerCase(); allUsers = allUsers.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || (u.phone || "").includes(s)); }
    if (status) allUsers = allUsers.filter(u => u.status === status);
    allUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const total = allUsers.length;
    const p = parseInt(String(page)); const l = parseInt(String(limit));
    const paginated = allUsers.slice((p - 1) * l, p * l).map(u => ({
      id: u.id, email: u.email, name: u.name, phone: u.phone, loginMethod: u.loginMethod,
      createdAt: u.createdAt, totalOrders: u.totalOrders || 0, totalSpent: u.totalSpent || 0,
      status: u.status || "active", addresses: (u.addresses || []).length,
    }));
    res.json({ customers: paginated, total, page: p, totalPages: Math.ceil(total / l) });
  });

  app.get("/api/admin/customers/:id", adminAuthMiddleware, (req: any, res: Response) => {
    const user = users.get(req.params.id);
    if (!user) return res.status(404).json({ error: "Customer not found" });
    const customerOrders = Array.from(orders.values()).filter(o => o.userId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json({ id: user.id, email: user.email, name: user.name, phone: user.phone, loginMethod: user.loginMethod, createdAt: user.createdAt, totalOrders: user.totalOrders || 0, totalSpent: user.totalSpent || 0, status: user.status || "active", addresses: user.addresses || [], orders: customerOrders });
  });

  app.put("/api/admin/customers/:id", adminAuthMiddleware, (req: any, res: Response) => {
    const user = users.get(req.params.id);
    if (!user) return res.status(404).json({ error: "Customer not found" });
    const { status, name, phone } = req.body;
    if (status) user.status = status;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    users.set(user.id, user); saveUsers();
    res.json({ id: user.id, email: user.email, name: user.name, phone: user.phone, status: user.status });
  });

  // ─── ADMIN REFUND ROUTES ───────────────────────────────────────────────────
  app.get("/api/admin/refunds", adminAuthMiddleware, (req: any, res: Response) => {
    const { status } = req.query;
    let allRefunds = Array.from(refunds.values());
    if (status) allRefunds = allRefunds.filter(r => r.status === status);
    allRefunds.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(allRefunds);
  });

  app.put("/api/admin/refunds/:id", adminAuthMiddleware, (req: any, res: Response) => {
    const refund = refunds.get(req.params.id);
    if (!refund) return res.status(404).json({ error: "Refund not found" });
    const { status, adminNote } = req.body;
    if (status) { refund.status = status; if (["approved", "rejected", "completed"].includes(status)) refund.resolvedAt = new Date().toISOString(); }
    if (adminNote !== undefined) refund.adminNote = adminNote;
    // If approved, update order payment status
    if (status === "completed") {
      const order = orders.get(refund.orderId);
      if (order) { order.paymentStatus = "refunded"; orders.set(order.id, order); saveOrders(); }
    }
    refunds.set(refund.id, refund); saveRefunds();
    res.json(refund);
  });

  // ─── ADMIN SETTINGS ROUTES ─────────────────────────────────────────────────
  app.get("/api/admin/settings", adminAuthMiddleware, (req: any, res: Response) => {
    res.json(settings);
  });

  app.put("/api/admin/settings", adminAuthMiddleware, (req: any, res: Response) => {
    settings = { ...settings, ...req.body };
    saveSettings();
    res.json(settings);
  });

  // ─── IMAGE UPLOAD ──────────────────────────────────────────────────────────
  app.post("/api/admin/upload", adminAuthMiddleware, upload.array("images", 10), (req: any, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) return res.status(400).json({ error: "No files uploaded" });
    const urls = files.map(f => `/uploads/${f.filename}`);
    res.json({ urls });
  });

  // ─── ADMIN INVENTORY ALERTS ────────────────────────────────────────────────
  app.get("/api/admin/inventory/alerts", adminAuthMiddleware, (req: any, res: Response) => {
    const lowStock = Array.from(products.values()).filter(p => p.stock <= p.lowStockThreshold && p.status === "active").map(p => ({ id: p.id, name: p.name, sku: p.sku, stock: p.stock, lowStockThreshold: p.lowStockThreshold }));
    const outOfStock = Array.from(products.values()).filter(p => p.stock === 0 && p.status === "active").map(p => ({ id: p.id, name: p.name, sku: p.sku }));
    res.json({ lowStock, outOfStock });
  });

  // ─── ADMIN ORDER CREATION ──────────────────────────────────────────────────────
  app.post("/api/admin/orders/create", adminAuthMiddleware, (req: any, res: Response) => {
    const { items, customerEmail, customerName, customerPhone, shippingAddress, paymentMethod, notes } = req.body;
    if (!items?.length) return res.status(400).json({ error: "No items in order" });
    if (!customerEmail) return res.status(400).json({ error: "Customer email required" });
    
    const subtotal = items.reduce((s: number, i: any) => s + (i.price * i.quantity), 0);
    const tax = Math.round(subtotal * (settings.taxRate / 100));
    const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
    const total = subtotal + tax + shipping;
    
    const order: StoredOrder = {
      id: crypto.randomUUID(), orderNumber: generateOrderNumber(), userId: "",
      customerName, customerEmail, date: new Date().toISOString(), items,
      subtotal, tax, shipping, total,
      status: "pending", paymentStatus: "unpaid", paymentMethod: paymentMethod || "manual",
      shippingAddress: shippingAddress || {}, notes
    };
    orders.set(order.id, order); saveOrders();
    // Update product stock
    for (const item of items) {
      const product = Array.from(products.values()).find(p => p.id === item.id);
      if (product) { product.stock = Math.max(0, product.stock - item.quantity); product.sales = (product.sales || 0) + item.quantity; products.set(product.id, product); }
    }
    saveProducts();
    res.status(201).json(order);
  });

  // ─── ADMIN PAYMENT PROCESSING ──────────────────────────────────────────────────
  app.post("/api/admin/orders/:id/process-payment", adminAuthMiddleware, (req: any, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const { amount, method, transactionId } = req.body;
    order.paymentStatus = "paid";
    order.paidAt = new Date().toISOString();
    order.paymentMethod = method || order.paymentMethod;
    order.notes = (order.notes || "") + `\n[Payment] KES ${amount} via ${method} (Ref: ${transactionId || "manual"})`;
    orders.set(order.id, order); saveOrders();
    res.json(order);
  });

  // ─── ADMIN INVOICE GENERATION ──────────────────────────────────────────────────
  app.get("/api/admin/orders/:id/invoice", adminAuthMiddleware, (req: any, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const invoiceData = {
      orderNumber: order.orderNumber,
      date: order.date,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress,
      storeInfo: {
        name: settings.storeName,
        email: settings.storeEmail,
        phone: settings.storePhone,
        address: settings.storeAddress,
      }
    };
    res.json(invoiceData);
  });

  // ─── ADMIN FINANCIAL REPORTS ───────────────────────────────────────────────────
  app.get("/api/admin/reports/financial", adminAuthMiddleware, (req: any, res: Response) => {
    const allOrders = Array.from(orders.values());
    const paidOrders = allOrders.filter(o => o.paymentStatus === "paid");
    const unpaidOrders = allOrders.filter(o => o.paymentStatus === "unpaid");
    const refundedOrders = allOrders.filter(o => o.paymentStatus === "refunded");
    
    const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
    const totalCost = Array.from(products.values()).reduce((s, p) => s + ((p.cost || 0) * (p.sales || 0)), 0);
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100).toFixed(2) : "0";
    
    // Revenue by payment status
    const paymentStatusBreakdown = {
      paid: paidOrders.length,
      unpaid: unpaidOrders.length,
      refunded: refundedOrders.length,
      paidAmount: totalRevenue,
      unpaidAmount: unpaidOrders.reduce((s, o) => s + o.total, 0),
    };
    
    // Top products by revenue
    const topProductsByRevenue = Array.from(products.values())
      .map(p => ({ name: p.name, sales: p.sales || 0, revenue: (p.sales || 0) * p.price, profit: ((p.sales || 0) * (p.price - (p.cost || 0))) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    res.json({
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      paymentStatusBreakdown,
      topProductsByRevenue,
      orderCount: allOrders.length,
      averageOrderValue: allOrders.length > 0 ? (totalRevenue / allOrders.length).toFixed(2) : "0",
    });
  });

  // ─── ADMIN FULFILLMENT TRACKING ────────────────────────────────────────────────
  app.put("/api/admin/orders/:id/fulfillment", adminAuthMiddleware, (req: any, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const { status, trackingNumber, carrier, estimatedDelivery } = req.body;
    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === "shipped") order.notes = (order.notes || "") + `\n[Shipped] ${carrier || "Standard"} - Tracking: ${trackingNumber}`;
    if (status === "delivered") order.deliveredAt = new Date().toISOString();
    orders.set(order.id, order); saveOrders();
    res.json(order);
  });

  // ─── ADMIN EXPORT ORDERS ──────────────────────────────────────────────────────
  app.get("/api/admin/orders/export/csv", adminAuthMiddleware, (req: any, res: Response) => {
    const allOrders = Array.from(orders.values());
    const csv = [
      ["Order Number", "Date", "Customer", "Email", "Total", "Status", "Payment Status"].join(","),
      ...allOrders.map(o => [
        o.orderNumber,
        new Date(o.date).toLocaleDateString(),
        o.customerName || "",
        o.customerEmail || "",
        o.total,
        o.status,
        o.paymentStatus
      ].map(v => `"${v}"`).join(","))
    ].join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
    res.send(csv);
  });

  // ─── DISCOUNTS ─────────────────────────────────────────────────────────────
  app.get("/api/admin/discounts", adminAuthMiddleware, (_req: any, res: Response) => {
    res.json(Array.from(discounts.values()));
  });

  app.post("/api/admin/discounts", adminAuthMiddleware, (req: any, res: Response) => {
    const id = crypto.randomUUID();
    const discount = {
      id,
      code: (req.body.code || "").toUpperCase().trim(),
      type: req.body.type || "percentage",
      value: Number(req.body.value) || 0,
      minOrder: Number(req.body.minOrder) || 0,
      maxUses: req.body.maxUses ? Number(req.body.maxUses) : null,
      expiresAt: req.body.expiresAt || null,
      active: req.body.active !== false,
      usedCount: 0,
      totalSavings: 0,
      createdAt: new Date().toISOString(),
    };
    if (!discount.code) return res.status(400).json({ error: "Code is required" });
    discounts.set(id, discount);
    saveDiscounts();
    res.json(discount);
  });

  app.put("/api/admin/discounts/:id", adminAuthMiddleware, (req: any, res: Response) => {
    const d = discounts.get(req.params.id);
    if (!d) return res.status(404).json({ error: "Not found" });
    const updated = { ...d, ...req.body };
    discounts.set(req.params.id, updated);
    saveDiscounts();
    res.json(updated);
  });

  app.delete("/api/admin/discounts/:id", adminAuthMiddleware, (req: any, res: Response) => {
    discounts.delete(req.params.id);
    saveDiscounts();
    res.json({ success: true });
  });

  // Validate discount code (public)
  app.post("/api/discounts/validate", (req: Request, res: Response) => {
    const { code, orderTotal } = req.body;
    const d = Array.from(discounts.values()).find(d => d.code === (code || "").toUpperCase() && d.active);
    if (!d) return res.status(404).json({ error: "Invalid discount code" });
    if (d.expiresAt && new Date(d.expiresAt) < new Date()) return res.status(400).json({ error: "Discount code has expired" });
    if (d.maxUses && d.usedCount >= d.maxUses) return res.status(400).json({ error: "Discount code has reached its usage limit" });
    if (d.minOrder && orderTotal < d.minOrder) return res.status(400).json({ error: `Minimum order of KES ${d.minOrder.toLocaleString()} required` });
    const savings = d.type === "percentage" ? Math.round(orderTotal * d.value / 100) : d.value;
    res.json({ valid: true, discount: d, savings });
  });

  // ─── Customer status update ───────────────────────────────────────────────────
  app.put("/api/admin/customers/:id/status", adminAuthMiddleware, (req: any, res: Response) => {
    const user = users.get(req.params.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    user.status = req.body.status;
    users.set(req.params.id, user);
    saveUsers();
    res.json(user);
  });

  // ─── Refund status update ─────────────────────────────────────────────────────
  app.put("/api/admin/refunds/:id/status", adminAuthMiddleware, (req: any, res: Response) => {
    const refund = refunds.get(req.params.id);
    if (!refund) return res.status(404).json({ error: "Not found" });
    refund.status = req.body.status;
    if (req.body.status === "approved") refund.resolvedAt = new Date().toISOString();
    refunds.set(req.params.id, refund);
    saveRefunds();
    res.json(refund);
  });

  // ─── Static Files ──────────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.use("/uploads", express.static(UPLOADS_DIR));
  app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));

  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}/`));
}

startServer().catch(console.error);
