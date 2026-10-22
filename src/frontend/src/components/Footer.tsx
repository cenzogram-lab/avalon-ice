import RoadParade from "@/components/home/RoadParade";
import { SOCIALS } from "@/lib/socials";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";

const FOOTER_LINKS = [
  { key: "home", to: "/", label: "Home" },
  { key: "shop", to: "/shop", label: "Shop & Pricing" },
  { key: "about", to: "/about", label: "About Us" },
  { key: "contact", to: "/contact", label: "Contact Us" },
] as const;

export default function Footer() {
  return (
    <footer
      data-ocid="footer"
      className="texture-paper border-t-[3px] border-navy bg-cream text-navy"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_0.8fr_1.2fr] md:gap-10">
        {/* Brand block */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/avalon-heron.webp"
              alt="Avalon Ice egret mascot"
              className="size-12 rounded-full border-2 border-navy bg-cream-bright"
            />
            <span className="flex items-baseline gap-2 leading-none">
              <span className="font-script text-3xl text-navy">Avalon</span>
              <span className="text-block-ice text-2xl leading-none">ICE</span>
            </span>
          </div>

          <div className="clip-ribbon ice-shadow mt-6 inline-block bg-navy p-[3px]">
            <div className="clip-ribbon bg-ice-light px-6 py-2.5">
              <span
                data-ocid="footer.ribbon"
                className="inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-[0.14em] text-navy"
              >
                <MapPin className="size-4" />
                Proudly Born in Avalon, NJ
              </span>
            </div>
          </div>

          <p className="mt-6 max-w-sm font-body text-sm leading-relaxed text-lagoon">
            Packaged &amp; bulk ice distribution — Cape May County and up the
            shore.
          </p>
        </div>

        {/* Site navigation: the same primary pages as the navbar */}
        <nav aria-label="Footer" data-ocid="footer.nav">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-3 grid gap-0.5">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  data-ocid={`footer.link.${link.key}`}
                  className="inline-flex min-h-11 min-w-11 items-center font-body text-sm font-semibold text-lagoon underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-200 ease-out hover:text-navy hover:decoration-ice-deep"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Wholesale & partnerships */}
        <div className="md:justify-self-end">
          <h2 className="eyebrow">Wholesale &amp; Partnerships</h2>
          <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-lagoon">
            Standing orders, event supply, and route partnerships — let's talk
            before the season starts.
          </p>
          <a
            href="mailto:Sales@AvalonIce.co"
            data-ocid="footer.email"
            className="mt-4 inline-flex min-h-12 items-center gap-2.5 font-script text-2xl text-navy hover:text-lagoon"
          >
            <Mail className="size-5 text-lagoon" />
            Sales@AvalonIce.co
          </a>
          <p className="mt-2 font-body text-sm font-semibold text-lagoon">
            <a
              href="tel:8563089986"
              data-ocid="footer.phone"
              className="inline-flex min-h-12 items-center hover:text-navy"
            >
              (856) 308-9986
            </a>
          </p>

          <div className="mt-6 flex items-center gap-3">
            {SOCIALS.map((s) => (
              <span
                key={s.label}
                role="img"
                aria-label={`${s.label} — coming soon`}
                title={`${s.label} — coming soon`}
                data-ocid={`footer.social.${s.label.toLowerCase()}`}
                className="social-tile cursor-default"
              >
                <s.icon className="size-5" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* The fleet keeps rolling along the foot of the site */}
      <RoadParade />

      <div className="border-t border-navy/25">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-x-5 gap-y-1 px-4 pt-4 font-body text-xs font-bold uppercase tracking-[0.14em] text-lagoon sm:flex-row sm:flex-wrap sm:px-6 md:py-4">
          <span className="py-1 text-center">
            © 2026 Avalon Ice · Cape May County, N.J.
          </span>
          <nav
            aria-label="Legal"
            className="flex items-center gap-1"
            data-ocid="footer.legal"
          >
            <span aria-hidden="true" className="hidden text-navy/30 sm:inline">
              ·
            </span>
            <Link
              to="/privacy"
              data-ocid="footer.privacy_link"
              className="inline-flex min-h-11 items-center px-2 underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-200 ease-out hover:text-navy hover:decoration-ice-deep"
            >
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-navy/30">
              ·
            </span>
            <Link
              to="/terms"
              data-ocid="footer.terms_link"
              className="inline-flex min-h-11 items-center px-2 underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-200 ease-out hover:text-navy hover:decoration-ice-deep"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
        {/* Extra bottom padding on mobile keeps the fixed contact CTA clear */}
        <div className="flex items-center justify-center pb-24 text-center md:pb-4">
          <Link
            to="/admin"
            data-ocid="footer.admin_link"
            className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 font-body text-xs text-lagoon-soft hover:text-navy"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
