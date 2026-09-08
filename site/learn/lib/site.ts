// Site-wide constants. NEXT_PUBLIC_APP_URL lets previews carry their own origin.

/**
 * The origin, with any trailing slash removed.
 *
 * Every consumer builds URLs as `${SITE_URL}/something`, so an origin that
 * ends in a slash yields `https://host//topics/bitcoin` — a different URL to
 * a crawler, in the sitemap, in every canonical tag and in every JSON-LD
 * `@id`. Vercel's own `NEXT_PUBLIC_*` values are routinely pasted with the
 * slash on, so the normalisation belongs here rather than at each of the
 * dozen call sites.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://learn.rapold.io").replace(
  /\/+$/,
  "",
);

/** Bare hostname, for the places that want a host rather than an origin. */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

export const TITLE = "ÆON Learn — any subject, deeply researched, built around you";

// ~150 chars, key benefit first (SERP-safe). Tested to stay <= 170.
export const DESCRIPTION =
  "Turn any subject into a researched, adaptive learning journey. One sentence to your AI agent — the open ÆON protocol does the rest. No account.";
