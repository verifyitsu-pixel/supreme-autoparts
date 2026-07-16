# Supreme Autoparts

Modern Next.js storefront for Supreme Autoparts, rebuilt from the Parts Central information architecture with new branding.

## Run locally

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and set the canonical production domain. The site includes reusable category and make routes, responsive navigation, quote and support experiences, metadata, JSON-LD, sitemap and robots configuration.

## Production integrations

Connect the contact endpoint to your CRM or transactional email provider before launch. Add payment-provider hosted links rather than collecting card details directly. Replace placeholder editorial photography with the final owned image library and have legal copy reviewed before publishing.

## Catalog audit

The public reference-site crawl is stored in `catalog-audit.json`. The normalized dataset contains 230 product types, 33 makes and 19 categories, generating 7,590 make-specific product routes and 7,872 total catalog routes. All storefront prices are displayed and settled in USD.
