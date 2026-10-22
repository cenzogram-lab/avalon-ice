import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Home, Phone, ShoppingBag, Snowflake } from "lucide-react";

/**
 * Any URL the router doesn't know. The head hook already marks these
 * noindex with a "Page not found" title; this gives the visitor a clear
 * message and the three places they most likely meant to go.
 */
export default function NotFound() {
  return (
    <section
      data-ocid="not_found"
      className="texture-paper bg-cream px-4 py-20 text-center md:py-28"
    >
      <span className="mx-auto flex size-16 items-center justify-center rounded-full border-[3px] border-navy bg-ice-light text-navy shadow-[0_4px_0_#A3CCD1]">
        <Snowflake className="size-8" />
      </span>
      <h1 className="script-heading mt-6 text-5xl sm:text-6xl">
        Page not found
      </h1>
      <p className="mx-auto mt-4 max-w-md font-body text-lg text-lagoon">
        That page melted away. Try one of these instead, or call us at{" "}
        <a href="tel:8563089986" className="font-bold text-navy underline">
          (856) 308-9986
        </a>
        .
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          size="lg"
          data-ocid="not_found.home"
          className="btn-brutal btn-brutal-ice min-h-12 bg-navy font-body font-bold uppercase tracking-wide text-cream-bright hover:bg-lagoon"
        >
          <Link to="/">
            <Home className="size-4" /> Home
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          data-ocid="not_found.shop"
          className="btn-brutal btn-brutal-ice min-h-12 bg-cream-bright font-body font-bold uppercase tracking-wide text-navy hover:bg-ice-mist"
        >
          <Link to="/shop">
            <ShoppingBag className="size-4" /> Shop
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          data-ocid="not_found.contact"
          className="btn-brutal btn-brutal-ice min-h-12 bg-cream-bright font-body font-bold uppercase tracking-wide text-navy hover:bg-ice-mist"
        >
          <Link to="/contact">
            <Phone className="size-4" /> Contact
          </Link>
        </Button>
      </div>
    </section>
  );
}
