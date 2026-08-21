import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouterState } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const isAdmin = pathname.startsWith("/admin");

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
