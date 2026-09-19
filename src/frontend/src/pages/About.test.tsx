import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// ContactSection (rendered by About) calls useSubmitInquiry, which reaches
// for the backend actor. A null actor keeps the forms inert with no network.
vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: null, isFetching: false }),
}));

import About from "@/pages/About";
import { renderWithRouter } from "@/test/renderWithRouter";

describe("About", () => {
  it("renders the rewritten origin, local-advantage and mascot chapters", async () => {
    renderWithRouter(<About />);

    expect(
      await screen.findByText("Born in Cape May County."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Built for the Shore, by people who know it."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Why the Egret Carries the Bag"),
    ).toBeInTheDocument();
  });

  it("renders no user-visible 'Woodbine' or 'heron' reference", async () => {
    const { container } = renderWithRouter(<About />);

    // Wait for the page to mount before scanning its text.
    await screen.findByText("Born in Cape May County.");
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/Woodbine/i);
    expect(text).not.toMatch(/heron/i);
  });
});
