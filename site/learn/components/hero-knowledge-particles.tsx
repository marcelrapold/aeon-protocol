"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const COUNT_DESKTOP = 58;
const COUNT_MOBILE = 24;
const VIOLET_HUE = 252;
const CYAN_HUE = 187;

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  alpha: number;
  cyan: boolean;
};

export function HeroKnowledgeParticles({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const section: HTMLElement = canvas.closest("section") ?? canvas;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let particles: Particle[] = [];

    const random = (min: number, max: number) => min + Math.random() * (max - min);
    const count = () => (width < 640 ? COUNT_MOBILE : COUNT_DESKTOP);

    const makeParticle = (): Particle => {
      const rightWeighted = Math.random() < 0.72;
      return {
        x: rightWeighted ? random(width * 0.42, width) : random(0, width),
        y: random(0, height),
        r: random(0.7, 2.25),
        vx: random(-0.055, 0.07),
        vy: random(-0.17, -0.045),
        phase: random(0, Math.PI * 2),
        speed: random(0.006, 0.014),
        alpha: random(0.24, 0.76),
        cyan: Math.random() < 0.14,
      };
    };

    const sync = () => {
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width < 2 || bounds.height < 2) return false;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const requiredWidth = Math.floor(bounds.width * dpr);
      const requiredHeight = Math.floor(bounds.height * dpr);

      if (
        canvas.width !== requiredWidth ||
        canvas.height !== requiredHeight ||
        particles.length === 0
      ) {
        width = bounds.width;
        height = bounds.height;
        canvas.width = requiredWidth;
        canvas.height = requiredHeight;
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        particles = Array.from({ length: count() }, makeParticle);
      }

      return true;
    };

    const render = () => {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      // Sparse, short-lived knowledge links. Deliberately restricted to the
      // right half so the headline stays quiet and readable.
      context.lineWidth = 0.55;
      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        if (a.x < width * 0.45) continue;
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          if (b.x < width * 0.45) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance > 112) continue;
          const alpha = (1 - distance / 112) * 0.045;
          context.strokeStyle = `hsla(252, 88%, 72%, ${alpha})`;
          context.beginPath();
          context.moveTo(a.x + currentX * a.r * 5, a.y + currentY * a.r * 5);
          context.lineTo(b.x + currentX * b.r * 5, b.y + currentY * b.r * 5);
          context.stroke();
        }
      }

      for (const particle of particles) {
        const twinkle = reduced ? 0.86 : 0.62 + 0.38 * Math.sin(particle.phase);
        const alpha = particle.alpha * twinkle;
        const hue = particle.cyan ? CYAN_HUE : VIOLET_HUE;
        const x = particle.x + currentX * particle.r * 7;
        const y = particle.y + currentY * particle.r * 7;

        context.beginPath();
        context.fillStyle = `hsla(${hue}, 92%, 70%, ${alpha})`;
        context.shadowColor = `hsla(${hue}, 96%, 64%, ${alpha})`;
        context.shadowBlur = 7 + particle.r * 4;
        context.arc(x, y, particle.r, 0, Math.PI * 2);
        context.fill();
      }

      context.shadowBlur = 0;
      context.globalCompositeOperation = "source-over";
    };

    const tick = () => {
      if (sync()) {
        currentX += (targetX - currentX) * 0.055;
        currentY += (targetY - currentY) * 0.055;

        for (const particle of particles) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.phase += particle.speed;

          if (particle.y < -5) {
            particle.y = height + 5;
            particle.x = Math.random() < 0.72 ? random(width * 0.42, width) : random(0, width);
          }
          if (particle.x < -5) particle.x = width + 5;
          if (particle.x > width + 5) particle.x = -5;
        }

        render();
      }

      if (running) raf = requestAnimationFrame(tick);
    };

    /**
     * The hero is one screen of a long page, so this canvas spends most of a
     * visit scrolled past. Animating it there spends a frame budget on pixels
     * nobody sees, so the loop only runs while the hero is in view. Hidden
     * tabs need no separate handling — browsers already suspend rAF there,
     * and gating on `document.hidden` would only add a way to never start.
     */
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
            // A little lead time so the field is already alive on arrival.
            rootMargin: "120px",
          })
        : null;

    if (reduced) {
      const paintWhenReady = () => {
        if (sync()) render();
        else raf = requestAnimationFrame(paintWhenReady);
      };
      paintWhenReady();
    } else if (observer) {
      observer.observe(section);
    } else {
      // No observer (very old browsers): animate unconditionally, as before.
      start();
    }

    const onMove = (event: PointerEvent) => {
      const bounds = section.getBoundingClientRect();
      targetX = (event.clientX - (bounds.left + bounds.width / 2)) / (bounds.width / 2);
      targetY = (event.clientY - (bounds.top + bounds.height / 2)) / (bounds.height / 2);
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    if (!reduced && finePointer) {
      section.addEventListener("pointermove", onMove, { passive: true });
      section.addEventListener("pointerleave", onLeave, { passive: true });
    }

    return () => {
      observer?.disconnect();
      stop();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none", className)} />;
}
