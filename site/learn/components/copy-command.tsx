"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function useCopy() {
  const [copied, setCopied] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  const copy = React.useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — surface it instead of
      // failing silently.
      setFailed(true);
      window.setTimeout(() => setFailed(false), 4000);
    }
  }, []);

  return { copied, failed, copy };
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
        onClick={() => copy(command)}
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
        onClick={() => copy(text)}
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
          onClick={() => copy(command)}
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
