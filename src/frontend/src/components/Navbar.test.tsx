import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("keeps call and quote one tap away in the bar", async () => {
    renderWithRouter(<Navbar />);
    expect(
      await screen.findByRole("link", { name: /Call Avalon Ice/ }),
    ).toHaveAttribute("href", "tel:8563089986");
    expect(screen.getByRole("link", { name: "Get a Quote" })).toHaveAttribute(
      "href",
      "/#order-form",
    );
  });

  it("opens and closes the More panel", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Navbar />);
    const more = await screen.findByRole("button", { name: "More" });
    expect(more).toHaveAttribute("aria-expanded", "false");

    await user.click(more);
    expect(more).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(
      more.getAttribute("aria-controls") ?? "",
    );
    expect(panel).not.toBeNull();
    const items = within(panel as HTMLElement).getAllByRole("link");
    expect(items.map((a) => a.getAttribute("href"))).toEqual([
      "/#order-form",
      "tel:8563089986",
      "/shop",
    ]);

    await user.keyboard("{Escape}");
    expect(more).toHaveAttribute("aria-expanded", "false");
    expect(more).toHaveFocus();

    await user.click(more);
    await user.click(document.body);
    expect(more).toHaveAttribute("aria-expanded", "false");
  });
});
