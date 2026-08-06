// Lists every Search Console site and GA4 property the service account can read.
//
// Use it to find the numeric GA4_PROPERTY_ID (the Data API needs that, not the
// G-XXXX measurement id), and to confirm access was granted before running the
// puller. A property missing here means the SA email hasn't been added to it.
//
// Run: npm run seo:properties

import { GoogleAuth } from 'google-auth-library';

const KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!KEY) {
  console.error('\n✖ GOOGLE_APPLICATION_CREDENTIALS is not set (path to service-account JSON key).\n');
  process.exit(1);
}

const auth = new GoogleAuth({
  keyFile: KEY,
  scopes: [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/analytics.readonly',
  ],
});

async function get(url) {
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}\n${await res.text()}`);
  return res.json();
}

// Either API can fail independently (not enabled, no grants), so report both.
async function attempt(label, fn) {
  try {
    return await fn();
  } catch (err) {
    console.log(`\n${label}\n  ✖ ${String(err.message || err).split('\n')[0]}`);
    return null;
  }
}

const { client_email } = JSON.parse(await import('node:fs/promises').then((fs) => fs.readFile(KEY, 'utf8')));
console.log(`\nService account: ${client_email}`);

await attempt('Search Console', async () => {
  const { siteEntry = [] } = await get('https://searchconsole.googleapis.com/webmasters/v3/sites');
  console.log('\nSearch Console sites');
  if (!siteEntry.length) console.log('  (none. Add the SA email under Settings → Users and permissions)');
  for (const s of siteEntry) console.log(`  ${s.siteUrl}  [${s.permissionLevel}]`);
});

await attempt('GA4', async () => {
  const { accountSummaries = [] } = await get('https://analyticsadmin.googleapis.com/v1beta/accountSummaries');
  console.log('\nGA4 properties');
  if (!accountSummaries.length) console.log('  (none. Add the SA email under Admin → Property access management)');
  for (const acc of accountSummaries) {
    console.log(`  ${acc.displayName}`);
    for (const p of acc.propertySummaries || []) {
      // "properties/123456789" → the numeric id GA4_PROPERTY_ID wants
      console.log(`    ${p.property.split('/')[1]}  ${p.displayName}`);
    }
  }
});

console.log('');
