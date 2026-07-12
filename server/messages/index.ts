/**
 * Messaging Module
 * Handles customer-to-admin messaging with conversations and replies.
 */

import { Application, Request, Response, RequestHandler } from "express";
import * as crypto from "crypto";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: "customer" | "admin";
  senderName: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId?: string;
  subject: string;
  status: "open" | "closed" | "pending_customer";
  priority: "low" | "medium" | "high" | "urgent";
  messages: Message[];
  assignedAdminId?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export function registerMessageRoutes(
  app: Application,
  ctx: {
    conversations: Map<string, Conversation>;
    messages: Map<string, Message>;
    saveConversations: () => void;
    saveMessages: () => void;
    users: Map<string, any>;
    admins: Map<string, any>;
    orders: Map<string, any>;
    authMiddleware: RequestHandler;
    adminAuthMiddleware: RequestHandler;
  }
) {
  // Customer routes
  app.get("/api/messages", ctx.authMiddleware, (req: Request, res: Response) => {
    const senderId = req.userId || "";
    const userConversations = Array.from(ctx.conversations.values()).filter(
      c => c.userId === senderId
    ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    res.json(userConversations);
  });

  app.get("/api/messages/:conversationId", ctx.authMiddleware, (req: Request, res: Response) => {
    const conversation = ctx.conversations.get(req.params.conversationId);
    if (!conversation || conversation.userId !== req.userId) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    // Mark unread messages as read
    conversation.messages.forEach(m => {
      if (m.senderType === "admin" && !m.isRead) {
        m.isRead = true; m.readAt = new Date().toISOString();
      }
    });
    ctx.conversations.set(conversation.id, conversation);
    ctx.saveConversations();
    res.json(conversation);
  });

  app.post("/api/messages", ctx.authMiddleware, (req: Request, res: Response) => {
    const senderId = req.userId || "";
    const { orderId, subject, content } = req.body;
    if (!subject || !content) return res.status(400).json({ error: "Subject and content are required" });

    let conversation: Conversation;
    if (orderId) {
      const order = ctx.orders.get(orderId);
      if (!order) return res.status(404).json({ error: "Order not found" });
      conversation = {
        id: crypto.randomUUID(), userId: senderId,
        userName: ctx.users.get(senderId)?.name || "Customer",
        userEmail: ctx.users.get(senderId)?.email || "",
        orderId, subject,
        status: "open" as const, priority: "medium" as const,
        messages: [], createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } else {
      conversation = {
        id: crypto.randomUUID(), userId: senderId,
        userName: ctx.users.get(senderId)?.name || "Customer",
        userEmail: ctx.users.get(senderId)?.email || "",
        subject, status: "open" as const, priority: "medium" as const,
        messages: [], createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const message: Message = {
      id: crypto.randomUUID(), conversationId: conversation.id,
      senderId, senderType: "customer",
      senderName: ctx.users.get(senderId)?.name || "Customer",
      content, isRead: false, createdAt: new Date().toISOString(),
    };
    conversation.messages.push(message);
    ctx.messages.set(message.id, message);
    ctx.conversations.set(conversation.id, conversation);
    ctx.saveConversations();
    ctx.saveMessages();
    res.status(201).json({ success: true, conversation });
  });

  app.post("/api/messages/:conversationId/reply", ctx.authMiddleware, (req: Request, res: Response) => {
    const conversation = ctx.conversations.get(req.params.conversationId);
    if (!conversation || conversation.userId !== req.userId) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const message: Message = {
      id: crypto.randomUUID(), conversationId: conversation.id,
      senderId: req.userId || "", senderType: "customer",
      senderName: ctx.users.get(req.userId)?.name || "Customer",
      content, isRead: false, createdAt: new Date().toISOString(),
    };
    conversation.messages.push(message);
    conversation.status = "open";
    conversation.updatedAt = new Date().toISOString();
    ctx.messages.set(message.id, message);
    ctx.conversations.set(conversation.id, conversation);
    ctx.saveConversations();
    ctx.saveMessages();
    res.status(201).json({ success: true, message });
  });

  // Admin routes
  app.get("/api/admin/messages", (req: Request, res: Response) => {
    const allConversations = Array.from(ctx.conversations.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    res.json(allConversations);
  });

  app.get("/api/admin/messages/:conversationId", (req: Request, res: Response) => {
    const conversation = ctx.conversations.get(req.params.conversationId);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    // Mark customer unread messages as read
    conversation.messages.forEach(m => {
      if (m.senderType === "customer" && !m.isRead) {
        m.isRead = true; m.readAt = new Date().toISOString();
      }
    });
    ctx.conversations.set(conversation.id, conversation);
    ctx.saveConversations();
    res.json(conversation);
  });

  app.post("/api/admin/messages/:conversationId/reply", (req: Request, res: Response) => {
    const conversation = ctx.conversations.get(req.params.conversationId);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    const { content, priority } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const adminId = req.userId || "";
    const admin = ctx.admins.get(adminId);

    const message: Message = {
      id: crypto.randomUUID(), conversationId: conversation.id,
      senderId: adminId, senderType: "admin",
      senderName: admin?.name || "Support",
      content, isRead: false, createdAt: new Date().toISOString(),
    };
    conversation.messages.push(message);
    conversation.status = "pending_customer";
    if (priority) conversation.priority = priority;
    conversation.assignedAdminId = adminId;
    conversation.updatedAt = new Date().toISOString();
    ctx.messages.set(message.id, message);
    ctx.conversations.set(conversation.id, conversation);
    ctx.saveConversations();
    ctx.saveMessages();
    res.status(201).json({ success: true, message });
  });

  app.put("/api/admin/messages/:conversationId/status", (req: Request, res: Response) => {
    const conversation = ctx.conversations.get(req.params.conversationId);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });
    conversation.status = status;
    if (status === "closed") conversation.closedAt = new Date().toISOString();
    conversation.updatedAt = new Date().toISOString();
    ctx.conversations.set(conversation.id, conversation);
    ctx.saveConversations();
    res.json({ success: true });
  });

  app.put("/api/admin/messages/:conversationId/assign", (req: Request, res: Response) => {
    const conversation = ctx.conversations.get(req.params.conversationId);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    const { adminId } = req.body;
    if (!adminId) return res.status(400).json({ error: "Admin ID is required" });
    conversation.assignedAdminId = adminId;
    conversation.updatedAt = new Date().toISOString();
    ctx.conversations.set(conversation.id, conversation);
    ctx.saveConversations();
    res.json({ success: true });
  });

  app.get("/api/messages/unread-count", ctx.authMiddleware, (req: Request, res: Response) => {
    let count = 0;
    ctx.conversations.forEach(c => {
      if (c.userId === req.userId) {
        c.messages.forEach(m => {
          if (m.senderType === "admin" && !m.isRead) count++;
        });
      }
    });
    res.json({ count });
  });

  console.log("✅ Message routes registered");
}
