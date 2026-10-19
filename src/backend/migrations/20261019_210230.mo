import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

// Multi-admin: replaces the single-password `auth` state with `admins`,
// seeding the primary account with the password set under the old scheme
// so the owner signs in exactly as before. `auth` is consumed here and not
// carried forward: its sessions were predictable (derived from the caller
// and the clock) and its principal check is retired.
module {
  type OldAuthState = {
    var passwordHash : ?Text;
    var sessions : Map.Map<Text, Int>;
    var adminPrincipal : ?Principal;
  };

  type AdminAccount = {
    email : Text;
    isPrimary : Bool;
    addedBy : Text;
    addedAt : Int;
    var passwordHash : ?Text;
    var salt : Text;
  };

  type AdminSession = {
    email : Text;
    expiresAt : Int;
  };

  type AdminInvite = {
    codeHash : Text;
    invitedBy : Text;
    expiresAt : Int;
    var attempts : Nat;
  };

  type LoginThrottle = {
    var failures : Nat;
    var lockedUntil : Int;
  };

  type NotificationLog = {
    var windowStart : Int;
    var sentInWindow : Nat;
    var lastAttemptAt : ?Int;
    var lastSuccessAt : ?Int;
    var lastError : ?Text;
  };

  type AdminState = {
    accounts : Map.Map<Text, AdminAccount>;
    sessions : Map.Map<Text, AdminSession>;
    invites : Map.Map<Text, AdminInvite>;
    throttles : Map.Map<Text, LoginThrottle>;
    notifications : NotificationLog;
  };

  type OldActor = {
    auth : OldAuthState;
  };

  type NewActor = {
    admins : AdminState;
  };

  public func migration(old : OldActor) : NewActor {
    let accounts = Map.empty<Text, AdminAccount>();
    accounts.add(
      "sales@avalonice.co",
      {
        email = "Sales@AvalonIce.co";
        isPrimary = true;
        addedBy = "Avalon Ice";
        addedAt = 0;
        // The old scheme stored an unsalted SHA-256 hex digest; an empty
        // salt tells the new code to verify it the same way.
        var passwordHash = old.auth.passwordHash;
        var salt = "";
      },
    );
    {
      admins = {
        accounts;
        sessions = Map.empty();
        invites = Map.empty();
        throttles = Map.empty();
        notifications = {
          var windowStart = 0;
          var sentInWindow = 0;
          var lastAttemptAt = null;
          var lastSuccessAt = null;
          var lastError = null;
        };
      };
    };
  };
};
