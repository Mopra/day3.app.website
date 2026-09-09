// IndexNow submitter. Pushes the sitemap's URLs to Bing/Yandex/Seznam/Naver.
//
// Google ignores IndexNow, so this is not a fix for the "unknown to Google"
// pages; it is the free half of the problem. Bing is also what several AI answer
// engines index from, and AI referrals are already day3's best-engaging channel.
//
// Run: npm run seo:indexnow            (everything in the sitemap)
//   or: npm run seo:indexnow -- /pricing /compare      (just these paths)
//
// Safe to re-run. IndexNow is idempotent; re-submitting an unchanged URL is a
// no-op at the far end, not a penalty. Submitting URLs that have not changed at
// a high rate is discouraged though, so prefer passing the paths you touched.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const ORIGIN = 'https://day3.app';
const HOST = new URL(ORIGIN).host;

/*
  Read the key from the source of truth rather than restating it, so rotating it
  in one place cannot leave this script pushing a dead key.
*/
function readKey() {
  const src = readFileSync(join(__dirname, '..', '..', 'src', 'lib', 'indexnow.ts'), 'utf8');
  const match = src.match(/INDEXNOW_KEY = "([0-9a-f]{8,128})"/);
  if (!match) fail('Could not read INDEXNOW_KEY from src/lib/indexnow.ts.');
  return match[1];
}

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

const KEY = readKey();

/*
  IndexNow rejects the whole batch with 403 when the key file is not reachable,
  and the error gives no hint as to why. Checking first turns a silent, confusing
  failure into a sentence that says what to do.
*/
async function assertKeyFileLive() {
  const url = `${ORIGIN}/${KEY}.txt`;
  const res = await fetch(url);
  if (!res.ok) {
    fail(
      `Key file is not live at ${url} (HTTP ${res.status}).\n` +
        `  Create public/${KEY}.txt containing exactly the key, then deploy before submitting.`,
    );
  }
  const body = (await res.text()).trim();
  if (body !== KEY) {
    fail(`Key file at ${url} contains "${body.slice(0, 40)}", expected "${KEY}".`);
  }
  console.log(`✔ Key file verified at ${url}`);
}

async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) fail(`Could not fetch ${ORIGIN}/sitemap.xml (HTTP ${res.status}).`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function submit(urlList) {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, urlList }),
  });
  const text = await res.text();
  return { status: res.status, ok: res.ok, text };
}

(async () => {
  await assertKeyFileLive();

  // Explicit paths win; otherwise submit the whole sitemap.
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const urlList = args.length
    ? args.map((p) => new URL(p, ORIGIN).toString())
    : await sitemapUrls();

  if (!urlList.length) fail('Nothing to submit.');

  console.log(`\nSubmitting ${urlList.length} URL(s) for ${HOST}:`);
  for (const u of urlList) console.log(`  ${u.replace(ORIGIN, '') || '/'}`);

  const { status, ok, text } = await submit(urlList);
  if (ok) {
    // 200 = accepted, 202 = accepted but key validation pending.
    console.log(`\n✔ IndexNow accepted the batch (HTTP ${status}).`);
    if (status === 202) console.log('  202 means validation is still pending; this is normal on a first submit.');
  } else {
    fail(`IndexNow returned HTTP ${status}.\n${text.slice(0, 400)}`);
  }
})();
