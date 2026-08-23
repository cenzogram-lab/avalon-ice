import BrandVideo from "@/components/home/BrandVideo";
import FrostOverlay from "@/components/home/FrostOverlay";
import IceFrame from "@/components/home/IceFrame";
import VideoBackdrop from "@/components/home/VideoBackdrop";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MERCH_VIDEO } from "@/lib/media";
import { Mail, ShoppingBag, Truck } from "lucide-react";

/**
 * /shop — branded storefront placeholder. No products are listed yet:
 * a hand-drawn ice banner announces the upcoming Avalon Ice merch and
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
      className="relative overflow-hidden bg-gradient-to-b from-cream-bright via-cream to-ice-light py-14 sm:py-16 md:flex md:min-h-[82vh] md:items-center md:py-24"
    >
      {!isMobile && (
        <VideoBackdrop
          src={MERCH_VIDEO}
          label="Avalon Ice merch promo"
          scrim="even"
        />
      )}

      <FrostOverlay />

      <div className="relative z-10 mx-auto w-full max-w-2xl px-4 text-center sm:px-6">
        <span className="eyebrow inline-flex items-center gap-2">
          <ShoppingBag className="size-4" />
          The Avalon Ice Shop
        </span>

        <div className="mt-6">
          <IceFrame
            clip="a"
            shadow="ice"
            cracks
            innerClassName="flex flex-col items-center gap-5 px-5 py-10 sm:px-14 sm:py-14"
          >
            <img
              src="/assets/images/avalon-ice-logo.webp"
              alt="Avalon Ice — Cape May County, N.J."
              className="w-32 rounded-md mix-blend-multiply sm:w-44"
            />

            <h1
              data-ocid="shop.coming_soon"
              className="text-block-ice text-4xl leading-tight sm:text-6xl"
            >
              Coming Soon
            </h1>

            <span
              className="block h-[5px] w-28 border-y-2 border-ice-deep"
              aria-hidden="true"
            />

            <p className="font-script text-xl text-lagoon sm:text-2xl">
              Merch, gear &amp; bagged ice — straight from the shore.
            </p>

            <span className="chip chip-solid">Labor Day Weekend 2026</span>

            <p className="max-w-sm font-body text-sm leading-relaxed text-lagoon">
              The direct Avalon Ice storefront is on its way. In the meantime,
              wholesale, event, and delivery inquiries are open.
            </p>

            <div className="mt-2 flex w-full flex-col items-stretch gap-3.5 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
              <Button
                asChild
                size="lg"
                data-ocid="shop.order_button"
                className="btn-brutal btn-brutal-ice bg-navy px-6 py-5 font-body text-sm font-bold uppercase tracking-wide text-cream-bright hover:bg-navy"
              >
                <a href="/#order-form">
                  <Truck className="size-4" />
                  Request Delivery / Quote
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                data-ocid="shop.notify_button"
                className="btn-brutal bg-cream-bright px-6 py-5 font-body text-sm font-bold uppercase tracking-wide text-navy hover:bg-ice-frost"
              >
                <a href="mailto:Sales@AvalonIce.com?subject=Avalon%20Ice%20Shop%20Waitlist">
                  <Mail className="size-4" />
                  Get Notified
                </a>
              </Button>
            </div>
          </IceFrame>
        </div>

        {/* Phones: the promo plays inline at its native aspect ratio rather
            than as a cropped backdrop, so nothing is cut off. */}
        {isMobile && (
          <div className="mt-8 overflow-hidden rounded-2xl border-[3px] border-navy shadow-[0_6px_0_#A3CCD1]">
            <div className="aspect-video w-full bg-gradient-ice-card">
              <BrandVideo
                src={MERCH_VIDEO}
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
