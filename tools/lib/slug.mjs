/**
 * GitHub heading anchors.
 *
 * GitHub slugs the *rendered* heading text, not its Markdown source, then
 * de-duplicates repeats with a numeric suffix. Both steps are reproduced here
 * so that `[text](#anchor)` can be resolved without rendering the document.
 */

/**
 * Remove raw HTML tags, repeating until the text stops changing.
 *
 * Today's greedy pattern already leaves nothing re-formable: matching is
 * leftmost-first, so a `<` only survives when no `>` follows it, and a second
 * pass provably changes nothing. Looping makes that independent of the
 * pattern, which a lazy quantifier would break. Each pass strictly shortens
 * the string, so this terminates.
 *
 * Nothing here reaches HTML in any case: the result becomes an anchor slug,
 * and `slugify` drops every character outside letters, numbers, marks,
 * underscore, hyphen and whitespace — angle brackets included.
 *
 * @param {string} text
 * @returns {string}
 */
function stripTags(text) {
  let previous;
  let stripped = text;
  do {
    previous = stripped;
    stripped = stripped.replace(/<[^>]+>/g, "");
  } while (stripped !== previous);
  return stripped;
}

/**
 * Reduce Markdown inline markup to the text a reader sees.
 *
 * Handles the constructs that occur in headings: code spans, emphasis, links,
 * images, raw HTML tags, backslash escapes and the optional ATX closing run.
 *
 * @param {string} raw heading source, without the leading `#` run
 * @returns {string} plain text
 */
export function renderInline(raw) {
  let text = raw;
  text = text.replace(/\s+#+\s*$/, ""); // closing ATX run
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1"); // images
  text = text.replace(/!\[([^\]]*)\]\[[^\]]*\]/g, "$1");
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1"); // inline links
  text = text.replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1"); // reference links
  text = stripTags(text); // raw HTML
  text = text.replace(/`+/g, ""); // code spans keep their content
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1");
  text = text.replace(/__([^_]+)__/g, "$1");
  text = text.replace(/\*([^*]+)\*/g, "$1");
  // Underscore emphasis only at word boundaries: `snake_case` is literal text.
  text = text.replace(/(^|\s)_([^_]+)_(?=\s|$)/g, "$1$2");
  text = text.replace(/\\([\\`*_{}[\]()#+\-.!<>|~])/g, "$1"); // escapes
  return text;
}

/**
 * Slug one piece of already-rendered text, GitHub's way: trim, lowercase, drop
 * everything that is not a letter, number, mark, underscore or hyphen, and turn
 * each remaining space into a hyphen.
 *
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}_\-\s]/gu, "")
    .replace(/\s/g, "-");
}

/**
 * Slug a raw Markdown heading, markup included.
 *
 * @param {string} raw heading source, without the leading `#` run
 * @returns {string}
 */
export function slugFromHeading(raw) {
  return slugify(renderInline(raw));
}

/**
 * A stateful slugger: the second heading that slugs to `overview` becomes
 * `overview-1`, the third `overview-2`, exactly as GitHub numbers repeats.
 *
 * @returns {(raw: string) => string}
 */
export function createSlugger() {
  /** @type {Map<string, number>} */
  const seen = new Map();
  return (raw) => {
    const base = slugFromHeading(raw);
    const count = seen.get(base);
    if (count === undefined) {
      seen.set(base, 1);
      return base;
    }
    seen.set(base, count + 1);
    return `${base}-${count}`;
  };
}
