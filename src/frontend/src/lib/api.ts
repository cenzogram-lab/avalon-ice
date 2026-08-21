import { createActor } from "@/backend";
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
      return {
        referenceId: `AVL-${id.toString()}`,
        inquiry: { ...inquiry, id },
      };
    },
  });
}

/** Set the master admin password on first deploy. */
export function useSetupPassword() {
  const { actor, isFetching } = useActor(createActor);
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor || isFetching) throw new Error("Backend is still loading");
      return actor.setupPassword(password);
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

/** Check whether a session token is still valid. */
export function useIsAuthenticated(token: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["auth", token],
    queryFn: async () => {
      if (!actor || !token) return false;
      return actor.isAuthenticated(token);
    },
    enabled: !!actor && !isFetching && !!token,
  });
}

/** Fetch all inquiries for the admin portal. */
export function useInquiries() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.exportInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Update an inquiry's status and optional notes. */
export function useUpdateInquiryStatus() {
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
      return actor.updateInquiryStatus(id, status, notes ?? null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}
