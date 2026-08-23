import BrandVideo from "@/components/home/BrandVideo";
import FrostOverlay from "@/components/home/FrostOverlay";
import IceFrame from "@/components/home/IceFrame";
import VideoBackdrop from "@/components/home/VideoBackdrop";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MASCOT_LOGO_VIDEO } from "@/lib/media";
import { Link } from "@tanstack/react-router";
import { Anchor, Feather, MapPin, Truck } from "lucide-react";

const CHAPTERS = [
  {
    icon: MapPin,
    eyebrow: "The Origin",
    title: "Born in Avalon, Cape May County.",
    body: "Avalon Ice started where the Parkway runs out and the barrier islands begin. Seven miles of beach, a working harbor, and a summer that triples the population overnight — a town that runs on ice and never had a supplier of its own. So we built one here, on the island, instead of trucking it down from somewhere that has never had to restock a marina at 6 a.m. on the Fourth of July.",
    clip: "a" as const,
  },
  {
    icon: Truck,
    eyebrow: "The Heritage",
    title: "A shore route, run by shore people.",
    body: "Every route still starts at our Woodbine HQ and runs the same coast our families have worked for generations — Cape May and the Wildwoods, Stone Harbor and Sea Isle, Ocean City and up the Parkway to North Jersey. We know which kitchens need a second drop on a holiday weekend, which festivals blow through a pallet before noon, and which marina gate is easier at low tide. That is not a logistics network you buy. It is one you grow up in.",
    clip: "b" as const,
  },
  {
    icon: Feather,
    eyebrow: "The Mascot",
    title: "Why a heron carries our ice.",
    body: "Stand on any back bay marsh in Cape May County at dawn and you will find a Great Blue Heron working the shallows — patient, unhurried, and there before anyone else is awake. It is the bird of these wetlands, and it keeps the same hours we do. Ours carries a bag of ice up the coast because that is the job: show up early, move quietly, deliver cold. He has been on the truck, the bag, and the door ever since.",
    clip: "c" as const,
  },
];

/**
 * /about — the Avalon Ice origin story, delivery heritage, and the story
 * behind the heron mascot, over the animated brand logo loop.
 */
export default function About() {
  // One video element per breakpoint: full-bleed backdrop on larger
  // screens, inline uncropped player on phones.
  const isMobile = useIsMobile();

  return (
    <>
      <section
        id="about"
        data-ocid="about"
        className="relative overflow-hidden bg-cream py-14 sm:py-16 md:flex md:min-h-[62vh] md:items-center md:py-24"
      >
        {!isMobile && (
          <VideoBackdrop
            src={MASCOT_LOGO_VIDEO}
            label="Avalon Ice animated logo"
            scrim="side"
          />
        )}

        <FrostOverlay />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">
          <span className="chip chip-solid mb-6" data-ocid="about.badge">
            <Anchor className="size-3.5" />
            Est. Avalon, N.J.
          </span>

          <h1 className="script-heading max-w-3xl text-5xl sm:text-6xl md:text-7xl">
            The story behind the{" "}
            <span className="text-block-ice text-4xl sm:text-5xl md:text-6xl">
              Ice
            </span>
            .
          </h1>

          <p className="mt-6 max-w-xl font-body text-lg font-medium text-lagoon">
            An island supplier, a shore route, and one very patient bird.
          </p>

          {isMobile && (
            <div className="mt-9 overflow-hidden rounded-2xl border-[3px] border-navy shadow-[0_6px_0_#A3CCD1]">
              <div className="aspect-video w-full bg-gradient-ice-card">
                <BrandVideo
                  src={MASCOT_LOGO_VIDEO}
                  label="Avalon Ice animated logo"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        data-ocid="about.story"
        className="texture-paper bg-cream py-14 md:py-20"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:gap-12 lg:grid-cols-3">
          {CHAPTERS.map((chapter) => (
            <IceFrame
              key={chapter.title}
              clip={chapter.clip}
              cracks
              className="h-full"
              innerClassName="flex h-full flex-col gap-3 p-7 pb-8"
            >
              <span className="eyebrow inline-flex items-center gap-2">
                <chapter.icon className="size-4" />
                {chapter.eyebrow}
              </span>
              <h2 className="text-block-navy text-lg leading-snug sm:text-xl">
                {chapter.title}
              </h2>
              <p className="font-body text-sm leading-relaxed text-lagoon">
                {chapter.body}
              </p>
            </IceFrame>
          ))}
        </div>

        <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center gap-5 px-4 text-center sm:px-6">
          <h2 className="script-heading text-3xl sm:text-4xl">
            Cold for every cooler on the coast.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              data-ocid="about.order_button"
              className="btn-brutal btn-brutal-ice bg-navy px-7 py-6 font-body text-sm font-bold uppercase tracking-[0.1em] text-cream-bright hover:bg-navy"
            >
              <a href="/#order-form">
                <Truck className="size-5" />
                Request Delivery / Quote
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              data-ocid="about.network_button"
              className="btn-brutal bg-cream-bright px-7 py-6 font-body text-sm font-bold uppercase tracking-[0.1em] text-navy hover:bg-ice-frost"
            >
              <Link to="/">
                <MapPin className="size-5" />
                See the Network
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
