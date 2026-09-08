import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Colour contrast, measured from the tokens themselves.
 *
 * globals.css already carries a note explaining why the dark theme's muted
 * foreground sits at 68% and not 60%. That reasoning only survives if
 * something checks it, so this recomputes every text pairing the site
 * actually renders and holds them to WCAG 1.4.3 — 4.5:1 for body copy, 3:1
 * for the non-text boundaries that carry meaning.
 */

const css = readFileSync(
  resolve(dirname(fileURLToPath(import.meta.url)), "globals.css"),
  "utf8",
);

/** The `:root { … }` and `.dark { … }` token blocks, as name → "h s% l%". */
function tokens(selector: string): Record<string, string> {
  const block = new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`).exec(css)?.[1];
  if (!block) throw new Error(`no ${selector} block in globals.css`);
  const found: Record<string, string> = {};
  for (const [, name, value] of block.matchAll(/--([a-z-]+):\s*([^;]+);/g)) {
    if (name && value) found[name] = value.trim();
  }
  return found;
}

const THEMES = {
  light: tokens(":root"),
  dark: tokens("\\.dark"),
};

function rgb(triplet: string): [number, number, number] {
  const parts = /^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/.exec(triplet);
  if (!parts) throw new Error(`not an HSL triplet: ${triplet}`);
  const h = Number(parts[1]) / 360;
  const s = Number(parts[2]) / 100;
  const l = Number(parts[3]) / 100;
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    const u = (t + 1) % 1;
    if (u < 1 / 6) return p + (q - p) * 6 * u;
    if (u < 1 / 2) return q;
    if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6;
    return p;
  };
  return [channel(h + 1 / 3), channel(h), channel(h - 1 / 3)];
}

function luminance(colour: [number, number, number]): number {
  const [r, g, b] = colour.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [
    number,
    number,
    number,
  ];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(theme: keyof typeof THEMES, foreground: string, background: string): number {
  const palette = THEMES[theme];
  const fg = palette[foreground];
  const bg = palette[background];
  if (!fg || !bg) throw new Error(`missing token ${foreground} or ${background} in ${theme}`);
  const a = luminance(rgb(fg));
  const b = luminance(rgb(bg));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Every foreground/background pair the components actually put text in. */
const TEXT_PAIRS: [string, string][] = [
  ["foreground", "background"],
  ["foreground", "card"],
  ["muted-foreground", "background"],
  ["muted-foreground", "card"],
  ["muted-foreground", "secondary"],
  ["card-foreground", "card"],
  ["primary", "background"],
  ["primary", "card"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["accent-foreground", "accent"],
];

/* `popover` and `destructive` are declared by the shadcn-style palette this
   file follows but nothing in the site renders either of them, so neither is
   a pairing the page can actually put text in. The dark theme's
   destructive-foreground on destructive measures 4.21:1 and would need
   lifting before anything used it — noted here rather than asserted, because
   asserting on a colour no page shows is a test that fails for nobody. */

describe.each(["light", "dark"] as const)("%s theme", (theme) => {
  it.each(TEXT_PAIRS)("%s on %s reaches 4.5:1", (foreground, background) => {
    expect(contrast(theme, foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps the focus ring visible against the page", () => {
    // WCAG 1.4.11: the ring is a non-text indicator, so 3:1.
    expect(contrast(theme, "ring", "background")).toBeGreaterThanOrEqual(3);
    expect(contrast(theme, "ring", "card")).toBeGreaterThanOrEqual(3);
  });

  it("defines every token the components reference", () => {
    for (const [foreground, background] of TEXT_PAIRS) {
      expect(Object.keys(THEMES[theme])).toContain(foreground);
      expect(Object.keys(THEMES[theme])).toContain(background);
    }
  });
});

describe("the focus ring itself", () => {
  it("is still declared for links and buttons", () => {
    // A utility class once overrode this for every control wearing
    // buttonVariants; the rule going missing entirely would be worse.
    expect(css).toMatch(/a:focus-visible,\s*\n?\s*button:focus-visible\s*\{[^}]*outline:/);
  });
});

/** Every `@media (prefers-reduced-motion: reduce)` block, brace-matched so
 *  nested rules come along with it. */
function reducedMotionBlocks(): string[] {
  const blocks: string[] = [];
  const marker = "@media (prefers-reduced-motion: reduce)";
  for (let at = css.indexOf(marker); at !== -1; at = css.indexOf(marker, at + 1)) {
    let depth = 0;
    let end = css.indexOf("{", at);
    const from = end;
    while (end < css.length) {
      if (css[end] === "{") depth += 1;
      if (css[end] === "}") {
        depth -= 1;
        if (depth === 0) break;
      }
      end += 1;
    }
    blocks.push(css.slice(from, end + 1));
  }
  return blocks;
}

describe("motion", () => {
  it("disables every named animation under prefers-reduced-motion", () => {
    // Only classes that actually declare an animation; `.aeon-topic-art`
    // shares the prefix but is a background-image utility.
    const declared = [
      ...css.matchAll(/^ {2}\.(animate-[a-z-]+|aeon-[a-z-]+)[^{]*\{([^}]*)\}/gm),
    ]
      .filter(([, , body]) => /\banimation:/.test(body ?? ""))
      .map(([, name]) => name);
    expect(declared.length).toBeGreaterThan(0);

    const silenced = reducedMotionBlocks().join("\n");
    expect(silenced).toContain("animation: none");
    for (const name of declared) {
      expect(silenced, `.${name} keeps animating under reduced motion`).toContain(`.${name}`);
    }
  });

  it("stops smooth scrolling under prefers-reduced-motion", () => {
    expect(reducedMotionBlocks().join("\n")).toContain("scroll-behavior: auto");
  });

  it("forces the scroll reveal visible under reduced motion and without scripting", () => {
    // The CSS half of components/reveal.tsx: if either escape hatch went
    // missing, content would sit at opacity 0 for the people least able to
    // wait for it.
    expect(reducedMotionBlocks().join("\n")).toMatch(/\.reveal\s*\{[^}]*opacity: 1/);
    expect(css).toMatch(/@media \(scripting: none\)[\s\S]*?\.reveal\s*\{[^}]*opacity: 1/);
  });
});
