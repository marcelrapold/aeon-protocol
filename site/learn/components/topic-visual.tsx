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

/**
 * Full-bleed card motif, 8:5, matching the sibling project's card anatomy:
 * the artwork reaches the card edges and its lower third fades into the card
 * so the overlaid title stays legible. Hover lifts the fade and eases the
 * image in. `children` is that overlay. `sizes` matches the library grid, so
 * a card fetches a card-sized variant rather than the 1200px master.
 */
export function TopicVisual({ id, children }: { id: PackageId; children?: React.ReactNode }) {
  const sizes =
    "(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 90vw";

  return (
    <div className="relative aspect-[8/5] w-full overflow-hidden">
      <Image
        src={`/visuals/topics/light/${id}.webp`}
        alt=""
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 dark:hidden"
      />
      <Image
        src={`/visuals/topics/dark/${id}.webp`}
        alt=""
        fill
        sizes={sizes}
        className="hidden object-cover transition-transform duration-700 ease-out group-hover:scale-105 dark:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-card via-card/70 to-transparent transition-colors duration-500 group-hover:via-card/40"
      />
      {children}
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
