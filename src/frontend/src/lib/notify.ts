import type { Inquiry } from "@/lib/types";
import { INQUIRY_TYPE_LABELS } from "@/lib/types";

/** Every inquiry notification is addressed here. */
export const NOTIFY_EMAIL = "Sales@AvalonIce.com";

/**
 * Relay endpoint that forwards a submitted inquiry to NOTIFY_EMAIL.
 *
 * Point this at any webhook that sends mail — a Zapier/Make catch hook, a
 * Formspree/FormSubmit endpoint, or your own function. Set it at build time
 * with VITE_INQUIRY_WEBHOOK, or paste the URL into the fallback below.
 * While it is empty, notifications are simply skipped: inquiries are still
 * stored in the canister and visible in the admin portal, which remains the
 * source of truth either way.
 */
const WEBHOOK_URL: string =
  (import.meta as { env?: Record<string, string | undefined> }).env
    ?.VITE_INQUIRY_WEBHOOK ?? "";

export const notificationsConfigured = WEBHOOK_URL.length > 0;

function summarize(inquiry: Inquiry, referenceId: string) {
  const details = Object.entries(inquiry.orderDetails)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => {
      const pretty = k.replace(/([A-Z])/g, " $1").toLowerCase();
      const value = Array.isArray(v) ? v.join(", ") : String(v);
      return `${pretty}: ${value}`;
    })
    .filter((line) => !line.endsWith(": "));

  return [
    `New ${INQUIRY_TYPE_LABELS[inquiry.inquiryType]} inquiry — ${referenceId}`,
    "",
    `Name: ${inquiry.name}`,
    inquiry.businessName ? `Business: ${inquiry.businessName}` : "",
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone}`,
    inquiry.address ? `Address: ${inquiry.address}` : "",
    "",
    ...details,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Fire-and-forget notification of a stored inquiry.
 *
 * Never throws and never blocks the submission: the canister write has
 * already succeeded by the time this runs, so a failed or unconfigured
 * relay must not turn a captured lead into an error for the visitor.
 */
export async function notifyInquiry(
  inquiry: Inquiry,
  referenceId: string,
): Promise<void> {
  if (!notificationsConfigured) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: NOTIFY_EMAIL,
        subject: `Avalon Ice — ${INQUIRY_TYPE_LABELS[inquiry.inquiryType]} inquiry ${referenceId}`,
        referenceId,
        inquiryType: INQUIRY_TYPE_LABELS[inquiry.inquiryType],
        name: inquiry.name,
        businessName: inquiry.businessName ?? "",
        email: inquiry.email,
        phone: inquiry.phone,
        address: inquiry.address ?? "",
        orderDetails: inquiry.orderDetails,
        message: summarize(inquiry, referenceId),
      }),
      signal: controller.signal,
      keepalive: true,
    });
  } catch (err) {
    // Logged only — the inquiry is already persisted in the canister.
    console.warn("Avalon Ice: inquiry notification relay failed", err);
  } finally {
    clearTimeout(timeout);
  }
}
