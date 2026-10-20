import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: null, isFetching: false }),
}));

import Contact from "@/pages/Contact";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("Contact page", () => {
  it("offers phone, email, service area and the inquiry forms", async () => {
    const { container } = renderWithRouter(<Contact />);
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(
      "Contact Avalon Ice",
    );
    // The number also appears in the shared contact band; check the hero card.
    expect(
      container.querySelector('[data-ocid="contact.phone"]'),
    ).toHaveAttribute("href", "tel:8563089986");
    expect(
      container.querySelector('a[href="mailto:Sales@AvalonIce.co"]'),
    ).not.toBeNull();
    expect(container.querySelector("#order-form")).not.toBeNull();
    expect(container.querySelector("#contact")).not.toBeNull();
  });
});
