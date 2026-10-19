import Random "mo:core/Random";
import Result "mo:core/Result";
import Time "mo:core/Time";
import Text "mo:core/Text";
import EmailClient "mo:caffeineai-email/emailClient";
import Types "../types/admins";
import Admins "../lib/admins";
import Notifications "../lib/notifications";

// Admin accounts, sessions and notification settings.
//
// Every privileged call carries a session token from `login` and is
// checked against it. The frontend talks to this canister anonymously, so
// the caller principal cannot identify an admin; only a token can.
mixin (admins : Types.AdminState) {
  func throttleFor(key : Text) : Types.LoginThrottle {
    switch (admins.throttles.get(key)) {
      case (?throttle) throttle;
      case null {
        let throttle : Types.LoginThrottle = {
          var failures = 0;
          var lockedUntil = 0;
        };
        admins.throttles.add(key, throttle);
        throttle;
      };
    };
  };

  // Whether an email belongs to an admin account (activated or pending).
  public query func verifyAdminAccess(email : Text) : async Bool {
    admins.accounts.containsKey(Admins.normalizeEmail(email));
  };

  // Email + password sign-in for any admin, returning a 24-hour session
  // token. Five wrong passwords lock that account for 15 minutes.
  public shared func login(email : Text, password : Text) : async ?Text {
    let key = Admins.normalizeEmail(email);
    let ?account = admins.accounts.get(key) else return null;
    let ?stored = account.passwordHash else return null;
    let throttle = throttleFor(key);
    if (Time.now() < throttle.lockedUntil) return null;

    if (Admins.hashPassword(account.salt, password) != stored) {
      throttle.failures += 1;
      if (throttle.failures >= Admins.MAX_LOGIN_FAILURES) {
        throttle.failures := 0;
        throttle.lockedUntil := Time.now() + Admins.LOCKOUT_NS;
      };
      return null;
    };
    throttle.failures := 0;

    let entropy = await Random.blob();
    // The account may have been removed while the randomness was fetched.
    if (not admins.accounts.containsKey(key)) return null;
    let now = Time.now();
    Admins.purgeExpiredSessions(admins, now);
    let token = Admins.tokenFrom(entropy);
    admins.sessions.add(token, { email = key; expiresAt = now + Admins.SESSION_NS });
    ?token;
  };

  public shared func logout(token : Text) : async () {
    admins.sessions.remove(token);
  };

  public query func isAuthenticated(token : Text) : async Bool {
    Admins.sessionEmail(admins, token, Time.now()) != null;
  };

  // Who the token belongs to, for the dashboard header.
  public query func getAdminSession(token : Text) : async ?Types.AdminSessionInfo {
    let ?key = Admins.sessionEmail(admins, token, Time.now()) else return null;
    let ?account = admins.accounts.get(key) else return null;
    ?{ email = account.email; isPrimary = account.isPrimary };
  };

  // First-run setup for the primary account. Only works while that
  // account has no password; added admins activate with a setup code.
  public shared func setupPassword(password : Text) : async Bool {
    if (password.size() < Admins.MIN_PASSWORD_LENGTH) return false;
    let key = Admins.normalizeEmail(Admins.PRIMARY_EMAIL);
    let ?account = admins.accounts.get(key) else return false;
    if (account.passwordHash != null) return false;
    let entropy = await Random.blob();
    if (account.passwordHash != null) return false;
    let salt = Admins.saltFrom(entropy);
    account.salt := salt;
    account.passwordHash := ?Admins.hashPassword(salt, password);
    true;
  };

  // Add an admin. They get a one-time setup code by email (and the code is
  // returned here too, as a fallback) which they use to choose a password.
  // Re-adding a pending admin issues a fresh code.
  public shared func addAdminEmail(token : Text, newEmail : Text) : async Result.Result<Types.AdminInviteResult, Text> {
    let ?inviter = Admins.sessionEmail(admins, token, Time.now()) else return #err(Admins.SESSION_EXPIRED);
    let key = Admins.normalizeEmail(newEmail);
    if (not Admins.isValidEmail(key)) return #err("Enter a valid email address.");
    switch (admins.accounts.get(key)) {
      case (?existing) {
        if (Admins.isActive(existing)) return #err(existing.email # " is already an admin.");
      };
      case null {
        if (admins.accounts.size() >= Admins.MAX_ADMINS) {
          return #err("You can have up to 25 admins. Remove one first.");
        };
      };
    };

    let entropy = await Random.blob();
    // Re-check after the await: the session or the account may have changed.
    let ?inviterKey = Admins.sessionEmail(admins, token, Time.now()) else return #err(Admins.SESSION_EXPIRED);
    let inviterEmail = switch (admins.accounts.get(inviterKey)) {
      case (?a) a.email;
      case null inviter;
    };
    let now = Time.now();
    switch (admins.accounts.get(key)) {
      case (?existing) {
        if (Admins.isActive(existing)) return #err(existing.email # " is already an admin.");
      };
      case null {
        let account : Types.AdminAccount = {
          email = key;
          isPrimary = false;
          addedBy = inviterEmail;
          addedAt = now;
          var passwordHash = null;
          var salt = "";
        };
        admins.accounts.add(key, account);
      };
    };
    let setupCode = Admins.setupCodeFrom(entropy);
    let expiresAt = now + Admins.INVITE_NS;
    let invite : Types.AdminInvite = {
      codeHash = Admins.hashSetupCode(setupCode);
      invitedBy = inviterEmail;
      expiresAt;
      var attempts = 0;
    };
    admins.invites.add(key, invite);

    let sent = await EmailClient.sendServiceEmail(
      Notifications.FROM_USERNAME,
      [key],
      Notifications.inviteSubject(),
      Notifications.inviteBody(inviterEmail, setupCode),
    );
    let (emailed, emailError) = switch (sent) {
      case (#ok)(true, null);
      case (#err(error))(false, ?error);
    };
    #ok({ email = key; setupCode; expiresAt; emailed; emailError });
  };

  // Remove an admin and sign them out everywhere. The primary account and
  // the last remaining admin cannot be removed.
  public shared func removeAdminEmail(token : Text, targetEmail : Text) : async Result.Result<(), Text> {
    let ?_ = Admins.sessionEmail(admins, token, Time.now()) else return #err(Admins.SESSION_EXPIRED);
    let key = Admins.normalizeEmail(targetEmail);
    let ?account = admins.accounts.get(key) else return #err("That email is not an admin.");
    if (account.isPrimary) return #err("The primary account can't be removed.");
    if (admins.accounts.size() <= 1) return #err("At least one admin must remain.");
    admins.accounts.remove(key);
    admins.invites.remove(key);
    admins.throttles.remove(key);
    Admins.dropSessionsFor(admins, key);
    #ok;
  };

  public query func getAdminEmails(token : Text) : async Result.Result<[Types.AdminEmailInfo], Text> {
    let ?_ = Admins.sessionEmail(admins, token, Time.now()) else return #err(Admins.SESSION_EXPIRED);
    #ok(Admins.listInfo(admins));
  };

  // An added admin chooses their password with the setup code they were
  // sent. Five wrong codes void the invitation.
  public shared func activateAdminAccount(email : Text, setupCode : Text, password : Text) : async Result.Result<(), Text> {
    let key = Admins.normalizeEmail(email);
    let ?invite = admins.invites.get(key) else return #err("There is no pending invitation for this email.");
    if (Time.now() > invite.expiresAt) {
      return #err("This setup code has expired. Ask an admin to add you again.");
    };
    if (invite.attempts >= Admins.MAX_CODE_ATTEMPTS) {
      return #err("Too many incorrect codes. Ask an admin to add you again.");
    };
    if (password.size() < Admins.MIN_PASSWORD_LENGTH) {
      return #err("Choose a password of at least 8 characters.");
    };
    if (Admins.hashSetupCode(setupCode) != invite.codeHash) {
      invite.attempts += 1;
      return #err("That setup code isn't right.");
    };

    let entropy = await Random.blob();
    // The invite may have been reissued or the admin removed meanwhile.
    let ?current = admins.invites.get(key) else return #err("There is no pending invitation for this email.");
    if (current.codeHash != invite.codeHash) return #err("This setup code was replaced by a newer one.");
    let ?account = admins.accounts.get(key) else return #err("That email is not an admin.");
    let salt = Admins.saltFrom(entropy);
    account.salt := salt;
    account.passwordHash := ?Admins.hashPassword(salt, password);
    admins.invites.remove(key);
    #ok;
  };

  public query func getNotificationStatus(token : Text) : async Result.Result<Types.NotificationStatus, Text> {
    let ?_ = Admins.sessionEmail(admins, token, Time.now()) else return #err(Admins.SESSION_EXPIRED);
    let log = admins.notifications;
    #ok({
      recipients = Admins.activeRecipients(admins);
      lastAttemptAt = log.lastAttemptAt;
      lastSuccessAt = log.lastSuccessAt;
      lastError = log.lastError;
    });
  };

  // Send a test email to every active admin to confirm delivery works.
  public shared func sendTestNotification(token : Text) : async Result.Result<(), Text> {
    let ?_ = Admins.sessionEmail(admins, token, Time.now()) else return #err(Admins.SESSION_EXPIRED);
    switch (await Notifications.sendToAdmins(admins, "[Avalon Ice Drop] Test notification", Notifications.testBody())) {
      case (#ok) #ok;
      case (#err(error)) #err(error);
    };
  };
};
