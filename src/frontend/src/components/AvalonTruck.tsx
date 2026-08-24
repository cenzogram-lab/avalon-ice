import { useId } from "react";

/**
 * The Avalon Ice refrigerated box truck.
 *
 * Single source of truth for the fleet mark: the road parade under the
 * delivery map, the same parade at the foot of the site, and the loading
 * screen all render this one component so the truck never drifts between
 * surfaces.
 *
 * The heron badge is drawn from the same asset the rest of the site uses.
 * It is an `<image>` rather than inline paths, so if it has not arrived
 * yet the truck still reads correctly — it simply carries no door decal
 * for a moment instead of rendering broken.
 *
 * NOTE: `index.html` inlines a plain-HTML copy of this truck for the
 * pre-boot loading screen (it has to paint before any JS runs). Keep the
 * two in sync when changing the livery.
 */
export default function AvalonTruck({ className }: { className?: string }) {
  // The parade renders several trucks at once, so the clip path needs an
  // id unique per instance rather than a shared literal.
  const clipId = `avalon-truck-heron-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      viewBox="0 0 180 92"
      className={className}
      aria-hidden="true"
      role="presentation"
    >
      <title>Avalon Ice delivery truck</title>

      {/* Box body */}
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

      {/* Heron badge on the box door */}
      <circle
        cx="33"
        cy="37"
        r="20"
        fill="#F7F2EA"
        stroke="#0C3552"
        strokeWidth="2.5"
      />
      <clipPath id={clipId}>
        <circle cx="33" cy="37" r="18.5" />
      </clipPath>
      <image
        href="/assets/images/avalon-heron.webp"
        x="14.5"
        y="18.5"
        width="37"
        height="37"
        clipPath={`url(#${clipId})`}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Livery, set beside the badge */}
      <text
        x="87"
        y="33"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="13"
        fill="#0C3552"
      >
        AVALON
      </text>
      <rect x="69" y="39" width="36" height="3.5" rx="1.75" fill="#8CBEC5" />
      <text
        x="87"
        y="57"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="13"
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
