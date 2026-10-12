# Warriv's memory

## Rules
- GA4 (property 542844170): sign_up is the key event and means a real account, fired server-side by the day3.app repo. CTA clicks on this site stay signup_click (with ga_cid). Never ship CTA clicks as sign_up.

## Lately
- 2026-10-12 Round: nothing to do. Only open quest waits on the human; latest main is already live (signup_click in the bundle), no aims, no check stone to cast.
- 2026-10-12 Stall wake: the last open quest, "Verify GA4 sign_up from completed app sign-ups", is blocked on the human's test sign-up. Noted it; nothing else to do, no aims open.
- 2026-10-12 Stall wake: d687c5a reached origin/main, so "Verify GA4 sign_up from completed app sign-ups" resumed by itself. Nothing else to do; no aims open.
- 2026-10-12 Track sign_up did not merge (907280f); left it unmerged on purpose and noted why. Filed "Verify GA4 sign_up from completed app sign-ups" (sonnet) to replace the old verify quest, marked it superseded.
- 2026-10-12 Look back: the day was clean, nothing went wrong twice.
- 2026-10-12 Round: branch track-sign-up-as-a-ga4-key-event (907280f) is superseded by the app's server-side sign_up (day3.app b3bb266) and main's d687c5a. Noted on the Verify quest to check the app-side sign_up instead and drop the branch.

## Open
- Branch track-sign-up-as-a-ga4-key-event stays unmerged; the human may delete it.
- "Verify GA4 sign_up from completed app sign-ups" is blocked on the human: GA4 Realtime check plus a deletable test sign-up on go.day3.app (until 2026-10-13). Then the day-later socialsandbox ga4 check.
