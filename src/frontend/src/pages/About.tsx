import ContactSection from "@/components/ContactSection";
import BrandVideo from "@/components/home/BrandVideo";
import FrostOverlay from "@/components/home/FrostOverlay";
import IceFrame from "@/components/home/IceFrame";
import VideoBackdrop from "@/components/home/VideoBackdrop";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { MASCOT_LOGO_VIDEO } from "@/lib/media";
import { Link } from "@tanstack/react-router";
import { Anchor, Feather, MapPin, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Chapter = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  /** Optional bold lead line set above the body paragraphs. */
  lead?: string;
  body: string[];
  clip: "a" | "b" | "c";
};

const CHAPTERS: Chapter[] = [
  {
    icon: MapPin,
    eyebrow: "The Origin",
    title: "Born in Cape May County.",
    body: [
      "Avalon Ice started where the Parkway runs out and the barrier islands begin. Seven miles of beach, working harbors, and summers that triple the population overnight — a place where ice is essential and reliable service matters.",
      "For too long, the Shore has been just another stop on somebody else’s delivery route. We built Avalon Ice to change that. Local production, local people, and a company built around the businesses that keep the Shore running — especially when they need us most.",
      "Because at 6 a.m. on the Fourth of July, being local matters.",
    ],
    clip: "a",
  },
  {
    icon: Truck,
    eyebrow: "The Local Advantage",
    title: "Built for the Shore, by people who know it.",
    body: [
      "The Shore is a different kind of market. A normal summer weekend can turn into a rush without warning, and a holiday weekend can change everything. When a business runs low on ice, waiting until the next scheduled delivery isn’t always an option.",
      "That’s why we’re building Avalon Ice around the needs of South Jersey businesses. Based in Cape May County, our goal is simple: dependable scheduled deliveries, responsive service when demand spikes, and relationships with the businesses we serve.",
      "We’re not trying to be another name on a delivery truck. We want to be the local ice company our customers know they can call when they need us.",
    ],
    clip: "b",
  },
  {
    icon: Feather,
    eyebrow: "The Mascot",
    title: "Why the Egret Carries the Bag",
    lead: "A familiar sight along the Shore.",
    body: [
      "Egrets are a familiar sight around the bays, marshes, and waterways of Cape May County. They’re part of the coastal landscape that surrounds the communities Avalon Ice was built to serve.",
      "Known for their patience, adaptability, and persistence, egrets are well suited to an environment that is always changing. Those qualities made the egret a natural fit for Avalon Ice — a company built around being dependable, responsive, and ready when our customers need us.",
    ],
    clip: "c",
  },
];

/**
 * /about — the Avalon Ice origin story, delivery heritage, and the story
 * behind the egret mascot, over the animated brand logo loop.
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
              {chapter.lead && (
                <p className="font-body text-sm font-semibold leading-relaxed text-navy">
                  {chapter.lead}
                </p>
              )}
              {chapter.body.map((para) => (
                <p
                  key={para}
                  className="font-body text-sm leading-relaxed text-lagoon"
                >
                  {para}
                </p>
              ))}
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
      <ContactSection />
    </>
  );
}
