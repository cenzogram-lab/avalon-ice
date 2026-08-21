import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Mail, Menu, Phone, Snowflake, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#network", label: "Network" },
  { href: "#order", label: "Order" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      data-ocid="navbar"
      className="sticky top-0 z-40 border-b border-border bg-card shadow-subtle"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#top"
          data-ocid="navbar.brand"
          className="flex items-center gap-2 text-foreground"
        >
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Snowflake className="size-5" />
          </span>
          <span className="font-script text-2xl leading-none text-primary">
            Avalon Ice
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid={`navbar.link.${link.label.toLowerCase()}`}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            asChild
            variant="outline"
            size="sm"
            data-ocid="navbar.admin_link"
          >
            <Link to="/admin">Admin</Link>
          </Button>
          <Button asChild size="sm" data-ocid="navbar.call_button">
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
          className="inline-flex size-10 items-center justify-center rounded-md text-foreground hover:bg-muted md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                data-ocid={`navbar.mobile_link.${link.label.toLowerCase()}`}
                className="rounded-md px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button asChild variant="outline" data-ocid="navbar.mobile_admin">
                <Link to="/admin" onClick={() => setOpen(false)}>
                  Admin Portal
                </Link>
              </Button>
              <Button asChild data-ocid="navbar.mobile_call">
                <a href="tel:8563089986">
                  <Phone className="size-4" />
                  Call (856) 308-9986
                </a>
              </Button>
              <Button
                asChild
                variant="secondary"
                data-ocid="navbar.mobile_mail"
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
