import ContactSection from "@/components/ContactSection";
import { ChevronDown, Scale } from "lucide-react";
import { type ReactNode, useEffect } from "react";

/** The legal entity named on every legal page. */
export const LEGAL_ENTITY = "Avalon Ice, LLC";
export const LEGAL_EMAIL = "Sales@AvalonIce.co";
export const LEGAL_PHONE = "(856) 308-9986";
export const LEGAL_PHONE_HREF = "tel:8563089986";

export type LegalSection = {
  /** Anchor id; also the table-of-contents target. */
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  ocid: string;
  /** Headline words; the last is set in the ice accent. */
  title: [string, string];
  /** Browser tab title. */
  documentTitle: string;
  intro: ReactNode;
  effectiveDate: string;
  sections: LegalSection[];
};

const ACCENT =
  "bg-gradient-to-r from-sky-200 via-white to-sky-400 bg-clip-text text-transparent";

/**
 * Shared shell for /privacy and /terms: a navy masthead matching the
 * products band, a table of contents (collapsible on phones, sticky beside
 * the text on desktop), numbered sections, and the site-wide contact form.
 *
 * Each page passes its sections as data, so the table of contents and the
 * body are generated from one list and cannot drift apart.
 */
export default function LegalPage({
  ocid,
  title,
  documentTitle,
  intro,
  effectiveDate,
  sections,
}: LegalPageProps) {
  // Open at the top of the page. Layout's navigation hook already resets
  // scroll on route changes; this also covers a fresh load or a reload
  // part-way down. A deep link to a section (/privacy#your-rights) keeps
  // its hash target instead.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const previous = document.title;
    document.title = documentTitle;
    return () => {
      document.title = previous;
    };
  }, [documentTitle]);

  const toc = (
    <ol className="grid gap-0.5">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="flex min-h-11 items-baseline gap-3 rounded-md px-2 py-2 font-body text-sm text-lagoon transition-colors hover:bg-ice-light/60 hover:text-navy"
          >
            <span className="w-6 shrink-0 font-bold tabular-nums text-navy/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <section
        data-ocid={`${ocid}.header`}
        className="relative overflow-x-clip bg-gradient-to-b from-[#081B2E] via-[#0C2B48] to-[#0C2B48] pb-24 pt-14 md:pb-32 md:pt-20"
      >
        {/* The masthead runs into the cream body, so its lower edge fades
            rather than ending on a hard line. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cream to-transparent md:h-28"
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <span className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
            <Scale className="size-4" />
            Legal
          </span>
          <h1 className="script-heading mt-3 text-5xl sm:text-6xl md:text-7xl">
            <span className="text-white">{title[0]}</span>{" "}
            <span className={ACCENT}>{title[1]}</span>
          </h1>
          <div className="mt-6 max-w-2xl font-body text-base leading-relaxed text-sky-100/85 sm:text-lg">
            {intro}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="chip chip-solid">Effective {effectiveDate}</span>
            <span className="chip">{LEGAL_ENTITY} · Cape May County, N.J.</span>
          </div>
        </div>
      </section>

      <section
        data-ocid={`${ocid}.body`}
        className="texture-paper bg-cream pb-16 pt-4 md:pb-24"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
          {/* Phones and tablets: a collapsible contents list above the text. */}
          <details className="group rounded-xl border-2 border-navy bg-cream-bright shadow-[0_4px_0_#A3CCD1] lg:hidden">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-body text-sm font-bold uppercase tracking-[0.14em] text-navy [&::-webkit-details-marker]:hidden">
              On this page
              <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
            </summary>
            <nav aria-label="On this page" className="px-2 pb-3">
              {toc}
            </nav>
          </details>

          {/* Desktop: the contents list rides alongside the text. */}
          <aside className="hidden lg:block">
            <nav
              aria-label="Sections"
              className="sticky top-28 rounded-xl border-2 border-navy bg-cream-bright p-3 shadow-[0_4px_0_#A3CCD1]"
            >
              <p className="eyebrow px-2 pb-2 pt-1">On this page</p>
              {toc}
            </nav>
          </aside>

          <article className="min-w-0">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                aria-labelledby={`${s.id}-title`}
                className="scroll-mt-28 border-t-2 border-navy/15 py-9 first:border-t-0 first:pt-2"
              >
                <p className="eyebrow">
                  Section {String(i + 1).padStart(2, "0")}
                </p>
                <h2
                  id={`${s.id}-title`}
                  className="text-block-navy mt-2 text-xl leading-snug sm:text-2xl"
                >
                  {s.title}
                </h2>
                <div className="mt-4 grid gap-4 font-body text-[0.95rem] leading-relaxed text-lagoon">
                  {s.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>

      <ContactSection />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Prose helpers shared by the legal pages                             */
/* ------------------------------------------------------------------ */

export function LegalList({ children }: { children: ReactNode }) {
  return (
    <ul className="grid list-disc gap-2 pl-5 marker:text-ice-deep">
      {children}
    </ul>
  );
}

/** A labelled sub-heading inside a section. */
export function LegalSubhead({ children }: { children: ReactNode }) {
  return (
    <h3 className="pt-1 font-body text-base font-bold text-navy">{children}</h3>
  );
}

/** Set-apart statement for the clauses readers most need to see. */
export function LegalCallout({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border-2 border-navy bg-ice-light/50 p-5 shadow-[0_4px_0_#A3CCD1]">
      <p className="font-body text-xs font-bold uppercase tracking-[0.16em] text-navy">
        {label}
      </p>
      <div className="mt-2 font-body text-[0.95rem] font-medium leading-relaxed text-navy">
        {children}
      </div>
    </div>
  );
}

export function EmailLink() {
  return (
    <a
      href={`mailto:${LEGAL_EMAIL}`}
      className="font-semibold text-navy underline decoration-ice-deep decoration-2 underline-offset-2 hover:text-lagoon"
    >
      {LEGAL_EMAIL}
    </a>
  );
}

export function PhoneLink() {
  return (
    <a
      href={LEGAL_PHONE_HREF}
      className="font-semibold text-navy underline decoration-ice-deep decoration-2 underline-offset-2 hover:text-lagoon"
    >
      {LEGAL_PHONE}
    </a>
  );
}

/** In-page cross-reference to another section of the same document. */
export function SectionLink({
  to,
  children,
}: { to: string; children: ReactNode }) {
  return (
    <a
      href={`#${to}`}
      className="font-semibold text-navy underline decoration-ice-deep decoration-2 underline-offset-2 hover:text-lagoon"
    >
      {children}
    </a>
  );
}
