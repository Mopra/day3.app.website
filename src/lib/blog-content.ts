/**
 * Source of truth for /blog and /blog/<slug>.
 *
 * Why this exists: every other page on this site is a product page, so there was
 * nothing for someone with a question to land on. These six answer the questions
 * that surround the product (authentication, unsubscribe compliance, consent,
 * reputation, migration, pricing models) rather than describing day3. Each one is
 * a subject day3 has to get right internally, which is the only honest reason to
 * publish on it.
 *
 * Accuracy policy, same spirit as the comparison pages: cite standards by number,
 * describe requirements as the mailbox providers state them, and where something
 * is a judgement call rather than a rule, say so. No legal advice. Nothing here
 * should need editing when a competitor changes their pricing page.
 */

export type Block =
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: string[] }
  | { kind: "code"; caption?: string; code: string }
  | { kind: "note"; title: string; text: string }
  | {
      kind: "table";
      caption?: string;
      head: string[];
      rows: string[][];
    };

export type Section = {
  heading: string;
  blocks: Block[];
};

export type BlogPost = {
  slug: string;
  /** H1. */
  title: string;
  /** ISO date first published. */
  published: string;
  /** ISO date last substantively changed. Defaults to `published` when equal. */
  updated: string;
  /** Rough read time in minutes, shown in the index. */
  readMinutes: number;
  /** Topic label, used as articleSection and as the index filter chip. */
  topic: string;

  // --- SEO ---
  metaTitle: string;
  metaDescription: string;
  keywords: string[];

  /** Lede under the H1. Also the index card description. */
  summary: string;
  /** The answer up front, for readers and for answer engines that quote it. */
  keyTakeaways: string[];
  sections: Section[];
  faqs: { q: string; a: string }[];
  /** Refs into the internal link mesh. See lib/internal-links.ts. */
  related: string[];
};

export const blogPosts: BlogPost[] = [
  // ---------------------------------------------------------------- 1. auth
  {
    slug: "spf-dkim-dmarc-explained",
    title: "SPF, DKIM and DMARC: the three records that decide whether your email arrives",
    published: "2026-08-12",
    updated: "2026-08-12",
    readMinutes: 9,
    topic: "Deliverability",
    metaTitle: "SPF, DKIM and DMARC explained (with the records)",
    metaDescription:
      "What each of the three authentication records does, why DMARC alignment is the part people miss, and the order to roll them out without blocking your own mail.",
    keywords: [
      "spf dkim dmarc",
      "email authentication",
      "dmarc alignment",
      "set up dkim",
      "dmarc policy p=none",
      "gmail bulk sender requirements",
    ],
    summary:
      "Three DNS records stand between your email and the spam folder. Here is what each one actually proves, why two of them can pass while DMARC still fails, and the order to deploy them in.",
    keyTakeaways: [
      "SPF says which servers may send for your domain. It is checked against the envelope sender, not the From address your reader sees, and it breaks when mail is forwarded.",
      "DKIM cryptographically signs the message, so it survives forwarding. This is the one that matters most.",
      "DMARC ties the other two to the visible From domain through alignment, and tells receivers what to do when they fail. Passing SPF or DKIM is not enough on its own.",
      "Start at p=none with a reporting address, read the reports for a few weeks, then move to quarantine and only then to reject.",
      "Since 2024, Gmail and Yahoo require all three plus one-click unsubscribe from anyone sending roughly 5,000 messages a day or more to their users.",
    ],
    sections: [
      {
        heading: "The problem all three solve",
        blocks: [
          {
            kind: "p",
            text: "SMTP, the protocol carrying your email, has no notion of identity. Any machine on the internet can open a connection and claim to be sending on behalf of your domain, and nothing in the original protocol contradicts it. Every anti-spoofing mechanism in email is a later layer bolted on to fix that, which is why there are three of them rather than one.",
          },
          {
            kind: "p",
            text: "They answer different questions. SPF answers \"was this sent from a machine the domain owner authorised?\" DKIM answers \"was this message signed by someone holding the domain's private key, and has it been altered since?\" DMARC answers \"do the answers to those two questions refer to the same domain the reader sees in the From line, and what should I do if not?\"",
          },
          {
            kind: "p",
            text: "You need all three. Two of them passing while the third fails is the single most common reason a technically correct setup still lands in spam.",
          },
        ],
      },
      {
        heading: "SPF: which servers may send",
        blocks: [
          {
            kind: "p",
            text: "SPF is one TXT record on your domain listing the servers allowed to send mail for it. A receiving server looks it up and checks whether the connecting machine is on the list.",
          },
          {
            kind: "code",
            caption: "A minimal SPF record for a domain using one sending provider",
            code: "example.com.  IN  TXT  \"v=spf1 include:amazonses.com -all\"",
          },
          {
            kind: "p",
            text: "The mechanisms matter. `include:` delegates to another domain's SPF record, which is how you authorise a provider without knowing their IP addresses. The final qualifier is the policy: `-all` means \"anything not listed above is a hard fail\", `~all` means soft fail, and `?all` means neutral, which is close to having no policy at all. Use `-all` once you are confident the list is complete.",
          },
          {
            kind: "p",
            text: "Two limitations catch people out. First, SPF is checked against the envelope sender, the address in the SMTP MAIL FROM command, not the From header your reader sees. Those are frequently different domains, which is exactly the gap DMARC exists to close. Second, SPF breaks on forwarding: when a mailing list or a corporate forward relays your message, the connecting server is now theirs and is not in your record, so SPF fails through no fault of yours.",
          },
          {
            kind: "note",
            title: "The ten-lookup limit",
            text: "SPF evaluation is capped at 10 DNS lookups, and every `include:` costs at least one. Stack up four or five providers and you will silently exceed it, at which point the record returns permerror and effectively stops working. If you send through several services, check your total rather than assuming a valid-looking record is a working one.",
          },
        ],
      },
      {
        heading: "DKIM: the signature that survives forwarding",
        blocks: [
          {
            kind: "p",
            text: "DKIM signs the message with a private key held by the sending system and publishes the matching public key in DNS. The signature covers the body and a named set of headers, so a receiver can verify both that the signer held the key and that nothing signed has been modified in transit.",
          },
          {
            kind: "p",
            text: "The public key lives at a selector-scoped hostname, which is what lets one domain authorise several senders independently:",
          },
          {
            kind: "code",
            caption: "A DKIM public key, published under a selector",
            code: "selector1._domainkey.example.com.  IN  TXT  \"v=DKIM1; k=rsa; p=MIGfMA0GCSq...\"",
          },
          {
            kind: "p",
            text: "The signature itself rides in a DKIM-Signature header on the message, and includes `d=` (the signing domain), `s=` (the selector, telling the receiver which key to fetch) and `bh=` (a hash of the body). The `d=` value is the one that matters for DMARC, and it is also the identity most mailbox providers attach reputation to.",
          },
          {
            kind: "p",
            text: "Because the signature travels with the message rather than depending on the connecting IP, DKIM survives forwarding. That makes it the more robust of the two, and it is the reason a DMARC policy that relies on DKIM alignment causes far fewer false failures than one relying on SPF.",
          },
        ],
      },
      {
        heading: "DMARC: alignment, and what to do on failure",
        blocks: [
          {
            kind: "p",
            text: "DMARC does two jobs. It requires that a passing SPF or DKIM check refer to the same domain as the visible From header, which is called alignment, and it publishes what a receiver should do when neither aligned check passes.",
          },
          {
            kind: "code",
            caption: "A monitoring-only DMARC record, which is where everyone should start",
            code: "_dmarc.example.com.  IN  TXT  \"v=DMARC1; p=none; rua=mailto:dmarc@example.com; pct=100; adkim=r; aspf=r\"",
          },
          {
            kind: "p",
            text: "Alignment is the part people miss. You can have a perfectly valid SPF record that passes and a perfectly valid DKIM signature that verifies, and still fail DMARC, because the domain that passed was your provider's rather than yours. If your envelope sender is `bounces@provider.net` and your DKIM `d=` is `provider.net`, both checks pass and neither aligns with a From address at `example.com`. Nothing is broken; nothing is authenticated either.",
          },
          {
            kind: "p",
            text: "The fix is to have your provider sign with your own domain, which is what a verified sending domain means in practice: their key, published under a selector on your DNS, signing as `d=example.com`. `adkim` and `aspf` control how strict the match must be, with `r` for relaxed, which permits subdomains, and `s` for strict, which does not. Relaxed is the right default.",
          },
          {
            kind: "table",
            caption: "What each DMARC policy tells receivers to do",
            head: ["Policy", "Effect", "When to use it"],
            rows: [
              [
                "p=none",
                "Deliver as normal, but send reports",
                "Always first. It changes nothing about delivery and tells you what is actually sending as you",
              ],
              [
                "p=quarantine",
                "Treat failures as suspicious, usually spam-foldered",
                "Once reports show all your legitimate senders aligning",
              ],
              [
                "p=reject",
                "Refuse failures outright",
                "The end state, once you are confident nothing legitimate fails",
              ],
            ],
          },
          {
            kind: "note",
            title: "Do not start at reject",
            text: "Publishing p=reject before you know what sends as your domain is how companies discover that their invoicing system, their helpdesk and their CRM were all sending unauthenticated mail, by way of it all bouncing at once. Start at none, read the aggregate reports, fix what appears, then tighten.",
          },
        ],
      },
      {
        heading: "The order to do this in",
        blocks: [
          {
            kind: "steps",
            items: [
              "Publish DKIM for every service that sends as your domain, signing with d= set to your domain rather than theirs. This is the single highest-value step.",
              "Publish or fix SPF, listing every sending service, and check you are under the ten-lookup limit.",
              "Publish DMARC at p=none with an rua address, and give it two to four weeks.",
              "Read the aggregate reports. Every source that is legitimate but failing alignment needs fixing at the source, not exempting.",
              "Move to p=quarantine, watch for a couple of weeks, then to p=reject.",
            ],
          },
          {
            kind: "p",
            text: "If you send bulk and transactional mail from the same domain, consider whether bulk should move to a subdomain such as `mail.example.com`. Reputation is scored largely per domain, so isolating the mail most likely to attract complaints protects the mail you cannot afford to have filtered. That is a judgement call rather than a rule, and we have written about the trade-off separately.",
          },
        ],
      },
      {
        heading: "What the mailbox providers now require",
        blocks: [
          {
            kind: "p",
            text: "In February 2024 Gmail and Yahoo turned what had been best practice into an entry requirement for bulk senders, defined as roughly 5,000 messages a day or more to their users. The requirements are SPF and DKIM on all mail, a DMARC record at minimum p=none, alignment between the From domain and one of the passing checks, a spam complaint rate kept below 0.3%, and one-click unsubscribe in the RFC 8058 sense on marketing mail.",
          },
          {
            kind: "p",
            text: "The complaint-rate threshold deserves attention because it is the one that is not a configuration task. 0.3% is three complaints in a thousand delivered messages, which a poorly targeted send to a stale list can exceed easily. Authentication gets you admitted; complaint rate is what keeps you there.",
          },
        ],
      },
      {
        heading: "How day3 handles it",
        blocks: [
          {
            kind: "p",
            text: "Connect a domain hosted on Cloudflare and day3 publishes the DKIM, SPF and DMARC records for you, then rechecks until the domain verifies rather than asking you to confirm you did it. On any other DNS host you get the exact records to paste. Either way the DKIM key signs with `d=` set to your domain, so alignment works rather than merely appearing to.",
          },
          {
            kind: "p",
            text: "The DMARC record day3 publishes starts at p=none deliberately, for the reason above. Tightening it is your call and your timing, because we cannot see what else sends as your domain and you can.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Do I need all three of SPF, DKIM and DMARC?",
        a: "Yes, if you want reliable delivery to Gmail and Yahoo. Since February 2024 both require SPF, DKIM and a DMARC record from bulk senders, and DMARC only means anything if one of the other two aligns with your visible From domain.",
      },
      {
        q: "What is DMARC alignment?",
        a: "It means the domain that passed SPF or DKIM has to match the domain in the From header your reader sees. Both checks can pass against your email provider's domain and still fail alignment with yours, which is the most common reason a setup that looks correct is not actually authenticating anything.",
      },
      {
        q: "Should I set DMARC to p=reject straight away?",
        a: "No. Start at p=none with a reporting address, read the aggregate reports for a few weeks to find every system that sends as your domain, fix what fails, then move through quarantine to reject. Starting at reject is how legitimate mail from your invoicing or helpdesk systems gets blocked without warning.",
      },
      {
        q: "Why does SPF fail when my email is forwarded?",
        a: "Because SPF checks the connecting server against your record, and after a forward the connecting server belongs to whoever forwarded it. Nothing is wrong with your setup. This is why DKIM, whose signature travels with the message, is the more dependable of the two.",
      },
      {
        q: "What is a DKIM selector?",
        a: "A label in the DNS name where your public key is published, such as selector1._domainkey.example.com. Selectors let one domain authorise several sending services independently, each with its own key, and let you rotate a key without downtime.",
      },
    ],
    related: [
      "page:/deliverability",
      "blog:one-click-unsubscribe-rfc-8058",
      "blog:transactional-and-marketing-one-domain",
      "for:saas",
      "feature:metrics",
      "page:/security",
    ],
  },

  // -------------------------------------------------------- 2. unsubscribe
  {
    slug: "one-click-unsubscribe-rfc-8058",
    title: "One-click unsubscribe: what RFC 8058 actually requires",
    published: "2026-08-12",
    updated: "2026-08-12",
    readMinutes: 6,
    topic: "Compliance",
    metaTitle: "One-click unsubscribe: what RFC 8058 requires",
    metaDescription:
      "The two headers one-click unsubscribe needs, why a confirmation page breaks it, and what Gmail and Yahoo expect from bulk senders. With the exact header values.",
    keywords: [
      "rfc 8058",
      "one-click unsubscribe",
      "list-unsubscribe header",
      "list-unsubscribe-post",
      "gmail unsubscribe requirement",
      "bulk sender unsubscribe",
    ],
    summary:
      "Two headers, one POST, no confirmation page. One-click unsubscribe is a small standard that a surprising number of senders implement incorrectly, and since 2024 Gmail and Yahoo treat getting it wrong as a deliverability problem.",
    keyTakeaways: [
      "It takes two headers, not one: List-Unsubscribe carrying an HTTPS URL, and List-Unsubscribe-Post carrying the literal value List-Unsubscribe=One-Click.",
      "The mailbox provider sends a POST to your URL. It must unsubscribe the recipient on that POST alone. A confirmation page or a login makes the implementation non-compliant.",
      "You still need a visible unsubscribe link in the message body. One-click is in addition, not instead.",
      "Gmail expects the unsubscribe to take effect within two days.",
      "Sending it on transactional mail is a mistake. It belongs on marketing and bulk mail.",
    ],
    sections: [
      {
        heading: "Where this came from",
        blocks: [
          {
            kind: "p",
            text: "The `List-Unsubscribe` header has existed since RFC 2369 in 1998, and for most of that time it was a courtesy: a hint some mail clients would surface as an unsubscribe button, pointing at either a URL or a mailto address. It had a design flaw. Some clients would fetch the URL to check it, and a plain GET request to an unsubscribe link is indistinguishable from a person clicking it, which meant automated scanning could unsubscribe people who never asked.",
          },
          {
            kind: "p",
            text: "RFC 8058, published in 2018, fixed that by moving the action to POST and requiring the sender to opt in explicitly with a second header. In February 2024 Gmail and Yahoo made it a requirement for bulk senders rather than a nicety, with one-click support specifically expected on marketing mail from June 2024.",
          },
        ],
      },
      {
        heading: "The two headers",
        blocks: [
          {
            kind: "code",
            caption: "Both headers are required. One without the other does nothing.",
            code: "List-Unsubscribe: <https://example.com/u/9fb2c1a4e7>\nList-Unsubscribe-Post: List-Unsubscribe=One-Click",
          },
          {
            kind: "p",
            text: "`List-Unsubscribe` holds the URL, in angle brackets. It may hold a comma-separated list including a `mailto:` alternative, and if it does, the HTTPS URL should come first. `List-Unsubscribe-Post` holds exactly one value, `List-Unsubscribe=One-Click`, and its presence is what tells the mailbox provider that a POST to that URL is safe and will be honoured.",
          },
          {
            kind: "p",
            text: "When a recipient presses the unsubscribe button their mail client shows, the provider sends a POST to your URL with `List-Unsubscribe=One-Click` as the request body, content type `application/x-www-form-urlencoded`. Your endpoint must unsubscribe them and return a success status.",
          },
        ],
      },
      {
        heading: "The four ways people get it wrong",
        blocks: [
          {
            kind: "list",
            items: [
              "Sending List-Unsubscribe without List-Unsubscribe-Post. The header is then treated as the old 1998 courtesy version, and one-click does not apply. This is the most common mistake.",
              "Answering the POST with a confirmation page. The standard requires the POST itself to complete the unsubscribe. \"Are you sure?\" is exactly what one-click removes, and a provider that gets a page instead of a completed action may treat your implementation as broken.",
              "Requiring authentication on the URL. The recipient is not logged in and the POST comes from the mailbox provider, not from a browser session. The URL has to carry its own unguessable token and work unauthenticated.",
              "Putting it on transactional email. A password reset with an unsubscribe header invites someone to opt out of a message they need. One-click belongs on marketing and bulk mail.",
            ],
          },
          {
            kind: "note",
            title: "Keep the body link too",
            text: "One-click does not replace the visible unsubscribe link in your email. Not every client surfaces the header button, and CAN-SPAM and equivalent rules elsewhere expect a clear opt-out mechanism in the message itself. Ship both.",
          },
        ],
      },
      {
        heading: "The endpoint",
        blocks: [
          {
            kind: "p",
            text: "The URL should carry a token that identifies the subscription without being guessable and without encoding the email address in a readable form. Sequential ids or base64-encoded addresses both let anyone unsubscribe anyone by iterating.",
          },
          {
            kind: "code",
            caption: "The shape of the request your endpoint receives",
            code: "POST /u/9fb2c1a4e7 HTTP/1.1\nHost: example.com\nContent-Type: application/x-www-form-urlencoded\nContent-Length: 26\n\nList-Unsubscribe=One-Click",
          },
          {
            kind: "p",
            text: "Return 200 on success. Be idempotent: providers retry, and a second POST for an already-unsubscribed address should succeed rather than error. And process it promptly. Gmail's guidance is that the unsubscribe takes effect within two days, which in practice means writing the suppression synchronously rather than dropping the request onto a queue you drain nightly.",
          },
        ],
      },
      {
        heading: "Why the complaint rate is the real reason to care",
        blocks: [
          {
            kind: "p",
            text: "The compliance framing undersells this. The practical value of an easy unsubscribe is that it is the alternative to the spam button, and those two actions have wildly different costs to you. An unsubscribe removes one address from your list. A spam complaint tells the mailbox provider that your mail is unwanted, and it is counted against the 0.3% threshold Gmail publishes for bulk senders.",
          },
          {
            kind: "p",
            text: "Anything that adds friction to leaving pushes people toward the button that hurts you more. A confirmation page, a login wall, a preferences centre with fifteen checkboxes: each one converts some number of would-be unsubscribes into complaints. Making it trivially easy to leave is the cheapest deliverability work available.",
          },
          {
            kind: "p",
            text: "Subscription topics are the one refinement worth adding, because they give someone a way to reduce your email without leaving entirely. That is a different thing from a preferences page that exists to talk people out of unsubscribing.",
          },
        ],
      },
      {
        heading: "How day3 handles it",
        blocks: [
          {
            kind: "p",
            text: "Both headers go on every campaign automatically, with a per-subscription token, and the endpoint suppresses on the POST itself with no confirmation step. The visible footer link ships alongside it, together with the postal address bulk mail is expected to carry. Transactional mail sent through the API does not get the headers, because it should not.",
          },
          {
            kind: "p",
            text: "Unsubscribes write to a per-sender suppression list that survives re-import, so bringing the same CSV back next month cannot re-subscribe someone who left.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is RFC 8058?",
        a: "The standard defining one-click unsubscribe. It requires two headers, List-Unsubscribe with an HTTPS URL and List-Unsubscribe-Post with the value List-Unsubscribe=One-Click, and specifies that a POST to that URL must complete the unsubscribe without any further interaction.",
      },
      {
        q: "Do I need both List-Unsubscribe and List-Unsubscribe-Post?",
        a: "Yes. List-Unsubscribe alone is the older RFC 2369 behaviour and does not give you one-click. The List-Unsubscribe-Post header is what signals that a POST is safe and will be honoured, and omitting it is the most common implementation mistake.",
      },
      {
        q: "Can my unsubscribe URL show a confirmation page?",
        a: "Not for the one-click flow. The POST itself has to complete the unsubscribe. You can show a confirmation page to someone who arrives by clicking the link in the email body, but the POST from the mailbox provider must not require a second step.",
      },
      {
        q: "Does one-click unsubscribe replace the link in the email?",
        a: "No. Keep the visible unsubscribe link in the body. Not every mail client surfaces the header button, and opt-out rules generally expect a clear mechanism in the message itself.",
      },
      {
        q: "Should transactional email have an unsubscribe header?",
        a: "No. Password resets, receipts and magic links are messages the recipient needs, and offering to opt them out of those is a mistake. One-click unsubscribe belongs on marketing and bulk mail.",
      },
      {
        q: "How fast do I have to process an unsubscribe?",
        a: "Gmail's guidance for bulk senders is within two days. In practice that means writing the suppression as part of handling the request rather than batching it into a job you run overnight.",
      },
    ],
    related: [
      "page:/deliverability",
      "blog:spf-dkim-dmarc-explained",
      "blog:gdpr-double-opt-in",
      "feature:audiences",
      "for:saas",
      "page:/legal/acceptable-use",
    ],
  },

  // ----------------------------------------------------------- 3. pricing
  {
    slug: "per-subscriber-vs-per-send-email-pricing",
    title: "Per-subscriber vs per-send email pricing, worked out",
    published: "2026-08-12",
    updated: "2026-08-12",
    readMinutes: 7,
    topic: "Pricing",
    metaTitle: "Per-subscriber vs per-send email pricing, compared",
    metaDescription:
      "One number decides which email pricing model is cheaper for you: monthly sends divided by subscribers. Here is the arithmetic, with the cases where each model wins.",
    keywords: [
      "email marketing pricing comparison",
      "per subscriber vs per send pricing",
      "email pricing model",
      "cheapest email marketing pricing",
      "unlimited subscribers email tool",
    ],
    summary:
      "Almost every email tool meters one of two things: how many people are on your list, or how many emails you send them. Which is cheaper is not a matter of opinion, and you can work it out with one division.",
    keyTakeaways: [
      "Divide your monthly sends by your subscriber count. Call it send intensity.",
      "Below roughly 1, meaning you do not email everyone every month, per-send pricing is cheaper and the gap grows as your list does.",
      "Above roughly 1, meaning a weekly or daily letter, per-subscriber pricing can be cheaper. Small list, high frequency is the case where it wins.",
      "The two curves diverge over time for most software teams, because lists compound and release cadence does not.",
      "Per-subscriber pricing has a hidden cost: it makes an accurate list expensive, so it quietly encourages you to keep a worse one.",
    ],
    sections: [
      {
        heading: "The one number that decides it",
        blocks: [
          {
            kind: "p",
            text: "Take the number of emails you send in a typical month and divide it by the number of people on your list. If you have 20,000 subscribers and send two campaigns to all of them, that is 40,000 sends over 20,000 subscribers, an intensity of 2. If you have 20,000 subscribers and send one campaign every other month, it is 10,000 over 20,000, an intensity of 0.5.",
          },
          {
            kind: "p",
            text: "Low intensity favours a per-send meter, because you are paying for the small number rather than the large one. High intensity favours a per-subscriber meter, because the subscriber count is fixed no matter how often you hit send. Everything else in this comparison is detail.",
          },
          {
            kind: "table",
            caption: "The same list, four sending cadences",
            head: ["Subscribers", "Cadence", "Sends / month", "Intensity", "Better meter"],
            rows: [
              ["20,000", "Every other month", "10,000", "0.5", "Per send"],
              ["20,000", "Monthly", "20,000", "1.0", "Roughly level"],
              ["20,000", "Weekly", "80,000", "4.0", "Per subscriber"],
              ["2,000", "Daily", "60,000", "30.0", "Per subscriber, clearly"],
            ],
          },
        ],
      },
      {
        heading: "Why software teams usually land below 1",
        blocks: [
          {
            kind: "p",
            text: "A list compounds. Every launch, every mention, every month of organic signups adds people, and nothing removes them except unsubscribes and bounces. It is a stock that only grows.",
          },
          {
            kind: "p",
            text: "Sending does not work like that. For a product team, sending is gated by having something worth announcing, which is gated by engineering time. You do not ship twice as often because your list doubled. So the numerator stays roughly flat while the denominator climbs, and intensity falls month after month.",
          },
          {
            kind: "p",
            text: "That is the structural reason per-subscriber pricing feels increasingly unfair to a growing software company and feels fine to a daily newsletter. The newsletter's intensity is pinned high by its format. The software company's drifts downward by default.",
          },
        ],
      },
      {
        heading: "The quiet cost of a per-contact meter",
        blocks: [
          {
            kind: "p",
            text: "There is a second effect that does not show up in a spreadsheet. When contacts cost money, every decision about your list becomes partly a billing decision.",
          },
          {
            kind: "list",
            items: [
              "Do we put trial signups on the list, or only paying customers?",
              "Should we delete the contacts who have not opened anything in a year?",
              "Do we keep the churned accounts, in case they come back?",
              "Can we afford to keep the people who unsubscribed, as a record that they did?",
            ],
          },
          {
            kind: "p",
            text: "Every one of those has a correct answer from your business's point of view and a different answer from your invoice's. Pruning a list to reduce a bill is a strange thing to be doing, and keeping no record of who opted out is actively risky: if you cannot see that someone unsubscribed in 2024, nothing stops a fresh import mailing them in 2026.",
          },
          {
            kind: "p",
            text: "When subscribers are free, all four questions collapse into one answer: keep the accurate list. That is worth something, even though it does not appear on either side of the price comparison.",
          },
        ],
      },
      {
        heading: "What to check beyond the meter",
        blocks: [
          {
            kind: "p",
            text: "Price per email is the headline, but three mechanics change the real cost more than the rate does.",
          },
          {
            kind: "list",
            items: [
              "Overage behaviour. Does exceeding your allowance charge you automatically, throttle you, or stop sending? An automatic overage on a per-send plan can turn a mistake into an invoice, which is why a hard cap is worth having.",
              "Rollover. Most allowances reset monthly and do not carry forward, so an occasional sender should size the plan to the month they actually send rather than to their annual average.",
              "Whether transactional counts. If your app sends password resets and receipts, running them through the same allowance is usually cheaper than a second vendor, but only if the allowance is sized for both. Add them to the numerator before you pick a tier.",
            ],
          },
          {
            kind: "note",
            title: "Do the arithmetic on your own numbers",
            text: "We are obviously not a neutral party here, and there is a real range of list shapes where a per-subscriber tool is the cheaper choice. Work out your own intensity before taking anyone's word for it, including ours.",
          },
        ],
      },
      {
        heading: "How day3 prices it",
        blocks: [
          {
            kind: "p",
            text: "day3 meters sends only. Subscribers are unlimited on every paid plan, transactional email through the API draws on the same monthly allowance as campaigns, and there is no overage: sending pauses at the cap rather than billing past it. Plans run from $1/mo for 1,000 emails up to $220/mo for 1,000,000, and you can move between them as your sending changes.",
          },
          {
            kind: "p",
            text: "Which means the honest summary of who should pick it: if your intensity is comfortably below 1 and your list is growing, this model is built for you. If you send a daily letter to a few thousand people, it is not, and a per-subscriber tool will serve you better.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is per-send or per-subscriber email pricing cheaper?",
        a: "It depends on your send intensity: monthly sends divided by subscriber count. Below about 1, meaning you do not email your whole list every month, per-send pricing is cheaper and the gap widens as the list grows. Above about 1, per-subscriber pricing can be cheaper.",
      },
      {
        q: "Why does my email bill go up when I have not sent more email?",
        a: "Because your tool meters subscribers rather than sends, so the bill tracks list growth. Crossing a subscriber tier raises the price whether or not you send anything that month.",
      },
      {
        q: "Does transactional email count toward a send allowance?",
        a: "On day3, yes: password resets, receipts and magic links draw on the same monthly allowance as campaigns, which is usually cheaper than paying a second vendor. Add your transactional volume to your monthly sends before choosing a tier.",
      },
      {
        q: "What happens if I go over my monthly email limit?",
        a: "On day3 sending pauses at the cap with no overage charge. Not every tool works that way, so it is worth checking: an automatic overage on a per-send plan can turn one mistargeted campaign into a large invoice.",
      },
      {
        q: "Do unused emails roll over to next month?",
        a: "On day3, no, and on most tools, no. Allowances reset each billing period. If you send rarely but heavily, size the plan to the month you actually send rather than to your monthly average.",
      },
    ],
    related: [
      "page:/how-it-works",
      "page:/pricing",
      "compare:mailchimp-alternative",
      "compare:convertkit-alternative",
      "for:startups",
      "feature:audiences",
    ],
  },

  // -------------------------------------------------------------- 4. GDPR
  {
    slug: "gdpr-double-opt-in",
    title: "Double opt-in and the GDPR: what you actually have to record",
    published: "2026-08-12",
    updated: "2026-08-12",
    readMinutes: 7,
    topic: "Compliance",
    metaTitle: "Does the GDPR require double opt-in for email?",
    metaDescription:
      "The GDPR never mentions double opt-in. It requires demonstrable consent. Here is the difference, what to record, and why double opt-in is still right.",
    keywords: [
      "gdpr double opt-in",
      "does gdpr require double opt in",
      "gdpr email consent",
      "demonstrable consent gdpr",
      "email marketing gdpr compliance",
      "consent record email list",
    ],
    summary:
      "Double opt-in is not a GDPR requirement. Demonstrable consent is, and double opt-in is the most practical way to produce it. The distinction matters, because it tells you what you actually have to store.",
    keyTakeaways: [
      "The GDPR does not mention double opt-in anywhere. It requires that consent be freely given, specific, informed and unambiguous, and that you be able to demonstrate it (Articles 4(11) and 7(1)).",
      "Double opt-in is evidence, not compliance. It is the cheapest way to produce the evidence Article 7(1) asks for.",
      "What to record: what they agreed to, the exact wording shown, when, and from where.",
      "Pre-ticked boxes are not consent. The CJEU settled that in Planet49 (C-673/17).",
      "Withdrawing consent must be as easy as giving it (Article 7(3)), which is a direct argument for one-click unsubscribe.",
      "This is a description of the rules, not legal advice. Get advice for your own situation.",
    ],
    sections: [
      {
        heading: "What the regulation actually says",
        blocks: [
          {
            kind: "p",
            text: "Search the GDPR text for \"double opt-in\" and you will find nothing, because the phrase is an industry practice rather than a legal term. What the regulation gives you is a definition and an obligation.",
          },
          {
            kind: "p",
            text: "Article 4(11) defines consent as \"any freely given, specific, informed and unambiguous indication of the data subject's wishes by which he or she, by a statement or by a clear affirmative action, signifies agreement to the processing of personal data relating to him or her\". Article 7(1) then adds the part that shapes your database: \"the controller shall be able to demonstrate that the data subject has consented\".",
          },
          {
            kind: "p",
            text: "So the requirement is not a particular signup flow. It is that you can show, later, that a specific person agreed to a specific thing at a specific time. Everything about double opt-in follows from trying to satisfy that cheaply.",
          },
          {
            kind: "note",
            title: "Not legal advice",
            text: "This is a plain-language description of what the rules say and how it maps onto the fields you need in a database. Your obligations depend on where you and your subscribers are, what you send, and how you got the addresses. Ask a lawyer about your specific case.",
          },
        ],
      },
      {
        heading: "Why single opt-in usually fails the evidence test",
        blocks: [
          {
            kind: "p",
            text: "A single opt-in form adds whatever was typed into it. That means the record you hold is \"someone, using this browser, typed this address into our form\". Which is not quite the claim you need to make, because you cannot show that the person who typed it is the person who owns the address.",
          },
          {
            kind: "p",
            text: "In practice single opt-in lists accumulate four kinds of entry that undermine both your compliance position and your deliverability: typos, other people's addresses entered maliciously or carelessly, bot submissions, and spam-trap addresses seeded specifically to catch senders who do not verify.",
          },
          {
            kind: "p",
            text: "Double opt-in closes the gap with one step. The address receives a confirmation email and nothing is sent to it until someone clicks the link inside. Now your record says \"the person who controls this mailbox took an affirmative action\", which is much closer to what Article 4(11) describes.",
          },
        ],
      },
      {
        heading: "The fields to store",
        blocks: [
          {
            kind: "p",
            text: "If Article 7(1) is the requirement, then your consent record is the deliverable. At minimum it should capture:",
          },
          {
            kind: "table",
            head: ["Field", "Why it matters"],
            rows: [
              [
                "Timestamp of consent",
                "Establishes when, which matters for withdrawal, retention and any dispute",
              ],
              [
                "Source",
                "Which form, page, or import. Ties the consent to a context you can describe",
              ],
              [
                "The exact wording shown",
                "\"Informed\" means informed about something specific. If your wording changed in 2025, you need to know which version this person saw",
              ],
              [
                "Confirmation timestamp",
                "For double opt-in, the moment the link was clicked. This is the affirmative action itself",
              ],
              [
                "IP address",
                "Corroborating detail. Not required by name, but it is what turns a claim into a record",
              ],
              [
                "Withdrawal timestamp",
                "When they unsubscribed. Keeping this is how you prove you honoured it, and how you avoid re-mailing them after a future import",
              ],
            ],
          },
          {
            kind: "p",
            text: "That last row is the one people delete, on the theory that removing someone means removing their data. It does not follow. Keeping a suppression record of an address that asked never to be contacted is generally the more defensible position than deleting it and mailing them again next year, and it is usually treated as compatible with the original purpose rather than a new one.",
          },
        ],
      },
      {
        heading: "Three things that are not consent",
        blocks: [
          {
            kind: "list",
            items: [
              "A pre-ticked box. The Court of Justice settled this in Planet49 (C-673/17, 2019): consent requires an active choice, and a box the user has to untick is not one.",
              "Consent bundled into terms acceptance. \"Specific\" means the marketing consent has to be separable from signing up for the service. If declining the newsletter means not being able to use the product, the consent was not freely given.",
              "A purchased or scraped list. Whoever sold it to you cannot transfer consent that was given to them, if it was given at all. There is no version of this that produces a record you could show anyone.",
            ],
          },
          {
            kind: "p",
            text: "Worth separating from all of this: consent is not the only lawful basis, and marketing to your own existing customers about similar products may be permissible on a different footing. That route comes from the ePrivacy Directive rather than the GDPR, it is implemented differently in each member state, and it is narrower than most people hope. Do not assume it covers you without checking.",
          },
        ],
      },
      {
        heading: "Withdrawal has to be as easy as consent",
        blocks: [
          {
            kind: "p",
            text: "Article 7(3): \"It shall be as easy to withdraw as to give consent.\" If signing up took one click on a form, then leaving should take one click too, and a preferences centre that requires a login and four screens does not meet that standard.",
          },
          {
            kind: "p",
            text: "This lines up neatly with the deliverability argument for one-click unsubscribe, which is the rare case where the compliance requirement and the self-interested move are the same thing. Friction on the way out converts unsubscribes into spam complaints, and spam complaints cost you far more.",
          },
        ],
      },
      {
        heading: "How day3 handles it",
        blocks: [
          {
            kind: "p",
            text: "Double opt-in is on by default on every signup form, and you can turn it off per form for the cases where it makes sense, such as a form behind a login where the address is already verified. Confirmed signups store the consent timestamp and the originating IP address.",
          },
          {
            kind: "p",
            text: "Unsubscribes are honoured immediately, written to a per-sender suppression list that survives re-import, and one-click unsubscribe headers go on every campaign. day3 is a Danish company with EU-only hosting and sub-processors, offers a DPA, and lists every sub-processor publicly.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Does the GDPR require double opt-in?",
        a: "No. The GDPR never mentions double opt-in. It requires that consent be freely given, specific, informed and unambiguous, and that you be able to demonstrate it. Double opt-in is the most practical way to produce that evidence, which is why it is treated as the standard, but it is not itself a legal requirement.",
      },
      {
        q: "What do I need to record to prove email consent?",
        a: "When they consented, what form or page it came from, the exact wording they were shown, the confirmation timestamp if you use double opt-in, and ideally the originating IP. Keep the withdrawal timestamp too, so you can show you honoured an unsubscribe.",
      },
      {
        q: "Are pre-ticked consent boxes allowed?",
        a: "No. The Court of Justice of the European Union settled this in Planet49 (C-673/17): consent requires a clear affirmative action, and a box the user must untick does not qualify.",
      },
      {
        q: "Can I email customers without consent under legitimate interest?",
        a: "Sometimes, for existing customers about similar products, but that route comes from the ePrivacy Directive rather than the GDPR, is implemented differently in each member state, and is narrower than most senders assume. Do not rely on it without advice specific to your situation.",
      },
      {
        q: "Should I delete contacts who unsubscribe?",
        a: "Usually not entirely. Keeping a suppression record of an address that asked not to be contacted is what stops a future import from mailing them again, and is generally more defensible than deleting the record and re-adding them by accident later.",
      },
      {
        q: "Is buying an email list ever GDPR compliant?",
        a: "In practice, no. Consent given to one company cannot be transferred to another, and you would have no record showing what any individual on the list agreed to. It is also the fastest way to collect spam-trap hits and destroy your sending reputation.",
      },
    ],
    related: [
      "page:/gdpr",
      "feature:signup-forms",
      "blog:one-click-unsubscribe-rfc-8058",
      "page:/legal/dpa",
      "page:/security",
      "page:/legal/subprocessors",
    ],
  },

  // ------------------------------------------------------ 5. one domain
  {
    slug: "transactional-and-marketing-one-domain",
    title: "Sending transactional and marketing email from one domain",
    published: "2026-08-12",
    updated: "2026-08-12",
    readMinutes: 8,
    topic: "Deliverability",
    metaTitle: "Transactional and marketing email on one domain",
    metaDescription:
      "Whether to send both kinds of mail from one domain, when subdomain separation is worth it, and the behaviours that must differ between them whatever you decide.",
    keywords: [
      "transactional vs marketing email",
      "separate subdomain for marketing email",
      "email sending domain reputation",
      "transactional email deliverability",
      "one domain for all email",
    ],
    summary:
      "Most teams end up with two email vendors, two sending identities and two reputations to watch. Consolidating is usually right, splitting by subdomain is sometimes right, and a few behaviours must differ either way.",
    keyTakeaways: [
      "Reputation attaches largely to the domain in your DKIM d= value, so what shares a domain shares a fate.",
      "At low to moderate volume, one well-authenticated domain is simpler and performs fine.",
      "At higher volume, or if your marketing mail attracts complaints, move bulk to a subdomain and keep transactional on the cleaner one.",
      "Whatever you choose: unsubscribes must apply to marketing and must not block transactional.",
      "Never put marketing content in a transactional message. It reclassifies the message and takes its exemptions with it.",
    ],
    sections: [
      {
        heading: "How the split usually happens",
        blocks: [
          {
            kind: "p",
            text: "Nobody designs this. Engineering needs password resets to work, so they wire up an email API. Later someone wants to send a product update, and a marketing tool is the obvious thing for that, so it gets set up separately. Both work. Nothing looks wrong.",
          },
          {
            kind: "p",
            text: "What you have acquired is two sending identities on the same brand, two reputations that mailbox providers score independently, two dashboards to check when a customer says an email never arrived, and two invoices for what is arguably one job. The cost is not obvious until the day the two interact.",
          },
        ],
      },
      {
        heading: "What reputation actually attaches to",
        blocks: [
          {
            kind: "p",
            text: "Mailbox providers score several identities at once: the sending IP, the domain in your DKIM `d=` value, and increasingly the brand as a whole. For most senders on shared provider infrastructure, the domain is the identity that matters most, because the IP is shared with other customers and the provider manages it.",
          },
          {
            kind: "p",
            text: "That has a direct consequence. If your marketing campaigns and your password resets both sign as `d=example.com`, they share one reputation. A campaign that collects complaints degrades the deliverability of the mail your product depends on, and a password reset that lands in spam is a support ticket and possibly a lost customer.",
          },
          {
            kind: "p",
            text: "The conservative response is subdomain separation: bulk mail signs as `mail.example.com`, transactional as `notify.example.com` or the root. Reputation is then tracked mostly separately, and a bad campaign is contained.",
          },
          {
            kind: "note",
            title: "Subdomains are not a firewall",
            text: "Providers do consider the parent domain and the overall brand, so a subdomain does not fully isolate you. It reduces blast radius; it does not eliminate it. Treat it as containment rather than as permission to send worse mail.",
          },
        ],
      },
      {
        heading: "When to consolidate and when to split",
        blocks: [
          {
            kind: "table",
            caption: "Which shape fits which situation",
            head: ["Your situation", "What to do"],
            rows: [
              [
                "Under a few tens of thousands of emails a month, permission-based list, complaint rate well under 0.1%",
                "One domain. The operational simplicity is worth more than the marginal isolation",
              ],
              [
                "Growing volume, or campaigns to a list you did not build entirely yourself",
                "Split: bulk on a subdomain, transactional on the root or its own subdomain",
              ],
              [
                "Any history of deliverability trouble on the marketing side",
                "Split, and keep transactional as far from it as you can",
              ],
              [
                "Two vendors today, both working, low volume",
                "Consolidating is still usually worth it for the single reputation and single allowance, but this is the least urgent case",
              ],
            ],
          },
          {
            kind: "p",
            text: "The thing worth avoiding in all four rows is the accidental version: two vendors, two reputations, nobody watching either, discovered when something breaks. Choosing one shape deliberately beats drifting into the other.",
          },
        ],
      },
      {
        heading: "What must differ between the two kinds",
        blocks: [
          {
            kind: "p",
            text: "Whether or not they share a domain, transactional and marketing mail have to behave differently in three specific ways.",
          },
          {
            kind: "list",
            items: [
              "Unsubscribes apply to marketing and must not apply to transactional. Someone who left your newsletter still needs their password reset and their receipt. Suppressing those because of a marketing opt-out is a broken product, not compliance.",
              "Hard bounces and complaints apply to both. A dead address is dead whatever you send it, and continuing to mail it damages your reputation regardless of the message type.",
              "One-click unsubscribe headers go on marketing only. Putting RFC 8058 headers on a password reset invites someone to opt out of a message they need.",
            ],
          },
          {
            kind: "p",
            text: "There is a fourth rule that is less about mechanics and more about not undermining yourself: do not put marketing content into transactional messages. A receipt with a promotion attached is, in most regulators' view and certainly in most recipients' view, a marketing message. It then needs an unsubscribe mechanism, and worse, it teaches people that your transactional mail is worth ignoring. The value of a receipt is that it is always relevant. Spend that carefully.",
          },
        ],
      },
      {
        heading: "The operational argument for consolidating",
        blocks: [
          {
            kind: "p",
            text: "The reputation argument cuts both ways, which is why the deciding factor for most small teams is operational rather than technical.",
          },
          {
            kind: "p",
            text: "With one system, a customer saying \"I never got the reset\" is one search. Monthly volume is one number against one allowance rather than two subscriptions sized independently and both slightly wrong. Domain authentication is done once. Bounce and complaint rates are one pair of gauges rather than two you have to remember to check separately. There is one place suppressions live, so an address that hard-bounced on a campaign is also refused for transactional, which is what you want and is easy to get wrong across two vendors.",
          },
          {
            kind: "p",
            text: "That last point is the underrated one. Split across two systems, suppression lists diverge. The marketing tool knows an address bounced; the transactional service does not, and keeps trying. Every one of those attempts is a small deposit against your reputation.",
          },
        ],
      },
      {
        heading: "How day3 handles it",
        blocks: [
          {
            kind: "p",
            text: "Campaigns and transactional email both leave the same verified domain and draw on the same monthly allowance, so a month of 18,000 password resets and 2,000 launch notes is a 20,000-email month on one bill. `POST /v1/emails` takes an Idempotency-Key so a network retry can never double-send a reset, even when the retry races the original request.",
          },
          {
            kind: "p",
            text: "The behavioural differences above are built in rather than left to you: unsubscribes are ignored for transactional and enforced for campaigns, hard bounces and complaints are refused for both from one shared suppression list, and one-click unsubscribe headers are added to campaigns only. If you would rather split by subdomain, verify the subdomain as its own sending domain and use it for campaigns.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Should I use a separate subdomain for marketing email?",
        a: "At higher volume or if your campaigns attract complaints, yes: put bulk mail on a subdomain and keep transactional on a cleaner one, so a bad campaign does not degrade your password resets. Under a few tens of thousands of emails a month with a permission-based list, one well-authenticated domain is simpler and performs fine.",
      },
      {
        q: "Can transactional and marketing email share a sending domain?",
        a: "Yes, and for small teams it is usually the better trade: one reputation to keep clean, one suppression list, one allowance, one place to look when an email does not arrive. The risk is that complaints on campaigns affect transactional deliverability, which is what subdomain separation mitigates.",
      },
      {
        q: "Do unsubscribes apply to transactional email?",
        a: "They should not. Someone who unsubscribed from your newsletter still needs their password reset and receipts, so a marketing opt-out must not suppress transactional mail. Hard bounces and spam complaints do apply to both, because those addresses damage your reputation whatever you send.",
      },
      {
        q: "Can I put a promotion in a receipt?",
        a: "Better not to. Adding marketing content to a transactional message tends to reclassify it as marketing, which brings unsubscribe obligations with it, and it trains recipients to treat your transactional mail as ignorable. The value of a receipt is that it is always relevant.",
      },
      {
        q: "What is the risk of using two separate email vendors?",
        a: "Two reputations scored independently, two dashboards, two allowances, and most importantly two suppression lists that drift apart. When the transactional service does not know an address hard-bounced on a campaign, it keeps mailing it, and every attempt costs you reputation.",
      },
    ],
    related: [
      "feature:api",
      "blog:spf-dkim-dmarc-explained",
      "compare:resend-alternative",
      "for:saas",
      "page:/deliverability",
      "feature:metrics",
    ],
  },

  // ------------------------------------------------------- 6. migration
  {
    slug: "migrate-email-list-without-losing-deliverability",
    title: "How to migrate an email list without wrecking your deliverability",
    published: "2026-08-12",
    updated: "2026-08-12",
    readMinutes: 8,
    topic: "Deliverability",
    metaTitle: "Migrate an email list without hurting deliverability",
    metaDescription:
      "The order matters: suppressions before contacts, same domain if you can, first send to your most engaged segment. A checklist for moving providers safely.",
    keywords: [
      "migrate email list",
      "change email marketing provider",
      "email list migration deliverability",
      "import suppression list",
      "domain warm up email",
      "switch email provider safely",
    ],
    summary:
      "Moving providers is mostly a data-import problem with one deliverability trap in it. Get the order right and mailbox providers barely notice. Get it wrong and you can undo years of reputation in one send.",
    keyTakeaways: [
      "Import your suppression list before your contacts, not after. This is the step people skip and the only one that is genuinely hard to undo.",
      "Keep the same sending domain if you can. Reputation follows the domain, so keeping it means keeping most of what you built.",
      "Import unsubscribed contacts as unsubscribed. A migration must never re-subscribe someone.",
      "Send your first campaign to your most engaged segment, not the whole list.",
      "If the list has been dormant for a year or more, treat it as needing re-permission rather than a warm-up.",
    ],
    sections: [
      {
        heading: "What you are actually protecting",
        blocks: [
          {
            kind: "p",
            text: "Two things carry your sending reputation: the domain you send from and, to a lesser degree for most senders, the IP address. On shared provider infrastructure the IP belongs to the provider and is their problem. The domain is yours, and it is where the value you have accumulated lives.",
          },
          {
            kind: "p",
            text: "That is the single most useful fact about migrations. If you keep the same sending domain, you keep most of your reputation, and the move is closer to invisible than people expect. If you change domain at the same time as changing provider, you are starting from zero on the identity that matters and doing it while also changing everything else.",
          },
          {
            kind: "p",
            text: "So: change one thing at a time. Move providers on your existing domain. If you also want to move to a subdomain for bulk mail, do that as a separate, later step with its own warm-up.",
          },
        ],
      },
      {
        heading: "Suppressions first. Always.",
        blocks: [
          {
            kind: "p",
            text: "Your suppression list is every address that hard-bounced, complained, or explicitly asked never to hear from you again. It is the most valuable file in your old account and the one nobody thinks to export.",
          },
          {
            kind: "p",
            text: "If you import contacts before suppressions, there is a window in which your new tool believes those addresses are mailable. If a campaign goes out in that window, you have mailed people who complained about you and addresses that are known dead, both of which are exactly what mailbox providers watch for. Some of those dead addresses will be spam traps, and a trap hit is worth considerably more damage than an ordinary bounce.",
          },
          {
            kind: "p",
            text: "Import them in the right order and something reassuring happens: the contact rows matching your suppression list get refused on the way in. That looks like an import error and is actually the guard working. Expect it, rather than debugging it.",
          },
          {
            kind: "note",
            title: "This is the irreversible one",
            text: "Almost every other mistake in a migration is fixable afterwards. Mailing your suppression list is not: the complaints are recorded, the trap hits are recorded, and you cannot take them back. If you do one thing from this article, do this one.",
          },
        ],
      },
      {
        heading: "The order of operations",
        blocks: [
          {
            kind: "steps",
            items: [
              "Export everything from the old provider while you still have access: contacts, custom fields, unsubscribes, and the suppression or blocklist. Do this before you cancel anything.",
              "Import the suppression list into the new tool.",
              "Import contacts, preserving status. Unsubscribed stays unsubscribed, with the original date if the format allows it.",
              "Map custom fields and rebuild segments. Check that merge tags resolve before you rely on them in a subject line.",
              "Authenticate the sending domain: DKIM signing as your domain, SPF including the new provider, DMARC left as it is if you already have one.",
              "Send a test to yourself and to a couple of colleagues on different mail providers. Check it renders, check the unsubscribe link works, check the From address is what you expect.",
              "Send the first real campaign to your most engaged segment only.",
              "Watch bounce and complaint rates on that send before widening.",
            ],
          },
          {
            kind: "p",
            text: "Step 5 is worth a note if you are keeping your old provider running in parallel: leave their DKIM selector and their SPF include in place until you have fully cut over. Both providers can authenticate the same domain simultaneously, because DKIM selectors are independent. Removing the old records early is a common way to break mail that is still in flight.",
          },
        ],
      },
      {
        heading: "The first send",
        blocks: [
          {
            kind: "p",
            text: "Resist the urge to make your first campaign on the new tool a big one. Not because the tool might fail, but because the first send is your only cheap chance to see whether anything is subtly wrong before it is wrong at scale.",
          },
          {
            kind: "p",
            text: "Send to your most engaged segment: the people who opened something recently. Their engagement is a positive signal, their bounce rate will be near zero because the addresses are demonstrably live, and their complaint rate will be low because they remember signing up. That is the best possible first impression to give a mailbox provider that is seeing a new sending path for your domain.",
          },
          {
            kind: "p",
            text: "Then read the numbers before widening. Bounce rate should be a fraction of a percent on an engaged segment; if it is higher, your import brought in rows it should not have. Complaint rate should be near zero; if it is not, you may have contacts on the list who do not remember you, which is a list problem rather than a migration problem.",
          },
        ],
      },
      {
        heading: "The dormant list problem",
        blocks: [
          {
            kind: "p",
            text: "There is one case where none of the above is enough, and it is common: the list you are migrating has not been emailed in a year or more.",
          },
          {
            kind: "p",
            text: "Those addresses have decayed. People changed jobs, providers recycled abandoned mailboxes into spam traps, and the ones that still work belong to people who have forgotten you exist. Mailing that list is a bad idea on any provider and a worse idea as your first send on a new one.",
          },
          {
            kind: "p",
            text: "Treat it as a re-permission exercise rather than a warm-up. Send to the most recently active slice, in small batches, and watch the numbers. Do not send to anyone who has not engaged in two years without accepting that you are gambling reputation on them. Under the GDPR there is a further question about whether consent that old is still a live basis for contacting someone, which is worth asking before the deliverability question.",
          },
        ],
      },
      {
        heading: "How day3 handles it",
        blocks: [
          {
            kind: "p",
            text: "Suppressions can be pushed straight in through the API before any contacts, and doing so makes day3 refuse the matching contact rows on import. CSV import takes email, first_name and last_name, dedupes, reports per-row results, and lets you retry only the rows that failed rather than restarting the batch. The API takes up to 1,000 contacts per call and upserts by plain email address, so a re-run is safe.",
          },
          {
            kind: "p",
            text: "Contacts already marked unsubscribed import with that status and the date they left. Domain verification publishes DKIM, SPF and DMARC through Cloudflare automatically, or hands you the records for any other DNS host, and rechecks until it verifies. Bounce and complaint gauges are scaled to the provider's own thresholds, so the first send tells you whether the import was clean.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "How do I move an email list to a new provider without hurting deliverability?",
        a: "Import your suppression list first, then contacts with their statuses preserved, keep the same sending domain, authenticate it properly, and send your first campaign to your most engaged segment rather than the whole list. Changing provider and domain at the same time is the main thing to avoid.",
      },
      {
        q: "Why should I import suppressions before contacts?",
        a: "Because until the suppression list is in place, your new tool believes those addresses are mailable. A campaign in that window mails people who complained about you and addresses that are known dead, some of which are spam traps. It is the one migration mistake you cannot undo.",
      },
      {
        q: "Do I need to warm up a new email provider?",
        a: "If you keep the same sending domain, far less than people assume, because reputation follows the domain rather than the tool. Ramping your first few sends and starting with engaged recipients is still sensible. A genuine warm-up matters when you change domain or subdomain.",
      },
      {
        q: "Can two email providers authenticate the same domain at once?",
        a: "Yes. DKIM selectors are independent, so each provider publishes its own key under its own selector, and SPF can include both. Keep the old records in place until you have fully cut over: removing them early breaks mail that is still in flight.",
      },
      {
        q: "What should I do with a list I have not emailed in over a year?",
        a: "Treat it as needing re-permission rather than a warm-up. Send to the most recently engaged slice in small batches and watch bounce and complaint rates. Old addresses decay into spam traps, and there is a separate GDPR question about whether consent that old still supports contacting someone.",
      },
    ],
    related: [
      "compare:mailchimp-alternative",
      "feature:api",
      "blog:spf-dkim-dmarc-explained",
      "feature:audiences",
      "page:/deliverability",
      "compare:resend-alternative",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

/** Newest first, for the index and the sitemap. */
export function sortedBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.published.localeCompare(a.published));
}
