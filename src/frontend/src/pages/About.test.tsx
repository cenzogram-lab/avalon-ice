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
  it("names the heritage chapter's headquarters as Ocean View", async () => {
    renderWithRouter(<About />);

    expect(await screen.findByText(/our Ocean View HQ/)).toBeInTheDocument();
  });

  it("renders no user-visible 'Woodbine' reference", async () => {
    const { container } = renderWithRouter(<About />);

    // Wait for the page to mount before scanning its text.
    await screen.findByText(/our Ocean View HQ/);
    expect(container.textContent ?? "").not.toMatch(/Woodbine/i);
  });
});
