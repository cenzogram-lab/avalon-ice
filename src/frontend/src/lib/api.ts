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

/**
 * Build a backend `Inquiry` record from a typed form payload.
 * The backend assigns the real id/timestamp on submit; we seed id 0 and
 * the current time so the shape is complete for the wire call.
 */
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
      name: v.name,
      email: v.email,
      phone: v.phone,
      orderDetails: { message: v.message, desiredDeliveryDays: [] },
    };
  }

  if (form.type === InquiryType.Wholesale) {
    const v = form.values;
    const address = [v.street, v.city, v.zip].filter(Boolean).join(", ");
    return {
      ...base,
      inquiryType: InquiryType.Wholesale,
      name: v.contactPerson,
      businessName: v.businessName,
      email: v.email,
      phone: v.phone,
      address,
      orderDetails: {
        businessName: v.businessName,
        estimatedWeeklyUsage: v.estimatedWeeklyUsage,
        deliveryAddress: address,
        desiredDeliveryDays: v.desiredDeliveryDays,
        deliveryFrequency: v.deliveryFrequency,
      },
    };
  }

  const v = form.values;
  return {
    ...base,
    inquiryType: InquiryType.Event,
    name: v.contactPerson,
    businessName: v.hostName,
    email: v.email,
    phone: v.phone,
    address: v.venueAddress,
    orderDetails: {
      businessName: v.hostName,
      eventDate: v.eventDate,
      deliveryTimeWindow: v.deliveryTimeWindow,
      venueName: v.venueName,
      deliveryAddress: v.venueAddress,
      totalBags: v.totalBags,
      iceType: v.iceType,
      onSiteFreezer: v.onSiteFreezer,
      desiredDeliveryDays: [],
    },
  };
}

/** Submit an inquiry and return a human-friendly reference id. */
export function useSubmitInquiry() {
  const { actor, isFetching } = useActor(createActor);
  return useMutation({
    mutationFn: async (form: InquiryFormValues): Promise<SubmissionResult> => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      const inquiry = buildInquiry(form);
      const id = await actor.submitInquiry(inquiry);
      const stored = { ...inquiry, id };
      // The canister emails every active admin itself, after the record is
      // stored, so there is nothing more to do here.
      return { referenceId: `AVL-${id.toString()}`, inquiry: stored };
    },
    // One retry absorbs a transient blip without the visitor re-typing.
    retry: 1,
    retryDelay: 1200,
  });
}

/** How often the dashboard re-reads inquiries to spot new ones. */
export const INQUIRY_POLL_MS = 30_000;

type BackendResult<T> =
  | { __kind__: "ok"; ok: T }
  | { __kind__: "err"; err: string };

/** Unwrap a canister `Result`, turning `#err` into a thrown Error. */
export function unwrap<T>(result: BackendResult<T>): T {
  if (result.__kind__ === "err") throw new Error(result.err);
  return result.ok;
}

/** Set the primary admin password on first deploy. */
export function useSetupPassword() {
  const { actor, isFetching } = useActor(createActor);
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      return actor.setupPassword(password);
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
 */
export function useIsAuthenticated(token: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["auth", token],
    queryFn: async () => {
      if (!actor || !token) return false;
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
    queryFn: async (): Promise<AdminSessionInfo | null> => {
      if (!actor) return null;
      return actor.getAdminSession(token);
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * All inquiries for the admin portal. Polls so new submissions appear (and
 * trigger browser alerts) while the dashboard is open, including in a
 * background tab.
 */
export function useInquiries(token: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["inquiries", token],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listInquiries(token);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: INQUIRY_POLL_MS,
    refetchIntervalInBackground: true,
  });
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
