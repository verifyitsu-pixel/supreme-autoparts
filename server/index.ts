import express, { Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple in-memory user store (in production, use a database)
interface StoredUser {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatar?: string;
  loginMethod: "email" | "google" | "apple";
  createdAt: Date;
}

const users: Map<string, StoredUser> = new Map();
const tokens: Map<string, string> = new Map(); // token -> userId

// Helper functions
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyToken(token: string): string | null {
  return tokens.get(token) || null;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Auth middleware
  const authMiddleware = (req: any, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.slice(7);
    const userId = verifyToken(token);
    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userId = userId;
    next();
  };

  // Authentication Routes
  app.post("/api/auth/register", (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const userId = crypto.randomUUID();
    const hashedPassword = hashPassword(password);
    const token = generateToken();

    const user: StoredUser = {
      id: userId,
      email,
      name,
      password: hashedPassword,
      loginMethod: "email",
      createdAt: new Date(),
    };

    users.set(userId, user);
    tokens.set(token, userId);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        loginMethod: user.loginMethod,
        createdAt: user.createdAt,
      },
      token,
    });
  });

  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken();
    tokens.set(token, user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        loginMethod: user.loginMethod,
        createdAt: user.createdAt,
      },
      token,
    });
  });

  app.get("/api/auth/me", authMiddleware, (req: any, res: Response) => {
    const user = users.get(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      loginMethod: user.loginMethod,
      createdAt: user.createdAt,
    });
  });

  // OAuth endpoints (simplified - in production, use proper OAuth libraries)
  app.get("/api/auth/google", (req: Request, res: Response) => {
    // In production, redirect to Google OAuth consent screen
    // For now, create a demo user
    const email = `user-${crypto.randomBytes(4).toString("hex")}@gmail.com`;
    const userId = crypto.randomUUID();
    const token = generateToken();

    const user: StoredUser = {
      id: userId,
      email,
      name: "Google User",
      loginMethod: "google",
      avatar: "https://via.placeholder.com/150",
      createdAt: new Date(),
    };

    users.set(userId, user);
    tokens.set(token, userId);

    // In production, redirect to frontend with token
    res.redirect(`/?auth_token=${token}`);
  });

  app.get("/api/auth/apple", (req: Request, res: Response) => {
    // In production, redirect to Apple OAuth consent screen
    // For now, create a demo user
    const email = `user-${crypto.randomBytes(4).toString("hex")}@icloud.com`;
    const userId = crypto.randomUUID();
    const token = generateToken();

    const user: StoredUser = {
      id: userId,
      email,
      name: "Apple User",
      loginMethod: "apple",
      avatar: "https://via.placeholder.com/150",
      createdAt: new Date(),
    };

    users.set(userId, user);
    tokens.set(token, userId);

    // In production, redirect to frontend with token
    res.redirect(`/?auth_token=${token}`);
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      tokens.delete(token);
    }
    res.json({ success: true });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
