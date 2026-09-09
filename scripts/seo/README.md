# SEO data puller

Pulls **Google Search Console** + **GA4** data for `day3.app` via a service account and writes
an opportunities report to `scripts/seo/output/` (gitignored).

The report is built around *what to do*, not raw rows:

- **Brand collision vs category demand**: the split to read first, see below
- **Category queries**: the real signal, with brand collisions removed
- **Striking distance**: queries ranking 5 to 20 with real impressions (push to page 1)
- **Title/meta rewrites**: high impressions but CTR below what the position should earn
- **Content gaps**: demand exists but only the homepage ranks, or the best page sits past #15 (build/strengthen a page)
- **Movers**: biggest click swings vs the previous equal window
- **Top queries / pages** and **GA4 channels / landing pages** for context

## Two things that will mislead you if you forget them

**1. Most impressions are not ours.** "day3" reads as a date, and there is an unrelated
BPO called Daythree. Over a recent 90-day window, 859 of 912 impressions were queries
meant for something else, which drags site-wide CTR to ~0.7% while the pages ranking for
real questions sit in a normal range. The report splits this out and lists the category
queries separately; **track the category row, not the total.** The pattern lives in
`BRAND_NOISE` in `pull-seo.mjs`, and the opportunity lists all exclude it. Their
impression thresholds are deliberately low (2 to 10) because real category demand here is
single-digit impressions per query.

**2. The GSC property covers every subdomain.** `sc-domain:day3.app` includes the app at
`go.day3.app`, whose auth pages were ~27% of all impressions and showed up in "top pages"
as `/login` and `/sign-up` once the origin was stripped. Page-level data is filtered to
`day3.app` by default; set `SEO_HOST=all` to see everything, or `SEO_HOST=go.day3.app` to
look at the app on its own.

## Setup

This project reuses the service account from `exit1.dev.website`:
`seo-reader@exit1-dev.iam.gserviceaccount.com` (key already copied to `.keys/`, gitignored).
A service account can read any property it is granted on. The GCP project it lives in is
irrelevant. So the only work is granting it access to day3's two properties.

### 1. Grant read access

- **Search Console** (search.google.com/search-console) → the `day3.app` property →
  **Settings → Users and permissions → Add user** → paste the SA email → **Restricted** is enough.
- **GA4** (analytics.google.com) → **Admin → Property access management → +** →
  paste the SA email → **Viewer**.

### 2. Get the GA4 numeric property ID

`GA4_PROPERTY_ID` is a number like `123456789`, *not* the `G-JJJ6E2LDX8` measurement id.

```
npm run seo:properties
```

lists every GSC site and GA4 property the key can see. It also doubles as an access check:
if a property isn't listed, step 1 didn't take.

> The GA4 half needs the **Google Analytics Admin API** enabled in the `exit1-dev` project,
> it currently isn't. Enable it at
> console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=exit1-dev,
> or skip the script and read the id from **GA4 → Admin → Property details**.

### 3. Fill in `.env.local`

```
GOOGLE_APPLICATION_CREDENTIALS=scripts/seo/.keys/seo-reader.json
GSC_SITE_URL=sc-domain:day3.app
GA4_PROPERTY_ID=123456789
# optional
SEO_DAYS=28
SEO_COUNTRY=usa
SEO_HOST=day3.app
```

> `GSC_SITE_URL` is `sc-domain:day3.app` for a Domain property, or the exact URL-prefix
> (e.g. `https://day3.app/`) if that's how the property was added in Search Console.

## Run

```
npm run seo
```

Writes `scripts/seo/output/seo-YYYY-MM-DD.md` and prints a summary. Either source is optional;
set only `GSC_SITE_URL` or only `GA4_PROPERTY_ID` to pull just one.

### Index coverage

```
npm run seo:index
```

Asks Search Console what it actually did with every sitemap URL and writes
`output/index-YYYY-MM-DD.md`. This is the one that catches the problems no amount of
content work fixes. As of 2026-09-09: 39 indexed, `/pricing` and `/compare` **unknown to
Google**, `/deliverability` discovered but not indexed. Two of the three commercial hubs
have never been crawled while every leaf page beneath them is indexed, which is a
crawl-budget symptom on a low-authority domain, not a config bug: all three are in the
nav, in the sitemap, return 200, and carry correct canonicals.

Takes a few minutes; the inspection endpoint is rate-limited and this calls it serially.

### IndexNow (Bing, Yandex, Seznam, Naver)

```
npm run seo:indexnow                        # everything in the sitemap
npm run seo:indexnow -- /pricing /compare   # just the paths you changed
```

Pushes URLs instead of waiting to be crawled. Google ignores IndexNow, so this is not a
fix for the pages above, but it is free everywhere else, and Bing is what several AI
answer engines index from, a channel that already shows day3's best engagement rate.

The key lives in `src/lib/indexnow.ts` and must be served as `public/<key>.txt` containing
exactly the key. The script verifies that file is live before submitting, because
otherwise IndexNow rejects the whole batch with a bare 403. Prefer passing the specific
paths you touched: re-submitting unchanged URLs at volume is discouraged.

## Note on the shared key

The same private key now lives in two repos. If it's ever leaked or rotated, both
`exit1.dev.website` and this project break, and it grants read access to every property
it's been added to. If that blast radius stops being acceptable, mint a `day3` service
account in its own GCP project and swap the file in `.keys/`. Nothing else changes.
