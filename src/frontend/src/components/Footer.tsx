import { Mail, MapPin, Phone, Snowflake } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-ocid="footer"
      className="border-t border-border bg-primary text-primary-foreground"
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary-foreground text-primary">
              <Snowflake className="size-5" />
            </span>
            <span className="font-script text-2xl leading-none">
              Avalon Ice
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
            The Shore's Coldest Delivery. Cape May County &amp; Beyond · Jersey
            Shore Ice Distribution.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-primary-foreground/70">
            Contact
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="tel:8563089986"
                data-ocid="footer.phone"
                className="inline-flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground"
              >
                <Phone className="size-4" /> (856) 308-9986
              </a>
            </li>
            <li>
              <a
                href="mailto:Sales@AvalonIce.com"
                data-ocid="footer.email"
                className="inline-flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground"
              >
                <Mail className="size-4" /> Sales@AvalonIce.com
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-primary-foreground/80">
              <MapPin className="size-4" /> Woodbine / Avalon, Cape May County,
              NJ
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-wider text-primary-foreground/70">
            Explore
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href="#services"
                className="text-primary-foreground/90 hover:text-primary-foreground"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#network"
                className="text-primary-foreground/90 hover:text-primary-foreground"
              >
                Delivery Network
              </a>
            </li>
            <li>
              <a
                href="#order"
                className="text-primary-foreground/90 hover:text-primary-foreground"
              >
                Request Delivery
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-primary-foreground/70 sm:flex-row sm:px-6">
          <span>© {year} Avalon Ice. All rights reserved.</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary-foreground"
          >
            Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
