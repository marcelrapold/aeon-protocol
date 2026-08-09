"use client";

import * as React from "react";

/**
 * The hero's knowledge constellation: drifting nodes that link up when they
 * come close — a knowledge graph forming itself. Canvas-driven, in the
 * spirit of a sibling project's background field but drawn as this
 * protocol's own metaphor.
 *
 * Discipline: the rAF loop pauses when the hero leaves the viewport or the
 * tab is hidden; prefers-reduced-motion gets a single static frame; DPR is
 * capped at 2; the first frame is drawn synchronously so the field is never
 * blank. Decorative only (aria-hidden).
 */

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  cyan: boolean;
  phase: number;
};

const LINK_DISTANCE = 120;

export function KnowledgeField() {
  const ref = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let inView = true;

    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

    const seed = () => {
      const count = width < 640 ? 32 : 68;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 0.9 + Math.random() * 1.5,
        cyan: Math.random() < 0.12,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr()));
      canvas.height = Math.max(1, Math.round(height * dpr()));
      ctx.setTransform(dpr(), 0, 0, dpr(), 0, 0);
      if (!nodes.length) seed();
      for (const n of nodes) {
        n.x = Math.min(n.x, width);
        n.y = Math.min(n.y, height);
      }
    };

    const draw = (t: number) => {
      const dark = document.documentElement.classList.contains("dark");
      ctx.clearRect(0, 0, width, height);
      // Additive glow reads beautifully on dark; on light, normal compositing
      // with deeper tones keeps the field visible without washing out.
      ctx.globalCompositeOperation = dark ? "lighter" : "source-over";
      const lineHue = 250;
      const lineL = dark ? 72 : 42;
      const nodeL = dark ? 74 : 40;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DISTANCE) {
            const alpha = (1 - d / LINK_DISTANCE) * (dark ? 0.14 : 0.1);
            ctx.strokeStyle = `hsla(${lineHue}, 80%, ${lineL}%, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const pulse = 0.55 + 0.45 * Math.sin(t / 1400 + n.phase);
        const hue = n.cyan ? 188 : 250;
        ctx.fillStyle = `hsla(${hue}, 85%, ${nodeL}%, ${(dark ? 0.55 : 0.45) * pulse})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        // soft halo
        ctx.fillStyle = `hsla(${hue}, 85%, ${nodeL}%, ${0.07 * pulse})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (t: number) => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -8) n.x = width + 8;
        if (n.x > width + 8) n.x = -8;
        if (n.y < -8) n.y = height + 8;
        if (n.y > height + 8) n.y = -8;
      }
      draw(t);
    };

    const loop = (t: number) => {
      if (inView && !document.hidden) step(t);
      raf = window.requestAnimationFrame(loop);
    };

    resize();
    draw(0); // never blank, even before the loop (or without it)

    if (!reduced) {
      raf = window.requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver((entries) => {
      inView = entries.some((e) => e.isIntersecting);
    });
    io.observe(canvas);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70"
    />
  );
}
