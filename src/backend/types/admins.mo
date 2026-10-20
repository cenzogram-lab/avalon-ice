import Map "mo:core/Map";

module {
  // ------------------------------------------------------------------
  // Stable state
  // ------------------------------------------------------------------

  // One admin account, keyed in `AdminState.accounts` by its normalized
  // (trimmed, lowercased) email address.
  public type AdminAccount = {
    // The address as shown in the dashboard.
    email : Text;
    // The owner account. It cannot be removed, so the business can never
    // be locked out of its own dashboard by another admin.
    isPrimary : Bool;
    addedBy : Text;
    addedAt : Int;
    // Null until the admin activates the account with their setup code.
    var passwordHash : ?Text;
    // Per-account random salt. "" marks the legacy unsalted primary hash
    // carried over from the single-password setup.
    var salt : Text;
  };

  public type AdminSession = {
    // Normalized email of the signed-in admin.
    email : Text;
    expiresAt : Int;
  };

  // A pending invitation: the hash of the one-time setup code an added
  // admin uses to choose their password.
  public type AdminInvite = {
    codeHash : Text;
    invitedBy : Text;
    expiresAt : Int;
    var attempts : Nat;
  };

  // Failed-login counter for one existing account.
  public type LoginThrottle = {
    var failures : Nat;
    var lockedUntil : Int;
  };

  // Delivery bookkeeping for admin email notifications: an hourly cap so a
  // flood of form submissions cannot run up email sends, plus the outcome
  // of the latest attempt for the dashboard.
  public type NotificationLog = {
    var windowStart : Int;
    var sentInWindow : Nat;
    var lastAttemptAt : ?Int;
    var lastSuccessAt : ?Int;
    var lastError : ?Text;
  };

  public type AdminState = {
    accounts : Map.Map<Text, AdminAccount>;
    sessions : Map.Map<Text, AdminSession>;
    invites : Map.Map<Text, AdminInvite>;
    throttles : Map.Map<Text, LoginThrottle>;
    notifications : NotificationLog;
  };

  // ------------------------------------------------------------------
  // Shared (Candid) shapes
  // ------------------------------------------------------------------

  public type AdminStatus = { #active; #pending };

  public type AdminEmailInfo = {
    email : Text;
    isPrimary : Bool;
    status : AdminStatus;
    addedBy : Text;
    addedAt : Int;
  };

  public type AdminSessionInfo = {
    email : Text;
    isPrimary : Bool;
  };

  public type AdminInviteResult = {
    email : Text;
    // Returned so the inviting admin can pass it on if the email does not
    // arrive. Possessing it only lets someone activate this one account.
    setupCode : Text;
    expiresAt : Int;
    emailed : Bool;
    emailError : ?Text;
  };

  public type NotificationStatus = {
    recipients : [Text];
    lastAttemptAt : ?Int;
    lastSuccessAt : ?Int;
    lastError : ?Text;
  };
};
