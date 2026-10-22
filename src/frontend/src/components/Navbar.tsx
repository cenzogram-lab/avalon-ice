import { SOCIALS } from "@/lib/socials";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Mail, Phone, ShoppingBag } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

/**
 * Primary navigation. Short, specific anchor text helps visitors and search
 * engines alike (sitelinks are derived from it); the same pages are listed
 * in the footer and in the SiteNavigationElement schema (src/lib/seo.ts).
 */
export const NAV_LINKS = [
  { key: "services", href: "/#services", label: "Services" },
  { key: "network", href: "/#network", label: "Network" },
  { key: "shop", href: "/shop", label: "Shop & Pricing" },
  { key: "about", href: "/about", label: "About Us" },
  { key: "contact", href: "/contact", label: "Contact Us" },
];

const PHONE_HREF = "tel:8563089986";
const PHONE_LABEL = "(856) 308-9986";

/** One full-height bar cell; dividers come from the cell's left border. */
const CELL = "flex h-full shrink-0 items-center border-l border-navy/15";

/**
 * Social placeholders — the brand accounts aren't live yet, so these are
 * labelled but inert (no destination, not focusable as links).
 */
function SocialCells() {
  return (
    <div className="flex h-full items-center">
      {SOCIALS.map((s) => (
        <span
          key={s.label}
          role="img"
          aria-label={`${s.label} — coming soon`}
          title={`${s.label} — coming soon`}
          data-ocid={`navbar.social.${s.label.toLowerCase()}`}
          className={`${CELL} w-10 cursor-default justify-center text-navy sm:w-12`}
        >
          <s.icon className="size-4" />
        </span>
      ))}
    </div>
  );
}

/** "More ▾": the call and quote actions plus the shop, in one small panel. */
function MoreMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);
  const item =
    "flex min-h-12 items-center gap-3 border-t border-navy/15 px-4 font-body text-sm font-bold text-navy first:border-t-0 hover:bg-ice-mist";

  return (
    <div ref={rootRef} className={`${CELL} relative`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        data-ocid="navbar.menu_button"
        className="nav-cell flex h-full items-center gap-6 px-3 font-body text-sm font-bold text-navy sm:px-4"
      >
        More
        <ChevronDown
          aria-hidden="true"
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          id={panelId}
          data-ocid="navbar.more_panel"
          className="absolute right-0 top-full z-50 mt-px w-64 border border-navy/15 bg-cream-bright shadow-lg xl:left-0 xl:right-auto"
        >
          {/* biome-ignore lint/a11y/useValidAnchor: real navigation to the order form; onClick only closes the panel */}
          <a
            href="/#order-form"
            onClick={close}
            data-ocid="navbar.mobile_contact"
            className={item}
          >
            <Mail className="size-4" /> Get a Quote
          </a>
          <a href={PHONE_HREF} data-ocid="navbar.mobile_call" className={item}>
            <Phone className="size-4" /> Call {PHONE_LABEL}
          </a>
          <Link
            to="/shop"
            onClick={close}
            data-ocid="navbar.mobile_shop"
            className={item}
          >
            <ShoppingBag className="size-4" /> Visit the Shop
          </Link>
        </div>
      )}
    </div>
  );
}

/**
 * The phone link row scrolls sideways. Fade whichever edge has more links
 * past it, so the row reads as scrollable, and bring the current page's
 * link into view (on /contact it would otherwise start off-screen).
 */
function useLinkStrip(pathname: string) {
  const ref = useRef<HTMLElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const nav = ref.current;
    if (!nav) return;
    const measure = () => {
      const max = nav.scrollWidth - nav.clientWidth;
      setEdges({ start: nav.scrollLeft > 2, end: nav.scrollLeft < max - 2 });
    };
    measure();
    nav.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      nav.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  // `pathname` re-runs this after navigation; the current link is read
  // from the DOM, which has re-rendered by then.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname re-runs this on route changes
  useEffect(() => {
    const nav = ref.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    const left = link.offsetLeft - nav.offsetLeft;
    const right = left + link.offsetWidth;
    if (left < nav.scrollLeft || right > nav.scrollLeft + nav.clientWidth) {
      nav.scrollLeft = left - (nav.clientWidth - link.offsetWidth) / 2;
    }
  }, [pathname]);

  const fade = 28;
  const mask =
    edges.start || edges.end
      ? `linear-gradient(to right, ${edges.start ? "transparent" : "#000"} 0, #000 ${edges.start ? fade : 0}px, #000 calc(100% - ${edges.end ? fade : 0}px), ${edges.end ? "transparent" : "#000"} 100%)`
      : undefined;
  return {
    ref,
    style: mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined,
  };
}

/**
 * A flat bar of full-height cells split by hairline dividers: brand, call,
 * page links and "More", then socials and the quote action. Below xl the
 * page links drop to a second, side-scrolling row so every link stays one
 * tap away on a phone.
 */
export default function Navbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const strip = useLinkStrip(pathname);

  return (
    <header
      data-ocid="navbar"
      className="sticky top-0 z-40 border-b border-navy/20 bg-cream-bright shadow-[0_1px_0_rgb(12_53_82/0.04)]"
    >
      <div className="mx-auto flex max-w-[88rem] flex-wrap items-stretch xl:h-16 xl:flex-nowrap">
        <div className="flex h-14 w-full items-stretch xl:contents">
          <a
            href="/#top"
            aria-label="Avalon Ice home"
            data-ocid="navbar.brand"
            className="flex h-full shrink-0 items-center gap-2.5 px-3 sm:px-4 xl:h-16"
          >
            <img
              src="/assets/images/avalon-heron.webp"
              alt=""
              aria-hidden="true"
              className="size-10 rounded-full border-2 border-navy bg-cream-bright"
            />
            <span className="hidden items-baseline gap-1.5 leading-none sm:flex">
              <span className="font-script text-2xl text-navy">Avalon</span>
              <span className="text-block-ice text-lg leading-none">ICE</span>
            </span>
          </a>

          {/* Call: a round icon like an account button, number when it fits */}
          <a
            href={PHONE_HREF}
            aria-label={`Call Avalon Ice at ${PHONE_LABEL}`}
            data-ocid="navbar.call_button"
            className={`${CELL} nav-cell gap-2 px-3 font-body text-sm font-bold text-navy xl:h-16`}
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-navy text-cream-bright">
              <Phone aria-hidden="true" className="size-4" />
            </span>
            <span className="hidden whitespace-nowrap md:inline xl:hidden 2xl:inline">
              {PHONE_LABEL}
            </span>
          </a>

          <div className="ml-auto flex h-full items-stretch xl:order-last xl:ml-auto xl:h-16">
            <SocialCells />
            {/* Quote CTA → inquiry forms */}
            <a
              href="/#order-form"
              aria-label="Get a Quote"
              data-ocid="navbar.contact_button"
              className="flex h-full shrink-0 items-center gap-2 bg-navy px-4 font-body text-sm font-bold text-cream-bright transition-colors hover:bg-lagoon"
            >
              <Mail aria-hidden="true" className="size-4" />
              <span className="hidden md:inline">Get a Quote</span>
            </a>
          </div>
        </div>

        <div className="flex h-12 w-full items-stretch border-t border-navy/15 xl:h-16 xl:w-auto xl:border-t-0">
          <nav
            ref={strip.ref}
            aria-label="Primary"
            style={strip.style}
            className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto xl:overflow-visible"
          >
            {NAV_LINKS.map((link) => {
              const current = link.href === pathname;
              return (
                <a
                  key={link.key}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  data-ocid={`navbar.link.${link.key}`}
                  className="nav-cell flex shrink-0 items-center whitespace-nowrap border-l border-navy/15 px-3 font-body text-sm font-bold text-navy first:border-l-0 sm:px-4 xl:first:border-l 2xl:px-5"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
          <MoreMenu />
        </div>
      </div>
    </header>
  );
}
