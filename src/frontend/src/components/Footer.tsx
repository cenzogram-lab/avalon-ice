import RoadParade from "@/components/home/RoadParade";
import { SOCIALS } from "@/lib/socials";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      data-ocid="footer"
      className="texture-paper border-t-[3px] border-navy bg-cream text-navy"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 md:grid-cols-2">
        {/* Brand block */}
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/assets/images/avalon-heron.webp"
              alt="Avalon Ice heron mascot"
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

        {/* Wholesale & partnerships */}
        <div className="md:justify-self-end">
          <h3 className="eyebrow">Wholesale &amp; Partnerships</h3>
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
              Cell: (856) 308-9986
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
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-5 font-body text-xs font-bold uppercase tracking-[0.14em] text-lagoon sm:px-6">
          <span>© 2026 Avalon Ice · Cape May County, N.J.</span>
        </div>
        {/* Extra bottom padding on mobile keeps the fixed contact CTA clear */}
        <div className="flex items-center justify-center pb-24 text-center md:pb-4">
          <Link
            to="/admin"
            data-ocid="footer.admin_link"
            className="font-body text-[0.65rem] text-lagoon-soft hover:text-navy"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
