/**
 * IndexNow, the push protocol Bing, Yandex, Seznam and Naver share.
 *
 * Why bother when Google ignores it: Search Console currently reports two of
 * day3's three commercial hub pages as "URL is unknown to Google" and a third as
 * "Discovered, currently not indexed", while every leaf page beneath them is
 * indexed. That is a crawl-budget symptom, and a new domain cannot buy its way
 * out of it. IndexNow does not fix Google, but it removes the same delay
 * everywhere else at no cost, and Bing is what several AI answer engines index
 * from, which is a channel day3 already gets its best engagement from.
 *
 * The key must be served as a text file at the site root whose body is the key
 * itself; that is how the API proves the submitter controls the domain. See
 * app/[key].txt/route.ts.
 */
export const INDEXNOW_KEY = "cac1ab0e296af13c30940d9f43749e12";

export const INDEXNOW_KEY_FILE = `${INDEXNOW_KEY}.txt`;
