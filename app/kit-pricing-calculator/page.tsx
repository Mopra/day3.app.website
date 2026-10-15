import type { Metadata } from "next";

import { ProviderPricingPage } from "@/components/marketing/provider-pricing-page";
import { buildMetadata } from "@/lib/seo";
import { formatCount, formatUsd } from "@/lib/resend-comparison";
import {
  KIT_API_IMPORT_LIVE,
  KIT_FREE_LIMIT,
  KIT_MAX_PUBLISHED,
  KIT_PRICING_URL,
  KIT_VERIFIED_ON,
  kitModel,
  kitWorkedScenarios,
} from "@/lib/kit-comparison";

const PATH = "/kit-pricing-calculator";

export const metadata: Metadata = buildMetadata({
  title: "Kit (ConvertKit) pricing calculator: Kit vs day3",
  description:
    "What your list costs on Kit's published Creator prices against day3's per-send price. A Kit alternative billed by emails sent, including where Kit is cheaper.",
  path: PATH,
  ogEyebrow: "Pricing calculator",
  ogTitle: "Kit or day3? Move the slider.",
  keywords: [
    "kit pricing calculator",
    "convertkit pricing calculator",
    "kit pricing",
    "convertkit pricing",
    "kit alternative",
    "convertkit alternative",
    "cheaper than kit",
    "cheaper than convertkit",
    "kit vs day3",
  ],
});

// Read live off the snapshot, so the copy can never disagree with the table.
const creator = (n: number, option = "yearly") =>
  kitModel.cost(n, 0, option).priceUsd ?? 0;
const creator15k = creator(15_000);
const creator25k = creator(25_000);
const creator100kMonthly = creator(100_000, "monthly");

const faqs = [
  {
    q: "How much does Kit cost?",
    a: `On ${KIT_VERIFIED_ON}, Kit's own pricing page listed Free for up to ${formatCount(KIT_FREE_LIMIT)} subscribers, then Creator priced by list size: ${formatUsd(creator(15_000, "monthly"))}/mo for 15,000 subscribers on monthly billing, or ${formatUsd(creator15k)}/mo on yearly billing, and ${formatUsd(creator100kMonthly)}/mo monthly for 100,000. Pro costs more. Above ${formatCount(KIT_MAX_PUBLISHED)} subscribers it's a custom plan.`,
  },
  {
    q: "Is day3 cheaper than Kit?",
    a: `Once a list outgrows Kit's free plan, usually by several times. A 25,000-subscriber list on Kit Creator is ${formatUsd(creator25k)}/mo on yearly billing; mailed weekly that's 100,000 emails, which is $25/mo on day3. Kit is cheaper while your list fits its Free plan, and for a large list mailed close to daily, because Kit's sends are unlimited.`,
  },
  {
    q: "What's the best Kit alternative for a software team?",
    a: "If the job is telling users what shipped, day3 is built for exactly that: campaigns, signup forms, transactional email from the same domain, and a bill set by emails sent rather than subscribers. If the job is a creator business with sequences, a storefront and paid recommendations, Kit is the better tool and we would say so.",
  },
  {
    q: "What does Kit do that day3 doesn't?",
    a: "A lot, and the calculator doesn't price it. Kit has a creator storefront for digital products and paid newsletters, a recommendations network, sponsorships, a newsletter website, and mature visual automations and sequences. day3 has automations for welcome, onboarding and win-back flows as an early preview, and none of the commerce.",
  },
  {
    q: "Are these Kit's real prices?",
    a: `Yes. Every Kit figure comes from Kit's own pricing page on ${KIT_VERIFIED_ON}, from the same tier table its subscriber slider reads. Yearly billing is ten months' price for twelve; we divide the yearly total by twelve, which is a few cents lower than the rounded figure Kit displays.`,
  },
  {
    q: "Can I move my Kit list to day3?",
    a: KIT_API_IMPORT_LIVE
      ? "Yes. Paste your Kit API key into day3's importer and your subscribers and unsubscribes come over. Nobody who unsubscribed on Kit is re-subscribed by the move."
      : "Yes. Export your subscribers from Kit as CSV and import them into a day3 audience. Export your unsubscribed (Kit calls them cancelled), bounced and complained subscribers too, and add those to day3's suppression list first, so nobody who left is mailed again.",
  },
];

export default function KitPricingCalculatorPage() {
  return (
    <ProviderPricingPage
      provider="kit"
      model={kitModel}
      path={PATH}
      h1="What your list costs on Kit, and on day3."
      lede="Kit bills by how many subscribers you have. day3 bills by how many emails you send. If your Kit bill has been climbing with the list, here is the same list priced the other way."
      meters={[
        {
          title: "Kit bills the list",
          body: "Every subscriber counts toward your Creator tier, mailed this month or not. The bill steps up every 10,000 subscribers past 25,000.",
        },
        {
          title: "day3 bills the sends",
          body: "Subscribers are free and unlimited. Only the emails you send move the price, so a big list mailed weekly stays cheap.",
        },
        {
          title: "Where that flips",
          body: "Kit's sends are unlimited and its Free plan holds 10,000 subscribers. A small list, or a big one mailed daily, can come out cheaper there.",
        },
      ]}
      worked={kitWorkedScenarios}
      workedBasis="on Kit's yearly prices"
      wins={[
        {
          title: "When the list fits Kit Free.",
          body: `Kit's Free plan holds up to ${formatCount(KIT_FREE_LIMIT)} subscribers with unlimited broadcasts. day3's free tier only sends to your own team, so the first real email costs $1. If broadcasts are all you need and you're under ${formatCount(KIT_FREE_LIMIT)}, Kit Free costs less. Sequences and visual automations need Creator, though, and that's where the calculator's second Kit line comes in.`,
        },
        {
          title: "When you send every day.",
          body: "Kit charges nothing per send, so a daily newsletter costs the same as a monthly one. Per-send pricing can't beat a flat fee at that frequency once the list is big. A 25,000-subscriber list mailed daily is cheaper on Kit.",
        },
        {
          title: "When the newsletter is the business.",
          body: "Digital products, paid newsletters, paid recommendations, sponsorships, a creator network, and years of polish on sequences and visual automations. day3 does none of the commerce, and its automations are an early preview. If those earn you money, that's worth more than the difference in the bill.",
        },
      ]}
      compareSlug="kit-alternative"
      move={{
        importLive: KIT_API_IMPORT_LIVE,
        csvSteps: [
          {
            title: "Export your subscribers from Kit",
            body: "On Kit's Subscribers page, select everyone and export to CSV. Email address and first name come with it.",
          },
          {
            title: "Bring the people who left, first",
            body: "Filter Kit's subscribers to cancelled (Kit's word for unsubscribed), bounced and complained, export those, and paste them into the Suppressions tab under Audiences in day3. Anything on that list is refused on the way in.",
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
          "Sequences, visual automations, landing pages, products and paid subscriptions don't come across. day3 has automations of its own as an early preview, so a welcome or onboarding sequence can be rebuilt there by hand. Plan that rebuild before the move if a sequence is doing real work for you.",
      }}
      howCalculated={[
        <>
          Kit&apos;s prices were read off{" "}
          <a
            href={KIT_PRICING_URL}
            rel="nofollow noopener"
            className="underline underline-offset-2 hover:text-foreground"
          >
            their pricing page
          </a>{" "}
          on {KIT_VERIFIED_ON}, from the tier table its subscriber slider uses.
          Prices change; check the source before you quote this anywhere that
          matters.
        </>,
        <>
          Kit&apos;s side is the cheapest plan that holds the list: Free up to{" "}
          {formatCount(KIT_FREE_LIMIT)} subscribers, then Creator up to{" "}
          {formatCount(KIT_MAX_PUBLISHED)}. Above that Kit prices a custom plan
          through sales. Where Free fits, Creator at the same list size is shown
          alongside, because Free leaves out sequences and automations.
        </>,
        <>
          Yearly billing by default, which is Kit&apos;s lower price: ten
          months&apos; price for twelve, divided by twelve. Switch to monthly to
          see month-to-month.
        </>,
      ]}
      faqs={faqs}
      related={[
        "compare:kit-alternative",
        "page:/mailchimp-pricing-calculator",
        "page:/mailerlite-pricing-calculator",
        "page:/beehiiv-pricing-calculator",
        "page:/pricing",
        "blog:per-subscriber-vs-per-send-email-pricing",
      ]}
    />
  );
}
