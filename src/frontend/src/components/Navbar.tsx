import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/lib/socials";
import { Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#network", label: "Network" },
  { href: "/#order-form", label: "Order" },
  { href: "/#contact", label: "Contact" },
];

function SocialTiles({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {SOCIALS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          data-ocid={`navbar.social.${s.label.toLowerCase()}`}
          className={`social-tile ${
            compact ? "!h-8 !w-8 rounded-lg" : "!h-9 !w-9 rounded-lg"
          }`}
        >
          <s.icon className={compact ? "size-3.5" : "size-4"} />
        </a>
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:h-20">
        <a
          href="/#top"
          data-ocid="navbar.brand"
          className="flex shrink-0 items-center gap-2.5"
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
              Ice
            </span>
          </span>
        </a>

        {/* Large primary links, desktop */}
        <nav
          className="hidden items-center gap-1 lg:flex xl:gap-2"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid={`navbar.link.${link.label.toLowerCase()}`}
              className="rounded-full px-4 py-2.5 font-body text-base font-bold uppercase tracking-wide text-lagoon transition-colors hover:bg-ice-mist hover:text-navy xl:px-5 xl:text-lg"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Social icons live in the navbar on every breakpoint */}
          <div className="hidden lg:block">
            <SocialTiles />
          </div>
          <div className="lg:hidden">
            <SocialTiles compact />
          </div>

          {/* Call CTA: icon-only on phones, full number from md up */}
          <Button
            asChild
            size="sm"
            data-ocid="navbar.call_button"
            className="hidden rounded-full border-2 border-navy bg-cream-bright font-body text-sm font-bold uppercase tracking-wide text-navy shadow-[0_3px_0_#A3CCD1] hover:bg-ice-mist md:inline-flex lg:h-10 lg:px-4"
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
            className="size-8 rounded-lg border-2 border-navy bg-cream-bright text-navy shadow-[0_3px_0_#A3CCD1] hover:bg-ice-mist md:hidden"
          >
            <a href="tel:8563089986">
              <Phone className="size-3.5" />
            </a>
          </Button>

          {/* Contact CTA → inquiry forms */}
          <Button
            asChild
            size="sm"
            data-ocid="navbar.contact_button"
            className="hidden rounded-full border-2 border-navy bg-navy font-body text-sm font-bold uppercase tracking-wide text-cream-bright shadow-[0_3px_0_#A3CCD1] hover:bg-lagoon md:inline-flex lg:h-10 lg:px-5"
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
            className="inline-flex size-8 items-center justify-center rounded-lg border-2 border-navy text-navy shadow-[0_3px_0_#A3CCD1] hover:bg-ice-mist sm:size-10 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t-2 border-navy bg-cream-bright px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                data-ocid={`navbar.mobile_link.${link.label.toLowerCase()}`}
                className="rounded-md px-3 py-2.5 font-body text-lg font-bold uppercase tracking-wide text-lagoon hover:bg-ice-mist hover:text-navy"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2.5">
              <Button
                asChild
                data-ocid="navbar.mobile_contact"
                className="btn-brutal btn-brutal-ice rounded-xl bg-navy py-5 font-body font-bold uppercase tracking-wide text-cream-bright hover:bg-navy"
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
                className="btn-brutal rounded-xl bg-cream-bright py-5 font-body font-bold uppercase tracking-wide text-navy hover:bg-ice-frost"
              >
                <a href="tel:8563089986">
                  <Phone className="size-4" />
                  Call (856) 308-9986
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
