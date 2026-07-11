# Payment Module Architecture Design for Supreme Autoparts

This document outlines the architectural additions required to implement a modular, production-ready payment integration (Pesapal, PayPal, Stripe) into the existing monolithic Express/React stack.

## 1. Backend Architecture Additions

The backend currently uses a single `server/index.ts` file and JSON-file persistence. To maintain the architecture while preventing `index.ts` from becoming unmanageable, we will extract payment logic into dedicated service modules and import them into `index.ts`.

### 1.1 Directory Structure Additions
```
server/
  ├── index.ts
  ├── payments/
  │   ├── index.ts           (Payment Gateway interface/router)
  │   ├── pesapal.ts         (Pesapal service)
  │   ├── paypal.ts          (PayPal service)
  │   └── stripe.ts          (Stripe service)
```

### 1.2 Data Persistence (JSON Store)
We will add a new JSON store: `data/transactions.json` and extend the `StoredSettings` interface.

**`StoredSettings` Extensions (in `settings.json`)**
```typescript
interface StoredSettings {
  // ... existing settings
  paymentProviders: {
    pesapal: { enabled: boolean; env: 'sandbox' | 'live' };
    paypal: { enabled: boolean; env: 'sandbox' | 'live' };
    stripe: { enabled: boolean; env: 'test' | 'live' };
  }
}
```

**New `StoredTransaction` Interface**
```typescript
interface StoredTransaction {
  id: string;
  orderId: string;
  provider: "pesapal" | "paypal" | "stripe";
  providerTransactionId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  metadata?: any; // For webhook payloads, error messages, etc.
}
```

### 1.3 Environment Variables (Railway)
```env
# Pesapal
PESAPAL_CONSUMER_KEY=
PESAPAL_CONSUMER_SECRET=
PESAPAL_IPN_ID=

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_WEBHOOK_ID=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App Base URL (required for webhooks/redirects)
APP_BASE_URL=https://supreme-autoparts.up.railway.app
```

## 2. API Routes to Add (`server/index.ts`)

1. **`POST /api/payments/create`**
   - Triggered by frontend checkout.
   - Accepts `orderId` and `provider`.
   - Returns a `checkoutUrl` or `sessionId` for frontend redirection.

2. **`GET /api/payments/callback/:provider`**
   - User redirect target after payment completion.
   - Verifies status, updates order/transaction, redirects to frontend success/failure page.

3. **`POST /api/payments/webhook/:provider`**
   - Server-to-server webhook endpoint for async payment updates.
   - Validates signatures (Stripe) or fetches status (Pesapal IPN).

4. **`GET /api/admin/transactions`**
   - Admin route to fetch transaction history.

## 3. Frontend Architecture Additions

### 3.1 Checkout Modifications (`client/src/pages/CheckoutNew.tsx`)
- Update the "Payment" step to display enabled providers fetched from `GET /api/settings/public`.
- On submit, call `POST /api/payments/create` and redirect the user to the provider's hosted checkout page (or render Stripe/PayPal elements if needed, but hosted checkout is cleaner and safer).

### 3.2 Payment Result Pages
- `client/src/pages/PaymentSuccess.tsx`
- `client/src/pages/PaymentFailed.tsx`

### 3.3 Admin Configuration (`client/src/pages/AdminDashboard.tsx`)
- Add a new "Payments" section (or extend "Settings").
- Toggles for Pesapal, PayPal, Stripe.
- Display transaction history table.

## 4. Payment Provider Workflows

### 4.1 Pesapal (OAuth 2.0 API 3.0)
1. Get OAuth token using Key/Secret.
2. Register IPN URL (if not configured).
3. Submit Order Request -> Get `redirect_url`.
4. User pays on Pesapal.
5. Pesapal redirects to Callback URL.
6. Pesapal sends IPN webhook.
7. Server calls `GetTransactionStatus` to verify.

### 4.2 PayPal (Checkout V2 API)
1. Get Access Token.
2. Create Order -> Get `approve` link.
3. User approves on PayPal.
4. User redirected to Callback URL.
5. Server calls `CaptureOrder` to finalize payment.

### 4.3 Stripe (Checkout Sessions API)
1. Create Checkout Session -> Get `url`.
2. User pays on Stripe.
3. User redirected to Callback URL.
4. Stripe sends `checkout.session.completed` webhook.
5. Server verifies webhook signature and updates DB.
