import express, { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Persistent File Store ───────────────────────────────────────────────────
const DATA_DIR = path.resolve(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

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
}

interface StoredOrder {
  id: string;
  orderNumber: string;
  userId: string;
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
  reason: string;
  reasonDetail: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "completed";
  refundAmount: number;
  date: string;
  resolvedAt?: string;
  adminNote?: string;
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

function saveUsers() { writeStore("users.json", Object.fromEntries(users)); }
function saveTokens() { writeStore("tokens.json", Object.fromEntries(tokens)); }
function saveOrders() { writeStore("orders.json", Object.fromEntries(orders)); }
function saveRefunds() { writeStore("refunds.json", Object.fromEntries(refunds)); }

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateToken() { return crypto.randomBytes(32).toString("hex"); }
function hashPassword(p: string) { return crypto.createHash("sha256").update(p).digest("hex"); }
function verifyToken(token: string) { return tokens.get(token) || null; }
function generateOrderNumber() {
  const d = new Date();
  return `SA-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // ─── AUTH ROUTES ───────────────────────────────────────────────────────────
  app.post("/api/auth/register", (req: Request, res: Response) => {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const existing = Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(409).json({ error: "An account with this email already exists" });

    const userId = crypto.randomUUID();
    const token = generateToken();
    const user: StoredUser = {
      id: userId, email: email.toLowerCase(), name, phone: phone || "",
      password: hashPassword(password), loginMethod: "email",
      createdAt: new Date().toISOString(), addresses: [],
    };
    users.set(userId, user);
    tokens.set(token, userId);
    saveUsers(); saveTokens();

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, loginMethod: user.loginMethod, createdAt: user.createdAt },
      token,
    });
  });

  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const user = Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !user.password) return res.status(401).json({ error: "Invalid email or password" });
    if (user.password !== hashPassword(password)) return res.status(401).json({ error: "Invalid email or password" });

    const token = generateToken();
    tokens.set(token, user.id);
    saveTokens();

    res.json({
      user: { id: user.id, email: user.email, name: user.name, phone: user.phone, loginMethod: user.loginMethod, createdAt: user.createdAt },
      token,
    });
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
    users.set(req.userId, user);
    saveUsers();
    res.json({ id: user.id, email: user.email, name: user.name, phone: user.phone, loginMethod: user.loginMethod, createdAt: user.createdAt });
  });

  app.put("/api/auth/password", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Both passwords required" });
    if (user.password !== hashPassword(currentPassword)) return res.status(401).json({ error: "Current password is incorrect" });
    if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters" });
    user.password = hashPassword(newPassword);
    users.set(req.userId, user);
    saveUsers();
    res.json({ success: true });
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      tokens.delete(authHeader.slice(7));
      saveTokens();
    }
    res.json({ success: true });
  });

  // OAuth (demo mode)
  app.get("/api/auth/google", (req: Request, res: Response) => {
    const email = `google-${crypto.randomBytes(4).toString("hex")}@gmail.com`;
    const userId = crypto.randomUUID();
    const token = generateToken();
    const user: StoredUser = { id: userId, email, name: "Google User", loginMethod: "google", createdAt: new Date().toISOString(), addresses: [] };
    users.set(userId, user); tokens.set(token, userId);
    saveUsers(); saveTokens();
    res.redirect(`/?auth_token=${token}`);
  });

  app.get("/api/auth/apple", (req: Request, res: Response) => {
    const email = `apple-${crypto.randomBytes(4).toString("hex")}@icloud.com`;
    const userId = crypto.randomUUID();
    const token = generateToken();
    const user: StoredUser = { id: userId, email, name: "Apple User", loginMethod: "apple", createdAt: new Date().toISOString(), addresses: [] };
    users.set(userId, user); tokens.set(token, userId);
    saveUsers(); saveTokens();
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
    user.addresses.push(addr);
    users.set(req.userId, user);
    saveUsers();
    res.status(201).json(addr);
  });

  app.put("/api/addresses/:id", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    if (!user || !user.addresses) return res.status(404).json({ error: "Not found" });
    const idx = user.addresses.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Address not found" });
    if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
    user.addresses[idx] = { ...user.addresses[idx], ...req.body };
    users.set(req.userId, user);
    saveUsers();
    res.json(user.addresses[idx]);
  });

  app.delete("/api/addresses/:id", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    if (!user || !user.addresses) return res.status(404).json({ error: "Not found" });
    user.addresses = user.addresses.filter(a => a.id !== req.params.id);
    users.set(req.userId, user);
    saveUsers();
    res.json({ success: true });
  });

  // ─── ORDER ROUTES ──────────────────────────────────────────────────────────
  app.post("/api/orders", authMiddleware, (req: any, res: Response) => {
    const { items, subtotal, tax, shipping, total, shippingAddress, paymentMethod } = req.body;
    if (!items?.length) return res.status(400).json({ error: "No items in order" });

    const order: StoredOrder = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      userId: req.userId,
      date: new Date().toISOString(),
      items, subtotal, tax, shipping: shipping || 0, total,
      status: "pending",
      paymentStatus: "unpaid",
      paymentMethod: paymentMethod || "mpesa",
      shippingAddress,
    };
    orders.set(order.id, order);
    saveOrders();
    res.status(201).json(order);
  });

  app.get("/api/orders", authMiddleware, (req: any, res: Response) => {
    const userOrders = Array.from(orders.values())
      .filter(o => o.userId === req.userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(userOrders);
  });

  app.get("/api/orders/:id", authMiddleware, (req: any, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order || order.userId !== req.userId) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });

  // Admin: mark order as paid (seller action)
  app.put("/api/orders/:id/mark-paid", (req: Request, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.paymentStatus = "paid";
    order.paidAt = new Date().toISOString();
    order.status = "processing";
    orders.set(order.id, order);
    saveOrders();
    res.json(order);
  });

  app.put("/api/orders/:id/status", (req: Request, res: Response) => {
    const order = orders.get(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    const { status, trackingNumber } = req.body;
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === "delivered") order.deliveredAt = new Date().toISOString();
    orders.set(order.id, order);
    saveOrders();
    res.json(order);
  });

  // ─── REFUND ROUTES ─────────────────────────────────────────────────────────
  app.post("/api/refunds", authMiddleware, (req: any, res: Response) => {
    const { orderId, reason, reasonDetail, description, refundAmount } = req.body;
    const order = orders.get(orderId);
    if (!order || order.userId !== req.userId) return res.status(404).json({ error: "Order not found" });

    const refund: StoredRefund = {
      id: crypto.randomUUID(),
      orderId, orderNumber: order.orderNumber,
      userId: req.userId,
      reason, reasonDetail: reasonDetail || "", description: description || "",
      status: "pending",
      refundAmount: refundAmount || order.total,
      date: new Date().toISOString(),
    };
    refunds.set(refund.id, refund);
    saveRefunds();
    res.status(201).json(refund);
  });

  app.get("/api/refunds", authMiddleware, (req: any, res: Response) => {
    const userRefunds = Array.from(refunds.values())
      .filter(r => r.userId === req.userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(userRefunds);
  });

  // ─── Static Files ──────────────────────────────────────────────────────────
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));
  app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));

  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}

startServer().catch(console.error);
