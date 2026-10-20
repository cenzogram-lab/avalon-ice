import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AdminTypes "../types/admins";
import Types "../types/inquiries";
import Admins "../lib/admins";
import InquiriesLib "../lib/inquiries";
import Notifications "../lib/notifications";

mixin (inquiries : List.List<Types.Inquiry>, admins : AdminTypes.AdminState) {
  // Session-checked admin access. The anonymous frontend has no meaningful
  // caller principal, so authority comes from the session token alone.
  func requireAdmin(token : Text) {
    if (Admins.sessionEmail(admins, token, Time.now()) == null) {
      Runtime.trap("Unauthorized");
    };
  };

  // The retired token-less endpoints stay callable by canister controllers
  // (platform tooling) but no longer by the public.
  func requireController(caller : Principal) {
    if (not caller.isController()) {
      Runtime.trap("Unauthorized: sign in at /admin");
    };
  };

  // Email every active admin about a new inquiry. Runs as its own message,
  // so the visitor's submission returns without waiting on the mail outcall.
  func notifyAdmins(inquiry : Types.Inquiry) : async () {
    ignore await Notifications.sendToAdmins(
      admins,
      Notifications.inquirySubject(inquiry),
      Notifications.inquiryBody(inquiry),
    );
  };

  // Submit a new inquiry; returns the assigned reference id. The record is
  // stored before any notification is attempted, so a mail failure can
  // never lose a lead.
  public shared func submitInquiry(inquiry : Types.Inquiry) : async Nat {
    switch (InquiriesLib.validate(inquiry)) {
      case (?problem) Runtime.trap("Inquiry rejected: " # problem);
      case null {};
    };
    let id = InquiriesLib.submit(inquiries, inquiry);
    switch (InquiriesLib.get(inquiries, id)) {
      case (?stored) ignore notifyAdmins(stored);
      case null {};
    };
    id;
  };

  // How many inquiries exist. The dashboard polls this cheap call and only
  // re-reads the full list when the number changes.
  public query func getInquiryCount(token : Text) : async Nat {
    requireAdmin(token);
    InquiriesLib.count(inquiries);
  };

  // All inquiries, for the dashboard and its CSV/JSON export.
  public query func listInquiries(token : Text) : async [Types.Inquiry] {
    requireAdmin(token);
    InquiriesLib.export(inquiries);
  };

  public shared func updateInquiry(token : Text, id : Nat, status : Types.InquiryStatus, notes : ?Text) : async ?Types.Inquiry {
    requireAdmin(token);
    InquiriesLib.update(inquiries, id, status, notes);
  };

  // Retired: superseded by the token-checked endpoints above.
  public query ({ caller }) func getInquiry(id : Nat) : async ?Types.Inquiry {
    requireController(caller);
    InquiriesLib.get(inquiries, id);
  };

  public shared ({ caller }) func updateInquiryStatus(id : Nat, status : Types.InquiryStatus, notes : ?Text) : async ?Types.Inquiry {
    requireController(caller);
    InquiriesLib.update(inquiries, id, status, notes);
  };

  public query ({ caller }) func exportInquiries() : async [Types.Inquiry] {
    requireController(caller);
    InquiriesLib.export(inquiries);
  };
};
