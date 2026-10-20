import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Footer from "@/components/Footer";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("Footer", () => {
  it("links the primary pages with concise anchor text", async () => {
    renderWithRouter(<Footer />);
    const nav = await screen.findByRole("navigation", { name: "Footer" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Home", "/"],
      ["Shop & Pricing", "/shop"],
      ["About Us", "/about"],
      ["Contact Us", "/contact"],
    ]);
  });

  it("links to the Privacy Policy and Terms of Service beside the copyright", async () => {
    renderWithRouter(<Footer />);

    const legal = await screen.findByRole("navigation", { name: "Legal" });
    expect(
      within(legal).getByRole("link", { name: "Privacy Policy" }),
    ).toHaveAttribute("href", "/privacy");
    expect(
      within(legal).getByRole("link", { name: "Terms of Service" }),
    ).toHaveAttribute("href", "/terms");

    // Same row as the copyright note.
    const copyright = screen.getByText(/© 2026 Avalon Ice/);
    expect(copyright.parentElement).toBe(legal.parentElement);
  });
});
