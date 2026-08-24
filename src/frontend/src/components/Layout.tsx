import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouterState } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { type ReactNode, useEffect } from "react";

/**
 * Puts each navigation at the right scroll position.
 *
 * Two cases, neither of which the browser gets right on its own here:
 *
 * - A hash link (`/#order-form`). The native hash scroll only fires if the
 *   target already exists at load, which it never does in this client-
 *   rendered SPA — the scroll is silently dropped and the visitor is
 *   stranded at the top of the page.
 * - A plain route change (`/shop`). The router keeps the outgoing scroll
 *   offset, so jumping from mid-page lands the new page part-scrolled.
 */
function useScrollOnNavigate() {
  const { pathname, hash } = useRouterState({
    select: (s) => ({ pathname: s.location.pathname, hash: s.location.hash }),
  });

  // `pathname` is a re-run trigger, not a value this effect reads: a plain
  // route change (/ -> /shop) leaves `hash` empty both times, so depending
  // on `hash` alone would never fire and the new page would open still
  // scrolled to the old offset.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname re-runs this on route changes
  useEffect(() => {
    const id = hash.replace(/^#/, "");

    // No hash: a route change should start at the top of the new page.
    // Re-asserting over a few frames matters — content painting in after
    // the first reset (video backdrops, lazy sections) can otherwise leave
    // the page a little way down. Any real scroll input hands control back.
    if (!id) {
      let topFrame = 0;
      let held = 0;
      let cancelled = false;
      const release = () => {
        cancelled = true;
      };
      const hold = () => {
        if (cancelled) return;
        if (window.scrollY !== 0) window.scrollTo({ top: 0, left: 0 });
        if (++held < 20) topFrame = requestAnimationFrame(hold);
      };
      topFrame = requestAnimationFrame(hold);
      for (const evt of ["wheel", "touchstart", "keydown"]) {
        window.addEventListener(evt, release, { once: true, passive: true });
      }
      return () => {
        cancelAnimationFrame(topFrame);
        for (const evt of ["wheel", "touchstart", "keydown"]) {
          window.removeEventListener(evt, release);
        }
      };
    }

    let frame = 0;
    let attempts = 0;
    let settled = 0;

    // `scroll-margin-top` on the section keeps the sticky navbar clear.
    const marginOf = (el: Element) =>
      Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;

    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        const delta = el.getBoundingClientRect().top - marginOf(el);
        if (Math.abs(delta) <= 2) {
          // Hold still for a few frames before trusting the position:
          // images and lazy sections above can still push it down.
          if (++settled > 12) return;
        } else {
          settled = 0;
          // Nudging by a delta beats scrollIntoView here — a smooth
          // scrollIntoView animates toward an offset fixed at call time,
          // so content loading above it lands the page short.
          window.scrollBy({ top: delta, behavior: "auto" });
        }
      }
      if (attempts++ < 240) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hash, pathname]);
}

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const isAdmin = pathname.startsWith("/admin");

  useScrollOnNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Mobile-only fixed contact CTA → inquiry forms */}
      {!isAdmin && (
        <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
          <Button
            asChild
            size="lg"
            data-ocid="layout.mobile_contact"
            className="btn-brutal btn-brutal-ice w-full rounded-xl bg-navy py-6 font-body text-base font-bold uppercase tracking-wide text-cream-bright hover:bg-navy"
          >
            <a href="/#order-form">
              <Mail className="size-5" />
              Contact Us / Get a Quote
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
