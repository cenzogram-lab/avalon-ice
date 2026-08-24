import BrandVideo from "@/components/home/BrandVideo";
import ComingSoonRibbon from "@/components/home/ComingSoonRibbon";
import FrostOverlay from "@/components/home/FrostOverlay";
import VideoBackdrop from "@/components/home/VideoBackdrop";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MERCH_PROMO_VIDEO } from "@/lib/media";
import { Truck } from "lucide-react";

/**
 * /shop — branded storefront placeholder. No products are listed yet:
 * the "Coming Soon" ribbon announces the upcoming Avalon Ice merch and
 * direct storefront over the looping merch promo.
 *
 * The section height is content-driven on phones (and only adopts a
 * viewport minimum from md up), so the hero grows with its content
 * instead of blowing out or clipping on short screens.
 */
export default function Shop() {
  // One video element per breakpoint: a full-bleed backdrop on larger
  // screens, an inline uncropped player on phones.
  const isMobile = useIsMobile();

  return (
    <section
      id="shop"
      data-ocid="shop"
      className="relative min-h-[60vh] overflow-hidden bg-cream py-14 sm:min-h-[75vh] sm:py-16 md:flex md:min-h-[82vh] md:items-end md:pb-16 md:pt-24 lg:min-h-[85vh]"
    >
      {!isMobile && (
        <VideoBackdrop
          src={MERCH_PROMO_VIDEO}
          label="Avalon Ice merch promo"
          scrim="even"
        />
      )}

      <FrostOverlay />

      {/* Left-aligned and narrow so the promo footage stays visible beside
          the mark rather than being covered by a full-width flag. */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-md">
          <ComingSoonRibbon compact as="h1" headingOcid="shop.coming_soon" />

          <div className="mt-8 flex w-full flex-col items-stretch gap-3.5 sm:w-auto sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              data-ocid="shop.order_button"
              className="btn-brutal btn-brutal-ice bg-navy min-h-12 px-6 py-6 font-body text-sm font-bold uppercase tracking-wide text-cream-bright hover:bg-navy"
            >
              <a href="/#order-form">
                <Truck className="size-4" />
                Request Delivery / Quote
              </a>
            </Button>
          </div>
        </div>

        {/* Phones: the promo plays inline at its native aspect ratio rather
            than as a cropped backdrop, so nothing is cut off. */}
        {isMobile && (
          <div className="mt-8 overflow-hidden rounded-2xl border-[3px] border-navy shadow-[0_6px_0_#A3CCD1]">
            <div className="aspect-video w-full bg-gradient-ice-card">
              <BrandVideo
                src={MERCH_PROMO_VIDEO}
                label="Avalon Ice merch promo"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
