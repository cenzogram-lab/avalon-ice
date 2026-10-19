import { AdminStatus } from "@/backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actor = vi.hoisted(() => ({
  getAdminEmails: vi.fn(),
  getNotificationStatus: vi.fn(),
  addAdminEmail: vi.fn(),
  removeAdminEmail: vi.fn(),
  sendTestNotification: vi.fn(),
}));
vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor, isFetching: false }),
}));

import AdminRecipientsCard, {
  RECIPIENTS_HELPER,
} from "@/components/admin/AdminRecipientsCard";

const TOKEN = "session-token";

function renderCard() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <AdminRecipientsCard token={TOKEN} currentEmail="Sales@AvalonIce.co" />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  for (const fn of Object.values(actor)) fn.mockReset();
  actor.getAdminEmails.mockResolvedValue({
    __kind__: "ok",
    ok: [
      {
        email: "Sales@AvalonIce.co",
        isPrimary: true,
        status: AdminStatus.active,
        addedBy: "Avalon Ice",
        addedAt: 0n,
      },
      {
        email: "dispatcher@avalonice.co",
        isPrimary: false,
        status: AdminStatus.pending,
        addedBy: "Sales@AvalonIce.co",
        addedAt: 1n,
      },
    ],
  });
  actor.getNotificationStatus.mockResolvedValue({
    __kind__: "ok",
    ok: { recipients: ["Sales@AvalonIce.co"] },
  });
});

describe("AdminRecipientsCard", () => {
  it("lists admins as pills with roles, and shows the helper text", async () => {
    renderCard();
    expect(
      screen.getByText("Admin & Notification Recipients"),
    ).toBeInTheDocument();
    expect(screen.getByText(RECIPIENTS_HELPER)).toBeInTheDocument();

    const list = await screen.findByRole("list", { name: "Authorized admins" });
    const pills = within(list).getAllByRole("listitem");
    expect(pills).toHaveLength(2);
    expect(within(pills[0]).getByText("Primary")).toBeInTheDocument();
    expect(within(pills[0]).getByText("You")).toBeInTheDocument();
    expect(within(pills[1]).getByText("Pending")).toBeInTheDocument();
    expect(actor.getAdminEmails).toHaveBeenCalledWith(TOKEN);
  });

  it("never offers to remove the primary account", async () => {
    renderCard();
    await screen.findByText("dispatcher@avalonice.co");
    expect(
      screen.queryByRole("button", { name: "Remove Sales@AvalonIce.co" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove dispatcher@avalonice.co" }),
    ).toBeInTheDocument();
  });

  it("asks for confirmation before removing an admin", async () => {
    const user = userEvent.setup();
    actor.removeAdminEmail.mockResolvedValue({ __kind__: "ok", ok: null });
    renderCard();

    await user.click(
      await screen.findByRole("button", {
        name: "Remove dispatcher@avalonice.co",
      }),
    );
    const dialog = await screen.findByRole("alertdialog");
    expect(
      within(dialog).getByText("Remove dispatcher@avalonice.co?"),
    ).toBeInTheDocument();
    expect(actor.removeAdminEmail).not.toHaveBeenCalled();

    await user.click(
      within(dialog).getByRole("button", { name: "Remove admin" }),
    );
    await waitFor(() =>
      expect(actor.removeAdminEmail).toHaveBeenCalledWith(
        TOKEN,
        "dispatcher@avalonice.co",
      ),
    );
  });

  it("adds an admin and shows the setup code when the email could not be sent", async () => {
    const user = userEvent.setup();
    actor.addAdminEmail.mockResolvedValue({
      __kind__: "ok",
      ok: {
        email: "ops@avalonice.co",
        setupCode: "ABCDE-FGHJK",
        expiresAt: 1_900_000_000_000_000_000n,
        emailed: false,
        emailError: "The integrations gateway is not configured",
      },
    });
    renderCard();

    await user.type(
      screen.getByPlaceholderText(
        "Add recipient email (e.g., dispatcher@avalonice.co)",
      ),
      "Ops@AvalonIce.co",
    );
    await user.click(screen.getByRole("button", { name: "Add Admin" }));

    await waitFor(() =>
      expect(actor.addAdminEmail).toHaveBeenCalledWith(
        TOKEN,
        "Ops@AvalonIce.co",
      ),
    );
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("ABCDE-FGHJK")).toBeInTheDocument();
    expect(
      within(dialog).getByText(/share this one-time setup code/),
    ).toBeInTheDocument();
  });

  it("re-sends a setup code to a pending admin", async () => {
    const user = userEvent.setup();
    actor.addAdminEmail.mockResolvedValue({
      __kind__: "ok",
      ok: {
        email: "dispatcher@avalonice.co",
        setupCode: "NEWCO-DE234",
        expiresAt: 1_900_000_000_000_000_000n,
        emailed: true,
      },
    });
    renderCard();

    expect(
      screen.queryByRole("button", {
        name: "Send a new setup code to Sales@AvalonIce.co",
      }),
    ).not.toBeInTheDocument();
    await user.click(
      await screen.findByRole("button", {
        name: "Send a new setup code to dispatcher@avalonice.co",
      }),
    );
    await waitFor(() =>
      expect(actor.addAdminEmail).toHaveBeenCalledWith(
        TOKEN,
        "dispatcher@avalonice.co",
      ),
    );
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("NEWCO-DE234")).toBeInTheDocument();
    expect(within(dialog).getByText(/We emailed them/)).toBeInTheDocument();
  });

  it("rejects an invalid address without calling the backend", async () => {
    const user = userEvent.setup();
    renderCard();
    await user.type(
      screen.getByPlaceholderText(
        "Add recipient email (e.g., dispatcher@avalonice.co)",
      ),
      "not-an-email",
    );
    await user.click(screen.getByRole("button", { name: "Add Admin" }));
    expect(actor.addAdminEmail).not.toHaveBeenCalled();
  });

  it("surfaces the last email delivery error", async () => {
    actor.getNotificationStatus.mockResolvedValue({
      __kind__: "ok",
      ok: {
        recipients: ["Sales@AvalonIce.co"],
        lastAttemptAt: 1_800_000_000_000_000_000n,
        lastError: "Gateway rejected the sender domain",
      },
    });
    renderCard();
    expect(
      await screen.findByText(/Gateway rejected the sender domain/),
    ).toBeInTheDocument();
  });
});
