/**
 * Private /admin entry points. The sign-in screen only ever shows the login
 * form; activating an invite or setting the first password is reached
 * through these links instead. They live in the URL fragment, so the setup
 * code never reaches a server log or a Referer header.
 */
export type AdminLink =
  | { kind: "login" }
  | { kind: "invite"; code: string }
  | { kind: "setup" };

const INVITE_PREFIX = "#invite";
const SETUP_HASH = "#setup";

/** Read which entry point a /admin URL fragment asks for. */
export function parseAdminLink(hash: string): AdminLink {
  if (hash === SETUP_HASH) return { kind: "setup" };
  if (hash === INVITE_PREFIX || hash.startsWith(`${INVITE_PREFIX}=`)) {
    let code = hash.slice(INVITE_PREFIX.length + 1);
    try {
      code = decodeURIComponent(code);
    } catch {
      // A mangled code is left as typed; the backend rejects it if wrong.
    }
    return { kind: "invite", code: code.trim() };
  }
  return { kind: "login" };
}

/** The activation link an invited admin opens (emailed by the backend too). */
export function inviteLink(origin: string, setupCode: string): string {
  return `${origin}/admin${INVITE_PREFIX}=${encodeURIComponent(setupCode)}`;
}
