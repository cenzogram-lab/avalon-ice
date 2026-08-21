import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Sha256 "mo:sha2/Sha256";
import Blob "mo:core/Blob";
import Types "../types/inquiries";
import InquiriesLib "../lib/inquiries";

mixin (inquiries : List.List<Types.Inquiry>, auth : Types.AuthState) {
  // SHA-256 hash of a password, hex-encoded.
  private func hashPassword(password : Text) : Text {
    let digest = Sha256.fromBlob(password.encodeUtf8());
    toHex(digest.toArray())
  };

  // Hex-encode a byte array.
  private func toHex(bytes : [Nat8]) : Text {
    let hexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    var out = "";
    for (byte in bytes.values()) {
      let hi = byte / 16;
      let lo = byte % 16;
      out #= hexChars[Nat8.toNat(hi)] # hexChars[Nat8.toNat(lo)];
    };
    out
  };

  // Generate a SHA-256 session token from the caller principal and current time.
  private func generateToken(caller : Principal) : Text {
    let seed = caller.toText() # ":" # Time.now().toText();
    let digest = Sha256.fromBlob(seed.encodeUtf8());
    toHex(digest.toArray())
  };

  // Whether the given caller is the authenticated admin.
  private func isAdmin(caller : Principal) : Bool {
    switch (auth.adminPrincipal) {
      case (?admin) { admin.equal(caller) };
      case null { false };
    }
  };

  // Submit a new inquiry; returns the assigned reference id.
  public shared ({ caller }) func submitInquiry(inquiry : Types.Inquiry) : async Nat {
    ignore caller;
    InquiriesLib.submit(inquiries, inquiry)
  };

  // Fetch a single inquiry by id.
  public query ({ caller }) func getInquiry(id : Nat) : async ?Types.Inquiry {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized");
    };
    InquiriesLib.get(inquiries, id)
  };

  // Update an inquiry's status and notes.
  public shared ({ caller }) func updateInquiryStatus(id : Nat, status : Types.InquiryStatus, notes : ?Text) : async ?Types.Inquiry {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized");
    };
    InquiriesLib.update(inquiries, id, status, notes)
  };

  // Export all inquiries (for CSV/JSON export).
  public query ({ caller }) func exportInquiries() : async [Types.Inquiry] {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized");
    };
    InquiriesLib.export(inquiries)
  };

  // Admin auth: set the master password on first deploy.
  public shared ({ caller }) func setupPassword(password : Text) : async Bool {
    ignore caller;
    switch (auth.passwordHash) {
      case (?_) { false };
      case null {
        auth.passwordHash := ?hashPassword(password);
        auth.adminPrincipal := ?caller;
        true
      };
    }
  };

  // Admin auth: authenticate email + password, returning a session token.
  public shared ({ caller }) func login(email : Text, password : Text) : async ?Text {
    ignore caller;
    if (email != "Sales@AvalonIce.com") {
      return null;
    };
    switch (auth.passwordHash) {
      case (?stored) {
        if (stored != hashPassword(password)) {
          return null;
        };
        let token = generateToken(caller);
        auth.sessions.add(token, Time.now() + 24 * 3600 * 1000000000);
        auth.adminPrincipal := ?caller;
        ?token
      };
      case null { null };
    }
  };

  // Admin auth: invalidate a session token.
  public shared ({ caller }) func logout(token : Text) : async () {
    ignore caller;
    auth.sessions.remove(token);
    auth.adminPrincipal := null;
  };

  // Admin auth: check whether a session token is valid.
  public query func isAuthenticated(token : Text) : async Bool {
    switch (auth.sessions.get(token)) {
      case (?expiry) { Time.now() < expiry };
      case null { false };
    }
  };
};
