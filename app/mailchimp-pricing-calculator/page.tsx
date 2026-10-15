import type { Metadata } from "next";

import { ProviderPricingPage } from "@/components/marketing/provider-pricing-page";
import { buildMetadata } from "@/lib/seo";
import { formatCount, formatUsd } from "@/lib/resend-comparison";
import {
  MAILCHIMP_API_IMPORT_LIVE,
  MAILCHIMP_FREE_LIMIT,
  MAILCHIMP_FREE_SENDS,
  MAILCHIMP_MAX_PUBLISHED,
  MAILCHIMP_PRICING_URL,
  MAILCHIMP_VERIFIED_ON,
  mailchimpModel,
  mailchimpTiers,
  mailchimpWorkedScenarios,
} from "@/lib/mailchimp-comparison";

const PATH = "/mailchimp-pricing-calculator";

export const metadata: Metadata = buildMetadata({
  title: "Mailchimp pricing calculator: cheaper than Mailchimp?",
  description:
    "What your audience costs on Mailchimp's published plans against day3's per-send price. A Mailchimp alternative with unlimited contacts, including where Mailchimp wins.",
  path: PATH,
  ogEyebrow: "Pricing calculator",
  ogTitle: "Mailchimp or day3? Move the slider.",
  keywords: [
    "mailchimp pricing calculator",
    "mailchimp pricing",
    "cheaper than mailchimp",
    "mailchimp alternative",
    "mailchimp too expensive",
    "mailchimp price increase",
    "mailchimp vs day3",
  ],
});

// Read live off the snapshot, so the copy can never disagree with the table.
const tier = (max: number) => mailchimpTiers.find((t) => t.max === max)!;
const ess10k = tier(10_000).Essentials!;
const std100k = tier(100_000).Standard!;
const ess25kOffer = mailchimpModel.cost(25_000, 100_000, "offer").priceUsd ?? 0;

const faqs = [
  {
    q: "How much does Mailchimp cost?",
    a: `On ${MAILCHIMP_VERIFIED_ON}, Mailchimp's own pricing page listed Free for up to ${formatCount(MAILCHIMP_FREE_LIMIT)} contacts and ${formatCount(MAILCHIMP_FREE_SENDS)} sends a month, then Essentials from $13/mo, Standard from $20/mo and Premium from $350/mo, all rising with your contact count. A 10,000-contact audience was ${formatUsd(ess10k)}/mo on Essentials; 100,000 was ${formatUsd(std100k)}/mo on Standard. New customers with 10,000+ contacts get 15% off for the first 12 months. Above ${formatCount(MAILCHIMP_MAX_PUBLISHED)} contacts it's priced by sales.`,
  },
  {
    q: "Is day3 cheaper than Mailchimp?",
    a: `For almost every list past Mailchimp's free plan, yes, and usually by several times. A 25,000-contact audience mailed weekly is ${formatUsd(ess25kOffer)}/mo on Mailchimp Essentials even with the first-year discount; the same 100,000 emails are $25/mo on day3. Mailchimp is cheaper only while you fit its Free plan.`,
  },
  {
    q: "Why does Mailchimp cap my sends as well as my contacts?",
    a: "Every Mailchimp plan pairs a contact tier with a monthly send allowance: 10 times the tier on Essentials, 12 times on Standard, 15 times on Premium, and 500 a month on Free. Go past it and overages apply. day3 has one meter, emails sent, and subscribers are unlimited on every plan.",
  },
  {
    q: "What does Mailchimp do that day3 doesn't?",
    a: "Plenty. Customer journeys with A/B splits and behavioural triggers, a drag-and-drop designer, landing pages and websites, ads, a CRM, SMS, e-commerce integrations, and reporting built for a marketing team. day3 is a narrow tool for product emails, with automations as an early preview.",
  },
  {
    q: "Are these Mailchimp's real prices?",
    a: `Yes. Every Mailchimp figure was read off Mailchimp's own pricing page on ${MAILCHIMP_VERIFIED_ON}, in US dollars, at every step of its contact dropdown. The calculator uses the cheapest plan whose send allowance covers your sends, and the first-year discount unless you switch to list price.`,
  },
  {
    q: "Can I move my Mailchimp audience to day3?",
    a: MAILCHIMP_API_IMPORT_LIVE
      ? "Yes. Paste your Mailchimp API key into day3's importer and your subscribers and unsubscribes come over. Nobody who unsubscribed on Mailchimp is re-subscribed by the move."
      : "Yes. Export your audience from Mailchimp, which gives you separate CSV files for subscribed, unsubscribed and cleaned contacts. Add the unsubscribed and cleaned addresses to day3's suppression list first, then import the subscribed file into a day3 audience.",
  },
];

export default function MailchimpPricingCalculatorPage() {
  return (
    <ProviderPricingPage
      provider="mailchimp"
      model={mailchimpModel}
      path={PATH}
      h1="What your audience costs on Mailchimp, and on day3."
      lede="Mailchimp bills by how many contacts you keep, and caps how many emails you send. day3 bills by how many emails you send, and keeps contacts unlimited. Here is the same list priced both ways."
      meters={[
        {
          title: "Mailchimp bills the contacts",
          body: "Every contact counts toward your tier, mailed this month or not, and each plan caps your monthly sends at a multiple of that tier.",
        },
        {
          title: "day3 bills the sends",
          body: "Subscribers are free and unlimited. Only the emails you send move the price, so a big list mailed weekly stays cheap.",
        },
        {
          title: "Where that flips",
          body: "Under 250 contacts and 500 sends a month, Mailchimp Free costs nothing. Past that, the calculator shows the gap for your list.",
        },
      ]}
      worked={mailchimpWorkedScenarios}
      workedBasis="on Mailchimp's first-year prices, the cheaper ones"
      wins={[
        {
          title: "When the list is tiny.",
          body: `Mailchimp Free holds ${formatCount(MAILCHIMP_FREE_LIMIT)} contacts and ${formatCount(MAILCHIMP_FREE_SENDS)} sends a month for nothing. day3's free tier only sends to your own team, so the first real email costs $1. If you fit inside Mailchimp Free, stay there.`,
        },
        {
          title: "When you send rarely, through Pay As You Go.",
          body: "Mailchimp also sells email credits instead of a monthly plan, which it pitches at infrequent senders. It doesn't publish those prices on the plans page, so the calculator can't compare them. If you mail a few times a year, ask them.",
        },
        {
          title: "When marketing runs on Mailchimp's suite.",
          body: "Journeys with A/B splits and behavioural triggers, the drag-and-drop designer, landing pages, ads, the CRM, SMS, and store integrations. day3 has none of the suite and its automations are an early preview. If a marketing team lives in those tools, the cheaper bill is not the whole story.",
        },
      ]}
      compareSlug="mailchimp-alternative"
      move={{
        importLive: MAILCHIMP_API_IMPORT_LIVE,
        csvSteps: [
          {
            title: "Export your audience from Mailchimp",
            body: "In Mailchimp, export the audience. You get a zip with separate CSV files for subscribed, unsubscribed and cleaned (bounced) contacts. day3 reads Mailchimp's Email Address, First Name and Last Name headers as they are.",
          },
          {
            title: "Bring the people who left, first",
            body: "Paste the addresses from the unsubscribed and cleaned files into the Suppressions tab under Audiences in day3. Anything on that list is refused on the way in, so the move can't mail someone who left.",
          },
          {
            title: "Import the subscribed file into a day3 audience",
            body: "Upload it; extra columns become custom fields, and tags you export as columns come with them. Each file takes up to 5,000 rows, so split a bigger export, or script it against the API, which takes 1,000 contacts a call. The free tier holds 500 subscribers, so a bigger list needs a paid plan first, from $1/mo.",
          },
          {
            title: "Verify your domain and send a test",
            body: "Add your sending domain's DKIM, SPF and DMARC records, then send yourself a test before the list sees anything.",
          },
        ],
        caveat:
          "Journeys, landing pages, ad audiences and the CRM don't come across. Drag-and-drop designs are rebuilt in day3's composer, which is a writing tool rather than a layout canvas. Saved segments are rebuilt on top of your imported fields.",
      }}
      howCalculated={[
        <>
          Mailchimp&apos;s prices were read off{" "}
          <a
            href={MAILCHIMP_PRICING_URL}
            rel="nofollow noopener"
            className="underline underline-offset-2 hover:text-foreground"
          >
            their pricing page
          </a>{" "}
          on {MAILCHIMP_VERIFIED_ON}, in US dollars, at every step of its
          contact dropdown. Prices change; check the source before you quote
          this anywhere that matters.
        </>,
        <>
          Mailchimp&apos;s side is the cheapest plan that holds the contacts and
          whose send allowance covers the sends: Essentials (10x the tier, up
          to 50,000 contacts), Standard (12x, up to 100,000), then Premium
          (15x, up to {formatCount(MAILCHIMP_MAX_PUBLISHED)}). Past every
          allowance, Mailchimp charges overages it doesn&apos;t publish, so the
          price is shown as &quot;from&quot; and any saving as &quot;at
          least&quot;.
        </>,
        <>
          The first-year price by default: 15% off for new customers, which
          the page shows from the 5,001 to 10,000 contact tier up. Switch to
          list price to see what year two costs, and what an existing customer
          already pays.
        </>,
      ]}
      faqs={faqs}
      related={[
        "compare:mailchimp-alternative",
        "page:/kit-pricing-calculator",
        "page:/mailerlite-pricing-calculator",
        "page:/pricing",
        "page:/pricing/for",
        "blog:per-subscriber-vs-per-send-email-pricing",
      ]}
    />
  );
}
