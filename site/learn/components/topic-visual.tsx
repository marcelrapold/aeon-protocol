import Image from "next/image";
import type { PackageGroupKey, PackageId } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Topic and group artwork from the v0.3 visual system (masters in
 * ../visuals-src, manifest there records the palette). The motifs speak the
 * site's own language — knowledge nets, nodes, auras, technical geometry —
 * with one restrained accent per group drawn from the ÆON spectrum.
 *
 * Both themes ship as separate files and switch through the `.dark` class,
 * so no client JavaScript and no hydration flash is involved. Everything is
 * decorative: the card title sits directly beneath, so alt text would only
 * repeat it.
 */

/** Card motif, 8:5. `sizes` matches the library grid so Next serves a
 *  card-sized variant instead of the 1200px master. */
export function TopicVisual({ id }: { id: PackageId }) {
  return (
    <div
      aria-hidden="true"
      className="relative mb-4 aspect-[8/5] overflow-hidden rounded-lg border border-border/60 bg-secondary/30"
    >
      <Image
        src={`/visuals/topics/light/${id}.webp`}
        alt=""
        fill
        sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 90vw"
        className="object-cover dark:hidden"
      />
      <Image
        src={`/visuals/topics/dark/${id}.webp`}
        alt=""
        fill
        sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 90vw"
        className="hidden object-cover dark:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/40 to-transparent"
      />
    </div>
  );
}

/**
 * Group artwork, anchored to the right of the heading band.
 *
 * The masters are 45:14 with the motif on their right and open space on the
 * left. Stretching one across a full-width band would crop it to a sliver, so
 * the artwork keeps a panel roughly its own proportion and the band fades into
 * the page on its left edge. The heading sits in the cleared space.
 */
export function GroupVisual({ group, className }: { group: PackageGroupKey; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        // The motif scales with the panel's width, so the panel widens on
        // large screens rather than staying a fixed fraction.
        "pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[62%] sm:block lg:w-[52%] 2xl:w-[58%]",
        className,
      )}
    >
      <Image
        src={`/visuals/blocks/light/${group}.webp`}
        alt=""
        fill
        sizes="(min-width: 1024px) 46vw, 62vw"
        className="object-cover object-right opacity-70 dark:hidden"
      />
      <Image
        src={`/visuals/blocks/dark/${group}.webp`}
        alt=""
        fill
        sizes="(min-width: 1024px) 46vw, 62vw"
        className="hidden object-cover object-right opacity-60 dark:block"
      />
      {/* Dissolves the panel's left edge into the page so it reads as one band. */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/45 to-transparent" />
    </div>
  );
}
