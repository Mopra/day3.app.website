import type { Metadata } from "next";

import { ProviderPricingPage } from "@/components/marketing/provider-pricing-page";
import { buildMetadata } from "@/lib/seo";
import { formatCount, formatUsd } from "@/lib/resend-comparison";
import {
  MAILERLITE_API_IMPORT_LIVE,
  MAILERLITE_FREE_LIMIT,
  MAILERLITE_FREE_SENDS,
  MAILERLITE_MAX_PUBLISHED,
  MAILERLITE_PRICING_URL,
  MAILERLITE_VERIFIED_ON,
  mailerliteModel,
  mailerliteTiers,
  mailerliteWorkedScenarios,
} from "@/lib/mailerlite-comparison";

const PATH = "/mailerlite-pricing-calculator";

export const metadata: Metadata = buildMetadata({
  title: "MailerLite pricing calculator: MailerLite vs day3",
  description:
    "What your list costs on MailerLite's published Comfort and Power prices against day3's per-send price. A MailerLite alternative with unlimited subscribers.",
  path: PATH,
  ogEyebrow: "Pricing calculator",
  ogTitle: "MailerLite or day3? Move the slider.",
  keywords: [
    "mailerlite pricing calculator",
    "mailerlite pricing",
    "mailerlite alternative",
    "cheaper than mailerlite",
    "mailerlite price increase",
    "mailerlite vs day3",
  ],
});

// Read live off the snapshot, so the copy can never disagree with the table.
const tier = (max: number) => mailerliteTiers.find((t) => t.max === max)!;
const comfort10k = tier(10_000).comfort;
const comfort100k = tier(100_000).comfort;
const comfort25kYearly = mailerliteModel.cost(25_000, 100_000, "yearly").priceUsd ?? 0;

const faqs = [
  {
    q: "How much does MailerLite cost?",
    a: `On ${MAILERLITE_VERIFIED_ON}, MailerLite's own pricing page listed Free for up to ${formatCount(MAILERLITE_FREE_LIMIT)} subscribers and ${formatCount(MAILERLITE_FREE_SENDS)} emails a month, then Comfort from $12/mo and Power from $25/mo on monthly billing, both rising with your list. A 10,000-subscriber list was ${formatUsd(comfort10k)}/mo on Comfort; 100,000 was ${formatUsd(comfort100k)}/mo. Yearly billing takes 10% off. Above ${formatCount(MAILERLITE_MAX_PUBLISHED)} subscribers it's Enterprise, priced by sales.`,
  },
  {
    q: "Is day3 cheaper than MailerLite?",
    a: `For most lists mailed weekly or less, yes, by several times. A 25,000-subscriber list mailed weekly is ${formatUsd(comfort25kYearly)}/mo on MailerLite Comfort with yearly billing; the same 100,000 emails are $25/mo on day3. MailerLite is cheaper under ${formatCount(MAILERLITE_FREE_LIMIT)} subscribers, where its Free plan costs nothing, and for a bigger list mailed close to daily on Power, which has no send cap.`,
  },
  {
    q: "Does MailerLite limit how many emails I send?",
    a: `On Free, to ${formatCount(MAILERLITE_FREE_SENDS)} a month. On Comfort, to 10 times the ceiling of your subscriber tier. Power has no monthly cap, under a fair use policy, and costs more per subscriber. day3 has one meter, emails sent, and subscribers are unlimited on every plan.`,
  },
  {
    q: "What does MailerLite do that day3 doesn't?",
    a: "A drag-and-drop designer, websites and landing pages, pop-ups, quizzes and surveys, digital products and paid newsletters, A/B and multivariate testing, and a mature automation builder. day3 is a narrow tool for product emails, with automations as an early preview.",
  },
  {
    q: "Are these MailerLite's real prices?",
    a: `Yes. Every MailerLite figure was read off MailerLite's own pricing page on ${MAILERLITE_VERIFIED_ON}, in US dollars, at every step of its subscriber slider, on both monthly and yearly billing. The calculator uses the cheapest plan whose send allowance covers your sends, and yearly billing unless you switch it.`,
  },
  {
    q: "Can I move my MailerLite list to day3?",
    a: MAILERLITE_API_IMPORT_LIVE
      ? "Yes. Paste your MailerLite API key into day3's importer and your subscribers and unsubscribes come over. Nobody who unsubscribed on MailerLite is re-subscribed by the move."
      : "Yes. Export your active subscribers from MailerLite as CSV and import them into a day3 audience. Export your unsubscribed, bounced and spam-complaint subscribers too, and add those to day3's suppression list first, so nobody who left is mailed again.",
  },
];

export default function MailerLitePricingCalculatorPage() {
  return (
    <ProviderPricingPage
      provider="mailerlite"
      model={mailerliteModel}
      path={PATH}
      h1="What your list costs on MailerLite, and on day3."
      lede="MailerLite bills by how many subscribers you have, and caps how much you send on Comfort. day3 bills by how many emails you send, and keeps subscribers unlimited. Here is the same list priced both ways."
      meters={[
        {
          title: "MailerLite bills the list",
          body: "Every subscriber counts toward your tier, mailed this month or not. Comfort adds a send cap of 10x the tier; Power lifts it for a higher price.",
        },
        {
          title: "day3 bills the sends",
          body: "Subscribers are free and unlimited. Only the emails you send move the price, so a big list mailed weekly stays cheap.",
        },
        {
          title: "Where that flips",
          body: "A tiny list fits MailerLite Free, and a big list mailed daily can come out cheaper on Power. The calculator shows where the line falls.",
        },
      ]}
      worked={mailerliteWorkedScenarios}
      workedBasis="on MailerLite's yearly prices"
      wins={[
        {
          title: "When the list is tiny.",
          body: `MailerLite Free holds ${formatCount(MAILERLITE_FREE_LIMIT)} subscribers and ${formatCount(MAILERLITE_FREE_SENDS)} emails a month for nothing. day3's free tier only sends to your own team, so the first real email costs $1. If you fit inside MailerLite Free, stay there.`,
        },
        {
          title: "When you send every day.",
          body: "Power has no monthly send cap, so past a certain frequency its flat price beats paying per send. A 25,000-subscriber list mailed daily is a few dollars a month cheaper on MailerLite Power, billed yearly, than on day3.",
        },
        {
          title: "When you want the whole suite.",
          body: "Websites, landing pages, pop-ups, a drag-and-drop designer, digital products, paid newsletters, and A/B testing, all in one login. day3 has signup forms and a composer, and nothing else from that list. If a small marketing team uses that breadth, it's worth more than the difference.",
        },
      ]}
      compareSlug="mailerlite-alternative"
      move={{
        importLive: MAILERLITE_API_IMPORT_LIVE,
        csvSteps: [
          {
            title: "Export your subscribers from MailerLite",
            body: "On MailerLite's Subscribers page, export your active subscribers to CSV, with the fields you use as merge tags.",
          },
          {
            title: "Bring the people who left, first",
            body: "Export the unsubscribed, bounced and spam-complaint subscribers too, and paste them into the Suppressions tab under Audiences in day3. Anything on that list is refused on the way in.",
          },
          {
            title: "Import the CSV into a day3 audience",
            body: "Upload the file; columns are matched by name, and extra columns become custom fields. Each file takes up to 5,000 rows, so split a bigger export, or script it against the API, which takes 1,000 contacts a call. The free tier holds 500 subscribers, so a bigger list needs a paid plan first, from $1/mo.",
          },
          {
            title: "Verify your domain and send a test",
            body: "Add your sending domain's DKIM, SPF and DMARC records, then send yourself a test before the list sees anything.",
          },
        ],
        caveat:
          "Websites, landing pages, pop-up designs and paid-newsletter billing don't come across, because day3 has none of them. Drag-and-drop designs are rebuilt in day3's composer. Automations are rebuilt by hand on day3's canvas, which is an early preview.",
      }}
      howCalculated={[
        <>
          MailerLite&apos;s prices were read off{" "}
          <a
            href={MAILERLITE_PRICING_URL}
            rel="nofollow noopener"
            className="underline underline-offset-2 hover:text-foreground"
          >
            their pricing page
          </a>{" "}
          on {MAILERLITE_VERIFIED_ON}, in US dollars, at every step of its
          subscriber slider. Prices change; check the source before you quote
          this anywhere that matters.
        </>,
        <>
          MailerLite&apos;s side is the cheapest plan that holds the list and
          the sends: Free up to {formatCount(MAILERLITE_FREE_LIMIT)} subscribers
          and {formatCount(MAILERLITE_FREE_SENDS)} emails, Comfort while the
          sends stay within 10x the tier, Power above that. Above{" "}
          {formatCount(MAILERLITE_MAX_PUBLISHED)} subscribers it&apos;s
          Enterprise, which MailerLite prices through sales.
        </>,
        <>
          Yearly billing by default, which is MailerLite&apos;s lower price, 10%
          under monthly. Switch to monthly to see month-to-month.
        </>,
      ]}
      faqs={faqs}
      related={[
        "compare:mailerlite-alternative",
        "page:/mailchimp-pricing-calculator",
        "page:/kit-pricing-calculator",
        "page:/pricing",
        "page:/pricing/for",
        "blog:per-subscriber-vs-per-send-email-pricing",
      ]}
    />
  );
}
