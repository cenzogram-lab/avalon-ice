import type { Inquiry } from "@/lib/types";
import { InquiryStatus, InquiryType } from "@/lib/types";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const toastMock = vi.hoisted(() =>
  Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() }),
);
vi.mock("sonner", () => ({ toast: toastMock }));

import {
  ALERT_ICON,
  ALERT_TITLE,
  useInquiryAlerts,
} from "@/hooks/use-inquiry-alerts";

const shown: { title: string; options: NotificationOptions }[] = [];
class FakeNotification {
  static permission: NotificationPermission = "granted";
  static requestPermission = vi.fn(async () => FakeNotification.permission);
  onclick: (() => void) | null = null;
  constructor(title: string, options: NotificationOptions) {
    shown.push({ title, options });
  }
  close() {}
}

function inquiry(id: number, overrides: Partial<Inquiry> = {}): Inquiry {
  return {
    id: BigInt(id),
    timestamp: 0n,
    inquiryType: InquiryType.Wholesale,
    name: `Customer ${id}`,
    email: `c${id}@example.com`,
    phone: `609-555-010${id}`,
    status: InquiryStatus.New,
    orderDetails: { desiredDeliveryDays: [] },
    ...overrides,
  };
}

beforeEach(() => {
  shown.length = 0;
  toastMock.mockClear();
  FakeNotification.permission = "granted";
  vi.stubGlobal("Notification", FakeNotification);
});
afterEach(() => vi.unstubAllGlobals());

describe("useInquiryAlerts", () => {
  it("treats the first list as the baseline and announces nothing", () => {
    renderHook(() => useInquiryAlerts([inquiry(0), inquiry(1)], true));
    expect(shown).toHaveLength(0);
    expect(toastMock).not.toHaveBeenCalled();
  });

  it("fires a desktop notification with the spec'd title, body and egret icon", () => {
    const { rerender } = renderHook(
      ({ list }) => useInquiryAlerts(list, true),
      { initialProps: { list: [inquiry(0)] } },
    );
    rerender({
      list: [
        inquiry(0),
        inquiry(1, { name: "Shore Bait Co", phone: "609-555-0199" }),
      ],
    });

    expect(shown).toHaveLength(1);
    expect(shown[0].title).toBe(ALERT_TITLE);
    expect(shown[0].title).toBe("New Avalon Ice Quote Request");
    expect(shown[0].options.body).toBe(
      "Shore Bait Co (609-555-0199) requested a Wholesale drop.",
    );
    expect(shown[0].options.icon).toBe(ALERT_ICON);
    expect(ALERT_ICON).toBe("/assets/images/avalon-heron.webp");
    expect(toastMock).toHaveBeenCalledTimes(1);
  });

  it("announces each new inquiry once, oldest first", () => {
    const { rerender } = renderHook(
      ({ list }) => useInquiryAlerts(list, true),
      { initialProps: { list: [inquiry(0)] } },
    );
    rerender({ list: [inquiry(2), inquiry(0), inquiry(1)] });
    rerender({ list: [inquiry(2), inquiry(0), inquiry(1)] });

    expect(shown.map((n) => n.options.body)).toEqual([
      "Customer 1 (609-555-0101) requested a Wholesale drop.",
      "Customer 2 (609-555-0102) requested a Wholesale drop.",
    ]);
  });

  it("only shows the in-app toast when desktop alerts are off", () => {
    const { rerender } = renderHook(
      ({ list }) => useInquiryAlerts(list, false),
      { initialProps: { list: [inquiry(0)] } },
    );
    rerender({ list: [inquiry(0), inquiry(1)] });
    expect(shown).toHaveLength(0);
    expect(toastMock).toHaveBeenCalledTimes(1);
  });

  it("does not raise desktop alerts without browser permission", () => {
    FakeNotification.permission = "denied";
    const { rerender } = renderHook(
      ({ list }) => useInquiryAlerts(list, true),
      { initialProps: { list: [inquiry(0)] } },
    );
    rerender({ list: [inquiry(0), inquiry(1)] });
    expect(shown).toHaveLength(0);
  });
});
