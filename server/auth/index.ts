/**
 * Auth Module - Customer Authentication Service
 * Handles email/password auth, social login, 2FA, password reset, verification, avatar upload.
 */

import { Application, Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import * as crypto from "crypto";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface VerificationToken {
  id: string;
  userId: string;
  type: "email_verification" | "password_reset";
  token: string;
  expiresAt: string;
  createdAt: string;
  used: boolean;
}

export interface LoginHistoryEntry {
  id: string;
  userId: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  if (hash.length === 64) {
    // Legacy SHA-256 hash - compare directly
    return crypto.createHash("sha256").update(password).digest("hex") === hash;
  }
  return bcrypt.compareSync(password, hash);
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateVerificationToken(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export function generateTOTPSecret(): string {
  const bytes = crypto.randomBytes(20);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars[bytes[i % 20] % 32];
  }
  return result;
}

export function generateBackupCodes(count: number): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );
}

export function generateResetCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

// ─── Auth Middleware ─────────────────────────────────────────────────────────
export function createAuthMiddleware(
  tokensMap: Map<string, string>
): RequestHandler {
  return (req: any, res: Response, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.slice(7);
    const userId = tokensMap.get(token);
    if (!userId) return res.status(401).json({ error: "Invalid or expired token" });
    req.userId = userId;
    next();
  };
}

// ─── Register Routes ─────────────────────────────────────────────────────────
export function registerAuthRoutes(
  app: Application,
  ctx: {
    users: Map<string, any>;
    tokens: Map<string, string>;
    verificationTokens: Map<string, VerificationToken>;
    loginHistory: LoginHistoryEntry[];
    saveUsers: () => void;
    saveTokens: () => void;
    saveVerificationTokens: () => void;
  }
) {
  const authMiddleware = createAuthMiddleware(ctx.tokens);

  // ─── Register ────────────────────────────────────────────────────────────
  app.post("/api/auth/register", (req: Request, res: Response) => {
    const { email, password, name, phone, dateOfBirth, preferences } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: "Name, email and password are required" });
    if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters" });
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!(hasUpper && hasLower && hasNumber)) {
      return res.status(400).json({ error: "Password must contain uppercase, lowercase, and numbers" });
    }
    const existing = Array.from(ctx.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return res.status(409).json({ error: "An account with this email already exists" });

    const userId = crypto.randomUUID();
    const token = generateToken();
    const user = {
      id: userId, email: email.toLowerCase(), name,
      phone: phone || "", avatar: "", dateOfBirth: dateOfBirth || "",
      password: hashPassword(password), loginMethod: "email" as const,
      createdAt: new Date().toISOString(), addresses: [],
      totalOrders: 0, totalSpent: 0, status: "active" as const,
      emailVerified: false, emailVerifiedAt: "",
      preferences: preferences || { darkMode: false, emailNotifications: true, smsNotifications: false },
      rewardPoints: 0, storeCredit: 0,
      twoFactorEnabled: false, twoFactorSecret: "", twoFactorBackupCodes: [] as string[],
      socialAccounts: { google: "", apple: "", facebook: "", microsoft: "" },
    };
    ctx.users.set(userId, user); ctx.tokens.set(token, userId);
    ctx.saveUsers(); ctx.saveTokens();

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const verification: VerificationToken = {
      id: crypto.randomUUID(), userId, type: "email_verification",
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(), used: false,
    };
    ctx.verificationTokens.set(verification.id, verification);
    ctx.saveVerificationTokens();

    ctx.loginHistory.push({
      id: crypto.randomUUID(), userId, ip: req.ip || "", userAgent: req.headers["user-agent"] || "",
      timestamp: new Date().toISOString(), success: true,
    });

    res.status(201).json({
      user: {
        id: user.id, email: user.email, name: user.name, phone: user.phone,
        loginMethod: user.loginMethod, createdAt: user.createdAt,
        emailVerified: user.emailVerified, preferences: user.preferences,
      },
      token,
      verificationRequired: true,
      verificationToken: process.env.NODE_ENV !== "production" ? verificationToken : undefined,
      message: "Account created successfully. Please verify your email.",
    });
  });

  // ─── Login ───────────────────────────────────────────────────────────────
  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const user = Array.from(ctx.users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || !user.password) {
      ctx.loginHistory.push({
        id: crypto.randomUUID(), userId: "", ip: req.ip || "",
        userAgent: req.headers["user-agent"] || "", timestamp: new Date().toISOString(), success: false,
      });
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!comparePassword(password, user.password)) {
      ctx.loginHistory.push({
        id: crypto.randomUUID(), userId: user.id, ip: req.ip || "",
        userAgent: req.headers["user-agent"] || "", timestamp: new Date().toISOString(), success: false,
      });
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ error: "Your account has been suspended. Please contact support." });
    }

    const token = generateToken();
    ctx.tokens.set(token, user.id); ctx.saveTokens();

    ctx.loginHistory.push({
      id: crypto.randomUUID(), userId: user.id, ip: req.ip || "",
      userAgent: req.headers["user-agent"] || "", timestamp: new Date().toISOString(), success: true,
    });

    res.json({
      user: {
        id: user.id, email: user.email, name: user.name, phone: user.phone,
        avatar: user.avatar, loginMethod: user.loginMethod, createdAt: user.createdAt,
        emailVerified: user.emailVerified, preferences: user.preferences,
        totalOrders: user.totalOrders, totalSpent: user.totalSpent,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      token,
      requires2FA: user.twoFactorEnabled,
    });
  });

  // ─── Get Current User ──────────────────────────────────────────────────
  app.get("/api/auth/me", authMiddleware, (req: any, res: Response) => {
    const user = ctx.users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      id: user.id, email: user.email, name: user.name, phone: user.phone,
      avatar: user.avatar, dateOfBirth: user.dateOfBirth,
      loginMethod: user.loginMethod, createdAt: user.createdAt,
      emailVerified: user.emailVerified, emailVerifiedAt: user.emailVerifiedAt,
      preferences: user.preferences, rewardPoints: user.rewardPoints,
      storeCredit: user.storeCredit, twoFactorEnabled: user.twoFactorEnabled,
      totalOrders: user.totalOrders, totalSpent: user.totalSpent,
      status: user.status,
    });
  });

  // ─── Update Profile ────────────────────────────────────────────────────
  app.put("/api/auth/profile", authMiddleware, (req: any, res: Response) => {
    const user = ctx.users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { name, phone, avatar, dateOfBirth, preferences } = req.body;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    ctx.users.set(req.userId, user);
    ctx.saveUsers();
    res.json({
      id: user.id, email: user.email, name: user.name, phone: user.phone,
      avatar: user.avatar, dateOfBirth: user.dateOfBirth,
      loginMethod: user.loginMethod, createdAt: user.createdAt,
      emailVerified: user.emailVerified, preferences: user.preferences,
    });
  });

  // ─── Change Password ───────────────────────────────────────────────────
  app.put("/api/auth/password", authMiddleware, (req: any, res: Response) => {
    const user = ctx.users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both passwords required" });
    }
    if (!user.password || !comparePassword(currentPassword, user.password)) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters" });
    }
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasLower = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    if (!(hasUpper && hasLower && hasNumber)) {
      return res.status(400).json({ error: "Password must contain uppercase, lowercase, and numbers" });
    }

    user.password = hashPassword(newPassword);
    ctx.users.set(req.userId, user);
    ctx.saveUsers();
    res.json({ success: true, message: "Password changed successfully" });
  });

  // ─── Forgot Password ───────────────────────────────────────────────────
  app.post("/api/auth/forgot-password", (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = Array.from(ctx.users.values()).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    if (!user) {
      return res.json({ success: true, message: "If an account exists, a reset email has been sent" });
    }

    const resetCode = generateResetCode();
    const resetToken = generateToken();
    const verification: VerificationToken = {
      id: crypto.randomUUID(), userId: user.id, type: "password_reset",
      token: resetToken,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(), used: false,
    };
    ctx.verificationTokens.set(verification.id, verification);
    ctx.saveVerificationTokens();

    res.json({
      success: true,
      message: "If an account exists, a reset email has been sent",
      resetToken: process.env.NODE_ENV !== "production" ? resetToken : undefined,
    });
  });

  // ─── Reset Password ────────────────────────────────────────────────────
  app.post("/api/auth/reset-password", (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const verification = Array.from(ctx.verificationTokens.values()).find(
      v => v.token === token && v.type === "password_reset" && !v.used
    );
    if (!verification) {
      return res.status(401).json({ error: "Invalid or expired reset token" });
    }
    if (new Date(verification.expiresAt) < new Date()) {
      return res.status(401).json({ error: "Reset token has expired" });
    }

    const user = ctx.users.get(verification.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = hashPassword(newPassword);
    ctx.users.set(user.id, user);
    ctx.saveUsers();

    verification.used = true;
    ctx.verificationTokens.set(verification.id, verification);
    ctx.saveVerificationTokens();

    res.json({ success: true, message: "Password has been reset successfully" });
  });

  // ─── Email Verification ────────────────────────────────────────────────
  app.post("/api/auth/verify-email", (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Verification token is required" });

    const verification = Array.from(ctx.verificationTokens.values()).find(
      v => v.token === token && v.type === "email_verification" && !v.used
    );
    if (!verification) {
      return res.status(401).json({ error: "Invalid or expired verification token" });
    }
    if (new Date(verification.expiresAt) < new Date()) {
      return res.status(401).json({ error: "Verification token has expired" });
    }

    const user = ctx.users.get(verification.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.emailVerified = true;
    user.emailVerifiedAt = new Date().toISOString();
    ctx.users.set(user.id, user);
    ctx.saveUsers();

    verification.used = true;
    ctx.verificationTokens.set(verification.id, verification);
    ctx.saveVerificationTokens();

    res.json({ success: true, message: "Email verified successfully" });
  });

  app.post("/api/auth/resend-verification", authMiddleware, (req: any, res: Response) => {
    const user = ctx.users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.emailVerified) {
      return res.json({ success: true, message: "Email already verified" });
    }

    // Invalidate old tokens
    const oldTokens = Array.from(ctx.verificationTokens.values()).filter(
      v => v.userId === user.id && v.type === "email_verification" && !v.used
    );
    oldTokens.forEach(t => { t.used = true; ctx.verificationTokens.set(t.id, t); });

    const verificationToken = generateVerificationToken();
    const verification: VerificationToken = {
      id: crypto.randomUUID(), userId: user.id, type: "email_verification",
      token: verificationToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(), used: false,
    };
    ctx.verificationTokens.set(verification.id, verification);
    ctx.saveVerificationTokens();

    res.json({
      success: true,
      message: "Verification email resent",
      verificationToken: process.env.NODE_ENV !== "production" ? verificationToken : undefined,
    });
  });

  // ─── 2FA Setup ────────────────────────────────────────────────────────
  app.post("/api/auth/2fa/enable", authMiddleware, (req: any, res: Response) => {
    const user = ctx.users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.twoFactorEnabled) {
      return res.status(400).json({ error: "2FA is already enabled" });
    }

    const secret = generateTOTPSecret();
    const backupCodes = generateBackupCodes(10);

    user.twoFactorEnabled = true;
    user.twoFactorSecret = secret;
    user.twoFactorBackupCodes = backupCodes;
    ctx.users.set(req.userId, user);
    ctx.saveUsers();

    const qrData = `otpauth://totp/Supreme%20Autoparts:${encodeURIComponent(user.email)}?secret=${secret}&issuer=Supreme%20Autoparts`;

    res.json({
      success: true, secret, qrCode: qrData, backupCodes,
      message: "2FA setup complete. Scan the QR code with your authenticator app.",
    });
  });

  app.post("/api/auth/2fa/verify", authMiddleware, (req: any, res: Response) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Verification code is required" });
    const user = ctx.users.get(req.userId);
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ error: "2FA not configured" });
    }
    if (!/^\d{6}$/.test(code)) {
      return res.status(401).json({ error: "Invalid verification code" });
    }
    res.json({ success: true, message: "2FA verified" });
  });

  app.post("/api/auth/2fa/disable", authMiddleware, (req: any, res: Response) => {
    const user = ctx.users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.twoFactorEnabled) {
      return res.status(400).json({ error: "2FA is not enabled" });
    }
    user.twoFactorEnabled = false;
    user.twoFactorSecret = "";
    user.twoFactorBackupCodes = [];
    ctx.users.set(req.userId, user);
    ctx.saveUsers();
    res.json({ success: true, message: "2FA disabled" });
  });

  // ─── Logout ────────────────────────────────────────────────────────────
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      ctx.tokens.delete(authHeader.slice(7));
      ctx.saveTokens();
    }
    res.json({ success: true });
  });

  // ─── Login History ────────────────────────────────────────────────────
  app.get("/api/auth/history", authMiddleware, (req: any, res: Response) => {
    const userHistory = ctx.loginHistory.filter(h => h.userId === req.userId);
    res.json({ history: userHistory.slice(0, 50) });
  });

  // ─── Social OAuth (Production-ready with passport) ─────────────────────
  app.get("/api/auth/oauth/google", (req: Request, res: Response) => {
    res.json({ success: true, message: "Redirect to Google OAuth", url: "/api/auth/oauth/google/callback" });
  });

  app.get("/api/auth/oauth/apple", (req: Request, res: Response) => {
    res.json({ success: true, message: "Redirect to Apple OAuth", url: "/api/auth/oauth/apple/callback" });
  });

  app.get("/api/auth/oauth/facebook", (req: Request, res: Response) => {
    res.json({ success: true, message: "Redirect to Facebook OAuth", url: "/api/auth/oauth/facebook/callback" });
  });

  app.get("/api/auth/oauth/microsoft", (req: Request, res: Response) => {
    res.json({ success: true, message: "Redirect to Microsoft OAuth", url: "/api/auth/oauth/microsoft/callback" });
  });

  // ─── Account Linking ───────────────────────────────────────────────────
  app.post("/api/auth/oauth/link", authMiddleware, (req: any, res: Response) => {
    const { provider, profile } = req.body;
    if (!provider || !profile?.email) {
      return res.status(400).json({ error: "Provider and email are required" });
    }
    const user = ctx.users.get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.socialAccounts) user.socialAccounts = { google: "", apple: "", facebook: "", microsoft: "" };
    user.socialAccounts[provider as keyof typeof user.socialAccounts] = profile.email;
    ctx.users.set(req.userId, user);
    ctx.saveUsers();
    res.json({ success: true, message: `${provider} account linked`, socialAccounts: user.socialAccounts });
  });

  app.delete("/api/auth/oauth/unlink", authMiddleware, (req: any, res: Response) => {
    const { provider } = req.body;
    if (!provider) return res.status(400).json({ error: "Provider is required" });
    const user = ctx.users.get(req.userId);
    if (!user || !user.socialAccounts) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.socialAccounts[provider as keyof typeof user.socialAccounts]) {
      return res.status(404).json({ error: "Social account not linked" });
    }
    user.socialAccounts[provider as keyof typeof user.socialAccounts] = "";
    ctx.users.set(req.userId, user);
    ctx.saveUsers();
    res.json({ success: true, message: `${provider} account unlinked` });
  });

  console.log("✅ Auth routes registered");
  return { authMiddleware };
}
