import { createActor } from "@/backend";
import type {
  AdminEmailInfo,
  AdminInviteResult,
  AdminSessionInfo,
  NotificationStatus,
} from "@/backend";
import type { Inquiry, InquiryFormValues, SubmissionResult } from "@/lib/types";
import { InquiryStatus, InquiryType } from "@/lib/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Build a backend `Inquiry` record from a typed form payload.
 * The backend assigns the real id/timestamp on submit; we seed id 0 and
 * the current time so the shape is complete for the wire call.
 */
// Every typed value is trimmed; an optional field left blank is sent as
// absent rather than as an empty string.
const clean = (value: string) => value.trim();
const optional = (value: string) => value.trim() || undefined;

export function buildInquiry(form: InquiryFormValues): Inquiry {
  const timestamp = BigInt(Date.now());
  const base = {
    id: 0n,
    status: InquiryStatus.New,
    timestamp,
  };

  if (form.type === InquiryType.General) {
    const v = form.values;
    return {
      ...base,
      inquiryType: InquiryType.General,
      name: clean(v.name),
      email: clean(v.email),
      phone: clean(v.phone),
      orderDetails: { message: clean(v.message), desiredDeliveryDays: [] },
    };
  }

  if (form.type === InquiryType.Wholesale) {
    const v = form.values;
    const address = [v.street, v.city, v.zip]
      .map(clean)
      .filter(Boolean)
      .join(", ");
    return {
      ...base,
      inquiryType: InquiryType.Wholesale,
      name: clean(v.contactPerson),
      businessName: optional(v.businessName),
      email: clean(v.email),
      phone: clean(v.phone),
      address: optional(address),
      orderDetails: {
        businessName: optional(v.businessName),
        estimatedWeeklyUsage: optional(v.estimatedWeeklyUsage),
        deliveryAddress: optional(address),
        desiredDeliveryDays: v.desiredDeliveryDays,
        deliveryFrequency: optional(v.deliveryFrequency),
      },
    };
  }

  const v = form.values;
  return {
    ...base,
    inquiryType: InquiryType.Event,
    name: clean(v.contactPerson),
    businessName: optional(v.hostName),
    email: clean(v.email),
    phone: clean(v.phone),
    address: optional(v.venueAddress),
    orderDetails: {
      businessName: optional(v.hostName),
      eventDate: optional(v.eventDate),
      deliveryTimeWindow: optional(v.deliveryTimeWindow),
      venueName: optional(v.venueName),
      deliveryAddress: optional(v.venueAddress),
      totalBags: optional(v.totalBags),
      iceType: optional(v.iceType),
      onSiteFreezer: v.onSiteFreezer,
      desiredDeliveryDays: [],
    },
  };
}

const BACKEND_LOADING = "Backend is still loading";

/** Submit an inquiry and return a human-friendly reference id. */
export function useSubmitInquiry() {
  const { actor, isFetching } = useActor(createActor);
  return useMutation({
    mutationFn: async (form: InquiryFormValues): Promise<SubmissionResult> => {
      if (!actor || isFetching) throw new Error(BACKEND_LOADING);
      const inquiry = buildInquiry(form);
      const id = await actor.submitInquiry(inquiry);
      const stored = { ...inquiry, id };
      // The canister emails every active admin itself, after the record is
      // stored, so there is nothing more to do here.
      return { referenceId: `AVL-${id.toString()}`, inquiry: stored };
    },
    // Only a submit that never left the browser (the backend connection
    // was still starting) is retried automatically. Once the call is sent,
    // a lost reply doesn't mean nothing was saved, and a blind retry would
    // file the inquiry (and email the team) twice; the visitor gets the
    // error with call/email fallbacks and decides instead.
    retry: (failures, error) =>
      failures < 5 &&
      error instanceof Error &&
      error.message === BACKEND_LOADING,
    retryDelay: 1000,
  });
}

/**
 * How often the dashboard checks for new inquiries. The check is a single
 * number (the inquiry count), so it stays cheap however many inquiries exist;
 * the full list is only re-read when that number changes.
 */
export const INQUIRY_POLL_MS = 15_000;

/** Pause before re-checking a session that came back invalid. */
const SESSION_RECHECK_MS = 1_500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type BackendResult<T> =
  | { __kind__: "ok"; ok: T }
  | { __kind__: "err"; err: string };

/** Unwrap a canister `Result`, turning `#err` into a thrown Error. */
export function unwrap<T>(result: BackendResult<T>): T {
  if (result.__kind__ === "err") throw new Error(result.err);
  return result.ok;
}

/** Whether the primary account still needs its first password. */
export function useNeedsInitialSetup() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["needsInitialSetup"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.needsInitialSetup();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Set the primary admin password on first deploy. */
export function useSetupPassword() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      return actor.setupPassword(password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["needsInitialSetup"] });
    },
  });
}

/** Whether an email belongs to an admin account (activated or pending). */
export function useVerifyAdminAccess() {
  const { actor, isFetching } = useActor(createActor);
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      return actor.verifyAdminAccess(email);
    },
  });
}

/** Authenticate an admin email + password, returning a session token. */
export function useLogin() {
  const { actor, isFetching } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      return actor.login(email, password);
    },
  });
}

/** Activate an added admin account with its one-time setup code. */
export function useActivateAdminAccount() {
  const { actor, isFetching } = useActor(createActor);
  return useMutation({
    mutationFn: async ({
      email,
      setupCode,
      password,
    }: {
      email: string;
      setupCode: string;
      password: string;
    }) => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      unwrap(await actor.activateAdminAccount(email, setupCode, password));
    },
  });
}

/** Invalidate an admin session token. */
export function useLogout() {
  const { actor, isFetching } = useActor(createActor);
  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      return actor.logout(token);
    },
  });
}

/**
 * Check whether a session token is still valid. Re-checked every minute so
 * an admin who is removed (or whose session expires) is signed out.
 *
 * A "no" is confirmed once before it is believed: a read can reach a
 * replica that has not yet seen a sign-in that just completed.
 */
export function useIsAuthenticated(token: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["auth", token],
    queryFn: async () => {
      if (!actor || !token) return false;
      if (await actor.isAuthenticated(token)) return true;
      await wait(SESSION_RECHECK_MS);
      return actor.isAuthenticated(token);
    },
    enabled: !!actor && !isFetching && !!token,
    refetchInterval: 60_000,
  });
}

/** The signed-in admin's email and role. */
export function useAdminSession(token: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["adminSession", token],
    queryFn: async (): Promise<AdminSessionInfo> => {
      if (!actor) throw new Error("Backend is still loading");
      const session = await actor.getAdminSession(token);
      // Thrown so react-query retries (see useIsAuthenticated on replica lag).
      if (!session) throw new Error("Session not found");
      return session;
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * All inquiries for the admin portal, kept current while the dashboard is
 * open (a background tab included): the inquiry count is polled, and the
 * list is re-read only when the count moves past what is loaded.
 */
export function useInquiries(token: string) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const enabled = !!actor && !isFetching;

  const list = useQuery({
    queryKey: ["inquiries", token],
    queryFn: async () => {
      if (!actor) return [];
      // Read page by page: the backend cuts pages by size, so however long
      // the history grows no single response can exceed the IC limit.
      const rows: Inquiry[] = [];
      let start: bigint | undefined = 0n;
      while (start !== undefined) {
        const page = await actor.listInquiriesPage(token, start);
        rows.push(...page.inquiries);
        start = page.next;
      }
      return rows;
    },
    enabled,
  });

  const count = useQuery({
    queryKey: ["inquiryCount", token],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getInquiryCount(token);
    },
    enabled,
    refetchInterval: INQUIRY_POLL_MS,
    refetchIntervalInBackground: true,
  });

  const loaded = list.data?.length;
  const latest = count.data;
  useEffect(() => {
    if (loaded === undefined || latest === undefined) return;
    if (latest !== BigInt(loaded)) {
      queryClient.invalidateQueries({ queryKey: ["inquiries", token] });
    }
  }, [loaded, latest, queryClient, token]);

  return list;
}

/** Update an inquiry's status and optional notes. */
export function useUpdateInquiryStatus(token: string) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      notes,
    }: {
      id: bigint;
      status: InquiryStatus;
      notes?: string;
    }) => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      return actor.updateInquiry(token, id, status, notes ?? null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

/** Every admin account, primary first. */
export function useAdminEmails(token: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["adminEmails", token],
    queryFn: async (): Promise<AdminEmailInfo[]> => {
      if (!actor) return [];
      return unwrap(await actor.getAdminEmails(token));
    },
    enabled: !!actor && !isFetching,
  });
}

/** Add an admin; resolves with their setup code and whether it was emailed. */
export function useAddAdminEmail(token: string) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string): Promise<AdminInviteResult> => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      return unwrap(await actor.addAdminEmail(token, email));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEmails"] });
      queryClient.invalidateQueries({ queryKey: ["notificationStatus"] });
    },
  });
}

/** Remove an admin and sign them out everywhere. */
export function useRemoveAdminEmail(token: string) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      unwrap(await actor.removeAdminEmail(token, email));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEmails"] });
      queryClient.invalidateQueries({ queryKey: ["notificationStatus"] });
    },
  });
}

/** Who gets notification emails, and how the last send went. */
export function useNotificationStatus(token: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["notificationStatus", token],
    queryFn: async (): Promise<NotificationStatus | null> => {
      if (!actor) return null;
      return unwrap(await actor.getNotificationStatus(token));
    },
    enabled: !!actor && !isFetching,
    refetchInterval: INQUIRY_POLL_MS,
  });
}

/** Email every active admin a test message. */
export function useSendTestNotification(token: string) {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      unwrap(await actor.sendTestNotification(token));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationStatus"] });
    },
  });
}
