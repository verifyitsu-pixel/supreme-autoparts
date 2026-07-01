# How to Connect Your Manus Website to supremeautoparts.co.ke on HostAfrica

## Step 1: Get Your Manus Domain

Your Manus website is hosted at a domain like `supreme-autoparts.manus.space`. You need to point your **supremeautoparts.co.ke** domain to this Manus hosting.

---

## Step 2: Connect in Manus Management UI

1. Go to your Manus project **Supreme Autoparts**
2. Open the **Management UI** panel (click the "Settings" or gear icon)
3. Navigate to **Settings → Domains**
4. Click **"Bind Existing Custom Domain"** or **"Add Domain"**
5. Enter your domain: **supremeautoparts.co.ke**
6. Manus will provide you with DNS records (usually a CNAME or A record)

---

## Step 3: Configure DNS in HostAfrica

1. Log into your **HostAfrica cPanel** at `https://your-hosting-hostafrica.com/cpanel`
2. Go to **Domains → Zone Editor** (or **DNS Zone Editor**)
3. Select your domain **supremeautoparts.co.ke**
4. **Delete or edit** the existing A record pointing to HostAfrica's default IP
5. **Add a CNAME record** (or A record) as provided by Manus:
   - **Type**: CNAME
   - **Name**: `@` or `supremeautoparts.co.ke`
   - **Value/Target**: The domain Manus gives you (e.g., `supreme-autoparts.manus.space`)

   **OR** if Manus provides an A record:
   - **Type**: A
   - **Name**: `@`
   - **Value**: The IP address Manus provides

6. For **www** subdomain, add:
   - **Type**: CNAME
   - **Name**: `www`
   - **Value/Target**: The same Manus domain

7. **Save** all changes

---

## Step 4: Wait for DNS Propagation

- DNS changes typically take **1–48 hours** to propagate globally
- You can check propagation status at: https://dnschecker.org/
- Enter `supremeautoparts.co.ke` to see if it resolves to your Manus site

---

## Step 5: Enable SSL (HTTPS)

- Manus typically provides **free SSL certificates** automatically
- Once your domain is connected and propagated, HTTPS should work automatically
- If not, check the **Domains** section in Manus Management UI for SSL settings

---

## Alternative: If HostAfrica Doesn't Allow CNAME for Root Domain

If HostAfrica doesn't allow a CNAME record on the root domain (`supremeautoparts.co.ke`):

1. Use an **A record** instead with the IP address provided by Manus
2. Or use **ALIAS/ANAME record** if your DNS provider supports it
3. Contact **HostAfrica support** and ask them to update the DNS records for you

---

## Quick Contact Info

| Item | Detail |
|------|--------|
| **Manus Support** | https://help.manus.im |
| **HostAfrica Support** | https://hostafrica.com/support |
| **DNS Checker** | https://dnschecker.org |
