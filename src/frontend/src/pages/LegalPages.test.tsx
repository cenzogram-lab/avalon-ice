import { screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// ContactSection (rendered by every legal page) calls useSubmitInquiry, which
// reaches for the backend actor. A null actor keeps the forms inert.
vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: null, isFetching: false }),
}));

import PrivacyPolicy, { NO_SALE_STATEMENT } from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import { renderWithRouter } from "@/test/renderWithRouter";

afterEach(() => {
  vi.restoreAllMocks();
});

/** Every table-of-contents entry must land on a section that exists. */
async function expectTocMatchesSections(container: HTMLElement) {
  const nav = await screen.findByRole("navigation", { name: "Sections" });
  const hrefs = within(nav)
    .getAllByRole("link")
    .map((a) => a.getAttribute("href") ?? "");

  expect(hrefs.length).toBeGreaterThan(5);
  expect(new Set(hrefs).size).toBe(hrefs.length);
  for (const href of hrefs) {
    expect(href).toMatch(/^#[a-z-]+$/);
    expect(container.querySelector(href)).not.toBeNull();
  }
}

describe.each([
  ["Privacy Policy", PrivacyPolicy, "Privacy Policy · Avalon Ice"],
  ["Terms of Service", TermsOfService, "Terms of Service · Avalon Ice"],
] as const)("%s page", (_name, Page, tabTitle) => {
  it("opens at the top of the page on mount", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderWithRouter(<Page />);
    await screen.findByRole("heading", { level: 1 });
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("links every contents entry to a real section", async () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { container } = renderWithRouter(<Page />);
    await expectTocMatchesSections(container);
  });

  it("names the entity, contact channels, and sets the tab title", async () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { container } = renderWithRouter(<Page />);
    await screen.findByRole("heading", { level: 1 });

    const text = container.textContent ?? "";
    expect(text).toContain("Avalon Ice, LLC");
    expect(text).toContain("(856) 308-9986");
    expect(
      container.querySelector('a[href="mailto:Sales@AvalonIce.co"]'),
    ).not.toBeNull();
    expect(document.title).toBe(tabTitle);
  });
});

describe("Privacy Policy content", () => {
  it("covers the NJ statutes, no-sale pledge, rights timeline and minors", async () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { container } = renderWithRouter(<PrivacyPolicy />);
    await screen.findByRole("heading", { level: 1 });
    const text = container.textContent ?? "";

    expect(text).toContain("New Jersey Data Privacy Act");
    expect(text).toContain("Senate Bill 332");
    expect(text).toContain("N.J.S.A. § 56:8-1 et seq.");
    expect(screen.getByText(NO_SALE_STATEMENT)).toBeInTheDocument();
    expect(text).toContain("within 45 days");
    expect(text).toContain("Stripe");
    expect(text).toContain("Internet Computer Protocol");
    expect(text).toContain("COPPA");
    expect(text).toContain("aged 18 and older");
    expect(text).toContain("not directed to minors under 16");
  });
});

describe("Terms of Service content", () => {
  it("covers food grade, risk of loss, inspection window, payment and venue", async () => {
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    const { container } = renderWithRouter(<TermsOfService />);
    await screen.findByRole("heading", { level: 1 });
    const text = container.textContent ?? "";

    expect(text).toContain("21 CFR Part 117");
    expect(text).toContain("N.J.A.C. § 8:21");
    expect(text).toContain("between 0°F and 32°F");
    expect(text).toContain("4 hours of delivery");
    expect(text).toContain("24 hours’");
    expect(text).toContain("48 hours’");
    expect(text).toContain("1.5% per month");
    expect(text).toContain("Cape May County");
    expect(text).toContain("Camden Vicinage");
    expect(text).toContain("N.J.S.A. § 56:12-14 et seq.");
    expect(text).toContain("Garden State Parkway");
  });
});
