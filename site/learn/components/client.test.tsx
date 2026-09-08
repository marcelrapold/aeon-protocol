// @vitest-environment jsdom
import { act, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CopyCommandButton } from "@/components/copy-command";
import { MobileNav } from "@/components/mobile-nav";
import { Reveal } from "@/components/reveal";
import { SiteNav } from "@/components/site-nav";

/**
 * The behaviour of the interactive components: what happens after a click,
 * after a second click, and after the element goes away.
 *
 * Rendered with react-dom/client straight into jsdom — no component-testing
 * framework, because none of these need one. Everything that matters here is
 * a timer, a listener or an observer, and the interesting cases are the ones
 * where two of them overlap.
 */

let host: HTMLDivElement;
let root: Root;

async function mount(element: ReactElement) {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(async () => {
    root.render(element);
  });
}

async function unmount() {
  await act(async () => {
    root.unmount();
  });
  host.remove();
}

async function click(element: Element | null | undefined) {
  await act(async () => {
    (element as HTMLElement).click();
  });
}

const button = () => host.querySelector("button");
const status = () => host.querySelector('[role="status"]')?.textContent ?? "";

function stubClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
    writable: true,
  });
}

const COPY = (
  <CopyCommandButton
    command="Teach me Bitcoin using learn.rapold.io"
    label="Copy"
    copiedLabel="Copied"
    copiedAnnounce="Copied to clipboard"
    failedAnnounce="Copy failed"
  />
);

describe("the copy control", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useRealTimers();
    Reflect.deleteProperty(navigator, "clipboard");
  });

  it("writes the command and says so", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    stubClipboard(writeText);
    await mount(COPY);

    expect(button()?.textContent).toContain("Copy");
    expect(status()).toBe("");

    await click(button());
    expect(writeText).toHaveBeenCalledWith("Teach me Bitcoin using learn.rapold.io");
    expect(button()?.textContent).toContain("Copied");
    expect(status()).toBe("Copied to clipboard");

    await act(async () => {
      vi.advanceTimersByTime(1500);
    });
    expect(button()?.textContent).toContain("Copy");
    expect(button()?.textContent).not.toContain("Copied");
    await unmount();
  });

  it("gives a second copy its full time on screen", async () => {
    // The bug: each copy started a timeout and none of them were cancelled,
    // so a second click inherited the first click's countdown. Copy, wait
    // 1.4s, copy again — and the label snapped back a tenth of a second later
    // even though the second copy had just happened.
    stubClipboard(() => Promise.resolve());
    await mount(COPY);

    await click(button());
    await act(async () => {
      vi.advanceTimersByTime(1400);
    });
    expect(button()?.textContent).toContain("Copied");

    await click(button());
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    expect(button()?.textContent).toContain("Copied");

    await act(async () => {
      vi.advanceTimersByTime(1300);
    });
    expect(button()?.textContent).not.toContain("Copied");
    await unmount();
  });

  it("reports a refused clipboard instead of failing silently", async () => {
    stubClipboard(() => Promise.reject(new Error("not allowed")));
    await mount(COPY);

    await click(button());
    expect(status()).toBe("Copy failed");
    expect(button()?.textContent).not.toContain("Copied");

    await act(async () => {
      vi.advanceTimersByTime(4000);
    });
    expect(status()).toBe("");
    await unmount();
  });

  it("survives no clipboard API at all", async () => {
    Reflect.deleteProperty(navigator, "clipboard");
    await mount(COPY);
    await click(button());
    expect(status()).toBe("Copy failed");
    await unmount();
  });

  it("never claims a success and a failure at once", async () => {
    let allow = true;
    stubClipboard(() => (allow ? Promise.resolve() : Promise.reject(new Error("no"))));
    await mount(COPY);

    await click(button());
    expect(status()).toBe("Copied to clipboard");
    allow = false;
    await click(button());
    // The old two-boolean state left `copied` set, so the button went on
    // saying "Copied" while the live region announced the failure.
    expect(status()).toBe("Copy failed");
    expect(button()?.textContent).not.toContain("Copied");
    await unmount();
  });

  it("leaves no timer behind when it is unmounted mid-countdown", async () => {
    stubClipboard(() => Promise.resolve());
    await mount(COPY);
    await click(button());
    expect(vi.getTimerCount()).toBe(1);
    await unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("the scroll reveal", () => {
  const realObserver = globalThis.IntersectionObserver;

  afterEach(() => {
    globalThis.IntersectionObserver = realObserver;
  });

  it("shows its children when the browser cannot observe anything", async () => {
    // Without this the CSS holds the whole page below the fold at opacity 0
    // forever: scripting is on, so the (scripting: none) fallback never
    // applies, and nothing is left to flip the attribute.
    Reflect.deleteProperty(globalThis, "IntersectionObserver");
    await mount(<Reveal>visible anyway</Reveal>);
    expect(host.querySelector(".reveal")?.getAttribute("data-revealed")).toBe("true");
    await unmount();
  });

  it("waits for the viewport when it can observe, and disconnects afterwards", async () => {
    const disconnect = vi.fn();
    let fire: ((entries: { isIntersecting: boolean }[]) => void) | undefined;
    class FakeObserver {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        fire = callback;
      }
      observe() {}
      unobserve() {}
      disconnect = disconnect;
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = "";
      thresholds = [];
    }
    globalThis.IntersectionObserver = FakeObserver as unknown as typeof IntersectionObserver;

    await mount(<Reveal>later</Reveal>);
    const node = host.querySelector(".reveal");
    expect(node?.getAttribute("data-revealed")).toBe("false");

    await act(async () => {
      fire?.([{ isIntersecting: true }]);
    });
    expect(node?.getAttribute("data-revealed")).toBe("true");
    // Disconnected on arrival, so it does not go on observing for the rest of
    // the visit; and disconnected again on unmount.
    expect(disconnect).toHaveBeenCalled();

    disconnect.mockClear();
    await unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it("renders revealed from the first paint when told to", async () => {
    await mount(<Reveal immediate>hero</Reveal>);
    expect(host.querySelector(".reveal")?.getAttribute("data-revealed")).toBe("true");
    await unmount();
  });
});

const ITEMS = [
  { href: "#how", label: "How" },
  { href: "#why", label: "Why" },
];

describe("the mobile navigation", () => {
  it("closes on Escape and hands focus back to the toggle", async () => {
    await mount(<MobileNav label="Open" closeLabel="Close" panelLabel="Sections" items={ITEMS} />);
    const toggle = button();
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    expect(host.querySelector("#mobile-nav-panel")).toBeNull();

    await click(toggle);
    expect(toggle?.getAttribute("aria-expanded")).toBe("true");
    expect(host.querySelector("#mobile-nav-panel")?.getAttribute("aria-label")).toBe("Sections");

    await act(async () => {
      window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(toggle);
    await unmount();
  });

  it("renders nothing at all when there is nothing to navigate", async () => {
    await mount(<MobileNav label="Open" closeLabel="Close" panelLabel="Sections" items={[]} />);
    expect(host.textContent).toBe("");
    await unmount();
  });

  it("keeps no key listener once it is gone", async () => {
    const remove = vi.spyOn(window, "removeEventListener");
    await mount(<MobileNav label="Open" closeLabel="Close" panelLabel="Sections" items={ITEMS} />);
    await click(button());
    await unmount();
    expect(remove.mock.calls.some(([type]) => type === "keydown")).toBe(true);
    remove.mockRestore();
  });
});

describe("the section navigation", () => {
  function stubRects(tops: Record<string, number>) {
    for (const [id, top] of Object.entries(tops)) {
      const section = document.createElement("section");
      section.id = id;
      section.getBoundingClientRect = () =>
        ({ top, bottom: top + 500 }) as unknown as DOMRect;
      document.body.append(section);
    }
  }

  afterEach(() => {
    document.querySelectorAll("body > section").forEach((s) => s.remove());
  });

  it("marks the section that owns the reading line", async () => {
    stubRects({ how: -200, why: 400 });
    await mount(<SiteNav items={ITEMS} label="Main" />);

    const current = () =>
      [...host.querySelectorAll("a")].filter((a) => a.getAttribute("aria-current") === "true");
    expect(current().map((a) => a.getAttribute("href"))).toEqual(["#how"]);
    expect(host.querySelector("nav")?.getAttribute("aria-label")).toBe("Main");
    await unmount();
  });

  it("registers exactly one listener per event and removes both", async () => {
    // A scroll listener that outlives its component keeps reading rects for a
    // header that is no longer on the page.
    stubRects({ how: -200, why: 400 });
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    await mount(<SiteNav items={ITEMS} label="Main" />);

    const added = add.mock.calls.filter(([type]) => type === "scroll" || type === "resize");
    expect(added).toHaveLength(2);

    await unmount();
    const removed = remove.mock.calls.filter(([type]) => type === "scroll" || type === "resize");
    expect(removed).toHaveLength(2);
    add.mockRestore();
    remove.mockRestore();
  });
});
