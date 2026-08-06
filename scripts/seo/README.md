# SEO data puller

Pulls **Google Search Console** + **GA4** data for `day3.app` via a service account and writes
an opportunities report to `scripts/seo/output/` (gitignored).

The report is built around *what to do*, not raw rows:

- **Striking distance**: queries ranking 5–20 with real impressions (push to page 1)
- **Title/meta rewrites**: high impressions but CTR below what the position should earn
- **Content gaps**: demand exists but only the homepage ranks, or the best page sits past #15 (build/strengthen a page)
- **Movers**: biggest click swings vs the previous equal window
- **Top queries / pages** and **GA4 channels / landing pages** for context

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
```

> `GSC_SITE_URL` is `sc-domain:day3.app` for a Domain property, or the exact URL-prefix
> (e.g. `https://day3.app/`) if that's how the property was added in Search Console.

## Run

```
npm run seo
```

Writes `scripts/seo/output/seo-YYYY-MM-DD.md` and prints a summary. Either source is optional;
set only `GSC_SITE_URL` or only `GA4_PROPERTY_ID` to pull just one.

## Note on the shared key

The same private key now lives in two repos. If it's ever leaked or rotated, both
`exit1.dev.website` and this project break, and it grants read access to every property
it's been added to. If that blast radius stops being acceptable, mint a `day3` service
account in its own GCP project and swap the file in `.keys/`. Nothing else changes.
