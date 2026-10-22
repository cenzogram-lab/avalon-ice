import AdminRecipientsCard from "@/components/admin/AdminRecipientsCard";
import BrowserAlertsCard from "@/components/admin/BrowserAlertsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useBrowserAlertsSetting,
  useInquiryAlerts,
} from "@/hooks/use-inquiry-alerts";
import { type AdminLink, parseAdminLink } from "@/lib/admin-links";
import {
  useActivateAdminAccount,
  useAdminSession,
  useInquiries,
  useIsAuthenticated,
  useLogin,
  useLogout,
  useNeedsInitialSetup,
  useSetupPassword,
  useUpdateInquiryStatus,
  useVerifyAdminAccess,
} from "@/lib/api";
import {
  INQUIRY_STATUS_LABELS,
  INQUIRY_TYPE_LABELS,
  InquiryStatus,
  InquiryType,
} from "@/lib/types";
import type { Inquiry } from "@/lib/types";
import { Link } from "@tanstack/react-router";
import {
  Download,
  FileJson,
  FileSpreadsheet,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Search,
  ShieldCheck,
  Snowflake,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

/** The primary (owner) admin account; additional admins are added in the dashboard. */
const ADMIN_EMAIL = "Sales@AvalonIce.co";

/**
 * The session token survives a reload of this tab (so an admin can leave
 * the dashboard open for alerts) but not the tab itself: sessionStorage is
 * per tab and cleared when it closes.
 */
const SESSION_KEY = "avalon-ice:admin-session";

function readStoredToken(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string | null) {
  try {
    if (token) window.sessionStorage.setItem(SESSION_KEY, token);
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage blocked: the session simply won't survive a reload.
  }
}

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString();
}

function formatDateShort(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString();
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * A spreadsheet runs a cell that starts with = + - @ (or a tab/CR) as a
 * formula. These values come from the public forms, so such cells are
 * prefixed with an apostrophe to keep them plain text when an admin opens
 * the export.
 */
function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function toCsv(rows: Inquiry[]): string {
  const columns: [string, (r: Inquiry) => string][] = [
    ["ID", (r) => r.id.toString()],
    ["Type", (r) => INQUIRY_TYPE_LABELS[r.inquiryType]],
    ["Status", (r) => INQUIRY_STATUS_LABELS[r.status]],
    ["Date", (r) => formatDate(r.timestamp)],
    ["Name", (r) => r.name],
    ["Business", (r) => r.businessName ?? ""],
    ["Email", (r) => r.email],
    ["Phone", (r) => r.phone],
    ["Address", (r) => r.address ?? ""],
    ["Message", (r) => r.orderDetails.message ?? ""],
    ["Weekly Usage", (r) => r.orderDetails.estimatedWeeklyUsage ?? ""],
    ["Delivery Days", (r) => r.orderDetails.desiredDeliveryDays.join(" ")],
    ["Delivery Frequency", (r) => r.orderDetails.deliveryFrequency ?? ""],
    ["Event Date", (r) => r.orderDetails.eventDate ?? ""],
    ["Delivery Window", (r) => r.orderDetails.deliveryTimeWindow ?? ""],
    ["Venue", (r) => r.orderDetails.venueName ?? ""],
    ["Total Bags", (r) => r.orderDetails.totalBags ?? ""],
    ["Bag Type", (r) => r.orderDetails.iceType ?? ""],
    [
      "On-site Freezer",
      (r) =>
        r.orderDetails.onSiteFreezer === undefined
          ? ""
          : r.orderDetails.onSiteFreezer
            ? "Yes"
            : "No",
    ],
    ["Notes", (r) => r.notes ?? ""],
  ];
  const header = columns.map(([name]) => csvCell(name)).join(",");
  const lines = rows.map((r) =>
    columns.map(([, get]) => csvCell(get(r))).join(","),
  );
  // CRLF and a BOM so Excel reads the file as UTF-8 rows.
  return `\uFEFF${[header, ...lines].join("\r\n")}`;
}

export default function Admin() {
  // One toast container for every admin state: sign-in errors, invite
  // activation and dashboard alerts all report through it.
  return (
    <>
      {/* Bottom, so a toast never covers the sticky navbar on a phone. */}
      <Toaster position="bottom-right" />
      <AdminContent />
    </>
  );
}

function AdminContent() {
  const [token, setTokenState] = useState<string | null>(readStoredToken);
  const setToken = useCallback((next: string | null) => {
    storeToken(next);
    setTokenState(next);
  }, []);
  // Pending, not just loading: until the backend connection is ready the
  // check can't run yet, and a stored session must not flash the login form.
  const { data: isAuthenticated, isPending: authPending } =
    useIsAuthenticated(token);

  // A session that stopped being valid (expired, or this admin was removed)
  // is forgotten, which returns to the sign-in screen.
  useEffect(() => {
    if (token && isAuthenticated === false) {
      setToken(null);
      toast.info("Your admin session ended. Sign in again to continue.");
    }
  }, [token, isAuthenticated, setToken]);

  if (!token) {
    return <AuthGate onToken={setToken} />;
  }

  if (authPending) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4"
      >
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying session…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthGate onToken={setToken} />;
  }

  return <Dashboard token={token} onLogout={() => setToken(null)} />;
}

function readAdminLink(): AdminLink {
  return typeof window === "undefined"
    ? { kind: "login" }
    : parseAdminLink(window.location.hash);
}

function AuthGate({ onToken }: { onToken: (t: string) => void }) {
  // Before sign-in the page is only the login form. Activating an invite
  // and first-deploy setup are reached through private links (see
  // lib/admin-links), and inviting admins or managing notifications is
  // only possible from inside the dashboard.
  const [link, setLink] = useState<AdminLink>(readAdminLink);
  useEffect(() => {
    const onHashChange = () => setLink(readAdminLink());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  // Setup only works until the primary password exists; once it does, the
  // setup link falls back to the login form.
  const { data: needsSetup = false } = useNeedsInitialSetup();

  const backToLogin = useCallback(() => {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.search,
    );
    setLink({ kind: "login" });
  }, []);

  const mode =
    link.kind === "invite"
      ? "activate"
      : link.kind === "setup" && needsSetup
        ? "setup"
        : "login";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Snowflake className="size-7" />
        </span>
        <h1 className="font-display text-3xl text-primary">Avalon Ice Admin</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <ShieldCheck className="size-4" />
          Restricted to authorized admins
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-display text-xl text-primary">
            {mode === "setup"
              ? "Set up primary password"
              : mode === "activate"
                ? "Activate your invite"
                : "Admin login"}
          </CardTitle>
          <CardDescription>
            {mode === "setup"
              ? `First deploy only — create the password for ${ADMIN_EMAIL}.`
              : mode === "activate"
                ? "Enter the email you were invited with, your setup code, and choose a password."
                : "Sign in with your admin email and password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "setup" ? (
            <SetupPasswordForm onDone={backToLogin} />
          ) : mode === "activate" ? (
            <ActivateInviteForm
              initialCode={link.kind === "invite" ? link.code : ""}
              onDone={backToLogin}
            />
          ) : (
            <LoginForm onToken={onToken} />
          )}
          {mode !== "login" && (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="mt-2 min-h-11 w-full"
              onClick={backToLogin}
              data-ocid="admin.back_to_login"
            >
              Already have a password? Sign in
            </Button>
          )}
        </CardContent>
      </Card>

      <Button
        asChild
        variant="ghost"
        size="sm"
        className="min-h-11"
        data-ocid="admin.back_link"
      >
        <Link to="/">← Back to site</Link>
      </Button>
    </div>
  );
}

function SetupPasswordForm({ onDone }: { onDone: () => void }) {
  const setupPassword = useSetupPassword();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setupPassword.mutate(password, {
      onSuccess: (ok) => {
        if (ok) {
          toast.success("Primary password set. Sign in to continue.");
          onDone();
        } else {
          toast.error("Password setup failed. It may already be configured.");
        }
      },
      onError: () => toast.error("Could not set up password. Try again."),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="setup-email">Admin email</Label>
        <Input
          id="setup-email"
          value={ADMIN_EMAIL}
          readOnly
          disabled
          data-ocid="admin.setup_email"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="setup-password">Password</Label>
        <Input
          id="setup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          data-ocid="admin.setup_password"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="setup-confirm">Confirm password</Label>
        <Input
          id="setup-confirm"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat password"
          data-ocid="admin.setup_confirm"
        />
      </div>
      <Button
        type="submit"
        disabled={setupPassword.isPending}
        className="h-11"
        data-ocid="admin.setup_submit"
      >
        {setupPassword.isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Lock className="mr-2 size-4" />
        )}
        {setupPassword.isPending ? "Setting up…" : "Set up password"}
      </Button>
    </form>
  );
}

function LoginForm({ onToken }: { onToken: (t: string) => void }) {
  const verifyAccess = useVerifyAdminAccess();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const busy = verifyAccess.isPending || login.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const address = email.trim();
    if (!address || !password) {
      toast.error("Enter your admin email and password.");
      return;
    }
    try {
      const authorized = await verifyAccess.mutateAsync(address);
      if (!authorized) {
        toast.error("That email isn't an authorized Avalon Ice admin.");
        return;
      }
      const token = await login.mutateAsync({ email: address, password });
      if (token) {
        toast.success("Welcome back, Avalon Ice admin.");
        onToken(token);
      } else {
        toast.error(
          "Incorrect password, or the account isn't activated yet. Five wrong attempts lock sign-in for 15 minutes.",
        );
      }
    } catch {
      toast.error("Login failed. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email">Admin email</Label>
        <Input
          id="login-email"
          type="email"
          inputMode="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={ADMIN_EMAIL}
          data-ocid="admin.login_email"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          data-ocid="admin.login_password"
        />
      </div>
      <Button
        type="submit"
        disabled={busy}
        className="h-11"
        data-ocid="admin.login_submit"
      >
        {busy ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Lock className="mr-2 size-4" />
        )}
        {busy ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

function ActivateInviteForm({
  initialCode,
  onDone,
}: {
  initialCode: string;
  onDone: () => void;
}) {
  const activate = useActivateAdminAccount();
  const [email, setEmail] = useState("");
  const [setupCode, setSetupCode] = useState(initialCode);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !setupCode.trim()) {
      toast.error("Enter your email and setup code.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    activate.mutate(
      { email: email.trim(), setupCode: setupCode.trim(), password },
      {
        onSuccess: () => {
          toast.success("Account activated. Sign in with your new password.");
          onDone();
        },
        onError: (err) =>
          toast.error(err.message || "Could not activate. Try again."),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="activate-email">Your email</Label>
        <Input
          id="activate-email"
          type="email"
          inputMode="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@avalonice.co"
          data-ocid="admin.activate_email"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="activate-code">Setup code</Label>
        <Input
          id="activate-code"
          autoComplete="one-time-code"
          value={setupCode}
          onChange={(e) => setSetupCode(e.target.value)}
          placeholder="XXXXX-XXXXX"
          className="font-mono uppercase tracking-widest"
          data-ocid="admin.activate_code"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="activate-password">Choose a password</Label>
        <Input
          id="activate-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          data-ocid="admin.activate_password"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="activate-confirm">Confirm password</Label>
        <Input
          id="activate-confirm"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat password"
          data-ocid="admin.activate_confirm"
        />
      </div>
      <Button
        type="submit"
        disabled={activate.isPending}
        className="h-11"
        data-ocid="admin.activate_submit"
      >
        {activate.isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <KeyRound className="mr-2 size-4" />
        )}
        {activate.isPending ? "Activating…" : "Activate account"}
      </Button>
    </form>
  );
}

function Dashboard({
  token,
  onLogout,
}: {
  token: string;
  onLogout: () => void;
}) {
  const { data, isLoading, isError } = useInquiries(token);
  const inquiries = data ?? [];
  const { data: session } = useAdminSession(token);
  const alerts = useBrowserAlertsSetting();
  useInquiryAlerts(data, alerts.enabled);
  const logout = useLogout();
  const [filter, setFilter] = useState<InquiryType | "All">("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  // Newest first, so a fresh lead is at the top rather than at the end of
  // a growing list.
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries
      .filter((r) => {
        if (filter !== "All" && r.inquiryType !== filter) return false;
        if (!q) return true;
        return [
          r.name,
          r.email,
          r.businessName ?? "",
          r.phone,
          r.address ?? "",
          formatDateShort(r.timestamp),
        ].some((field) => field.toLowerCase().includes(q));
      })
      .sort((a, b) => (a.id === b.id ? 0 : a.id > b.id ? -1 : 1));
  }, [inquiries, filter, search]);

  const handleLogout = () => {
    // Sign out locally either way; the server session also expires on its own.
    logout.mutate(token, {
      onSuccess: () => toast.success("Signed out."),
      onError: () =>
        toast.error("Signed out here, but the server didn't confirm it."),
      onSettled: () => onLogout(),
    });
  };

  const handleExport = (format: "csv" | "json") => {
    const stamp = new Date().toISOString().slice(0, 10);
    if (format === "csv") {
      download(
        `avalon-ice-inquiries-${stamp}.csv`,
        toCsv(filtered),
        "text/csv",
      );
    } else {
      download(
        `avalon-ice-inquiries-${stamp}.json`,
        JSON.stringify(filtered, null, 2),
        "application/json",
      );
    }
    toast.success(
      `Exported ${filtered.length} inquiries as ${format.toUpperCase()}.`,
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-primary">
            Inquiry Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {inquiries.length} total submission
            {inquiries.length === 1 ? "" : "s"}
            {session && (
              <span
                className="block [overflow-wrap:anywhere] sm:inline"
                data-ocid="admin.signed_in_as"
              >
                <span className="hidden sm:inline"> · </span>
                Signed in as {session.email}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            data-ocid="admin.export_csv"
            className="max-sm:min-h-11"
          >
            <FileSpreadsheet className="mr-2 size-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
            data-ocid="admin.export_json"
            className="max-sm:min-h-11"
          >
            <FileJson className="mr-2 size-4" />
            Export JSON
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={logout.isPending}
            data-ocid="admin.logout_button"
            className="max-sm:min-h-11"
          >
            <LogOut className="mr-2 size-4" />
            Sign out
          </Button>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone…"
            aria-label="Search inquiries"
            className="pl-9"
            data-ocid="admin.search_input"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              "All",
              InquiryType.Wholesale,
              InquiryType.Event,
              InquiryType.General,
            ] as const
          ).map((t) => (
            <Button
              key={t}
              variant={filter === t ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(t)}
              aria-pressed={filter === t}
              className="max-sm:min-h-11 max-sm:min-w-11"
              data-ocid={`admin.filter.${t.toLowerCase()}`}
            >
              {t === "All" ? "All" : INQUIRY_TYPE_LABELS[t]}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div
          data-ocid="admin.loading_state"
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card py-20"
        >
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading inquiries…</p>
        </div>
      ) : isError ? (
        <div
          data-ocid="admin.error_state"
          className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card py-20 text-center"
        >
          <p className="font-display text-xl text-primary">
            Couldn't load inquiries
          </p>
          <p className="text-sm text-muted-foreground">
            Something went wrong fetching submissions.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="admin.empty_state"
          className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-20 text-center"
        >
          <Snowflake className="size-10 text-muted-foreground" />
          <p className="font-display text-xl text-primary">
            No inquiries found
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {inquiries.length === 0
              ? "No submissions yet. New inquiries will appear here."
              : "No inquiries match your current filters or search."}
          </p>
        </div>
      ) : (
        <>
          {/* Phones get a card per inquiry: the table would need sideways
            scrolling to show who each inquiry is from. */}
          <ul className="flex flex-col gap-3 sm:hidden" data-ocid="admin.cards">
            {filtered.map((r, i) => (
              <li key={r.id.toString()}>
                <button
                  type="button"
                  onClick={() => setSelected(r)}
                  data-ocid={`admin.card.${i + 1}`}
                  className="flex w-full flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0 font-medium text-primary [overflow-wrap:anywhere]">
                      {r.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDateShort(r.timestamp)}
                    </span>
                  </span>
                  <span className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {INQUIRY_TYPE_LABELS[r.inquiryType]}
                    </Badge>
                    <StatusBadge status={r.status} />
                  </span>
                  {r.businessName && (
                    <span className="text-sm text-muted-foreground [overflow-wrap:anywhere]">
                      {r.businessName}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {r.phone}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-hidden rounded-xl border border-border bg-card sm:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, i) => (
                    <TableRow
                      key={r.id.toString()}
                      className="cursor-pointer"
                      onClick={() => setSelected(r)}
                      data-ocid={`admin.row.${i + 1}`}
                    >
                      <TableCell>
                        <Badge variant="secondary">
                          {INQUIRY_TYPE_LABELS[r.inquiryType]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.businessName ?? "—"}</TableCell>
                      <TableCell>{r.phone}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDateShort(r.timestamp)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(r);
                          }}
                          data-ocid={`admin.view_button.${i + 1}`}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      <section
        aria-labelledby="admin-settings-heading"
        className="mt-12 flex flex-col gap-4"
        data-ocid="admin.settings"
      >
        <h2
          id="admin-settings-heading"
          className="font-display text-2xl text-primary"
        >
          Team &amp; notifications
        </h2>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <AdminRecipientsCard token={token} currentEmail={session?.email} />
          <BrowserAlertsCard
            enabled={alerts.enabled}
            permission={alerts.permission}
            onChange={(next) => void alerts.setEnabled(next)}
          />
        </div>
      </section>

      <InquiryModal
        token={token}
        inquiry={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: InquiryStatus }) {
  const variant =
    status === InquiryStatus.New
      ? "default"
      : status === InquiryStatus.Contacted
        ? "secondary"
        : status === InquiryStatus.InReview
          ? "outline"
          : "destructive";
  return <Badge variant={variant}>{INQUIRY_STATUS_LABELS[status]}</Badge>;
}

function InquiryModal({
  token,
  inquiry,
  onClose,
}: {
  token: string;
  inquiry: Inquiry | null;
  onClose: () => void;
}) {
  const updateStatus = useUpdateInquiryStatus(token);
  const [status, setStatus] = useState<InquiryStatus>(InquiryStatus.New);
  const [notes, setNotes] = useState("");

  // Start from the stored values every time the dialog opens, so edits
  // abandoned with Cancel don't reappear on the next open.
  const [openedFor, setOpenedFor] = useState<Inquiry | null>(null);
  if (inquiry !== openedFor) {
    setOpenedFor(inquiry);
    if (inquiry) {
      setStatus(inquiry.status);
      setNotes(inquiry.notes ?? "");
    }
  }

  const handleSave = () => {
    if (!inquiry) return;
    updateStatus.mutate(
      { id: inquiry.id, status, notes },
      {
        onSuccess: () => {
          toast.success("Inquiry updated.");
          onClose();
        },
        onError: () => toast.error("Could not update inquiry."),
      },
    );
  };

  return (
    <Dialog open={!!inquiry} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        {inquiry && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-primary">
                {inquiry.name}
              </DialogTitle>
              <DialogDescription>
                {INQUIRY_TYPE_LABELS[inquiry.inquiryType]} inquiry ·{" "}
                {formatDate(inquiry.timestamp)}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Type">
                  {INQUIRY_TYPE_LABELS[inquiry.inquiryType]}
                </Field>
                <Field label="Status">
                  <StatusBadge status={inquiry.status} />
                </Field>
                <Field label="Email">
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="break-all text-primary underline underline-offset-2"
                  >
                    {inquiry.email}
                  </a>
                </Field>
                <Field label="Phone">
                  <a
                    href={`tel:${inquiry.phone.replace(/[^\d+]/g, "")}`}
                    className="text-primary underline underline-offset-2"
                  >
                    {inquiry.phone}
                  </a>
                </Field>
                {inquiry.businessName && (
                  <Field label="Business">{inquiry.businessName}</Field>
                )}
                {inquiry.address && (
                  <Field label="Address">{inquiry.address}</Field>
                )}
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Order details
                </p>
                <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  {Object.entries(inquiry.orderDetails)
                    .filter(
                      ([, v]) => v !== undefined && v !== null && v !== "",
                    )
                    .map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <dt className="text-xs text-muted-foreground">
                          {prettyKey(key)}
                        </dt>
                        <dd className="font-medium">
                          {Array.isArray(value)
                            ? value.length
                              ? value.join(", ")
                              : "—"
                            : typeof value === "boolean"
                              ? value
                                ? "Yes"
                                : "No"
                              : String(value)}
                        </dd>
                      </div>
                    ))}
                </dl>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modal-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as InquiryStatus)}
                >
                  <SelectTrigger
                    id="modal-status"
                    data-ocid="admin.status_select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(InquiryStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {INQUIRY_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="modal-notes">Notes</Label>
                <Textarea
                  id="modal-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes…"
                  rows={3}
                  maxLength={2000}
                  data-ocid="admin.notes_input"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                data-ocid="admin.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateStatus.isPending}
                data-ocid="admin.save_button"
              >
                {updateStatus.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : null}
                Save changes
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

function prettyKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}
