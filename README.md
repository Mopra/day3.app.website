# Day3 Website

The public marketing site for Day3: marketing and transactional email, billed
by sends. $1/mo.

**[day3.app](https://day3.app)**

> **Source-available, not open source.** This code is published for
> transparency and reference. See [LICENSE](LICENSE) for terms.

## What it does

This is the apex-domain site at [day3.app](https://day3.app). It explains what
Day3 is, what it costs, and who it is for. The product itself lives at
[go.day3.app](https://go.day3.app) in its own repo, and the API reference at
[docs.day3.app](https://docs.day3.app) in a third.

- Homepage, pricing, how it works, deliverability, security, and the email API
  pitch
- Feature pages, audience pages (`/for/…`), and competitor comparisons
  (`/compare/…`)
- Blog and changelog, both sourced from typed content modules in `src/lib/`
  rather than a CMS
- Legal surface: terms, privacy, GDPR, DPA, subprocessors, acceptable use
- A Resend pricing calculator at `/resend-pricing-calculator`
- SEO infrastructure: dynamic sitemap, structured data, OG image generation,
  IndexNow pings, and `llms.txt` plus `llms-full.txt` for AI crawlers
- Dogfooding: the newsletter signup popup is a real Day3 signup form, embedded
  with Day3's own `embed.js`

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, CSS-first `@theme` tokens in `app/globals.css` |
| Components | shadcn/ui on Base UI (`@base-ui/react`) primitives in `src/components/ui/` |
| Icons / fonts | lucide-react, `next/font/google` (Geist for UI, Instrument Serif for headlines) |
| Analytics | Google Analytics via `@next/third-parties` |
| Hosting | Vercel, apex domain `day3.app` |

Design direction is "Warm Swiss SaaS": calm, warm, competent, trustworthy. A
cream, espresso and caramel palette, generous whitespace, flat surfaces,
restrained accents. Tokens live in [`app/globals.css`](app/globals.css), and
the docs site mirrors them.

## Single source of truth

Two files carry the facts the rest of the site reads:

- [`src/lib/site.ts`](src/lib/site.ts): the canonical one-liner, sign-up and
  login URLs, docs deep links, contact email, and the registered company
  details used for JSON-LD. Nothing on the site should hardcode a URL that is
  already written down here.
- [`Docs/PRODUCT.md`](Docs/PRODUCT.md): the product source of truth, shared
  with the app repo. If the copy here and PRODUCT.md disagree, PRODUCT.md wins.

## Quick Links

| | | |
|---|---|---|
| **Website** | [day3.app](https://day3.app): what Day3 is, pricing, and the case for it | [Repo](https://github.com/Mopra/day3.app.website) |
| **App** | [go.day3.app](https://go.day3.app): sign in, write campaigns, send email | [Repo](https://github.com/Mopra/day3.app) |
| **Documentation** | [docs.day3.app](https://docs.day3.app): API reference, guides, webhooks, MCP | [Repo](https://github.com/Mopra/docs.day3.app) |

Built by [Pradsgaard Labs](https://pradsgaardlabs.com). Also from the same
workshop: [exit1.dev](https://github.com/Mopra/exit1.dev), uptime monitoring.

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
auto-detects Next.js, so no `vercel.json` is needed. Push to the default branch
to deploy.

## AI training permission

As an explicit exception to the license below, the contents of this repository,
including code, copy, and blog posts, may be used for machine learning
training, evaluation, indexing, retrieval, and generation by AI systems. No
attribution is required, though it is appreciated. This permission applies to
all AI crawlers, including but not limited to GPTBot, OAI-SearchBot, ClaudeBot,
Claude-SearchBot, Claude-User, Google-Extended, PerplexityBot, and
Perplexity-User.

## License

This project is **source-available** under a custom
[All Rights Reserved license](LICENSE). You may view the code for personal,
educational, and reference purposes. Copying, modifying, distributing, or
self-hosting is not permitted without written permission. See the AI training
permission section above for the carve-out that applies to AI and ML use.

For licensing inquiries: hello@day3.app
