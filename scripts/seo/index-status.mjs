// Index coverage. Asks Search Console what it actually did with every sitemap URL.
//
// Impressions tell you what ranks; this tells you what Google even *has*. A new
// site's real bottleneck is usually "Discovered - currently not indexed", which
// no amount of content work fixes.
//
// Run: npm run seo:index

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GoogleAuth } from 'google-auth-library';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE = process.env.GSC_SITE_URL;
const KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!SITE || !KEY) {
  console.error('\n✖ Need GOOGLE_APPLICATION_CREDENTIALS and GSC_SITE_URL.\n');
  process.exit(1);
}

// sc-domain:day3.app → https://day3.app (the URL Inspection API wants real URLs)
const origin = SITE.startsWith('sc-domain:') ? `https://${SITE.slice(10)}` : SITE.replace(/\/$/, '');

const auth = new GoogleAuth({
  keyFile: KEY,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});
const client = await auth.getClient();
const { token } = await client.getAccessToken();

const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`\n${urls.length} URLs in ${origin}/sitemap.xml, inspecting…\n`);

async function inspect(inspectionUrl) {
  const res = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inspectionUrl, siteUrl: SITE }),
  });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).inspectionResult?.indexStatusResult ?? {};
}

const buckets = new Map();
for (const [i, url] of urls.entries()) {
  // Serial + spaced: the inspection endpoint is heavily rate-limited (~600/min).
  const r = await inspect(url).catch((e) => ({ verdict: 'ERROR', coverageState: e.message }));
  const state = r.coverageState || r.verdict || 'UNKNOWN';
  buckets.set(state, [...(buckets.get(state) || []), url.replace(origin, '') || '/']);
  /*
    A whole-line progress counter rather than a bare dot per URL. The dots were
    written without a newline, so when this script's output was piped or
    redirected the largest bucket's heading ended up appended to the dot line and
    was lost, which made the report unreadable exactly when it was being captured.
  */
  console.log(`[${String(i + 1).padStart(3)}/${urls.length}] ${state}  ${url.replace(origin, '') || '/'}`);
  await new Promise((r) => setTimeout(r, 120));
}

const ordered = [...buckets].sort((a, b) => b[1].length - a[1].length);

const lines = [];
lines.push(`# Index coverage: ${origin}`);
lines.push('');
lines.push(`_${urls.length} sitemap URLs, inspected ${new Date().toISOString().slice(0, 10)}._`);
lines.push('');
lines.push('Impressions tell you what ranks; this tells you what Google even has.');
lines.push('');
for (const [state, list] of ordered) {
  lines.push(`## ${state} (${list.length})`);
  lines.push('');
  for (const u of list) lines.push(`- ${u}`);
  lines.push('');
}

const out = join(__dirname, 'output', `index-${new Date().toISOString().slice(0, 10)}.md`);
writeFileSync(out, lines.join('\n'), 'utf8');

console.log('');
for (const [state, list] of ordered) {
  console.log(`${list.length.toString().padStart(3)}  ${state}`);
}
console.log(`\n✔ Full report written to ${out}`);
