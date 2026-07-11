/**
 * Payment Gateway Router
 * Central module that wires all payment providers into the Express app.
 * Import and call `registerPaymentRoutes(app, { ... })` from server/index.ts.
 */

import { Request, Response, Application } from "express";
import crypto from "crypto";
import {
  submitPesapalOrder,
  getPesapalTransactionStatus,
  registerIPN,
  mapPesapalStatus,
} from "./pesapal.js";
import {
  createPayPalOrder,
  capturePayPalOrder,
  verifyPayPalWebhook,
  mapPayPalStatus,
} from "./paypal.js";
import {
  createStripeSession,
  retrieveStripeSession,
  verifyStripeWebhook,
  mapStripeStatus,
} from "./stripe.js";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface StoredTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  provider: "pesapal" | "paypal" | "stripe";
  providerTransactionId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  customerEmail?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentLog {
  id: string;
  transactionId?: string;
  orderId?: string;
  provider: string;
  event: string;
  level: "info" | "warn" | "error";
  message: string;
  data?: unknown;
  timestamp: string;
}

export interface PaymentProviderSettings {
  pesapal: { enabled: boolean; env: "sandbox" | "live" };
  paypal: { enabled: boolean; env: "sandbox" | "live" };
  stripe: { enabled: boolean; env: "test" | "live" };
}

// ─── Context passed in from server/index.ts ───────────────────────────────────
export interface PaymentContext {
  transactions: Map<string, StoredTransaction>;
  paymentLogs: Map<string, PaymentLog>;
  orders: Map<string, any>;
  settings: any;
  saveTransactions: () => void;
  savePaymentLogs: () => void;
  saveOrders: () => void;
  saveSettings: () => void;
  adminAuthMiddleware: (req: any, res: Response, next: Function) => void;
  authMiddleware: (req: any, res: Response, next: Function) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getBaseUrl(): string {
  return process.env.APP_BASE_URL || "http://localhost:3000";
}

function getProviderSettings(settings: any): PaymentProviderSettings {
  return (
    settings.paymentProviders || {
      pesapal: { enabled: false, env: "sandbox" },
      paypal: { enabled: false, env: "sandbox" },
      stripe: { enabled: false, env: "test" },
    }
  );
}

function isProviderEnabled(settings: any, provider: "pesapal" | "paypal" | "stripe"): boolean {
  const ps = getProviderSettings(settings);
  return ps[provider]?.enabled === true;
}

function log(
  ctx: PaymentContext,
  level: "info" | "warn" | "error",
  provider: string,
  event: string,
  message: string,
  data?: unknown,
  transactionId?: string,
  orderId?: string
) {
  const entry: PaymentLog = {
    id: crypto.randomUUID(),
    transactionId,
    orderId,
    provider,
    event,
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  ctx.paymentLogs.set(entry.id, entry);
  // Keep only last 1000 logs to prevent unbounded growth
  if (ctx.paymentLogs.size > 1000) {
    const oldest = Array.from(ctx.paymentLogs.keys())[0];
    ctx.paymentLogs.delete(oldest);
  }
  ctx.savePaymentLogs();
  const prefix = `[Payment:${provider}]`;
  if (level === "error") console.error(prefix, event, message, data || "");
  else if (level === "warn") console.warn(prefix, event, message, data || "");
  else console.log(prefix, event, message);
}

// ─── Register All Payment Routes ──────────────────────────────────────────────
export function registerPaymentRoutes(app: Application, ctx: PaymentContext) {
  const base = getBaseUrl();

  // ── Public: Get enabled payment providers ─────────────────────────────────
  app.get("/api/payments/providers", (_req: Request, res: Response) => {
    const ps = getProviderSettings(ctx.settings);
    res.json({
      pesapal: {
        enabled: ps.pesapal.enabled,
        configured: !!(
          process.env.PESAPAL_CONSUMER_KEY &&
          process.env.PESAPAL_CONSUMER_SECRET &&
          process.env.PESAPAL_IPN_ID
        ),
      },
      paypal: {
        enabled: ps.paypal.enabled,
        configured: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
      },
      stripe: {
        enabled: ps.stripe.enabled,
        configured: !!process.env.STRIPE_SECRET_KEY,
      },
    });
  });

  // ── Create Payment Session ────────────────────────────────────────────────
  app.post("/api/payments/create", ctx.authMiddleware, async (req: any, res: Response) => {
    const { orderId, provider } = req.body;

    if (!orderId || !provider) {
      return res.status(400).json({ error: "orderId and provider are required" });
    }

    const order = ctx.orders.get(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.userId !== req.userId) return res.status(403).json({ error: "Forbidden" });

    if (!isProviderEnabled(ctx.settings, provider)) {
      return res.status(400).json({ error: `Payment provider '${provider}' is not enabled` });
    }

    // Prevent duplicate payment for already-paid orders
    if (order.paymentStatus === "paid") {
      return res.status(400).json({ error: "Order is already paid" });
    }

    // Check for existing pending transaction for this order+provider
    const existingTx = Array.from(ctx.transactions.values()).find(
      (t) => t.orderId === orderId && t.provider === provider && t.status === "pending"
    );

    log(ctx, "info", provider, "create_session", `Creating payment for order ${order.orderNumber}`, { orderId, provider }, existingTx?.id, orderId);

    try {
      if (provider === "pesapal") {
        const callbackUrl = `${base}/api/payments/callback/pesapal`;
        const cancellationUrl = `${base}/payment/cancelled`;

        const ipnId = process.env.PESAPAL_IPN_ID;
        if (!ipnId) {
          return res.status(500).json({ error: "Pesapal IPN not configured. Contact admin." });
        }

        const result = await submitPesapalOrder({
          orderId,
          orderNumber: order.orderNumber,
          amount: order.total,
          currency: ctx.settings.currency || "KES",
          description: `Supreme Autoparts Order ${order.orderNumber}`,
          email: order.customerEmail || order.shippingAddress?.email || "",
          phone: order.shippingAddress?.phone,
          firstName: order.customerName?.split(" ")[0],
          lastName: order.customerName?.split(" ").slice(1).join(" ") || "Customer",
          callbackUrl,
          cancellationUrl,
          ipnId,
        });

        if (!result.redirect_url) {
          log(ctx, "error", "pesapal", "create_session_failed", "No redirect_url from Pesapal", result, undefined, orderId);
          return res.status(500).json({ error: "Pesapal did not return a redirect URL" });
        }

        const tx: StoredTransaction = {
          id: crypto.randomUUID(),
          orderId,
          orderNumber: order.orderNumber,
          provider: "pesapal",
          providerTransactionId: result.order_tracking_id || "",
          amount: order.total,
          currency: ctx.settings.currency || "KES",
          status: "pending",
          customerEmail: order.customerEmail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: { order_tracking_id: result.order_tracking_id, merchant_reference: result.merchant_reference },
        };
        ctx.transactions.set(tx.id, tx);
        ctx.saveTransactions();

        log(ctx, "info", "pesapal", "session_created", `Pesapal session created for ${order.orderNumber}`, { trackingId: result.order_tracking_id }, tx.id, orderId);
        return res.json({ checkoutUrl: result.redirect_url, transactionId: tx.id });
      }

      if (provider === "paypal") {
        const returnUrl = `${base}/api/payments/callback/paypal`;
        const cancelUrl = `${base}/payment/cancelled`;

        // PayPal requires USD or supported currency; if store uses KES, convert or use USD
        const currency = ctx.settings.currency === "KES" ? "USD" : (ctx.settings.currency || "USD");
        // Simple conversion rate placeholder - in production use a real FX API
        const amount = currency === "USD" ? parseFloat((order.total / 130).toFixed(2)) : order.total;

        const result = await createPayPalOrder({
          orderId,
          orderNumber: order.orderNumber,
          amount,
          currency,
          description: `Supreme Autoparts Order ${order.orderNumber}`,
          returnUrl,
          cancelUrl,
        });

        const approveLink = result.links.find((l) => l.rel === "payer-action" || l.rel === "approve");
        if (!approveLink) {
          log(ctx, "error", "paypal", "create_session_failed", "No approve link from PayPal", result, undefined, orderId);
          return res.status(500).json({ error: "PayPal did not return an approval URL" });
        }

        const tx: StoredTransaction = {
          id: crypto.randomUUID(),
          orderId,
          orderNumber: order.orderNumber,
          provider: "paypal",
          providerTransactionId: result.id,
          amount,
          currency,
          status: "pending",
          customerEmail: order.customerEmail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: { paypal_order_id: result.id },
        };
        ctx.transactions.set(tx.id, tx);
        ctx.saveTransactions();

        log(ctx, "info", "paypal", "session_created", `PayPal session created for ${order.orderNumber}`, { paypalOrderId: result.id }, tx.id, orderId);
        return res.json({ checkoutUrl: approveLink.href, transactionId: tx.id });
      }

      if (provider === "stripe") {
        const successUrl = `${base}/api/payments/callback/stripe?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${base}/payment/cancelled`;

        const currency = ctx.settings.currency || "KES";
        const result = await createStripeSession({
          orderId,
          orderNumber: order.orderNumber,
          amount: order.total,
          currency,
          description: `Supreme Autoparts Order ${order.orderNumber}`,
          customerEmail: order.customerEmail,
          successUrl,
          cancelUrl,
        });

        const tx: StoredTransaction = {
          id: crypto.randomUUID(),
          orderId,
          orderNumber: order.orderNumber,
          provider: "stripe",
          providerTransactionId: result.id,
          amount: order.total,
          currency,
          status: "pending",
          customerEmail: order.customerEmail,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          metadata: { stripe_session_id: result.id },
        };
        ctx.transactions.set(tx.id, tx);
        ctx.saveTransactions();

        log(ctx, "info", "stripe", "session_created", `Stripe session created for ${order.orderNumber}`, { sessionId: result.id }, tx.id, orderId);
        return res.json({ checkoutUrl: result.url, transactionId: tx.id });
      }

      return res.status(400).json({ error: `Unknown provider: ${provider}` });
    } catch (err: any) {
      log(ctx, "error", provider, "create_session_error", err.message, { stack: err.stack }, undefined, orderId);
      return res.status(500).json({ error: `Payment initialization failed: ${err.message}` });
    }
  });

  // ── Pesapal Callback (user redirect after payment) ─────────────────────────
  app.get("/api/payments/callback/pesapal", async (req: Request, res: Response) => {
    const { OrderTrackingId, OrderMerchantReference } = req.query as Record<string, string>;

    log(ctx, "info", "pesapal", "callback_received", "Pesapal callback received", { OrderTrackingId, OrderMerchantReference });

    if (!OrderTrackingId) {
      return res.redirect(`${base}/payment/failed?reason=missing_tracking_id`);
    }

    try {
      const status = await getPesapalTransactionStatus(OrderTrackingId);
      const internalStatus = mapPesapalStatus(status.status_code);

      // Find transaction by tracking ID
      const tx = Array.from(ctx.transactions.values()).find(
        (t) => t.provider === "pesapal" && (t.metadata?.order_tracking_id === OrderTrackingId || t.orderId === OrderMerchantReference)
      );

      if (tx) {
        tx.status = internalStatus;
        tx.updatedAt = new Date().toISOString();
        tx.metadata = { ...tx.metadata, pesapal_status: status };
        ctx.transactions.set(tx.id, tx);
        ctx.saveTransactions();

        if (internalStatus === "completed") {
          const order = ctx.orders.get(tx.orderId);
          if (order && order.paymentStatus !== "paid") {
            order.paymentStatus = "paid";
            order.paidAt = new Date().toISOString();
            order.status = "processing";
            order.paymentMethod = "pesapal";
            ctx.orders.set(order.id, order);
            ctx.saveOrders();
          }
        }

        log(ctx, "info", "pesapal", "callback_processed", `Payment ${internalStatus} for ${tx.orderNumber}`, { status }, tx.id, tx.orderId);
      }

      if (internalStatus === "completed") {
        return res.redirect(`${base}/payment/success?order=${OrderMerchantReference}&provider=pesapal`);
      } else if (internalStatus === "cancelled") {
        return res.redirect(`${base}/payment/cancelled?order=${OrderMerchantReference}`);
      } else if (internalStatus === "failed") {
        return res.redirect(`${base}/payment/failed?order=${OrderMerchantReference}&provider=pesapal`);
      } else {
        return res.redirect(`${base}/payment/pending?order=${OrderMerchantReference}&provider=pesapal`);
      }
    } catch (err: any) {
      log(ctx, "error", "pesapal", "callback_error", err.message, { stack: err.stack });
      return res.redirect(`${base}/payment/failed?reason=verification_error`);
    }
  });

  // ── Pesapal IPN Webhook ────────────────────────────────────────────────────
  app.get("/api/payments/webhook/pesapal", async (req: Request, res: Response) => {
    const { OrderTrackingId, OrderMerchantReference, OrderNotificationType } = req.query as Record<string, string>;

    log(ctx, "info", "pesapal", "ipn_received", "Pesapal IPN received", { OrderTrackingId, OrderMerchantReference, OrderNotificationType });

    // Pesapal IPN expects a specific response format
    res.json({ orderNotificationType: OrderNotificationType, orderTrackingId: OrderTrackingId, orderMerchantReference: OrderMerchantReference, status: "200" });

    // Process asynchronously after responding
    if (!OrderTrackingId) return;

    try {
      const status = await getPesapalTransactionStatus(OrderTrackingId);
      const internalStatus = mapPesapalStatus(status.status_code);

      const tx = Array.from(ctx.transactions.values()).find(
        (t) => t.provider === "pesapal" && t.metadata?.order_tracking_id === OrderTrackingId
      );

      if (tx) {
        // Prevent duplicate processing
        if (tx.status === "completed" && internalStatus === "completed") {
          log(ctx, "info", "pesapal", "ipn_duplicate", "Duplicate IPN for completed transaction", { OrderTrackingId }, tx.id, tx.orderId);
          return;
        }

        tx.status = internalStatus;
        tx.updatedAt = new Date().toISOString();
        tx.metadata = { ...tx.metadata, pesapal_ipn_status: status };
        ctx.transactions.set(tx.id, tx);
        ctx.saveTransactions();

        if (internalStatus === "completed") {
          const order = ctx.orders.get(tx.orderId);
          if (order && order.paymentStatus !== "paid") {
            order.paymentStatus = "paid";
            order.paidAt = new Date().toISOString();
            order.status = "processing";
            order.paymentMethod = "pesapal";
            ctx.orders.set(order.id, order);
            ctx.saveOrders();
            log(ctx, "info", "pesapal", "ipn_payment_confirmed", `Order ${tx.orderNumber} marked as paid via IPN`, {}, tx.id, tx.orderId);
          }
        }
      }
    } catch (err: any) {
      log(ctx, "error", "pesapal", "ipn_error", err.message, { stack: err.stack });
    }
  });

  // ── PayPal Callback ────────────────────────────────────────────────────────
  app.get("/api/payments/callback/paypal", async (req: Request, res: Response) => {
    const { token: paypalOrderId } = req.query as Record<string, string>;

    log(ctx, "info", "paypal", "callback_received", "PayPal callback received", { paypalOrderId });

    if (!paypalOrderId) {
      return res.redirect(`${base}/payment/failed?reason=missing_token`);
    }

    try {
      const capture = await capturePayPalOrder(paypalOrderId);
      const internalStatus = mapPayPalStatus(capture.status);

      const tx = Array.from(ctx.transactions.values()).find(
        (t) => t.provider === "paypal" && t.metadata?.paypal_order_id === paypalOrderId
      );

      if (tx) {
        tx.status = internalStatus;
        tx.updatedAt = new Date().toISOString();
        tx.metadata = { ...tx.metadata, paypal_capture: capture };
        ctx.transactions.set(tx.id, tx);
        ctx.saveTransactions();

        if (internalStatus === "completed") {
          const order = ctx.orders.get(tx.orderId);
          if (order && order.paymentStatus !== "paid") {
            order.paymentStatus = "paid";
            order.paidAt = new Date().toISOString();
            order.status = "processing";
            order.paymentMethod = "paypal";
            ctx.orders.set(order.id, order);
            ctx.saveOrders();
          }
        }

        log(ctx, "info", "paypal", "callback_processed", `Payment ${internalStatus} for ${tx.orderNumber}`, { status: capture.status }, tx.id, tx.orderId);

        if (internalStatus === "completed") {
          return res.redirect(`${base}/payment/success?order=${tx.orderNumber}&provider=paypal`);
        }
      }

      return res.redirect(`${base}/payment/failed?reason=capture_failed`);
    } catch (err: any) {
      log(ctx, "error", "paypal", "callback_error", err.message, { stack: err.stack });
      return res.redirect(`${base}/payment/failed?reason=capture_error`);
    }
  });

  // ── PayPal Webhook ─────────────────────────────────────────────────────────
  app.post("/api/payments/webhook/paypal", express_raw_middleware(), async (req: any, res: Response) => {
    const rawBody = req.rawBody || req.body;
    const headers: Record<string, string> = {};
    for (const key of ["paypal-auth-algo", "paypal-cert-url", "paypal-transmission-id", "paypal-transmission-sig", "paypal-transmission-time"]) {
      if (req.headers[key]) headers[key] = req.headers[key] as string;
    }

    log(ctx, "info", "paypal", "webhook_received", "PayPal webhook received", { event_type: req.body?.event_type });

    try {
      const rawStr = typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody);
      const valid = await verifyPayPalWebhook(headers, rawStr);
      if (!valid) {
        log(ctx, "warn", "paypal", "webhook_invalid_signature", "PayPal webhook signature invalid");
        return res.status(400).json({ error: "Invalid webhook signature" });
      }

      const event = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;
      const eventType = event.event_type;

      if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
        const paypalOrderId = event.resource?.supplementary_data?.related_ids?.order_id;
        const tx = Array.from(ctx.transactions.values()).find(
          (t) => t.provider === "paypal" && t.metadata?.paypal_order_id === paypalOrderId
        );

        if (tx && tx.status !== "completed") {
          tx.status = "completed";
          tx.updatedAt = new Date().toISOString();
          tx.metadata = { ...tx.metadata, paypal_webhook_event: event };
          ctx.transactions.set(tx.id, tx);
          ctx.saveTransactions();

          const order = ctx.orders.get(tx.orderId);
          if (order && order.paymentStatus !== "paid") {
            order.paymentStatus = "paid";
            order.paidAt = new Date().toISOString();
            order.status = "processing";
            order.paymentMethod = "paypal";
            ctx.orders.set(order.id, order);
            ctx.saveOrders();
          }
          log(ctx, "info", "paypal", "webhook_payment_confirmed", `Order ${tx.orderNumber} paid via webhook`, {}, tx.id, tx.orderId);
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      log(ctx, "error", "paypal", "webhook_error", err.message, { stack: err.stack });
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // ── Stripe Callback ────────────────────────────────────────────────────────
  app.get("/api/payments/callback/stripe", async (req: Request, res: Response) => {
    const { session_id } = req.query as Record<string, string>;

    log(ctx, "info", "stripe", "callback_received", "Stripe callback received", { session_id });

    if (!session_id) {
      return res.redirect(`${base}/payment/failed?reason=missing_session`);
    }

    try {
      const session = await retrieveStripeSession(session_id);
      const internalStatus = mapStripeStatus(session.payment_status);
      const orderId = session.metadata?.order_id;
      const orderNumber = session.metadata?.order_number;

      const tx = Array.from(ctx.transactions.values()).find(
        (t) => t.provider === "stripe" && t.metadata?.stripe_session_id === session_id
      );

      if (tx) {
        tx.status = internalStatus;
        tx.updatedAt = new Date().toISOString();
        tx.metadata = { ...tx.metadata, stripe_session: { id: session.id, payment_status: session.payment_status, status: session.status } };
        ctx.transactions.set(tx.id, tx);
        ctx.saveTransactions();

        if (internalStatus === "completed") {
          const order = ctx.orders.get(tx.orderId);
          if (order && order.paymentStatus !== "paid") {
            order.paymentStatus = "paid";
            order.paidAt = new Date().toISOString();
            order.status = "processing";
            order.paymentMethod = "stripe";
            ctx.orders.set(order.id, order);
            ctx.saveOrders();
          }
        }
        log(ctx, "info", "stripe", "callback_processed", `Payment ${internalStatus} for ${tx.orderNumber}`, {}, tx.id, tx.orderId);
      }

      if (internalStatus === "completed") {
        return res.redirect(`${base}/payment/success?order=${orderNumber}&provider=stripe`);
      } else {
        return res.redirect(`${base}/payment/pending?order=${orderNumber}&provider=stripe`);
      }
    } catch (err: any) {
      log(ctx, "error", "stripe", "callback_error", err.message, { stack: err.stack });
      return res.redirect(`${base}/payment/failed?reason=session_error`);
    }
  });

  // ── Stripe Webhook ─────────────────────────────────────────────────────────
  app.post("/api/payments/webhook/stripe", express_raw_middleware(), async (req: any, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const rawBody = req.rawBody || req.body;
    const secret = process.env.STRIPE_WEBHOOK_SECRET || "";

    log(ctx, "info", "stripe", "webhook_received", "Stripe webhook received");

    try {
      const rawBuf = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody));
      const { event, valid } = verifyStripeWebhook(rawBuf, signature || "", secret);

      if (!valid) {
        log(ctx, "warn", "stripe", "webhook_invalid_signature", "Stripe webhook signature invalid");
        return res.status(400).json({ error: "Invalid webhook signature" });
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const sessionId = session.id;
        const internalStatus = mapStripeStatus(session.payment_status);

        const tx = Array.from(ctx.transactions.values()).find(
          (t) => t.provider === "stripe" && t.metadata?.stripe_session_id === sessionId
        );

        if (tx && tx.status !== "completed") {
          tx.status = internalStatus;
          tx.updatedAt = new Date().toISOString();
          tx.metadata = { ...tx.metadata, stripe_webhook_event: { type: event.type, session_id: sessionId, payment_status: session.payment_status } };
          ctx.transactions.set(tx.id, tx);
          ctx.saveTransactions();

          if (internalStatus === "completed") {
            const order = ctx.orders.get(tx.orderId);
            if (order && order.paymentStatus !== "paid") {
              order.paymentStatus = "paid";
              order.paidAt = new Date().toISOString();
              order.status = "processing";
              order.paymentMethod = "stripe";
              ctx.orders.set(order.id, order);
              ctx.saveOrders();
              log(ctx, "info", "stripe", "webhook_payment_confirmed", `Order ${tx.orderNumber} paid via webhook`, {}, tx.id, tx.orderId);
            }
          }
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      log(ctx, "error", "stripe", "webhook_error", err.message, { stack: err.stack });
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // ── Admin: Get Transactions ────────────────────────────────────────────────
  app.get("/api/admin/transactions", ctx.adminAuthMiddleware, (_req: any, res: Response) => {
    const txList = Array.from(ctx.transactions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(txList);
  });

  // ── Admin: Get Payment Logs ────────────────────────────────────────────────
  app.get("/api/admin/payment-logs", ctx.adminAuthMiddleware, (req: any, res: Response) => {
    const { provider, level, limit = "100" } = req.query as Record<string, string>;
    let logs = Array.from(ctx.paymentLogs.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    if (provider) logs = logs.filter((l) => l.provider === provider);
    if (level) logs = logs.filter((l) => l.level === level);
    res.json(logs.slice(0, parseInt(limit)));
  });

  // ── Admin: Get Payment Provider Settings ──────────────────────────────────
  app.get("/api/admin/payment-settings", ctx.adminAuthMiddleware, (_req: any, res: Response) => {
    const ps = getProviderSettings(ctx.settings);
    res.json({
      providers: ps,
      credentials: {
        pesapal: {
          hasKey: !!process.env.PESAPAL_CONSUMER_KEY,
          hasSecret: !!process.env.PESAPAL_CONSUMER_SECRET,
          hasIpnId: !!process.env.PESAPAL_IPN_ID,
          env: process.env.PESAPAL_ENV || "sandbox",
        },
        paypal: {
          hasClientId: !!process.env.PAYPAL_CLIENT_ID,
          hasSecret: !!process.env.PAYPAL_CLIENT_SECRET,
          hasWebhookId: !!process.env.PAYPAL_WEBHOOK_ID,
          env: process.env.PAYPAL_ENV || "sandbox",
        },
        stripe: {
          hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
          hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
          env: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "live" : "test",
        },
      },
    });
  });

  // ── Admin: Update Payment Provider Settings ───────────────────────────────
  app.put("/api/admin/payment-settings", ctx.adminAuthMiddleware, (req: any, res: Response) => {
    const { providers } = req.body;
    if (!providers) return res.status(400).json({ error: "providers required" });

    if (!ctx.settings.paymentProviders) {
      ctx.settings.paymentProviders = {
        pesapal: { enabled: false, env: "sandbox" },
        paypal: { enabled: false, env: "sandbox" },
        stripe: { enabled: false, env: "test" },
      };
    }

    for (const p of ["pesapal", "paypal", "stripe"] as const) {
      if (providers[p] !== undefined) {
        ctx.settings.paymentProviders[p] = {
          ...ctx.settings.paymentProviders[p],
          ...providers[p],
        };
      }
    }

    ctx.saveSettings();
    res.json({ success: true, providers: ctx.settings.paymentProviders });
  });

  // ── Admin: Register Pesapal IPN ────────────────────────────────────────────
  app.post("/api/admin/pesapal/register-ipn", ctx.adminAuthMiddleware, async (_req: any, res: Response) => {
    try {
      const ipnUrl = `${base}/api/payments/webhook/pesapal`;
      const ipnId = await registerIPN(ipnUrl);
      log(ctx, "info", "pesapal", "ipn_registered", `IPN registered: ${ipnId}`, { ipnUrl });
      res.json({ success: true, ipnId, ipnUrl, message: `Set PESAPAL_IPN_ID=${ipnId} in Railway environment variables` });
    } catch (err: any) {
      log(ctx, "error", "pesapal", "ipn_registration_failed", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  // ── Public: Get transaction status by order ID ────────────────────────────
  app.get("/api/payments/status/:orderId", ctx.authMiddleware, (req: any, res: Response) => {
    const { orderId } = req.params;
    const order = ctx.orders.get(orderId);
    if (!order || order.userId !== req.userId) {
      return res.status(404).json({ error: "Order not found" });
    }

    const txList = Array.from(ctx.transactions.values())
      .filter((t) => t.orderId === orderId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      orderId,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      transactions: txList.map((t) => ({
        id: t.id,
        provider: t.provider,
        status: t.status,
        amount: t.amount,
        currency: t.currency,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
    });
  });

  console.log("✅ Payment routes registered");
}

// ─── Raw body middleware helper for webhooks ──────────────────────────────────
// This is a no-op placeholder; actual raw body capture is handled in server/index.ts
function express_raw_middleware() {
  return (_req: any, _res: Response, next: Function) => next();
}
