import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actor = vi.hoisted(() => ({
  verifyAdminAccess: vi.fn(),
  login: vi.fn(),
  isAuthenticated: vi.fn(),
  activateAdminAccount: vi.fn(),
}));
vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor, isFetching: false }),
}));

import Admin from "@/pages/Admin";
import { renderWithRouter } from "@/test/renderWithRouter";

beforeEach(() => {
  for (const fn of Object.values(actor)) fn.mockReset();
});

async function signIn(email: string, password: string) {
  const user = userEvent.setup();
  renderWithRouter(<Admin />);
  await user.type(await screen.findByLabelText("Admin email"), email);
  await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: "Sign in" }));
  return user;
}

describe("Admin login", () => {
  it("checks the email against the admin list before trying the password", async () => {
    actor.verifyAdminAccess.mockResolvedValue(false);
    await signIn("stranger@example.com", "whatever123");

    await waitFor(() =>
      expect(actor.verifyAdminAccess).toHaveBeenCalledWith(
        "stranger@example.com",
      ),
    );
    expect(actor.login).not.toHaveBeenCalled();
    expect(
      await screen.findByText(
        "That email isn't an authorized Avalon Ice admin.",
      ),
    ).toBeInTheDocument();
  });

  it("signs in any authorized admin email with its password", async () => {
    actor.verifyAdminAccess.mockResolvedValue(true);
    actor.login.mockResolvedValue("tok-123");
    actor.isAuthenticated.mockResolvedValue(false);
    await signIn("dispatcher@avalonice.co", "Dispatch99");

    await waitFor(() =>
      expect(actor.login).toHaveBeenCalledWith(
        "dispatcher@avalonice.co",
        "Dispatch99",
      ),
    );
    await waitFor(() =>
      expect(actor.isAuthenticated).toHaveBeenCalledWith("tok-123"),
    );
  });

  it("offers invite activation alongside login", async () => {
    const user = userEvent.setup();
    actor.activateAdminAccount.mockResolvedValue({ __kind__: "ok", ok: null });
    renderWithRouter(<Admin />);

    await user.click(
      await screen.findByRole("tab", { name: "Activate invite" }),
    );
    await user.type(screen.getByLabelText("Your email"), "ops@avalonice.co");
    await user.type(screen.getByLabelText("Setup code"), "abcde-fghjk");
    await user.type(screen.getByLabelText("Choose a password"), "OpsPass123");
    await user.type(screen.getByLabelText("Confirm password"), "OpsPass123");
    await user.click(screen.getByRole("button", { name: "Activate account" }));

    await waitFor(() =>
      expect(actor.activateAdminAccount).toHaveBeenCalledWith(
        "ops@avalonice.co",
        "abcde-fghjk",
        "OpsPass123",
      ),
    );
  });
});
