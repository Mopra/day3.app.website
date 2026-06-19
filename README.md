# day3.app — marketing website

The public marketing site for [day3.app](https://day3.app) — _email marketing
without the bloat_. Separate from the product app (which lives at
**go.day3.app** in its own Vercel project / repo).

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (CSS-first `@theme` tokens in `app/globals.css`)
- **shadcn/ui on Base UI** (`@base-ui/react`) primitives in `src/components/ui/`
- **lucide-react** icons · fonts via `next/font/google`
  (Geist for UI/body, Instrument Serif for marketing headlines)

## Design

"Warm Swiss SaaS" — calm, warm, competent, trustworthy. Cream + Espresso +
Caramel palette, generous whitespace, flat surfaces, restrained accents. Tokens
live in [`app/globals.css`](app/globals.css).

## Routes

- `/` — homepage (hero, pricing, the model, product preview, features, CTA)
- `/pricing` — pricing + FAQ
- `/terms`, `/privacy` — lightweight legal stubs

Shared `SiteHeader` / `SiteFooter` are reused across every page.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # production build
```

## Deploy

Hosted on Vercel (project `day3.app.website`, apex domain `day3.app`). Vercel
auto-detects Next.js — no `vercel.json` needed. Push to the default branch to
deploy.

## Before going live — fill in real values

- **Sign-up / log-in URLs** point at `go.day3.app` — confirm the real routes
  (`src/lib/site.ts`).
- **Contact email** `hello@day3.app` must be a working inbox.
- **Footer location** "Copenhagen, Denmark" — replace with the real registered
  business name and full postal mailing address before relying on it for
  anti-spam / SES compliance.
- The `/terms` and `/privacy` pages are stubs — replace with reviewed copy.
