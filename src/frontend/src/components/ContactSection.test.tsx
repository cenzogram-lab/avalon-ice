import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actor = vi.hoisted(() => ({ submitInquiry: vi.fn() }));
vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor, isFetching: false }),
}));

import ContactSection from "@/components/ContactSection";
import { renderWithRouter } from "@/test/renderWithRouter";

beforeEach(() => {
  actor.submitInquiry.mockReset();
});

describe("Inquiry forms", () => {
  it("labels every field so it can be found and focused by name", async () => {
    renderWithRouter(<ContactSection />);
    for (const label of [
      "Full Name",
      "Phone Number",
      "Email Address",
      "Message",
    ]) {
      expect(await screen.findByLabelText(label)).toBeInTheDocument();
    }
  });

  it("flags the first problem, describes it, and moves the cursor there", async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContactSection />);
    await user.type(await screen.findByLabelText("Full Name"), "Jane");
    await user.click(screen.getByRole("button", { name: "Submit Inquiry" }));

    const phone = screen.getByLabelText("Phone Number");
    await waitFor(() => expect(phone).toHaveFocus());
    expect(phone).toHaveAttribute("aria-invalid", "true");
    expect(phone).toHaveAccessibleDescription("Enter a valid phone number.");
    expect(screen.getByLabelText("Full Name")).not.toHaveAttribute(
      "aria-invalid",
    );
    expect(actor.submitInquiry).not.toHaveBeenCalled();
  });

  it("refuses an event date in the past", async () => {
    const user = userEvent.setup();
    renderWithRouter(<ContactSection />);
    await user.click(await screen.findByRole("tab", { name: "Event" }));
    const date = screen.getByLabelText("Event Date");
    expect(date).toHaveAttribute("min");
    await user.type(date, "2020-07-04");
    await user.click(screen.getByRole("button", { name: "Submit Inquiry" }));
    expect(
      await screen.findByText("Choose today or a later date."),
    ).toBeInTheDocument();
    expect(actor.submitInquiry).not.toHaveBeenCalled();
  });

  it("caps fields at what the backend accepts", async () => {
    renderWithRouter(<ContactSection />);
    expect(await screen.findByLabelText("Full Name")).toHaveAttribute(
      "maxLength",
      "120",
    );
    expect(screen.getByLabelText("Email Address")).toHaveAttribute(
      "maxLength",
      "254",
    );
  });
});
