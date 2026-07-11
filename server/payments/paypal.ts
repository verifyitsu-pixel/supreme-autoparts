/**
 * PayPal Payment Service
 * Uses PayPal Checkout Orders API v2
 * Docs: https://developer.paypal.com/docs/api/orders/v2/
 */

const PAYPAL_BASE_SANDBOX = "https://api-m.sandbox.paypal.com";
const PAYPAL_BASE_LIVE = "https://api-m.paypal.com";

// ─── Token Cache ──────────────────────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

function getBaseUrl(): string {
  const env = process.env.PAYPAL_ENV || "sandbox";
  return env === "live" ? PAYPAL_BASE_LIVE : PAYPAL_BASE_SANDBOX;
}

export async function getPayPalToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const base = getBaseUrl();

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  if (!data.access_token) throw new Error("PayPal auth: no access_token in response");

  cachedToken = data.access_token as string;
  // Typically valid for 32400 seconds; cache for 8 hours
  tokenExpiry = now + (data.expires_in ? (data.expires_in - 60) * 1000 : 8 * 60 * 60 * 1000);
  return cachedToken;
}

// ─── Create Order ─────────────────────────────────────────────────────────────
export interface PayPalOrderRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{ href: string; rel: string; method: string }>;
}

export async function createPayPalOrder(req: PayPalOrderRequest): Promise<PayPalOrderResponse> {
  const token = await getPayPalToken();
  const base = getBaseUrl();

  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: req.orderId,
        description: req.description,
        custom_id: req.orderNumber,
        amount: {
          currency_code: req.currency || "USD",
          value: req.amount.toFixed(2),
        },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
          brand_name: "Supreme Autoparts",
          locale: "en-US",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: req.returnUrl,
          cancel_url: req.cancelUrl,
        },
      },
    },
  };

  const res = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "PayPal-Request-Id": `sa-${req.orderId}-${Date.now()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal create order failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<PayPalOrderResponse>;
}

// ─── Capture Order ────────────────────────────────────────────────────────────
export interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    reference_id: string;
    payments: {
      captures: Array<{
        id: string;
        status: string;
        amount: { currency_code: string; value: string };
      }>;
    };
  }>;
  payer?: {
    email_address?: string;
    payer_id?: string;
  };
}

export async function capturePayPalOrder(paypalOrderId: string): Promise<PayPalCaptureResponse> {
  const token = await getPayPalToken();
  const base = getBaseUrl();

  const res = await fetch(`${base}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal capture failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<PayPalCaptureResponse>;
}

// ─── Verify Webhook Signature ─────────────────────────────────────────────────
export async function verifyPayPalWebhook(
  headers: Record<string, string>,
  rawBody: string
): Promise<boolean> {
  const token = await getPayPalToken();
  const base = getBaseUrl();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    console.warn("[PayPal] PAYPAL_WEBHOOK_ID not set; skipping webhook verification");
    return true; // Permissive fallback for initial setup
  }

  const payload = {
    auth_algo: headers["paypal-auth-algo"],
    cert_url: headers["paypal-cert-url"],
    transmission_id: headers["paypal-transmission-id"],
    transmission_sig: headers["paypal-transmission-sig"],
    transmission_time: headers["paypal-transmission-time"],
    webhook_id: webhookId,
    webhook_event: JSON.parse(rawBody),
  };

  const res = await fetch(`${base}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.verification_status === "SUCCESS";
}

// ─── Map PayPal Status ────────────────────────────────────────────────────────
export function mapPayPalStatus(
  status: string
): "pending" | "completed" | "failed" | "cancelled" {
  if (status === "COMPLETED") return "completed";
  if (status === "VOIDED" || status === "DECLINED") return "failed";
  return "pending";
}
