/**
 * Notifications Module
 * Handles in-app notifications, push, email/SMS, and admin broadcasts.
 */

import { Application, Request, Response, RequestHandler } from "express";
import * as crypto from "crypto";

export interface Notification {
  id: string;
  userId: string;
  type: "order_update" | "payment" | "promotion" | "account" | "wishlist_alert" | "price_drop" | "back_in_stock" | "system" | "admin_broadcast";
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  actionUrl?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  wishlistAlerts: boolean;
  priceDrops: boolean;
  backInStock: boolean;
}

export function registerNotificationRoutes(
  app: Application,
  ctx: {
    notifications: Map<string, Notification>;
    notificationSettings: Map<string, NotificationSettings>;
    saveNotifications: () => void;
    saveNotificationSettings: () => void;
    authMiddleware: RequestHandler;
  }
) {
  const defaultSettings: NotificationSettings = {
    email: true, sms: false, push: true,
    orderUpdates: true, promotions: true, wishlistAlerts: true,
    priceDrops: true, backInStock: true,
  };

  app.get("/api/notifications", ctx.authMiddleware, (req: Request, res: Response) => {
    if (!req.userId) return res.status(401).json({ error: "Not authenticated" });
    const userNotifications = Array.from(ctx.notifications.values()).filter(
      n => n.userId === req.userId
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ notifications: userNotifications, unreadCount: userNotifications.filter(n => !n.isRead).length });
  });

  app.get("/api/notifications/unread-count", ctx.authMiddleware, (req: Request, res: Response) => {
    if (!req.userId) return res.status(401).json({ error: "Not authenticated" });
    const count = Array.from(ctx.notifications.values()).filter(
      n => n.userId === req.userId && !n.isRead
    ).length;
    res.json({ count });
  });

  app.put("/api/notifications/:id/read", ctx.authMiddleware, (req: Request, res: Response) => {
    const notification = ctx.notifications.get(req.params.id);
    if (!notification || notification.userId !== req.userId) return res.status(404).json({ error: "Not found" });
    notification.isRead = true;
    notification.readAt = new Date().toISOString();
    ctx.notifications.set(notification.id, notification);
    ctx.saveNotifications();
    res.json({ success: true });
  });

  app.put("/api/notifications/read-all", ctx.authMiddleware, (req: Request, res: Response) => {
    Array.from(ctx.notifications.values()).filter(n => n.userId === req.userId && !n.isRead).forEach(n => {
      n.isRead = true; n.readAt = new Date().toISOString();
      ctx.notifications.set(n.id, n);
    });
    ctx.saveNotifications();
    res.json({ success: true });
  });

  app.delete("/api/notifications/:id", ctx.authMiddleware, (req: Request, res: Response) => {
    const notification = ctx.notifications.get(req.params.id);
    if (!notification || notification.userId !== req.userId) return res.status(404).json({ error: "Not found" });
    ctx.notifications.delete(req.params.id);
    ctx.saveNotifications();
    res.json({ success: true });
  });

  app.delete("/api/notifications/read-all", ctx.authMiddleware, (req: Request, res: Response) => {
    Array.from(ctx.notifications.values()).filter(n => n.userId === req.userId && n.isRead).forEach(n => {
      ctx.notifications.delete(n.id);
    });
    ctx.saveNotifications();
    res.json({ success: true });
  });

  app.get("/api/notifications/settings", ctx.authMiddleware, (req: Request, res: Response) => {
    if (!req.userId) return res.status(401).json({ error: "Not authenticated" });
    const settings = ctx.notificationSettings.get(req.userId);
    res.json(settings || { ...defaultSettings, userId: req.userId });
  });

  app.put("/api/notifications/settings", ctx.authMiddleware, (req: Request, res: Response) => {
    if (!req.userId) return res.status(401).json({ error: "Not authenticated" });
    const existing = ctx.notificationSettings.get(req.userId) || { ...defaultSettings };
    const updated: NotificationSettings = { ...existing, ...req.body };
    ctx.notificationSettings.set(req.userId, updated);
    ctx.saveNotificationSettings();
    res.json(updated);
  });

  // Admin broadcast
  app.post("/api/admin/notifications/broadcast", (req: Request, res: Response) => {
    const { title, message, type, priority, targetUserIds } = req.body;
    if (!title || !message) return res.status(400).json({ error: "Title and message are required" });

    const notification: Notification = {
      id: crypto.randomUUID(), userId: targetUserIds?.[0] || "",
      type: type || "admin_broadcast", title, message,
      isRead: false, priority: priority || "medium",
      createdAt: new Date().toISOString(),
    };

    if (targetUserIds && targetUserIds.length > 0) {
      targetUserIds.forEach((userId: string) => {
        const notif = { ...notification, id: crypto.randomUUID(), userId };
        ctx.notifications.set(notif.id, notif);
      });
    }

    ctx.saveNotifications();
    res.json({ success: true, message: `Notification sent to ${targetUserIds?.length || 0} users` });
  });

  console.log("✅ Notification routes registered");
}
