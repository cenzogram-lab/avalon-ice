import ContactSection from "@/components/ContactSection";
import ComingSoonRibbon from "@/components/home/ComingSoonRibbon";
import VideoBackdrop from "@/components/home/VideoBackdrop";
import { Button } from "@/components/ui/button";
import { MERCH_PROMO_VIDEO } from "@/lib/media";
import { Truck } from "lucide-react";

/**
 * /shop — branded storefront placeholder. No products are listed yet:
 * the "Coming Soon" ribbon announces the upcoming Avalon Ice merch and
 * direct storefront over the looping merch promo.
 *
 * The merch promo plays full-bleed behind the mark at every width, and
 * the section's viewport minimum scales with the breakpoint so the ribbon
 * and CTA stay legible without blowing out on short phone screens.
 */
export default function Shop() {
  return (
    <>
    <section
      id="shop"
      data-ocid="shop"
      className="relative flex min-h-[50vh] items-end overflow-hidden bg-cream py-14 sm:min-h-[65vh] sm:py-16 md:min-h-[80vh] md:pb-16 md:pt-24 lg:min-h-[85vh]"
    >
      {/* Full-bleed at every width: phones get the same backdrop rather
          than an inline card, so the mark always sits over the footage. */}
      <VideoBackdrop
        src={MERCH_PROMO_VIDEO}
        label="Avalon Ice merch promo"
        scrim="even"
      />

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

      </div>
    </section>
      <ContactSection />
    </>
  );
}
