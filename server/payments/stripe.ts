/**
 * Stripe Payment Service
 * Uses Stripe Checkout Sessions API
 * Docs: https://stripe.com/docs/api/checkout/sessions
 */

import crypto from "crypto";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

function getStripeKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe not configured (STRIPE_SECRET_KEY)");
  return key;
}

async function stripeRequest<T>(
  path: string,
  method: "GET" | "POST",
  body?: Record<string, string | number | boolean | string[]>
): Promise<T> {
  const key = getStripeKey();

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2024-06-20",
    },
  };

  if (body && method === "POST") {
    options.body = new URLSearchParams(
      Object.entries(body).map(([k, v]) => [k, String(v)])
    ).toString();
  }

  const res = await fetch(`${STRIPE_API_BASE}${path}`, options);

  if (!res.ok) {
    const data = await res.json();
    throw new Error(`Stripe error: ${data.error?.message || res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ─── Create Checkout Session ──────────────────────────────────────────────────
export interface StripeSessionRequest {
  orderId: string;
  orderNumber: string;
  amount: number; // in smallest currency unit (e.g. cents for USD, or whole KES)
  currency: string;
  description: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeSessionResponse {
  id: string;
  url: string;
  payment_status: string;
  status: string;
  metadata?: Record<string, string>;
}

export async function createStripeSession(
  req: StripeSessionRequest
): Promise<StripeSessionResponse> {
  // Stripe requires amount in smallest currency unit
  // KES does not have sub-units so amount = amount * 100 would be wrong for KES
  // KES is a zero-decimal currency in Stripe
  const zeroDecimalCurrencies = ["bif", "clp", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "kes"];
  const isZeroDecimal = zeroDecimalCurrencies.includes(req.currency.toLowerCase());
  const unitAmount = isZeroDecimal ? Math.round(req.amount) : Math.round(req.amount * 100);

  const params: Record<string, string | number | boolean | string[]> = {
    "payment_method_types[0]": "card",
    "line_items[0][price_data][currency]": req.currency.toLowerCase(),
    "line_items[0][price_data][product_data][name]": `Order ${req.orderNumber}`,
    "line_items[0][price_data][product_data][description]": req.description,
    "line_items[0][price_data][unit_amount]": unitAmount,
    "line_items[0][quantity]": 1,
    mode: "payment",
    success_url: req.successUrl,
    cancel_url: req.cancelUrl,
    "metadata[order_id]": req.orderId,
    "metadata[order_number]": req.orderNumber,
  };

  if (req.customerEmail) {
    params["customer_email"] = req.customerEmail;
  }

  return stripeRequest<StripeSessionResponse>("/checkout/sessions", "POST", params);
}

// ─── Retrieve Session ─────────────────────────────────────────────────────────
export async function retrieveStripeSession(
  sessionId: string
): Promise<StripeSessionResponse & { metadata: Record<string, string> }> {
  return stripeRequest(`/checkout/sessions/${sessionId}`, "GET");
}

// ─── Verify Webhook Signature ─────────────────────────────────────────────────
export function verifyStripeWebhook(
  rawBody: Buffer | string,
  signature: string,
  webhookSecret: string
): { event: any; valid: boolean } {
  try {
    const secret = webhookSecret || process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) {
      console.warn("[Stripe] STRIPE_WEBHOOK_SECRET not set; skipping signature verification");
      return { event: JSON.parse(rawBody.toString()), valid: true };
    }

    const parts = signature.split(",");
    const timestamp = parts.find(p => p.startsWith("t="))?.split("=")[1];
    const v1 = parts.find(p => p.startsWith("v1="))?.split("=")[1];

    if (!timestamp || !v1) {
      return { event: null, valid: false };
    }

    // Verify timestamp is within 5 minutes
    const tolerance = 5 * 60;
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - parseInt(timestamp)) > tolerance) {
      console.warn("[Stripe] Webhook timestamp too old");
      return { event: null, valid: false };
    }

    const signedPayload = `${timestamp}.${rawBody.toString()}`;
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(v1, "hex"), Buffer.from(expectedSig, "hex"))) {
      return { event: null, valid: false };
    }

    return { event: JSON.parse(rawBody.toString()), valid: true };
  } catch (err) {
    console.error("[Stripe] Webhook verification error:", err);
    return { event: null, valid: false };
  }
}

// ─── Map Stripe Status ────────────────────────────────────────────────────────
export function mapStripeStatus(
  paymentStatus: string
): "pending" | "completed" | "failed" | "cancelled" {
  if (paymentStatus === "paid") return "completed";
  if (paymentStatus === "unpaid") return "pending";
  if (paymentStatus === "no_payment_required") return "completed";
  return "pending";
}
