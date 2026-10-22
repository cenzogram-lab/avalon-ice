import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { AlertPermission } from "@/hooks/use-inquiry-alerts";
import { BellRing } from "lucide-react";

export default function BrowserAlertsCard({
  enabled,
  permission,
  onChange,
}: {
  enabled: boolean;
  permission: AlertPermission;
  onChange: (next: boolean) => void;
}) {
  const note =
    permission === "unsupported"
      ? "This browser doesn't support desktop notifications."
      : permission === "denied"
        ? "Notifications are blocked for this site in your browser settings."
        : enabled
          ? "On for this browser. Keep this dashboard open (a background tab is fine)."
          : "Off. You'll still see an in-app alert while this page is open.";

  return (
    <Card data-ocid="admin.browser_alerts_card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg text-primary">
          <BellRing className="size-5 shrink-0" />
          Browser Alerts
        </CardTitle>
        <CardDescription>
          Get a desktop alert the moment a new quote request arrives while
          you're signed in here.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <Label
            htmlFor="browser-alerts"
            className="cursor-pointer text-sm font-semibold"
          >
            Enable Browser Push Notifications
          </Label>
          <Switch
            id="browser-alerts"
            checked={enabled}
            disabled={permission === "unsupported"}
            onCheckedChange={onChange}
            // A 44px touch area around the small switch.
            className="relative after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-['']"
            data-ocid="admin.browser_alerts_toggle"
          />
        </div>
        <p className="text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}
