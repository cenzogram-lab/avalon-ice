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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useInquiries,
  useIsAuthenticated,
  useLogin,
  useLogout,
  useSetupPassword,
  useUpdateInquiryStatus,
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
  Loader2,
  Lock,
  LogOut,
  Mail,
  Search,
  ShieldCheck,
  Snowflake,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const ADMIN_EMAIL = "Sales@AvalonIce.com";

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

function toCsv(rows: Inquiry[]): string {
  const headers = [
    "ID",
    "Type",
    "Status",
    "Name",
    "Business",
    "Email",
    "Phone",
    "Address",
    "Date",
    "Notes",
  ];
  const lines = rows.map((r) =>
    [
      r.id.toString(),
      INQUIRY_TYPE_LABELS[r.inquiryType],
      INQUIRY_STATUS_LABELS[r.status],
      r.name,
      r.businessName ?? "",
      r.email,
      r.phone,
      r.address ?? "",
      formatDate(r.timestamp),
      r.notes ?? "",
    ]
      .map((c) => `"${String(c).replace(/"/g, '""')}"`)
      .join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const { data: isAuthenticated, isLoading: authLoading } =
    useIsAuthenticated(token);

  if (!token) {
    return <AuthGate onToken={setToken} />;
  }

  if (authLoading) {
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

function AuthGate({ onToken }: { onToken: (t: string) => void }) {
  // Login is the everyday case — setup runs once, on the first deploy —
  // so a returning admin lands straight on the form they actually need.
  const [mode, setMode] = useState<"setup" | "login">("login");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-4 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Snowflake className="size-7" />
        </span>
        <h1 className="font-display text-3xl text-primary">Avalon Ice Admin</h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <ShieldCheck className="size-4" />
          Restricted to {ADMIN_EMAIL}
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-display text-xl text-primary">
            {mode === "setup" ? "Set up master password" : "Admin login"}
          </CardTitle>
          <CardDescription>
            {mode === "setup"
              ? "First deploy — create the master password for the admin portal."
              : "Sign in with your admin email and password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as "setup" | "login")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="setup" data-ocid="admin.setup_tab">
                Set up
              </TabsTrigger>
              <TabsTrigger value="login" data-ocid="admin.login_tab">
                Login
              </TabsTrigger>
            </TabsList>
            <TabsContent value="setup">
              <SetupPasswordForm onDone={() => setMode("login")} />
            </TabsContent>
            <TabsContent value="login">
              <LoginForm onToken={onToken} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Button asChild variant="ghost" size="sm" data-ocid="admin.back_link">
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
          toast.success("Master password set. You can now log in.");
          onDone();
        } else {
          toast.error("Password setup failed. It may already be configured.");
        }
      },
      onError: () => toast.error("Could not set up password. Try again."),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
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
        <Label htmlFor="setup-password">Master password</Label>
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
  const login = useLogin();
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email: ADMIN_EMAIL, password },
      {
        onSuccess: (token) => {
          if (token) {
            toast.success("Welcome back, Avalon Ice admin.");
            onToken(token);
          } else {
            toast.error("Invalid email or password.");
          }
        },
        onError: () => toast.error("Login failed. Try again."),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email">Admin email</Label>
        <Input
          id="login-email"
          value={ADMIN_EMAIL}
          readOnly
          disabled
          data-ocid="admin.login_email"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          data-ocid="admin.login_password"
        />
      </div>
      <Button
        type="submit"
        disabled={login.isPending}
        data-ocid="admin.login_submit"
      >
        {login.isPending ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Lock className="mr-2 size-4" />
        )}
        {login.isPending ? "Signing in…" : "Sign in"}
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
  const { data: inquiries = [], isLoading, isError } = useInquiries();
  const logout = useLogout();
  const [filter, setFilter] = useState<InquiryType | "All">("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inquiries.filter((r) => {
      if (filter !== "All" && r.inquiryType !== filter) return false;
      if (!q) return true;
      const business = (r.businessName ?? "").toLowerCase();
      const phone = r.phone.toLowerCase();
      const date = formatDateShort(r.timestamp).toLowerCase();
      return business.includes(q) || phone.includes(q) || date.includes(q);
    });
  }, [inquiries, filter, search]);

  const handleLogout = () => {
    logout.mutate(token, {
      onSuccess: () => {
        toast.success("Signed out.");
        onLogout();
      },
      onError: () => {
        toast.error("Could not sign out.");
      },
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
      <Toaster position="top-right" />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-primary">
            Inquiry Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {inquiries.length} total submission
            {inquiries.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            data-ocid="admin.export_csv"
          >
            <FileSpreadsheet className="mr-2 size-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
            data-ocid="admin.export_json"
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
            placeholder="Search by business name, phone, or date…"
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
        <div className="overflow-hidden rounded-xl border border-border bg-card">
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
      )}

      <InquiryModal inquiry={selected} onClose={() => setSelected(null)} />
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
  inquiry,
  onClose,
}: {
  inquiry: Inquiry | null;
  onClose: () => void;
}) {
  const updateStatus = useUpdateInquiryStatus();
  const [status, setStatus] = useState<InquiryStatus>(InquiryStatus.New);
  const [notes, setNotes] = useState("");

  // Reset local state whenever a new inquiry is opened.
  const [lastId, setLastId] = useState<string | null>(null);
  if (inquiry && inquiry.id.toString() !== lastId) {
    setLastId(inquiry.id.toString());
    setStatus(inquiry.status);
    setNotes(inquiry.notes ?? "");
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
                <Field label="Email">{inquiry.email}</Field>
                <Field label="Phone">{inquiry.phone}</Field>
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
