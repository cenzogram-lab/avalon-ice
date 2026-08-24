import { cn } from "@/lib/utils";

function TruckSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 92"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      {/* Box body with livery */}
      <rect
        x="4"
        y="8"
        width="112"
        height="58"
        rx="6"
        fill="#FDFCF8"
        stroke="#0C3552"
        strokeWidth="4"
      />
      <text
        x="60"
        y="34"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="17"
        fill="#0C3552"
      >
        AVALON
      </text>
      <rect x="30" y="41" width="60" height="4" rx="2" fill="#8CBEC5" />
      <text
        x="60"
        y="60"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="14"
        fill="#0C3552"
      >
        ICE
      </text>
      {/* Cab */}
      <path
        d="M116 26h34a8 8 0 0 1 6.6 3.5l14 20a8 8 0 0 1 1.4 4.5v4a8 8 0 0 1-8 8h-48V26Z"
        fill="#0C3552"
      />
      <rect x="122" y="32" width="22" height="15" rx="3" fill="#A3CCD1" />
      {/* Wheels */}
      {[34, 86, 146].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="72" r="13" fill="#061F33" />
          <circle cx={cx} cy="72" r="5.5" fill="#F7F2EA" />
        </g>
      ))}
    </svg>
  );
}

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
        <TruckSVG className="h-auto w-full drop-shadow-[0_4px_0_rgba(6,31,51,0.25)]" />
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
        <TruckSVG className="h-auto w-full drop-shadow-[0_4px_0_rgba(6,31,51,0.25)]" />
      </div>
    </div>
  );
}
