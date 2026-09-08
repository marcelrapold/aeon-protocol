"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

/** How long each outcome stays on screen. */
const COPIED_MS = 1500;
const FAILED_MS = 4000;

type CopyState = "idle" | "copied" | "failed";

/**
 * One outcome, one pending reset.
 *
 * Two separate booleans each with their own fire-and-forget timeout had two
 * faults. The timers were never cancelled, so a second copy inherited the
 * first one's countdown — click, wait a second and a half, click again, and
 * the label snapped back to "Copy" almost immediately — and neither was
 * cleared on unmount, so a chip scrolled away mid-countdown still had a timer
 * pointed at it. They could also both be true at once: a failure after a
 * success left `copied` set, and the button went on claiming it had copied.
 *
 * A single state plus a single tracked timer removes all three.
 */
function useCopy() {
  const [state, setState] = React.useState<CopyState>("idle");
  const timer = React.useRef<number | undefined>(undefined);

  const announce = React.useCallback((next: Exclude<CopyState, "idle">, after: number) => {
    if (timer.current !== undefined) window.clearTimeout(timer.current);
    setState(next);
    timer.current = window.setTimeout(() => {
      timer.current = undefined;
      setState("idle");
    }, after);
  }, []);

  React.useEffect(
    () => () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current);
    },
    [],
  );

  const copy = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        announce("copied", COPIED_MS);
      } catch {
        // Clipboard unavailable (e.g. insecure context) or refused — surface
        // it instead of failing silently.
        announce("failed", FAILED_MS);
      }
    },
    [announce],
  );

  return { copied: state === "copied", failed: state === "failed", copy };
}

/** Screen-reader announcement so the result is not visual-only (WCAG 4.1.3). */
function CopyStatus({
  copied,
  failed,
  copiedAnnounce,
  failedAnnounce,
}: {
  copied: boolean;
  failed: boolean;
  copiedAnnounce: string;
  failedAnnounce: string;
}) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {copied ? copiedAnnounce : failed ? failedAnnounce : ""}
    </span>
  );
}

/** Filled hero CTA that copies the invocation sentence. */
export function CopyCommandButton({
  command,
  label,
  copiedLabel,
  copiedAnnounce,
  failedAnnounce,
}: {
  command: string;
  label: string;
  copiedLabel: string;
  copiedAnnounce: string;
  failedAnnounce: string;
}) {
  const { copied, failed, copy } = useCopy();

  return (
    <>
      <button
        type="button"
        onClick={() => void copy(command)}
        className={cn(buttonVariants({ size: "lg" }))}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copied ? copiedLabel : label}
      </button>
      <CopyStatus
        copied={copied}
        failed={failed}
        copiedAnnounce={copiedAnnounce}
        failedAnnounce={failedAnnounce}
      />
    </>
  );
}

/** Compact outline chip that copies a ready-made prompt (library cards). */
export function CopyChip({
  text,
  label,
  copiedLabel,
  copiedAnnounce,
  failedAnnounce,
}: {
  text: string;
  label: string;
  copiedLabel: string;
  copiedAnnounce: string;
  failedAnnounce: string;
}) {
  const { copied, failed, copy } = useCopy();

  return (
    <>
      <button
        type="button"
        onClick={() => void copy(text)}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copied ? copiedLabel : label}
      </button>
      <CopyStatus
        copied={copied}
        failed={failed}
        copiedAnnounce={copiedAnnounce}
        failedAnnounce={failedAnnounce}
      />
    </>
  );
}

/**
 * Terminal-styled invocation block. The leading marker is aria-hidden and
 * never part of the copied payload.
 */
export function CommandBlock({
  command,
  copyLabel,
  copiedLabel,
  copiedAnnounce,
  failedAnnounce,
  hint,
}: {
  command: string;
  copyLabel: string;
  copiedLabel: string;
  copiedAnnounce: string;
  failedAnnounce: string;
  hint: string;
}) {
  const { copied, failed, copy } = useCopy();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
        <code className="font-mono text-sm leading-relaxed">
          <span aria-hidden="true" className="select-none text-primary">
            &gt;{" "}
          </span>
          {command}
        </code>
        <button
          type="button"
          onClick={() => void copy(command)}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      <CopyStatus
        copied={copied}
        failed={failed}
        copiedAnnounce={copiedAnnounce}
        failedAnnounce={failedAnnounce}
      />
    </div>
  );
}
