import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface Flake {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
  sparkle: boolean;
}

/**
 * Ambient frost / ice-particle drift rendered on a transparent canvas.
 * Sits above the hero video without obscuring it: low-opacity soft
 * flakes plus a few sparkle crosses, drifting slowly upward.
 */
export default function FrostOverlay({
  density = 28,
  className,
}: {
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let raf = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const flakes: Flake[] = Array.from({ length: density }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: 1.5 + Math.random() * 3.5,
      speed: 0.008 + Math.random() * 0.02,
      sway: 8 + Math.random() * 22,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.14 + Math.random() * 0.28,
      sparkle: i % 6 === 0,
    }));

    const drawFrame = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const f of flakes) {
        const x = f.x * width + Math.sin(t * 0.0004 + f.phase) * f.sway;
        const y =
          ((((f.y - (t * 0.00003 * f.speed) / 0.01) % 1) + 1) % 1) * height;
        ctx.globalAlpha = f.alpha;
        if (f.sparkle) {
          ctx.strokeStyle = "#FDFCF8";
          ctx.lineWidth = 1.2;
          const s = f.r * 2;
          ctx.beginPath();
          ctx.moveTo(x - s, y);
          ctx.lineTo(x + s, y);
          ctx.moveTo(x, y - s);
          ctx.lineTo(x, y + s);
          ctx.stroke();
        } else {
          const grad = ctx.createRadialGradient(x, y, 0, x, y, f.r * 2.2);
          grad.addColorStop(0, "rgba(253,252,248,0.95)");
          grad.addColorStop(1, "rgba(201,228,228,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, f.r * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      drawFrame(0);
    } else {
      const loop = (t: number) => {
        drawFrame(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const observer = new ResizeObserver(() => {
      resize();
      if (reduced) drawFrame(0);
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    />
  );
}
