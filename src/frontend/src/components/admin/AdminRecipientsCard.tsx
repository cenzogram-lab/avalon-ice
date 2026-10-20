import type { AdminInviteResult } from "@/backend";
import { AdminStatus } from "@/backend";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  useAddAdminEmail,
  useAdminEmails,
  useNotificationStatus,
  useRemoveAdminEmail,
  useSendTestNotification,
} from "@/lib/api";
import {
  CheckCircle2,
  Copy,
  Loader2,
  MailCheck,
  RotateCw,
  Send,
  TriangleAlert,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const RECIPIENTS_HELPER =
  "Authorized emails receive instant email notifications on new form submissions and have sign-in access to this dashboard.";

function formatWhen(ns: bigint | undefined): string | null {
  if (ns === undefined || ns === 0n) return null;
  return new Date(Number(ns / 1_000_000n)).toLocaleString();
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/.test(value);
}

export default function AdminRecipientsCard({
  token,
  currentEmail,
}: {
  token: string;
  currentEmail?: string;
}) {
  const { data: admins = [], isLoading, isError } = useAdminEmails(token);
  const { data: delivery } = useNotificationStatus(token);
  const addAdmin = useAddAdminEmail(token);
  const removeAdmin = useRemoveAdminEmail(token);
  const sendTest = useSendTestNotification(token);

  const [newEmail, setNewEmail] = useState("");
  const [invite, setInvite] = useState<AdminInviteResult | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newEmail.trim();
    if (!looksLikeEmail(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    addAdmin.mutate(email, {
      onSuccess: (result) => {
        setNewEmail("");
        setInvite(result);
      },
      onError: (err) => toast.error(err.message || "Could not add admin."),
    });
  };

  // Adding a pending admin again issues a fresh code and voids the old one.
  const resendCode = (email: string) => {
    addAdmin.mutate(email, {
      onSuccess: (result) => setInvite(result),
      onError: (err) =>
        toast.error(err.message || "Could not send a new code."),
    });
  };

  const confirmRemoval = () => {
    if (!pendingRemoval) return;
    const email = pendingRemoval;
    removeAdmin.mutate(email, {
      onSuccess: () => toast.success(`${email} was removed.`),
      onError: (err) => toast.error(err.message || "Could not remove admin."),
      onSettled: () => setPendingRemoval(null),
    });
  };

  const handleTest = () => {
    sendTest.mutate(undefined, {
      onSuccess: () => toast.success("Test email sent to every active admin."),
      onError: (err) => toast.error(err.message || "Test email failed."),
    });
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Setup code copied.");
    } catch {
      toast.error("Copy failed — select the code and copy it manually.");
    }
  };

  const lastSuccess = formatWhen(delivery?.lastSuccessAt);
  const lastAttempt = formatWhen(delivery?.lastAttemptAt);

  return (
    <Card data-ocid="admin.recipients_card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display text-lg text-primary">
          <Users className="size-5 shrink-0" />
          Admin &amp; Notification Recipients
        </CardTitle>
        <CardDescription>{RECIPIENTS_HELPER}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading admins…
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">
            Could not load admins. Your session may have expired.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2" aria-label="Authorized admins">
            {admins.map((admin) => {
              const pending = admin.status === AdminStatus.pending;
              const isYou =
                currentEmail?.toLowerCase() === admin.email.toLowerCase();
              return (
                <li
                  key={admin.email}
                  data-ocid="admin.recipient_pill"
                  className="flex min-h-10 max-w-full items-center gap-2 rounded-full border border-slate-200/80 bg-secondary/60 py-1 pl-3.5 pr-1.5 text-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:border-sky-300/70 hover:shadow-[0_8px_30px_rgba(11,25,44,0.08)] motion-safe:hover:-translate-y-0.5"
                >
                  <span className="min-w-0 break-all font-medium text-primary">
                    {admin.email}
                  </span>
                  {admin.isPrimary && <Badge variant="default">Primary</Badge>}
                  {pending && (
                    <Badge
                      variant="outline"
                      title="Invited — hasn't chosen a password yet. Pending admins don't receive notifications."
                    >
                      Pending
                    </Badge>
                  )}
                  {isYou && <Badge variant="secondary">You</Badge>}
                  {pending && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:text-primary"
                      aria-label={`Send a new setup code to ${admin.email}`}
                      title="Send a new setup code"
                      disabled={addAdmin.isPending}
                      data-ocid="admin.recipient_resend"
                      onClick={() => resendCode(admin.email)}
                    >
                      <RotateCw className="size-4" />
                    </Button>
                  )}
                  {admin.isPrimary ? (
                    <span className="w-1" aria-hidden="true" />
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove ${admin.email}`}
                      data-ocid="admin.recipient_remove"
                      onClick={() => setPendingRemoval(admin.email)}
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <form
          onSubmit={handleAdd}
          className="flex flex-col gap-2 sm:flex-row"
          noValidate
        >
          <Label htmlFor="add-admin-email" className="sr-only">
            Add recipient email
          </Label>
          <Input
            id="add-admin-email"
            type="email"
            inputMode="email"
            autoComplete="off"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Add recipient email (e.g., dispatcher@avalonice.co)"
            className="min-h-10 sm:flex-1"
            data-ocid="admin.recipient_input"
          />
          <Button
            type="submit"
            disabled={addAdmin.isPending}
            className="min-h-10"
            data-ocid="admin.recipient_add"
          >
            {addAdmin.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 size-4" />
            )}
            Add Admin
          </Button>
        </form>

        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-primary/25 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-2">
            {delivery?.lastError ? (
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
            ) : (
              <MailCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            )}
            <p
              className="min-w-0 text-muted-foreground"
              data-ocid="admin.delivery_status"
            >
              {delivery?.lastError ? (
                <>
                  <span className="font-semibold text-destructive">
                    Last email attempt failed
                  </span>
                  {lastAttempt ? ` (${lastAttempt})` : ""}: {delivery.lastError}
                </>
              ) : lastSuccess ? (
                <>Last notification email sent {lastSuccess}.</>
              ) : (
                <>No notification emails sent yet.</>
              )}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={sendTest.isPending}
            className="min-h-9 shrink-0"
            data-ocid="admin.recipient_test"
          >
            {sendTest.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Send className="mr-2 size-4" />
            )}
            Send test email
          </Button>
        </div>
      </CardContent>

      <AlertDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
      >
        <AlertDialogContent data-ocid="admin.remove_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {pendingRemoval}?</AlertDialogTitle>
            <AlertDialogDescription>
              They'll be signed out immediately, lose access to this dashboard,
              and stop receiving inquiry emails. You can add them again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoval}
              className="bg-destructive text-white hover:bg-destructive/90"
              data-ocid="admin.remove_confirm"
            >
              Remove admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={invite !== null}
        onOpenChange={(o) => !o && setInvite(null)}
      >
        <DialogContent data-ocid="admin.invite_dialog">
          {invite && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-display text-xl text-primary">
                  <CheckCircle2 className="size-5" />
                  {invite.email} added
                </DialogTitle>
                <DialogDescription>
                  {invite.emailed
                    ? "We emailed them a one-time setup code. They open /admin, choose “Activate invite”, and set their own password."
                    : "The invitation email couldn't be sent, so share this one-time setup code with them yourself. They open /admin, choose “Activate invite”, and set their own password."}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-2 rounded-lg bg-secondary/60 p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Setup code
                </span>
                <code
                  className="select-all font-mono text-2xl font-bold tracking-[0.2em] text-primary"
                  data-ocid="admin.invite_code"
                >
                  {invite.setupCode}
                </code>
                <span className="text-xs text-muted-foreground">
                  Expires {formatWhen(invite.expiresAt)}
                </span>
              </div>
              {!invite.emailed && invite.emailError && (
                <p className="text-xs text-muted-foreground">
                  Email error: {invite.emailError}
                </p>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copyCode(invite.setupCode)}
                >
                  <Copy className="mr-2 size-4" /> Copy code
                </Button>
                <Button type="button" onClick={() => setInvite(null)}>
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
