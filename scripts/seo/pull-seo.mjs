// SEO data puller: Google Search Console + GA4, via a service account.
//
// Reads from both REST APIs, then surfaces *actionable* opportunities
// (striking-distance queries, low-CTR titles, content gaps, page trends)
// rather than dumping raw rows. Writes a markdown report to ./output/.
//
// Run: npm run seo            (loads vars from .env.local via package.json)
//   or: node --env-file=.env.local scripts/seo/pull-seo.mjs
//
// Required env:
//   GOOGLE_APPLICATION_CREDENTIALS  path to the service-account JSON key
//   GSC_SITE_URL                    e.g. "sc-domain:day3.app" or "https://day3.app/"
//   GA4_PROPERTY_ID                 numeric GA4 property id (NOT the G-XXXX measurement id).
//                                   Run `npm run seo:properties` to find it.
// Optional env:
//   SEO_DAYS        lookback window in days (default 28)
//   SEO_COUNTRY     ISO-3 filter for GSC, e.g. "usa" (default: all)
//   SEO_HOST        hostname to report on (default "day3.app"). The GSC property
//                   is `sc-domain:day3.app`, which covers every subdomain, so the
//                   app (go.day3.app) lands in the same dataset as the marketing
//                   site. Set to "all" to disable the filter.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { GoogleAuth } from 'google-auth-library';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE = process.env.GSC_SITE_URL;
const GA4 = process.env.GA4_PROPERTY_ID;
const KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const DAYS = Number(process.env.SEO_DAYS || 28);
const COUNTRY = process.env.SEO_COUNTRY?.toLowerCase();
const HOST = (process.env.SEO_HOST || 'day3.app').toLowerCase();

/*
  Brand-collision queries.

  "day3" reads as a date, and there is an unrelated BPO called Daythree, so the
  bulk of what this property records is other people's brand. Over a recent 90d
  window that was 859 of 912 impressions, which is enough to swamp every average
  in the report: it is why site CTR reads ~0.7% while the pages that rank for
  real questions sit in a normal range.

  These are separated rather than deleted. Knowing the split is the point, and
  the raw totals stay visible directly above it.
*/
const BRAND_NOISE = new RegExp(
  [
    // "day3", "day 3", "day-3", "days3", "days 3", "day30", "dayc-3", "d3day"
    String.raw`day\w{0,2}\s*-?\s*\d`,
    String.raw`d\d\s*day`,
    String.raw`daydream`,
    // Spelled-out and misspelled forms of the colliding company name
    String.raw`day\s*-?\s*(three|iii|tre|tree|tronic)`,
    String.raw`daythree`,
    // Other brands whose logins land on this property
    String.raw`day(la|mark)`,
    // Transliterations and typos that only ever mean one of the above
    String.raw`dia\s*3`,
    String.raw`daiya`,
    String.raw`daycheek`,
    String.raw`daye3`,
  ].join('|'),
  'i',
);

const isBrandNoise = (q) => BRAND_NOISE.test(q);

if (!KEY) fail('GOOGLE_APPLICATION_CREDENTIALS is not set (path to service-account JSON key).');
if (!SITE && !GA4) fail('Set GSC_SITE_URL and/or GA4_PROPERTY_ID. Nothing to pull.');

function fail(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

// --- date helpers (no Date.now in module scope is fine here; this is a CLI) ---
function isoDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}
const END = isoDaysAgo(2); // GSC data lags ~2 days
const START = isoDaysAgo(2 + DAYS);
const PREV_END = isoDaysAgo(2 + DAYS);
const PREV_START = isoDaysAgo(2 + DAYS * 2);

const auth = new GoogleAuth({
  keyFile: KEY,
  scopes: [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/analytics.readonly',
  ],
});

async function token() {
  const client = await auth.getClient();
  const { token } = await client.getAccessToken();
  return token;
}

async function api(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${await token()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText} on ${url}\n${text}`);
  }
  return res.json();
}

// --------------------------- Search Console ---------------------------

async function gscQuery(dimensions, { start = START, end = END, rowLimit = 1000 } = {}) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    SITE,
  )}/searchAnalytics/query`;
  const body = { startDate: start, endDate: end, dimensions, rowLimit };
  if (COUNTRY) body.dimensionFilterGroups = [{ filters: [{ dimension: 'country', expression: COUNTRY }] }];
  const data = await api(url, body);
  const rows = data.rows || [];
  if (HOST === 'all') return rows;
  /*
    Filter by hostname where the response carries a page dimension. Doing it here
    rather than in each analysis means the totals, the top-query tables and the
    opportunity lists all describe the same site. Query-only queries have no page
    to filter on and are left alone; the host split is reported separately.
  */
  const pageIndex = dimensions.indexOf('page');
  if (pageIndex === -1) return rows;
  return rows.filter((r) => {
    try {
      return new URL(r.keys[pageIndex]).host === HOST;
    } catch {
      return true;
    }
  });
}

// Rough "expected CTR by position" curve, used to flag titles that underperform
// for where they actually rank. Industry-typical desktop+mobile blend.
function expectedCtr(pos) {
  const table = [0, 0.28, 0.15, 0.1, 0.07, 0.05, 0.04, 0.033, 0.028, 0.024, 0.021];
  if (pos <= 10) return table[Math.round(pos)] ?? 0.02;
  if (pos <= 20) return 0.012;
  return 0.006;
}

async function analyzeGsc() {
  const [queries, pages, prevQueries, queryPages] = await Promise.all([
    gscQuery(['query']),
    gscQuery(['page']),
    gscQuery(['query'], { start: PREV_START, end: PREV_END }),
    gscQuery(['query', 'page']),
  ]);

  const prevByQuery = new Map(prevQueries.map((r) => [r.keys[0], r]));

  /*
    The three opportunity lists below all exclude brand-collision queries, and
    their impression thresholds are set for the volume this site actually has.

    The old thresholds (30 and 100 impressions) were calibrated for a site with
    traffic. Here only the collision queries ever cleared them, so "striking
    distance" reported the single row "day3" and the CTR list came back empty
    every run, while the genuine category queries the guides are earning sat one
    or two orders of magnitude below the cut and never appeared at all.
  */
  const category = queries.filter((r) => !isBrandNoise(r.keys[0]));

  // Striking distance: ranking 5 to 20 with real impressions → small push = page 1.
  const striking = category
    .filter((r) => r.position >= 4.5 && r.position <= 20 && r.impressions >= 2)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 40);

  // Title/meta opportunities: enough impressions, CTR well below expected for position.
  const lowCtr = category
    .filter((r) => r.impressions >= 10 && r.position <= 15 && r.ctr < expectedCtr(r.position) * 0.6)
    .map((r) => ({ ...r, gap: expectedCtr(r.position) - r.ctr }))
    .sort((a, b) => b.impressions * b.gap - a.impressions * a.gap)
    .slice(0, 30);

  // Movers: biggest click swings vs the previous equal-length window.
  const movers = queries
    .map((r) => {
      const prev = prevByQuery.get(r.keys[0]);
      return { ...r, delta: r.clicks - (prev?.clicks || 0), prevClicks: prev?.clicks || 0 };
    })
    .filter((r) => Math.abs(r.delta) >= 3)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 25);

  // Content gaps: demand exists but coverage is weak. A query is a gap when it
  // pulls real impressions yet either (a) only the homepage/root ranks for it,
  // with no dedicated page, or (b) its best page sits past position 15. These are
  // candidates for a *new* page or a serious strengthening of the matched one.
  const bestPageByQuery = new Map();
  for (const r of queryPages) {
    const [q, page] = r.keys;
    const prev = bestPageByQuery.get(q);
    if (!prev || r.position < prev.position) bestPageByQuery.set(q, { ...r, page });
  }
  const path = (u) => u.replace(/^https?:\/\/[^/]+/, '') || '/';
  const isRoot = (u) => path(u) === '/' || /^\/\?/.test(path(u));
  const gaps = [...bestPageByQuery.values()]
    /*
      Brand queries are excluded. The homepage ranking for the company's own name
      is correct, not a missing page, and this rule used to report "day3" as the
      single largest content gap on the site every run.
    */
    .filter((r) => !isBrandNoise(r.keys[0]))
    .filter((r) => r.impressions >= 3 && (isRoot(r.page) || r.position > 15) && r.clicks <= 2)
    .map((r) => ({
      query: r.keys[0],
      impressions: r.impressions,
      position: r.position,
      page: path(r.page),
      reason: isRoot(r.page) ? 'no dedicated page (only root ranks)' : 'weak coverage (rank > 15)',
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 30);

  const sum = (rows) =>
    rows.reduce(
      (t, r) => ({ clicks: t.clicks + r.clicks, impressions: t.impressions + r.impressions }),
      { clicks: 0, impressions: 0 },
    );

  return {
    totals: sum(queries),
    // The split that decides how to read every other number in the report.
    brandSplit: { brand: sum(queries.filter((r) => isBrandNoise(r.keys[0]))), category: sum(category) },
    topCategoryQueries: category.sort((a, b) => b.impressions - a.impressions).slice(0, 30),
    topQueries: queries.sort((a, b) => b.clicks - a.clicks).slice(0, 25),
    topPages: pages.sort((a, b) => b.clicks - a.clicks).slice(0, 25),
    striking,
    lowCtr,
    movers,
    gaps,
  };
}

// ------------------------------- GA4 ----------------------------------

async function ga4Report(body) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4}:runReport`;
  return api(url, body);
}

function ga4Rows(report, metricNames) {
  return (report.rows || []).map((row) => {
    const o = { dim: row.dimensionValues.map((d) => d.value) };
    metricNames.forEach((m, i) => (o[m] = Number(row.metricValues[i]?.value || 0)));
    return o;
  });
}

async function analyzeGa4() {
  const range = [{ startDate: START, endDate: END }];

  const [landing, channels] = await Promise.all([
    ga4Report({
      dateRanges: range,
      dimensions: [{ name: 'landingPagePlusQueryString' }],
      metrics: [
        { name: 'sessions' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
        { name: 'keyEvents' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 30,
    }),
    ga4Report({
      dateRanges: range,
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'engagementRate' }, { name: 'keyEvents' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 15,
    }),
  ]);

  return {
    landing: ga4Rows(landing, ['sessions', 'engagementRate', 'avgDuration', 'keyEvents']),
    channels: ga4Rows(channels, ['sessions', 'engagementRate', 'keyEvents']),
  };
}

// ----------------------------- reporting ------------------------------

const pct = (n) => `${(n * 100).toFixed(1)}%`;
const pos = (n) => n.toFixed(1);
const num = (n) => Math.round(n).toLocaleString('en-US');

function table(headers, rows) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
}

function buildReport(gsc, ga4) {
  const lines = [];
  lines.push(`# SEO report: ${START} → ${END} (${DAYS}d${COUNTRY ? `, ${COUNTRY.toUpperCase()}` : ''})`);
  lines.push('');
  lines.push(
    HOST === 'all'
      ? '_All hostnames in the property, including the app subdomain._'
      : `_Page-level data filtered to \`${HOST}\`. The GSC property covers every subdomain, so the app would otherwise be mixed in; set SEO_HOST=all to see everything._`,
  );
  lines.push('');

  if (gsc) {
    lines.push('## Search Console');
    lines.push('');
    lines.push(
      `**Totals:** ${num(gsc.totals.clicks)} clicks · ${num(gsc.totals.impressions)} impressions · ` +
        `${pct(gsc.totals.clicks / Math.max(1, gsc.totals.impressions))} CTR`,
    );
    lines.push('');

    /*
      Reported before anything else, because the site-wide CTR above is close to
      meaningless on its own: it is an average over queries meant for a different
      company. The category row is the one to track over time.
    */
    const { brand, category } = gsc.brandSplit;
    const brandShare = brand.impressions / Math.max(1, gsc.totals.impressions);
    lines.push('### Brand collision vs real category demand');
    lines.push('');
    lines.push(
      `"day3" reads as a date and collides with an unrelated company (Daythree). ` +
        `Queries matching that pattern are split out here; **${pct(brandShare)} of impressions** are collision traffic.`,
    );
    lines.push('');
    lines.push(
      table(
        ['Segment', 'Clicks', 'Impr', 'CTR'],
        [
          ['Brand collision', num(brand.clicks), num(brand.impressions), pct(brand.clicks / Math.max(1, brand.impressions))],
          ['Real category demand', num(category.clicks), num(category.impressions), pct(category.clicks / Math.max(1, category.impressions))],
        ],
      ),
    );
    lines.push('');

    lines.push('### Category queries (the real signal)');
    lines.push('Brand collisions removed. This is the list that should grow.');
    lines.push('');
    lines.push(
      table(
        ['Query', 'Impr', 'Clicks', 'Pos'],
        gsc.topCategoryQueries.map((r) => [r.keys[0], num(r.impressions), num(r.clicks), pos(r.position)]),
      ),
    );
    lines.push('');

    lines.push('### 🎯 Striking distance (rank 5 to 20, push these to page 1)');
    lines.push('Closest wins: already visible, small ranking gains convert to real traffic.');
    lines.push('');
    lines.push(
      table(
        ['Query', 'Pos', 'Impr', 'Clicks', 'CTR'],
        gsc.striking.map((r) => [r.keys[0], pos(r.position), num(r.impressions), num(r.clicks), pct(r.ctr)]),
      ),
    );
    lines.push('');

    lines.push('### ✍️ Title/meta rewrites (high impressions, CTR below expected for position)');
    lines.push('You already rank. A better title/description steals clicks without new content.');
    lines.push('');
    lines.push(
      table(
        ['Query', 'Pos', 'Impr', 'CTR', 'Expected'],
        gsc.lowCtr.map((r) => [r.keys[0], pos(r.position), num(r.impressions), pct(r.ctr), pct(expectedCtr(r.position))]),
      ),
    );
    lines.push('');

    lines.push('### 🧩 Content gaps (demand exists, coverage is weak)');
    lines.push('Real impressions, but only the homepage ranks or the best page sits past #15. Candidates for a new page or a serious rewrite of the matched one.');
    lines.push('');
    lines.push(
      table(
        ['Query', 'Impr', 'Pos', 'Best page', 'Why'],
        gsc.gaps.map((r) => [r.query, num(r.impressions), pos(r.position), r.page, r.reason]),
      ),
    );
    lines.push('');

    lines.push(`### 📈 Movers vs previous ${DAYS}d`);
    lines.push('');
    lines.push(
      table(
        ['Query', 'Δ Clicks', 'Now', 'Before', 'Pos'],
        gsc.movers.map((r) => [r.keys[0], (r.delta > 0 ? '+' : '') + r.delta, num(r.clicks), num(r.prevClicks), pos(r.position)]),
      ),
    );
    lines.push('');

    lines.push('### Top queries');
    lines.push('');
    lines.push(
      table(
        ['Query', 'Clicks', 'Impr', 'CTR', 'Pos'],
        gsc.topQueries.map((r) => [r.keys[0], num(r.clicks), num(r.impressions), pct(r.ctr), pos(r.position)]),
      ),
    );
    lines.push('');

    lines.push('### Top pages');
    lines.push('');
    lines.push(
      table(
        ['Page', 'Clicks', 'Impr', 'CTR', 'Pos'],
        gsc.topPages.map((r) => [r.keys[0].replace(/^https?:\/\/[^/]+/, ''), num(r.clicks), num(r.impressions), pct(r.ctr), pos(r.position)]),
      ),
    );
    lines.push('');
  }

  if (ga4) {
    lines.push('## GA4');
    lines.push('');
    lines.push('### Channels');
    lines.push('');
    lines.push(
      table(
        ['Channel', 'Sessions', 'Engagement', 'Key events'],
        ga4.channels.map((r) => [r.dim[0], num(r.sessions), pct(r.engagementRate), num(r.keyEvents)]),
      ),
    );
    lines.push('');
    lines.push('### Top landing pages');
    lines.push('');
    lines.push(
      table(
        ['Landing page', 'Sessions', 'Engagement', 'Avg dur (s)', 'Key events'],
        ga4.landing.map((r) => [r.dim[0], num(r.sessions), pct(r.engagementRate), Math.round(r.avgDuration), num(r.keyEvents)]),
      ),
    );
    lines.push('');
  }

  return lines.join('\n');
}

// ------------------------------- main ---------------------------------

(async () => {
  try {
    const gsc = SITE ? await analyzeGsc() : null;
    const ga4 = GA4 ? await analyzeGa4() : null;

    const report = buildReport(gsc, ga4);
    const out = join(__dirname, 'output', `seo-${END}.md`);
    writeFileSync(out, report, 'utf8');

    console.log(report.split('\n').slice(0, 6).join('\n'));
    console.log(`\n✔ Full report written to ${out}`);
    if (gsc)
      console.log(
        `  ${gsc.striking.length} striking-distance · ${gsc.lowCtr.length} CTR opportunities · ${gsc.gaps.length} content gaps`,
      );
  } catch (err) {
    fail(err.message || String(err));
  }
})();
