import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { RootShell } from "./shell";

// With multiple root layouts there is no wrapping layout for unknown URLs, so
// the global 404 renders its own shell (English, the x-default locale).
export default function NotFound() {
  const tt = t("en");
  return (
    <RootShell lang="en">
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="text-3xl font-bold tracking-tight">{tt.notFound.title}</h1>
        <p className="max-w-md text-muted-foreground">{tt.notFound.body}</p>
        <Link href="/" className={cn(buttonVariants())}>
          {tt.notFound.back}
        </Link>
      </main>
    </RootShell>
  );
}
