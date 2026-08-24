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
  className,
}: {
  tagline?: string;
  headingOcid?: string;
  /** The page decides whether this headline is its h1. */
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* Folded tails tucked behind each end of the flag */}
      <div
        aria-hidden="true"
        className="clip-tail-left absolute inset-y-7 -left-2 hidden w-14 bg-navy-deep md:block lg:-left-5 lg:w-20"
      />
      <div
        aria-hidden="true"
        className="clip-tail-right absolute inset-y-7 -right-2 hidden w-14 bg-navy-deep md:block lg:-right-5 lg:w-20"
      />

      {/* Solid ice slab offset, cut to the same silhouette */}
      <div
        aria-hidden="true"
        className="clip-flag absolute inset-0 translate-x-[9px] translate-y-[12px] bg-ice"
      />

      <div className="clip-flag relative bg-navy p-[5px]">
        <div className="clip-flag h-full bg-ice-light p-[4px]">
          <div className="clip-flag relative h-full bg-cream-bright px-10 py-9 text-center sm:px-16 sm:py-11 md:px-20">
            {/* Angular speed shards flanking the headline */}
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

            <span className="inline-flex items-center gap-3">
              <img
                src="/assets/images/avalon-heron.webp"
                alt=""
                aria-hidden="true"
                className="size-10 rounded-full border-2 border-navy bg-cream-bright sm:size-12"
              />
              <span className="eyebrow whitespace-nowrap tracking-[0.14em] sm:tracking-[0.22em]">
                The Avalon Ice Shop
              </span>
            </span>

            <Heading
              data-ocid={headingOcid}
              className="text-block-ice mt-3 text-[2.5rem] leading-[0.88] sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Coming Soon
            </Heading>

            <div className="mx-auto mt-6 h-[3px] w-24 bg-navy sm:w-32" />

            <p className="mt-4 font-script text-2xl text-lagoon sm:text-3xl">
              {tagline}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
