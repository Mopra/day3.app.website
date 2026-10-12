# Warriv's memory

## Rules
- GA4 (property 542844170): sign_up is the key event and means a real account, fired server-side by the day3.app repo. CTA clicks on this site stay signup_click (with ga_cid). Never ship CTA clicks as sign_up.

## Lately
- 2026-10-12 Track sign_up did not merge (907280f); left it unmerged on purpose and noted why. Filed "Verify GA4 sign_up from completed app sign-ups" (sonnet) to replace the old verify quest, marked it superseded.
- 2026-10-12 Look back: the day was clean, nothing went wrong twice.
- 2026-10-12 Round: branch track-sign-up-as-a-ga4-key-event (907280f) is superseded by the app's server-side sign_up (day3.app b3bb266) and main's d687c5a. Noted on the Verify quest to check the app-side sign_up instead and drop the branch.

## Open
- "Verify GA4 sign_up from day3.app CTAs" is superseded; close it if the human has not. Branch track-sign-up-as-a-ga4-key-event stays unmerged; the human may delete it.
- day3.app b3bb266 is committed but not pushed (main ahead 1). The new verify quest waits on it and on this site's d687c5a shipping.
