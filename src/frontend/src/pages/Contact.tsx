import ContactSection from "@/components/ContactSection";
import IceFrame from "@/components/home/IceFrame";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Siren } from "lucide-react";

/**
 * /contact — a dedicated, indexable contact URL (a "/#contact" fragment is
 * treated by search engines as the home page). Quick ways to reach the
 * team up top, then the shared inquiry forms.
 */
export default function Contact() {
  return (
    <>
      <section
        data-ocid="contact.hero"
        className="texture-paper bg-cream pb-6 pt-14 md:pb-10 md:pt-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span className="chip chip-solid">
            <Siren className="size-3.5" />
            Emergency drops · Routes · Events
          </span>
          <h1 className="script-heading mt-6 max-w-3xl text-5xl sm:text-6xl md:text-7xl">
            Contact{" "}
            <span className="text-block-ice text-4xl sm:text-5xl md:text-6xl">
              Avalon Ice
            </span>
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg font-medium text-lagoon">
            Emergency shore drops, standing delivery routes and bulk ice pallets
            for events across Cape May County. Call, email, or send a request
            below and you'll get a reference number right away.
          </p>

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            <li>
              <IceFrame
                clip="a"
                hover="lift"
                className="h-full"
                innerClassName="flex h-full flex-col gap-2 p-6"
              >
                <span className="eyebrow inline-flex items-center gap-2">
                  <Phone className="size-4" />
                  Same-day &amp; emergency
                </span>
                <a
                  href="tel:8563089986"
                  className="text-block-navy inline-flex min-h-11 items-center text-xl hover:text-lagoon"
                  data-ocid="contact.phone"
                >
                  (856) 308-9986
                </a>
                <p className="font-body text-sm leading-relaxed text-lagoon">
                  Freezer down or a crowd surge? Call for a same-day shore run.
                </p>
              </IceFrame>
            </li>
            <li>
              <IceFrame
                clip="b"
                hover="lift"
                className="h-full"
                innerClassName="flex h-full flex-col gap-2 p-6"
              >
                <span className="eyebrow inline-flex items-center gap-2">
                  <Mail className="size-4" />
                  Routes &amp; wholesale
                </span>
                <a
                  href="mailto:Sales@AvalonIce.co"
                  className="text-block-navy inline-flex min-h-11 items-center break-all text-xl hover:text-lagoon"
                  data-ocid="contact.email"
                >
                  Sales@AvalonIce.co
                </a>
                <p className="font-body text-sm leading-relaxed text-lagoon">
                  Standing orders, event supply and route partnerships.
                </p>
              </IceFrame>
            </li>
            <li>
              <IceFrame
                clip="c"
                hover="lift"
                className="h-full"
                innerClassName="flex h-full flex-col gap-2 p-6"
              >
                <span className="eyebrow inline-flex items-center gap-2">
                  <MapPin className="size-4" />
                  Service area
                </span>
                <p className="text-block-navy text-xl">
                  Cape May County &amp; the South Jersey Shore
                </p>
                <Link
                  to="/"
                  hash="network"
                  className="inline-flex min-h-11 items-center font-body text-sm font-semibold text-navy underline decoration-ice-deep decoration-2 underline-offset-2 hover:text-lagoon"
                  data-ocid="contact.network_link"
                >
                  See the delivery map
                </Link>
              </IceFrame>
            </li>
          </ul>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
