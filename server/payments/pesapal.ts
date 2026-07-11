/**
 * Pesapal Payment Service
 * Uses Pesapal API 3.0 (OAuth 2.0)
 * Docs: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/api-reference
 */

import crypto from "crypto";

const PESAPAL_BASE_SANDBOX = "https://cybqa.pesapal.com/pesapalv3";
const PESAPAL_BASE_LIVE = "https://pay.pesapal.com/v3";

export interface PesapalOrderRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  description: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  callbackUrl: string;
  cancellationUrl: string;
  ipnId: string;
}

export interface PesapalOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error?: { code: string; message: string };
  status?: string;
}

export interface PesapalTransactionStatus {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: string;
  description: string;
  message: string;
  payment_account: string;
  call_back_url: string;
  status_code: number;
  merchant_reference: string;
  payment_status_code: string;
  currency: string;
  error?: { code: string; message: string };
  status?: string;
}

// ─── Token Cache ──────────────────────────────────────────────────────────────
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

function getBaseUrl(): string {
  const env = process.env.PESAPAL_ENV || "sandbox";
  return env === "live" ? PESAPAL_BASE_LIVE : PESAPAL_BASE_SANDBOX;
}

export async function getPesapalToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;

  const key = process.env.PESAPAL_CONSUMER_KEY;
  const secret = process.env.PESAPAL_CONSUMER_SECRET;

  if (!key || !secret) {
    throw new Error("Pesapal credentials not configured (PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET)");
  }

  const base = getBaseUrl();
  const res = await fetch(`${base}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ consumer_key: key, consumer_secret: secret }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pesapal auth failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  if (!data.token) throw new Error(`Pesapal auth: no token in response`);

  cachedToken = data.token as string;
  // Tokens are valid for 5 minutes; cache for 4 minutes to be safe
  tokenExpiry = now + 4 * 60 * 1000;
  return cachedToken;
}

// ─── Register IPN URL ─────────────────────────────────────────────────────────
export async function registerIPN(ipnUrl: string): Promise<string> {
  const token = await getPesapalToken();
  const base = getBaseUrl();

  const res = await fetch(`${base}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url: ipnUrl, ipn_notification_type: "GET" }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pesapal IPN registration failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  if (!data.ipn_id) throw new Error("Pesapal IPN registration: no ipn_id returned");
  return data.ipn_id as string;
}

// ─── Submit Order ─────────────────────────────────────────────────────────────
export async function submitPesapalOrder(req: PesapalOrderRequest): Promise<PesapalOrderResponse> {
  const token = await getPesapalToken();
  const base = getBaseUrl();

  const ipnId = process.env.PESAPAL_IPN_ID;
  if (!ipnId) {
    throw new Error("PESAPAL_IPN_ID not configured. Register your IPN URL first.");
  }

  const nameParts = (req.firstName && req.lastName)
    ? { first_name: req.firstName, last_name: req.lastName }
    : { first_name: req.email.split("@")[0], last_name: "Customer" };

  const payload = {
    id: req.orderId,
    currency: req.currency || "KES",
    amount: req.amount,
    description: req.description,
    callback_url: req.callbackUrl,
    cancellation_url: req.cancellationUrl,
    notification_id: ipnId,
    billing_address: {
      email_address: req.email,
      phone_number: req.phone || "",
      ...nameParts,
    },
  };

  const res = await fetch(`${base}/api/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pesapal order submission failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<PesapalOrderResponse>;
}

// ─── Get Transaction Status ───────────────────────────────────────────────────
export async function getPesapalTransactionStatus(
  orderTrackingId: string
): Promise<PesapalTransactionStatus> {
  const token = await getPesapalToken();
  const base = getBaseUrl();

  const res = await fetch(
    `${base}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pesapal status check failed: ${res.status} ${text}`);
  }

  return res.json() as Promise<PesapalTransactionStatus>;
}

// ─── Map Pesapal Status to Internal Status ────────────────────────────────────
export function mapPesapalStatus(
  statusCode: number | string
): "pending" | "completed" | "failed" | "cancelled" {
  const code = String(statusCode);
  if (code === "1") return "completed";
  if (code === "0") return "pending";
  if (code === "2") return "failed";
  if (code === "3") return "cancelled";
  return "pending";
}
