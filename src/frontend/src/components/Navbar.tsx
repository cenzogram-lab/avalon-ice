import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/lib/socials";
import { Link } from "@tanstack/react-router";
import { Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#network", label: "Network" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/#order-form", label: "Order" },
  { href: "/#contact", label: "Contact" },
];

/**
 * Social placeholders — the brand accounts aren't live yet, so these are
 * labelled but inert (no destination, not focusable as links).
 */
function SocialTiles() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {SOCIALS.map((s) => (
        <span
          key={s.label}
          role="img"
          aria-label={`${s.label} — coming soon`}
          title={`${s.label} — coming soon`}
          data-ocid={`navbar.social.${s.label.toLowerCase()}`}
          className="social-tile !h-10 !w-10 cursor-default rounded-lg"
        >
          <s.icon className="size-4" />
        </span>
      ))}
    </div>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      data-ocid="navbar"
      className="sticky top-0 z-40 border-b-[3px] border-navy bg-cream-bright/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:h-20">
        <a
          href="/#top"
          data-ocid="navbar.brand"
          className="flex min-h-12 min-w-12 shrink-0 items-center gap-2.5"
        >
          <img
            src="/assets/images/avalon-heron.webp"
            alt=""
            aria-hidden="true"
            className="size-10 rounded-full border-2 border-navy bg-cream-bright lg:size-11"
          />
          <span className="hidden items-baseline gap-1.5 leading-none sm:flex">
            <span className="font-script text-2xl text-navy lg:text-3xl">
              Avalon
            </span>
            <span className="text-block-ice text-lg leading-none lg:text-xl">
              ICE
            </span>
          </span>
        </a>

        {/* Large primary links, desktop */}
        <nav
          className="hidden items-center gap-1 xl:flex 2xl:gap-2"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid={`navbar.link.${link.label.toLowerCase()}`}
              className="flex min-h-12 items-center whitespace-nowrap rounded-full px-2 py-3 font-body text-sm font-bold uppercase tracking-wide text-lagoon transition-colors hover:bg-ice-mist hover:text-navy 2xl:px-4 2xl:text-lg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Social icons live in the navbar on every breakpoint */}
          <SocialTiles />

          {/* Call CTA: icon-only on phones, full number from md up */}
          <Button
            asChild
            size="sm"
            data-ocid="navbar.call_button"
            className="btn-brutal btn-brutal-ice hidden bg-cream-bright font-body text-xs font-bold uppercase tracking-[0.1em] text-navy hover:bg-ice-mist min-h-12 md:inline-flex lg:px-5 lg:text-sm"
          >
            <a href="tel:8563089986">
              <Phone className="size-4" />
              (856) 308-9986
            </a>
          </Button>
          <Button
            asChild
            size="icon"
            aria-label="Call Avalon Ice"
            data-ocid="navbar.call_icon"
            className="btn-brutal btn-brutal-ice size-12 bg-cream-bright text-navy hover:bg-ice-mist md:hidden"
          >
            <a href="tel:8563089986">
              <Phone className="size-4" />
            </a>
          </Button>

          {/* Contact CTA → inquiry forms */}
          <Button
            asChild
            size="sm"
            data-ocid="navbar.contact_button"
            className="btn-brutal btn-brutal-ice hidden bg-navy font-body text-xs font-bold uppercase tracking-[0.1em] text-cream-bright hover:bg-lagoon min-h-12 md:inline-flex lg:px-6 lg:text-sm"
          >
            <a href="/#order-form">
              <Mail className="size-4" />
              Contact Us
            </a>
          </Button>

          <button
            type="button"
            data-ocid="navbar.menu_button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="btn-brutal btn-brutal-ice inline-flex size-12 items-center justify-center bg-cream-bright text-navy hover:bg-ice-mist xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t-2 border-navy bg-cream-bright px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                data-ocid={`navbar.mobile_link.${link.label.toLowerCase()}`}
                className="flex min-h-12 items-center rounded-md px-3 py-3 font-body text-lg font-bold uppercase tracking-wide text-lagoon hover:bg-ice-mist hover:text-navy"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-3">
              <Button
                asChild
                data-ocid="navbar.mobile_contact"
                className="btn-brutal btn-brutal-ice bg-navy py-5 font-body font-bold uppercase tracking-[0.1em] text-cream-bright hover:bg-navy"
              >
                {/* biome-ignore lint/a11y/useValidAnchor: real navigation to the order form; onClick only closes the menu */}
                <a href="/#order-form" onClick={() => setOpen(false)}>
                  <Mail className="size-4" />
                  Contact Us / Get a Quote
                </a>
              </Button>
              <Button
                asChild
                data-ocid="navbar.mobile_call"
                className="btn-brutal btn-brutal-ice bg-cream-bright py-5 font-body font-bold uppercase tracking-[0.1em] text-navy hover:bg-ice-frost"
              >
                <a href="tel:8563089986">
                  <Phone className="size-4" />
                  Call (856) 308-9986
                </a>
              </Button>
              <Button
                asChild
                data-ocid="navbar.mobile_shop"
                className="btn-brutal btn-brutal-ice bg-ice-light py-5 font-body font-bold uppercase tracking-[0.1em] text-navy hover:bg-ice"
              >
                <Link to="/shop" onClick={() => setOpen(false)}>
                  Visit the Shop
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
