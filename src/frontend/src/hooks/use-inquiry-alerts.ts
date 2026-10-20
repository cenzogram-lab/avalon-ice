import type { Inquiry } from "@/lib/types";
import { INQUIRY_TYPE_LABELS } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const ALERT_TITLE = "New Avalon Ice Quote Request";
export const ALERT_ICON = "/assets/images/avalon-heron.webp";
const STORAGE_KEY = "avalon-ice:browser-alerts";

export type AlertPermission = NotificationPermission | "unsupported";

export function alertBody(inquiry: Inquiry): string {
  return `${inquiry.name} (${inquiry.phone}) requested a ${INQUIRY_TYPE_LABELS[inquiry.inquiryType]} drop.`;
}

function notificationsSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

function readPreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function writePreference(on: boolean) {
  try {
    if (on) window.localStorage.setItem(STORAGE_KEY, "on");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode or blocked storage: the toggle just won't persist.
  }
}

/** Show one desktop notification; returns false if the browser refused. */
function showDesktopAlert(title: string, body: string, tag: string): boolean {
  try {
    const n = new Notification(title, { body, icon: ALERT_ICON, tag });
    n.onclick = () => {
      window.focus();
      n.close();
    };
    return true;
  } catch {
    // Some mobile browsers only allow notifications from a service worker.
    return false;
  }
}

/**
 * The "Enable Browser Push Notifications" preference: remembered per
 * browser, and only on when the browser has granted permission.
 */
export function useBrowserAlertsSetting() {
  const [permission, setPermission] = useState<AlertPermission>(() =>
    notificationsSupported() ? Notification.permission : "unsupported",
  );
  const [preference, setPreference] = useState<boolean>(readPreference);
  const enabled = preference && permission === "granted";

  const setEnabled = useCallback(async (next: boolean) => {
    if (!next) {
      writePreference(false);
      setPreference(false);
      return;
    }
    if (!notificationsSupported()) {
      toast.error("This browser doesn't support desktop notifications.");
      return;
    }
    let result = Notification.permission;
    if (result === "default") result = await Notification.requestPermission();
    setPermission(result);
    if (result !== "granted") {
      toast.error(
        "Notifications are blocked for this site. Allow them in your browser's site settings, then try again.",
      );
      return;
    }
    writePreference(true);
    setPreference(true);
    showDesktopAlert(
      "Browser alerts are on",
      "You'll be notified here when a new quote request arrives.",
      "avalon-alerts-enabled",
    );
  }, []);

  return { enabled, permission, setEnabled };
}

/**
 * Announce inquiries that arrive while the dashboard is open.
 *
 * The first list seen is the baseline (nothing is announced for existing
 * inquiries); after that, any inquiry with a higher id is new. Ids are
 * assigned sequentially by the canister. Each new inquiry gets an in-app
 * toast and, when enabled, a desktop notification.
 */
export function useInquiryAlerts(
  inquiries: Inquiry[] | undefined,
  desktopEnabled: boolean,
) {
  const highestSeen = useRef<bigint | null>(null);

  useEffect(() => {
    if (!inquiries) return;
    const highest = inquiries.reduce<bigint>(
      (max, inquiry) => (inquiry.id > max ? inquiry.id : max),
      -1n,
    );
    const baseline = highestSeen.current;
    highestSeen.current =
      baseline === null || highest > baseline ? highest : baseline;
    if (baseline === null) return;

    const fresh = inquiries
      .filter((inquiry) => inquiry.id > baseline)
      .sort((a, b) => (a.id < b.id ? -1 : 1));
    for (const inquiry of fresh) {
      const body = alertBody(inquiry);
      toast(ALERT_TITLE, { description: body });
      if (desktopEnabled && Notification.permission === "granted") {
        showDesktopAlert(ALERT_TITLE, body, `avalon-inquiry-${inquiry.id}`);
      }
    }
  }, [inquiries, desktopEnabled]);
}
