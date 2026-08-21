import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ClipVariant = "a" | "b" | "c" | "d";
type FillVariant = "ice" | "cream" | "navy";
type ShadowVariant = "ice" | "deep" | "navy" | "none";

const FILL_CLASS: Record<FillVariant, string> = {
  ice: "",
  cream: "ice-frame-fill--cream",
  navy: "ice-frame-fill--navy",
};

const SHADOW_CLASS: Record<ShadowVariant, string> = {
  ice: "ice-shadow",
  deep: "ice-shadow-deep",
  navy: "ice-shadow-navy",
  none: "",
};

/**
 * Neo-brutalist hand-drawn ice-block frame: a jittered polygon clip-path
 * with dual navy/keyline strokes, an ice-gradient fill, and a solid
 * ice-blue slab drop shadow that follows the silhouette.
 */
export default function IceFrame({
  clip = "a",
  fill = "ice",
  shadow = "ice",
  cracks = false,
  className,
  innerClassName,
  children,
}: {
  clip?: ClipVariant;
  fill?: FillVariant;
  shadow?: ShadowVariant;
  cracks?: boolean;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  const clipClass = `clip-ice-${clip}`;
  return (
    <div className={cn(SHADOW_CLASS[shadow], className)}>
      <div className={cn("ice-frame-border", clipClass)}>
        <div className={cn("ice-frame-keyline", clipClass)}>
          <div
            className={cn(
              "ice-frame-fill",
              FILL_CLASS[fill],
              cracks && "ice-cracks",
              clipClass,
              innerClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
