import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Navbar from "@/components/Navbar";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("Navbar", () => {
  it("links every primary page from a labelled navigation landmark", async () => {
    renderWithRouter(<Navbar />);
    const nav = await screen.findByRole("navigation", { name: "Primary" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["Services", "/#services"],
      ["Network", "/#network"],
      ["Shop & Pricing", "/shop"],
      ["About Us", "/about"],
      ["Contact Us", "/contact"],
    ]);
    for (const a of links) {
      expect((a.textContent ?? "").length).toBeLessThanOrEqual(20);
    }
  });

  it("gives the logo link an accessible name", async () => {
    renderWithRouter(<Navbar />);
    expect(
      await screen.findByRole("link", { name: "Avalon Ice home" }),
    ).toHaveAttribute("href", "/#top");
  });
});
