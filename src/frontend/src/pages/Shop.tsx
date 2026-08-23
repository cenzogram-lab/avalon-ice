import BrandVideo from "@/components/home/BrandVideo";
import FrostOverlay from "@/components/home/FrostOverlay";
import IceFrame from "@/components/home/IceFrame";
import { Button } from "@/components/ui/button";
import { HERO_VIDEO } from "@/lib/media";
import { Mail, ShoppingBag, Truck } from "lucide-react";

/**
 * /shop — branded storefront placeholder. No products are listed yet:
 * a hand-drawn ice banner announces the upcoming Avalon Ice merch and
 * direct storefront over the looping brand video.
 */
export default function Shop() {
  return (
    <section
      id="shop"
      data-ocid="shop"
      className="relative flex min-h-[82vh] items-center overflow-hidden bg-gradient-to-b from-cream-bright via-cream to-ice-light py-16 md:py-24"
    >
      {/* Branded background video beneath the header */}
      <div className="absolute inset-0" aria-hidden="true">
        <BrandVideo
          src={HERO_VIDEO}
          label="Avalon Ice brand animation"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-cream/70 md:bg-gradient-to-b md:from-cream/80 md:via-cream/55 md:to-cream/80" />
      </div>

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
            innerClassName="flex flex-col items-center gap-5 px-6 py-12 sm:px-14 sm:py-14"
          >
            <img
              src="/assets/images/avalon-ice-logo.webp"
              alt="Avalon Ice — Cape May County, N.J."
              className="w-36 rounded-md mix-blend-multiply sm:w-44"
            />

            <h1
              data-ocid="shop.coming_soon"
              className="text-block-ice text-5xl leading-tight sm:text-6xl"
            >
              Coming Soon
            </h1>

            <span
              className="block h-[5px] w-28 border-y-2 border-ice-deep"
              aria-hidden="true"
            />

            <p className="font-script text-2xl text-lagoon">
              Merch, gear &amp; bagged ice — straight from the shore.
            </p>

            <span className="chip chip-solid">Labor Day Weekend 2026</span>

            <p className="max-w-sm font-body text-sm leading-relaxed text-lagoon">
              The direct Avalon Ice storefront is on its way. Until the doors
              open, wholesale, event, and delivery inquiries are already
              rolling.
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3.5">
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
      </div>
    </section>
  );
}
