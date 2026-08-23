import BrandVideo from "@/components/home/BrandVideo";
import { cn } from "@/lib/utils";

type Scrim = "side" | "even" | "band";

/**
 * Legibility scrims. Phones get a heavier wash because text sits directly
 * over the video with far less room; from md up the video reads through.
 */
const SCRIM_CLASS: Record<Scrim, string> = {
  side: "bg-gradient-to-b from-cream/85 via-cream/70 to-cream/85 md:bg-gradient-to-r md:from-cream/90 md:via-cream/55 md:to-transparent",
  even: "bg-cream/78 md:bg-gradient-to-b md:from-cream/82 md:via-cream/58 md:to-cream/82",
  band: "bg-navy/70 md:bg-gradient-to-r md:from-navy/85 md:via-navy/65 md:to-navy/45",
};

/**
 * Full-bleed looping video backdrop for a hero section.
 *
 * The video always fills its section with `object-cover`, so it scales
 * fluidly at every viewport instead of relying on a fixed height — give
 * the parent section a content-driven height and this tracks it. A
 * branded gradient sits underneath so the section is never blank before
 * the first frame paints (or if the video can't load at all).
 */
export default function VideoBackdrop({
  src,
  label,
  scrim = "even",
  fadeToCream = true,
  className,
}: {
  src: string;
  label: string;
  scrim?: Scrim;
  fadeToCream?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-gradient-to-b from-cream-bright via-cream to-ice-light",
        className,
      )}
      aria-hidden="true"
    >
      <BrandVideo
        src={src}
        label={label}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          SCRIM_CLASS[scrim],
        )}
      />
      {fadeToCream && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-cream md:h-24" />
      )}
    </div>
  );
}
