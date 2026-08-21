import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Mail, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#network", label: "Network" },
  { href: "/#order-form", label: "Order" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      data-ocid="navbar"
      className="sticky top-0 z-40 border-b-[3px] border-navy bg-cream-bright/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="/#top"
          data-ocid="navbar.brand"
          className="flex items-center gap-2.5"
        >
          <img
            src="/assets/images/avalon-heron.webp"
            alt=""
            aria-hidden="true"
            className="size-10 rounded-full border-2 border-navy bg-cream-bright"
          />
          <span className="flex items-baseline gap-1.5 leading-none">
            <span className="font-script text-2xl text-navy">Avalon</span>
            <span className="text-block-ice text-lg leading-none">Ice</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid={`navbar.link.${link.label.toLowerCase()}`}
              className="rounded-full px-3.5 py-2 font-body text-sm font-bold uppercase tracking-wide text-lagoon transition-colors hover:bg-ice-mist hover:text-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <Button
            asChild
            variant="outline"
            size="sm"
            data-ocid="navbar.admin_link"
            className="rounded-full border-2 border-navy bg-cream-bright font-body text-xs font-bold uppercase tracking-wide text-navy shadow-[0_3px_0_#A3CCD1] hover:bg-ice-mist"
          >
            <Link to="/admin">Admin</Link>
          </Button>
          <Button
            asChild
            size="sm"
            data-ocid="navbar.call_button"
            className="rounded-full border-2 border-navy bg-navy font-body text-xs font-bold uppercase tracking-wide text-cream-bright shadow-[0_3px_0_#A3CCD1] hover:bg-lagoon"
          >
            <a href="tel:8563089986">
              <Phone className="size-4" />
              (856) 308-9986
            </a>
          </Button>
        </div>

        <button
          type="button"
          data-ocid="navbar.menu_button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center rounded-md border-2 border-navy text-navy hover:bg-ice-mist md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-navy bg-cream-bright px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                data-ocid={`navbar.mobile_link.${link.label.toLowerCase()}`}
                className="rounded-md px-3 py-2.5 font-body text-base font-bold uppercase tracking-wide text-lagoon hover:bg-ice-mist hover:text-navy"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2.5">
              <Button
                asChild
                variant="outline"
                data-ocid="navbar.mobile_admin"
                className="rounded-full border-2 border-navy font-body font-bold uppercase tracking-wide text-navy"
              >
                <Link to="/admin" onClick={() => setOpen(false)}>
                  Admin Portal
                </Link>
              </Button>
              <Button
                asChild
                data-ocid="navbar.mobile_call"
                className="rounded-full border-2 border-navy bg-navy font-body font-bold uppercase tracking-wide text-cream-bright"
              >
                <a href="tel:8563089986">
                  <Phone className="size-4" />
                  Call (856) 308-9986
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                data-ocid="navbar.mobile_mail"
                className="rounded-full border-2 border-navy bg-ice-light font-body font-bold uppercase tracking-wide text-navy"
              >
                <a href="mailto:Sales@AvalonIce.com">
                  <Mail className="size-4" />
                  Sales@AvalonIce.com
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
