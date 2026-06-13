# day3.app — marketing website

The public teaser site for [day3.app](https://day3.app). Separate from the app
(which lives at **go.day3.app** in its own Vercel project / repo).

- **Single static page** — `index.html`, self-contained (styles inline, no build
  step, no dependencies).
- **Hosting**: a Vercel project on the root domain `day3.app`. Vercel serves the
  static `index.html` automatically; no framework or `vercel.json` needed.
- **Purpose right now**: a teaser, and the public business/sending-practices page
  that supports the Amazon SES production-access request. No signup links yet.

## Deploy

1. Push this repo to GitHub.
2. Create a new Vercel project from it (framework preset: **Other** / static).
3. Add the domain `day3.app` (apex) to the project.

## Before going live — fill in real values

`index.html` contains placeholders to replace with real details (Amazon and
anti-spam law both expect these to be accurate):

- **Contact email** `hello@day3.app` — must be a working inbox; Amazon may use it.
- **Footer location** "Copenhagen, Denmark" — replace with the real registered
  business name and full postal mailing address.
