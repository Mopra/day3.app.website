# SEO plan: organic traffic for day3.app

Status: agreed 2026-09-18. Owner: Morten. Review monthly.

## The idea in one line

Own "cheap email for a big list." Skip the head terms the incumbents own and win the long tail where day3's differentiators (billed per send, unlimited subscribers, EU-only) are the query itself.

## Ground rules

- Voice: plain, short, honest. No adjective stacking. Numbers over adjectives.
- Accuracy policy stands: never print a competitor's dollar price. Compare models, not figures. day3 prices always read from the ladder in `src/lib/site.ts`, never hardcoded in copy.
- Never claim a certification day3 does not hold.
- Every page: unique title and description through `buildMetadata`, self-canonical, breadcrumb JSON-LD, FAQ JSON-LD where there is a FAQ, an explicit `updated` date for the sitemap, and at least three internal links through the link mesh in `src/lib/internal-links.ts`.
- New content lives in a `src/lib/*-content.ts` file and renders through one template. No one-off pages.
- Skip generic "how to grow a newsletter" content. Beehiiv and Substack own it.

## Keyword clusters, in priority order

### 1. Pricing pain (highest intent, easiest to rank)

Target queries: mailchimp too expensive, email newsletter pricing per subscriber, cheapest newsletter tool for 10000 subscribers, email marketing cost calculator, pay per email sent newsletter, unlimited subscribers email marketing, newsletter pricing for 5000 / 10000 / 50000 subscribers.

Deliverables:
- [ ] Programmatic pages `/pricing/for/<n>-subscribers` for 1k, 2.5k, 5k, 10k, 25k, 50k, 100k, 250k. Each computes what that list costs on day3 at monthly, twice-monthly, weekly and twice-weekly cadence, read off the ladder. Hub at `/pricing/for`.
- [ ] Interactive cost calculator on `/pricing` (subscribers x sends per month, price from ladder). Same math as the programmatic pages.
- [ ] Guide: "Why email tools charge per subscriber, and what it costs you." Extends the existing per-subscriber vs per-send post.

### 2. Alternatives (extend the six existing pages)

Existing: Resend, Mailchimp, ConvertKit, beehiiv, EmailOctopus, Buttondown.

- [ ] Rename or alias ConvertKit to Kit (`/compare/kit-alternative`, redirect from the old slug). Search is shifting.
- [ ] Add: Substack, MailerLite, Loops, Brevo, Postmark, Mailgun.
- [ ] Every compare page links to the matching `/pricing/for/<n>` page in its worked example.

### 3. EU and GDPR (infra is the differentiator)

Target queries: gdpr compliant newsletter tool, eu hosted email marketing, european alternative to mailchimp, newsletter tool data stored in eu, gdpr email api, email marketing without us data transfer.

Deliverables:
- [ ] Landing page `/eu` or `/for/eu-companies`: EU-only hosting, named sub-processors, DPA on offer, no US transfer. Conversion page, not boilerplate.
- [ ] Guide: "Sending newsletters from the EU: what GDPR actually requires."
- [ ] Guide: "Is Mailchimp GDPR compliant? What you have to do yourself." Fair and factual.

### 4. Transactional plus marketing on one domain

Target queries: send transactional and marketing email same domain, resend alternative with newsletters, email api with newsletter, one email provider for everything.

Deliverables:
- [ ] Strengthen `/email-api` for "email api with newsletters."
- [ ] Guide: "Should transactional and marketing email share a domain?" (exists, expand with subdomain setup).
- [ ] Guide: "Password reset email: template and deliverability checklist."

### 5. Deliverability how-tos (top of funnel, backlink bait)

Existing: SPF/DKIM/DMARC explained, one-click unsubscribe RFC 8058, migrating a list.

- [ ] "Cloudflare email DNS setup: SPF, DKIM, DMARC step by step."
- [ ] "Google and Yahoo bulk sender requirements, current year, checklist."
- [ ] "Why your newsletter goes to spam, and the eight fixes."
- [ ] "DMARC p=none vs quarantine vs reject."
- [ ] "Email bounce codes explained."
- [ ] Keep every guide fresh: bump `updated` only on substantive edits.

### 5b. Lifecycle email for SaaS (new, automations shipped 2026-09-08)

Target queries: welcome email automation for saas, trial onboarding email sequence, drip email tool cheap, lifecycle email api, onboarding emails triggered from code, win-back email flow.

Deliverables:
- [x] Feature page `/features/automations`, in the nav, sitemap, llms.txt and the link mesh. Honest about the early preview label and the Phase 2 gaps.
- [ ] Guide: "A trial onboarding sequence in four emails, with an exit when they pay." Worked example that ends in the enroll endpoint.
- [ ] Guide: "Welcome email timing: send it now, not in the morning." Short, opinionated, links the send-window feature.
- [ ] Once the preview label comes off: rewrite the compare-page "stay if" paragraphs that still hedge on automations, and add day3 to "Customer.io alternative" style queries only if the node set has grown to match.

### 6. Audience pages, one more tier

Existing: startups, indie developers, SaaS.

- [ ] `/for/open-source`: newsletter for an open source project, release announcements.
- [ ] `/for/changelogs`: changelog email tool, product update emails.
- [ ] `/for/agencies` only if inbound asks for it. Otherwise skip.

## Structural work (matters more than any single keyword)

### Backlinks

- [ ] Launch on Product Hunt, Show HN, and the indie directories (Indie Hackers, BetaList, AlternativeTo, SaaSHub, Uneed, There's An AI For That is not relevant).
- [ ] One linkable asset: a public "Newsletter pricing index" comparing 15 tools at five list sizes. Competitor figures need a visible "checked on" date and quarterly review. This is the one exception to the no-competitor-prices rule, and it is only allowed because the date is on the page. Decide before building.
- [ ] Guest posts and podcast mentions in the indie dev space, two per quarter.
- [ ] Get listed on every "alternatives to X" page that accepts submissions.

### Programmatic pages

- [ ] `/pricing/for/<n>-subscribers` (this sprint).
- [ ] Later, if the first set indexes and gets impressions: cadence variants such as `/pricing/for/weekly-newsletter-10000-subscribers`. Only if the data says so. Thin pages hurt.

### Technical

- [x] Sitemap with real lastmod, IndexNow, llms.txt and llms-full.txt.
- [ ] Add new page families to sitemap, llms.txt and the link mesh in the same commit that adds the pages.
- [ ] Search Console: verify, submit sitemap, review queries monthly.
- [ ] Core Web Vitals check on the templated pages after each family ships.

## Measurement

Monthly, from Search Console:
- Impressions and clicks per cluster (group by URL prefix).
- Pages indexed vs pages submitted. If a family is not indexing, fix or cut it.
- Signups by landing page (conversion tracking already in place).

Kill rule: a page family with zero impressions after 90 days gets merged or removed.

## Order of work

1. Programmatic pricing pages plus hub, sitemap, llms.txt, mesh links.
2. Cost calculator on `/pricing`.
3. Kit rename and four new compare pages.
4. EU landing page and two GDPR guides.
5. Deliverability guides, one every two weeks.
6. Audience pages for open source and changelogs.
7. Launch week and the pricing index asset.
