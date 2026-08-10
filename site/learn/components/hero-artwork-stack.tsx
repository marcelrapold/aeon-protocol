"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type Layer = {
  src: string;
  depth: number;
  blend: CSSProperties["mixBlendMode"];
  opacity: number;
  priority?: boolean;
  className?: string;
  maskImage?: string;
};

const LAYERS: Layer[] = [
  {
    src: "/hero-v2/base-atmosphere.webp",
    depth: 2,
    blend: "normal",
    opacity: 1,
    priority: true,
  },
  {
    src: "/hero-v2/knowledge-rig.svg",
    depth: 5,
    blend: "screen",
    opacity: 0.28,
  },
  {
    src: "/hero-v2/learning-core.webp",
    depth: 8,
    blend: "normal",
    opacity: 0.92,
    priority: true,
    maskImage:
      "linear-gradient(to right, transparent 0%, transparent 32%, rgba(0,0,0,.12) 40%, rgba(0,0,0,.72) 52%, black 61%, black 100%)",
  },
  {
    src: "/hero-v2/cognitive-signals.svg",
    depth: 12,
    blend: "screen",
    opacity: 0.52,
  },
];

const LERP = 0.075;

export function HeroArtworkStack({
  className,
  parallax = true,
}: {
  className?: string;
  parallax?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parallax) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const track: HTMLElement = el.closest("section") ?? el;
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let running = false;

    const tick = () => {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;

      for (const layer of layers) {
        const depth = Number(layer.dataset.depth);
        layer.style.transform = `translate3d(${(-cx * depth).toFixed(2)}px, ${(-cy * depth).toFixed(2)}px, 0)`;
      }

      if (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const clamp = (value: number) => Math.max(-1, Math.min(1, value));

    const onMove = (event: PointerEvent) => {
      const bounds = track.getBoundingClientRect();
      tx = clamp((event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2));
      ty = clamp((event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2));
      start();
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      start();
    };

    track.addEventListener("pointermove", onMove, { passive: true });
    track.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [parallax]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none isolate overflow-hidden", className)}
    >
      {LAYERS.map((layer) => (
        <div
          key={layer.src}
          data-depth={layer.depth}
          className="absolute inset-0 will-change-transform"
          style={{
            mixBlendMode: layer.blend,
            opacity: layer.opacity,
            maskImage: layer.maskImage,
            WebkitMaskImage: layer.maskImage,
          }}
        >
          <Image
            src={layer.src}
            alt=""
            fill
            priority={layer.priority}
            unoptimized={layer.src.endsWith(".svg")}
            sizes="100vw"
            className={cn(
              "scale-[1.07] object-cover object-center",
              layer.className,
            )}
          />
        </div>
      ))}
    </div>
  );
}
