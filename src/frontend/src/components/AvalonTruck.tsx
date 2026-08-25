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
        cx="27"
        cy="37"
        r="17"
        fill="#F7F2EA"
        stroke="#0C3552"
        strokeWidth="2.5"
      />
      <clipPath id={clipId}>
        <circle cx="27" cy="37" r="15.5" />
      </clipPath>
      <image
        href="/assets/images/avalon-heron.webp"
        x="11.5"
        y="21.5"
        width="31"
        height="31"
        clipPath={`url(#${clipId})`}
        preserveAspectRatio="xMidYMid slice"
      />

      {/* Livery matching the brand animation: script wordmark over a
          boxed ICE badge, with cubes stacked at the base. */}
      <text
        x="79"
        y="26"
        textAnchor="middle"
        fontFamily="var(--font-script), 'Lobster', cursive"
        fontSize="16"
        fill="#0C3552"
      >
        Avalon
      </text>
      <rect
        x="55"
        y="31"
        width="48"
        height="18"
        rx="3"
        fill="#CDE7E9"
        stroke="#0C3552"
        strokeWidth="2.5"
      />
      <text
        x="79"
        y="45"
        textAnchor="middle"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="13"
        letterSpacing="1.5"
        fill="#0C3552"
      >
        ICE
      </text>
      {/* Ice cubes at the foot of the livery */}
      <g fill="#CDE7E9" stroke="#0C3552" strokeWidth="2">
        <rect x="57" y="53" width="9" height="9" rx="2" />
        <rect x="69" y="53" width="9" height="9" rx="2" />
      </g>

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
