import { InquiryStatus, InquiryType } from "@/lib/types";
import type { Inquiry } from "@/lib/types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actor = vi.hoisted(() => ({
  listInquiries: vi.fn(),
  getInquiryCount: vi.fn(),
  isAuthenticated: vi.fn(),
}));
vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor, isFetching: false }),
}));

import { useInquiries, useIsAuthenticated } from "@/lib/api";

const row = (id: number): Inquiry => ({
  id: BigInt(id),
  timestamp: 0n,
  inquiryType: InquiryType.General,
  name: `C${id}`,
  email: "c@x.com",
  phone: "609",
  status: InquiryStatus.New,
  orderDetails: { desiredDeliveryDays: [] },
});

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, wrapper };
}

beforeEach(() => {
  for (const fn of Object.values(actor)) fn.mockReset();
});

describe("useInquiries", () => {
  it("polls the count and re-reads the list only when it changes", async () => {
    const { client, wrapper } = setup();
    let rows = [row(0)];
    let count = 1n;
    actor.listInquiries.mockImplementation(async () => rows);
    actor.getInquiryCount.mockImplementation(async () => count);

    const { result } = renderHook(() => useInquiries("tok"), { wrapper });
    await waitFor(() => expect(result.current.data).toHaveLength(1));
    expect(actor.listInquiries).toHaveBeenCalledTimes(1);

    // A poll with no change does not re-read the list.
    await client.refetchQueries({ queryKey: ["inquiryCount"] });
    expect(actor.listInquiries).toHaveBeenCalledTimes(1);

    // A new inquiry arrives: the count moves, so the list is re-read.
    rows = [row(0), row(1)];
    count = 2n;
    await client.refetchQueries({ queryKey: ["inquiryCount"] });
    await waitFor(() => expect(result.current.data).toHaveLength(2));
    expect(actor.listInquiries).toHaveBeenCalledTimes(2);
    expect(actor.getInquiryCount).toHaveBeenCalledWith("tok");
  });
});

describe("useIsAuthenticated", () => {
  it("confirms a negative answer once before believing it", async () => {
    const { wrapper } = setup();
    actor.isAuthenticated
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);
    const { result } = renderHook(() => useIsAuthenticated("tok"), { wrapper });
    await waitFor(() => expect(result.current.data).toBe(true), {
      timeout: 4000,
    });
    expect(actor.isAuthenticated).toHaveBeenCalledTimes(2);
  });
});
