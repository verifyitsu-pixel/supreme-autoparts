# Supreme Autoparts Payment Integration Documentation

This document outlines the setup, configuration, testing, and deployment instructions for the newly integrated multi-provider payment module.

## 1. Railway Environment Variables

To enable the payment gateways in production, you must add the following environment variables in your Railway project settings.

### Base Configuration
- `APP_BASE_URL`: Your production URL (e.g., `https://supremeautoparts.co.ke`). This is required for webhooks and callbacks to route correctly back to your server.

### Pesapal
- `PESAPAL_ENV`: Set to `live` for production or `sandbox` for testing.
- `PESAPAL_CONSUMER_KEY`: Your Pesapal API Consumer Key.
- `PESAPAL_CONSUMER_SECRET`: Your Pesapal API Consumer Secret.
- `PESAPAL_IPN_ID`: The registered IPN ID. (You can generate this easily by clicking the "Register IPN URL" button in your new Admin Dashboard > Payments section).

### PayPal
- `PAYPAL_ENV`: Set to `live` for production or `sandbox` for testing.
- `PAYPAL_CLIENT_ID`: Your PayPal REST API Client ID.
- `PAYPAL_CLIENT_SECRET`: Your PayPal REST API Secret.
- `PAYPAL_WEBHOOK_ID`: The Webhook ID generated when you register your webhook in the PayPal Developer Dashboard.

### Stripe
- `STRIPE_SECRET_KEY`: Your Stripe Secret Key (starts with `sk_live_` or `sk_test_`).
- `STRIPE_WEBHOOK_SECRET`: Your Stripe Webhook Signing Secret (starts with `whsec_`).

---

## 2. Obtaining API Keys

### Pesapal
1. Log in to your Pesapal Merchant Dashboard (or sandbox.pesapal.com for testing).
2. Navigate to **Account Settings > API Credentials**.
3. Copy the **Consumer Key** and **Consumer Secret**.

### PayPal
1. Log in to the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).
2. Navigate to **Apps & Credentials**.
3. Create a new App (or select an existing one).
4. Copy the **Client ID** and **Secret**.

### Stripe
1. Log in to the [Stripe Dashboard](https://dashboard.stripe.com/).
2. Navigate to the **Developers** section.
3. Click on **API keys**.
4. Copy the **Secret key**.

---

## 3. Webhook and Callback URLs

You must register the following URLs with each respective provider to ensure payments are verified automatically.

### Pesapal
- **Callback URL:** `https://your-domain.com/api/payments/callback/pesapal` (Used for user redirects after payment).
- **IPN URL:** `https://your-domain.com/api/payments/webhook/pesapal` (Used for server-to-server status updates).
  > **Tip:** You do not need to register the IPN manually. Go to your **Admin Dashboard > Payments**, ensure your Key and Secret are set, and click **"Register IPN URL"**. It will give you the `PESAPAL_IPN_ID` to save in Railway.

### PayPal
- **Return URL:** `https://your-domain.com/api/payments/callback/paypal`
- **Webhook URL:** `https://your-domain.com/api/payments/webhook/paypal`
  > When creating the Webhook in the PayPal Developer Dashboard, select the `Payment capture completed` event. Save the generated Webhook ID to your `PAYPAL_WEBHOOK_ID` environment variable.

### Stripe
- **Success URL:** `https://your-domain.com/api/payments/callback/stripe`
- **Webhook URL:** `https://your-domain.com/api/payments/webhook/stripe`
  > When creating the Webhook in the Stripe Dashboard, select the `checkout.session.completed` event. Copy the "Signing secret" to your `STRIPE_WEBHOOK_SECRET` environment variable.

---

## 4. Database "Migrations"

The existing architecture uses JSON file stores (`data/*.json`). The payment module seamlessly integrates with this pattern without requiring SQL migrations. 

The following new stores will be automatically created in the `data/` directory upon the first transaction:
- `transactions.json`: Stores all payment sessions, provider transaction IDs, amounts, and statuses.
- `payment_logs.json`: A rolling log (max 1000 entries) of all payment events, errors, and webhook receptions for easy debugging via the Admin Dashboard.

The existing `settings.json` has been extended to store the `enabled` state of each provider.

---

## 5. Testing with Sandbox Accounts

### Pesapal
1. Set `PESAPAL_ENV=sandbox` in Railway.
2. Use keys from `cybqa.pesapal.com/pesapalv3`.
3. Test using a dummy mobile number and the provided test PINs in the Pesapal Sandbox environment.

### PayPal
1. Set `PAYPAL_ENV=sandbox` in Railway.
2. In the PayPal Developer Dashboard, go to **Testing Tools > Sandbox Accounts**.
3. Create a Personal (Buyer) account.
4. During checkout, log in with the Sandbox Buyer credentials to complete the mock payment.

### Stripe
1. Use keys starting with `sk_test_`.
2. During checkout, use Stripe's test card numbers (e.g., `4242 4242 4242 4242` with any future date and CVC).

---

## 6. Switching to Production

1. Update your Railway Environment Variables to use the Live API keys for all providers.
2. Change `PESAPAL_ENV` to `live`.
3. Change `PAYPAL_ENV` to `live`.
4. Register the production Webhook URLs in the live dashboards of PayPal and Stripe, and update `PAYPAL_WEBHOOK_ID` and `STRIPE_WEBHOOK_SECRET`.
5. For Pesapal, click the **"Register IPN URL"** button again in the Admin Dashboard (while live keys are active) to generate a live `PESAPAL_IPN_ID`. Update this in Railway.
6. Restart the Railway deployment to apply the new environment variables.

---

## 7. Deployment Checklist

- [ ] Code has been pushed to the `main` branch.
- [ ] Railway deployment triggered and built successfully.
- [ ] `APP_BASE_URL` environment variable is set correctly in Railway.
- [ ] Live API keys added to Railway environment variables.
- [ ] Live Webhooks registered in provider dashboards.
- [ ] Pesapal IPN registered via Admin Dashboard and `PESAPAL_IPN_ID` saved to Railway.
- [ ] In the Admin Dashboard > Payments section, toggle the desired payment providers to **Enabled**.
- [ ] Perform a $1 / KES 10 test transaction on production to verify the full flow (Checkout -> Redirect -> Payment -> Callback -> Webhook -> Order marked as Paid).
