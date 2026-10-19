import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Char "mo:core/Char";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat8 "mo:core/Nat8";
import Text "mo:core/Text";
import Sha256 "mo:sha2/Sha256";
import Types "../types/admins";

module {
  // The owner account, seeded by the migration that introduced multi-admin.
  public let PRIMARY_EMAIL = "Sales@AvalonIce.co";

  public let SESSION_EXPIRED = "Your session has expired. Sign in again.";

  public let SESSION_NS : Int = 86_400_000_000_000; // 24 hours
  public let INVITE_NS : Int = 604_800_000_000_000; // 7 days
  public let LOCKOUT_NS : Int = 900_000_000_000; // 15 minutes
  public let MAX_LOGIN_FAILURES : Nat = 5;
  public let MAX_CODE_ATTEMPTS : Nat = 5;
  public let MAX_ADMINS : Nat = 25;
  public let MIN_PASSWORD_LENGTH : Nat = 8;

  // Trimmed and lowercased: the key every admin lookup uses.
  public func normalizeEmail(email : Text) : Text {
    email.trim(#predicate(func(c : Char) : Bool { c == ' ' or c == '\t' or c == '\n' or c == '\r' })).toLower();
  };

  // A deliberately conservative address check: one "@", a non-empty local
  // part, a dotted domain, and no whitespace, quotes or angle brackets (the
  // address is echoed into HTML email bodies and the dashboard).
  public func isValidEmail(email : Text) : Bool {
    let size = email.size();
    if (size < 6 or size > 254) return false;
    var ats = 0;
    for (c in email.chars()) {
      if (c == '@') ats += 1;
      if (c == ' ' or c == '<' or c == '>' or c == '\"' or c == '\'' or c == ',' or c == ';' or c == '\\' or c.toNat32() < 33) {
        return false;
      };
    };
    if (ats != 1) return false;
    let parts = email.split(#char '@').toArray();
    let local = parts[0];
    let domain = parts[1];
    if (local.size() == 0 or domain.size() < 4) return false;
    if (not domain.contains(#char '.')) return false;
    if (domain.startsWith(#char '.') or domain.endsWith(#char '.')) return false;
    not domain.contains(#text "..");
  };

  public func toHex(bytes : [Nat8]) : Text {
    let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    var out = "";
    for (byte in bytes.values()) {
      out #= digits[Nat8.toNat(byte / 16)] # digits[Nat8.toNat(byte % 16)];
    };
    out;
  };

  public func sha256Hex(input : Text) : Text {
    toHex(Sha256.fromBlob(input.encodeUtf8()).toArray());
  };

  // An empty salt reproduces the original unsalted hash, so the primary
  // password set before multi-admin keeps working unchanged.
  public func hashPassword(salt : Text, password : Text) : Text {
    if (salt == "") sha256Hex(password) else sha256Hex(salt # ":" # password);
  };

  // 64 hex characters of management-canister randomness.
  public func tokenFrom(entropy : Blob) : Text {
    toHex(entropy.toArray());
  };

  // A 16-byte salt taken from the tail of a 32-byte entropy blob.
  public func saltFrom(entropy : Blob) : Text {
    let bytes = entropy.toArray();
    toHex(Array.tabulate(16, func(i : Nat) : Nat8 = bytes[(bytes.size() - 16 + i) % bytes.size()]));
  };

  // Ten characters from an unambiguous 32-symbol alphabet (50 bits),
  // grouped as XXXXX-XXXXX. 256 is a multiple of 32, so `byte % 32` is
  // uniform.
  public func setupCodeFrom(entropy : Blob) : Text {
    let alphabet = Text.toArray("ABCDEFGHJKLMNPQRSTUVWXYZ23456789");
    let bytes = entropy.toArray();
    var out = "";
    var i = 0;
    while (i < 10) {
      if (i == 5) out #= "-";
      out #= alphabet[Nat8.toNat(bytes[i] % 32)].toText();
      i += 1;
    };
    out;
  };

  // Codes are compared case-insensitively, ignoring dashes and spaces.
  public func hashSetupCode(code : Text) : Text {
    let cleaned = Text.fromIter(code.toUpper().chars().filter(func c = c != '-' and c != ' '));
    sha256Hex("avalon-ice-admin-invite:" # cleaned);
  };

  public func isActive(account : Types.AdminAccount) : Bool {
    account.passwordHash != null;
  };

  // The signed-in admin's normalized email, or null when the token is
  // unknown, expired, or belongs to an admin who has since been removed.
  public func sessionEmail(state : Types.AdminState, token : Text, now : Int) : ?Text {
    let ?session = state.sessions.get(token) else return null;
    if (session.expiresAt <= now) return null;
    let ?account = state.accounts.get(session.email) else return null;
    if (not isActive(account)) return null;
    ?session.email;
  };

  public func purgeExpiredSessions(state : Types.AdminState, now : Int) {
    let expired = List.empty<Text>();
    for ((token, session) in state.sessions.entries()) {
      if (session.expiresAt <= now) expired.add(token);
    };
    for (token in expired.values()) state.sessions.remove(token);
  };

  // Signs an admin out everywhere: used when an admin is removed.
  public func dropSessionsFor(state : Types.AdminState, key : Text) {
    let owned = List.empty<Text>();
    for ((token, session) in state.sessions.entries()) {
      if (session.email == key) owned.add(token);
    };
    for (token in owned.values()) state.sessions.remove(token);
  };

  // Primary first, then alphabetical.
  public func listInfo(state : Types.AdminState) : [Types.AdminEmailInfo] {
    let rows = List.empty<Types.AdminEmailInfo>();
    for ((_, account) in state.accounts.entries()) {
      rows.add({
        email = account.email;
        isPrimary = account.isPrimary;
        status = if (isActive(account)) #active else #pending;
        addedBy = account.addedBy;
        addedAt = account.addedAt;
      });
    };
    rows.toArray().sort(
      func(a, b) {
        if (a.isPrimary != b.isPrimary) { if (a.isPrimary) #less else #greater } else Text.compare(normalizeEmail(a.email), normalizeEmail(b.email));
      }
    );
  };

  // Addresses that receive inquiry notifications: every activated admin.
  // Pending invitees are left out until they prove they hold the address.
  public func activeRecipients(state : Types.AdminState) : [Text] {
    let out = List.empty<Text>();
    for ((_, account) in state.accounts.entries()) {
      if (isActive(account)) out.add(account.email);
    };
    out.toArray();
  };
};
