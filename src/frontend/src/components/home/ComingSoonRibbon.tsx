import { cn } from "@/lib/utils";

/**
 * The Avalon Ice "Coming Soon" ribbon: a bold swallowtail flag with dual
 * navy/ice strokes over a vintage cream field, folded navy tails behind
 * each end, and angled speed shards flanking an oversized Bevan
 * headline. Shared by the homepage shop band and the /shop hero so both
 * announce the storefront with the same mark.
 */
export default function ComingSoonRibbon({
  tagline = "Merch and gear",
  headingOcid = "coming_soon.heading",
  as: Heading = "h2",
  compact = false,
  className,
}: {
  tagline?: string;
  headingOcid?: string;
  /** The page decides whether this headline is its h1. */
  as?: "h1" | "h2";
  /**
   * Narrow, left-aligned treatment used over the shop hero videos, so the
   * footage stays visible alongside the mark instead of being covered by a
   * full-width flag.
   */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* Folded tails tucked behind each end of the flag */}
      <div
        aria-hidden="true"
        className={cn(
          "clip-tail-left absolute hidden bg-navy-deep md:block",
          compact
            ? "inset-y-4 -left-1.5 w-8"
            : "inset-y-7 -left-2 w-14 lg:-left-5 lg:w-20",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "clip-tail-right absolute hidden bg-navy-deep md:block",
          compact
            ? "inset-y-4 -right-1.5 w-8"
            : "inset-y-7 -right-2 w-14 lg:-right-5 lg:w-20",
        )}
      />

      {/* Solid ice slab offset, cut to the same silhouette */}
      <div
        aria-hidden="true"
        className="clip-flag absolute inset-0 translate-x-[9px] translate-y-[12px] bg-ice"
      />

      <div className="clip-flag relative bg-navy p-[5px]">
        <div className="clip-flag h-full bg-ice-light p-[4px]">
          <div
            className={cn(
              "clip-flag relative h-full bg-cream-bright text-center",
              compact
                ? "px-6 py-5 sm:px-8 sm:py-6"
                : "px-10 py-9 sm:px-16 sm:py-11 md:px-20",
            )}
          >
            {/* Angular speed shards flanking the headline. The compact flag
                is too narrow to seat them without crowding the headline. */}
            {!compact && (
              <>
                <div
                  aria-hidden="true"
                  className="absolute left-12 top-1/2 hidden -translate-y-1/2 items-center gap-2 xl:flex"
                >
                  <span className="block h-16 w-3 -skew-x-12 bg-navy" />
                  <span className="block h-12 w-2.5 -skew-x-12 bg-ice-deep" />
                  <span className="block h-8 w-2 -skew-x-12 bg-ice" />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute right-12 top-1/2 hidden -translate-y-1/2 items-center gap-2 xl:flex"
                >
                  <span className="block h-8 w-2 -skew-x-12 bg-ice" />
                  <span className="block h-12 w-2.5 -skew-x-12 bg-ice-deep" />
                  <span className="block h-16 w-3 -skew-x-12 bg-navy" />
                </div>
              </>
            )}

            <span className="inline-flex items-center gap-3">
              <img
                src="/assets/images/avalon-heron.webp"
                alt=""
                aria-hidden="true"
                className={cn(
                  "rounded-full border-2 border-navy bg-cream-bright",
                  compact ? "size-6 sm:size-7" : "size-10 sm:size-12",
                )}
              />
              <span
                className={cn(
                  "eyebrow whitespace-nowrap",
                  compact
                    ? "text-[0.55rem] tracking-[0.12em] sm:text-[0.65rem]"
                    : "tracking-[0.14em] sm:tracking-[0.22em]",
                )}
              >
                The Avalon Ice Shop
              </span>
            </span>

            <Heading
              data-ocid={headingOcid}
              className={cn(
                "text-block-ice leading-[0.88]",
                compact
                  ? "mt-2 text-[1.6rem] sm:text-3xl md:text-4xl"
                  : "mt-3 text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl",
              )}
            >
              Coming Soon
            </Heading>

            <div
              className={cn(
                "mx-auto bg-navy",
                compact ? "mt-3 h-[2px] w-12" : "mt-6 h-[3px] w-24 sm:w-32",
              )}
            />

            <p
              className={cn(
                "font-script text-lagoon",
                compact
                  ? "mt-2.5 text-base sm:text-lg"
                  : "mt-4 text-2xl sm:text-3xl",
              )}
            >
              {tagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
