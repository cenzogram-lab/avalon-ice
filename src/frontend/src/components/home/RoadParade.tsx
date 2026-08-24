import AvalonTruck from "@/components/AvalonTruck";
import { cn } from "@/lib/utils";

/**
 * Animated roadway with the Avalon Ice refrigerated fleet looping across
 * it. Used below the delivery map and again at the foot of the site.
 * Purely decorative — all motion stops under prefers-reduced-motion.
 */
export default function RoadParade({ className }: { className?: string }) {
  return (
    <div
      className={cn("relative h-28 overflow-hidden sm:h-32", className)}
      aria-hidden="true"
    >
      {/* Roadway */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-10 border-t-[3px] border-navy bg-navy sm:h-11">
        <div className="road-stripes absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 opacity-70" />
      </div>

      {/* Fleet */}
      <div
        className="animate-truck-drive absolute bottom-7 left-0 z-20 w-36 sm:w-44"
        style={{ "--truck-duration": "17s" } as React.CSSProperties}
      >
        <AvalonTruck className="h-auto w-full drop-shadow-[0_4px_0_rgba(6,31,51,0.25)]" />
      </div>
      <div
        className="animate-truck-drive absolute bottom-7 left-0 z-20 w-28 sm:w-32"
        style={
          {
            "--truck-duration": "26s",
            "--truck-delay": "-14s",
          } as React.CSSProperties
        }
      >
        <AvalonTruck className="h-auto w-full drop-shadow-[0_4px_0_rgba(6,31,51,0.25)]" />
      </div>
    </div>
  );
}
