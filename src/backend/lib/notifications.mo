import Char "mo:core/Char";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import EmailClient "mo:caffeineai-email/emailClient";
import AdminTypes "../types/admins";
import Types "../types/inquiries";
import Admins "admins";

module {
  // Sender mailbox on the app's verified mail domain.
  public let FROM_USERNAME = "notifications";

  // Where the "Open the dashboard" link in every notification points.
  public let ADMIN_URL = "https://www.avalonice.co/admin";

  // Notification emails (individual deliveries, one per recipient) allowed
  // per rolling hour. Inquiries are always stored; past this cap only the
  // email is skipped, so a spam burst on the public forms cannot run up
  // sends however many admins there are.
  public let MAX_EMAILS_PER_HOUR : Nat = 200;
  let HOUR_NS : Int = 3_600_000_000_000;

  // Longest field echoed into an email; the full record stays in /admin.
  let MAX_FIELD_CHARS : Nat = 2000;

  public func escapeHtml(input : Text) : Text {
    var out = "";
    for (c in input.chars()) {
      out #= switch (c) {
        case ('&') "&amp;";
        case ('<') "&lt;";
        case ('>') "&gt;";
        case ('\"') "&quot;";
        case ('\'') "&#39;";
        case _ c.toText();
      };
    };
    out;
  };

  func truncate(input : Text, max : Nat) : Text {
    if (input.size() <= max) return input;
    Text.fromIter(input.chars().take(max)) # "…";
  };

  // One line, no control characters: safe in a subject line.
  public func singleLine(input : Text, max : Nat) : Text {
    let flat = Text.fromIter(
      input.chars().map(func(c : Char) : Char = if (c.toNat32() < 32 or c.toNat32() == 127) ' ' else c)
    );
    truncate(flat.trim(#char ' '), max);
  };

  public func typeLabel(inquiryType : Types.InquiryType) : Text {
    switch (inquiryType) {
      case (#General) "General";
      case (#Wholesale) "Wholesale";
      case (#Event) "Event";
    };
  };

  public func inquirySubject(inquiry : Types.Inquiry) : Text {
    "[Avalon Ice Drop] New " # typeLabel(inquiry.inquiryType) # " Inquiry: " # singleLine(inquiry.name, 80);
  };

  func row(caption : Text, value : Text) : Text {
    "<tr><td style=\"padding:4px 16px 4px 0;color:#1b4f70;font-weight:600;vertical-align:top;white-space:nowrap\">"
    # caption # "</td><td style=\"padding:4px 0;color:#0c3552;white-space:pre-wrap\">"
    # escapeHtml(truncate(value, MAX_FIELD_CHARS)) # "</td></tr>";
  };

  func optRow(rows : List.List<Text>, caption : Text, value : ?Text) {
    switch (value) {
      case (?v) { if (v.trim(#char ' ') != "") rows.add(row(caption, v)) };
      case null {};
    };
  };

  // Customer name, phone, email, category and message up top, then any
  // order details the form collected, then the dashboard link.
  public func inquiryBody(inquiry : Types.Inquiry) : Text {
    let d = inquiry.orderDetails;
    let rows = List.empty<Text>();
    rows.add(row("Reference", "AVL-" # inquiry.id.toText()));
    rows.add(row("Name", inquiry.name));
    rows.add(row("Phone", inquiry.phone));
    rows.add(row("Email", inquiry.email));
    rows.add(row("Category", typeLabel(inquiry.inquiryType)));
    optRow(rows, "Message", d.message);
    optRow(rows, "Business", inquiry.businessName);
    optRow(rows, "Address", inquiry.address);
    optRow(rows, "Weekly usage", d.estimatedWeeklyUsage);
    if (d.desiredDeliveryDays.size() > 0) {
      rows.add(row("Delivery days", d.desiredDeliveryDays.values().join(", ")));
    };
    optRow(rows, "Frequency", d.deliveryFrequency);
    optRow(rows, "Event date", d.eventDate);
    optRow(rows, "Time window", d.deliveryTimeWindow);
    optRow(rows, "Venue", d.venueName);
    optRow(rows, "Total bags", d.totalBags);
    optRow(rows, "Bag type", d.iceType);
    switch (d.onSiteFreezer) {
      case (?true) rows.add(row("On-site freezer", "Yes"));
      case (?false) rows.add(row("On-site freezer", "No"));
      case null {};
    };

    "<div style=\"font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#0c3552\">"
    # "<p style=\"margin:0 0 12px\">A new " # typeLabel(inquiry.inquiryType)
    # " inquiry just came in through the Avalon Ice website.</p>"
    # "<table style=\"border-collapse:collapse\">" # rows.values().join("") # "</table>"
    # "<p style=\"margin:20px 0 0\"><a href=\"" # ADMIN_URL
    # "\" style=\"color:#0c3552;font-weight:700\">Open the admin dashboard</a> to review it and update its status.</p>"
    # "<p style=\"margin:16px 0 0;font-size:12px;color:#3a6e7b\">You receive this because you are an authorized Avalon Ice admin.</p>"
    # "</div>";
  };

  public func inviteSubject() : Text {
    "You've been added as an Avalon Ice admin";
  };

  public func inviteBody(invitedBy : Text, setupCode : Text) : Text {
    "<div style=\"font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#0c3552\">"
    # "<p>" # escapeHtml(invitedBy) # " added you as an admin of the Avalon Ice website. Admins can sign in to the inquiry dashboard and receive an email for every new form submission.</p>"
    # "<p>Your one-time setup code:</p>"
    # "<p style=\"font-size:22px;font-weight:700;letter-spacing:2px\">" # escapeHtml(setupCode) # "</p>"
    # "<p>Open <a href=\"" # ADMIN_URL # "\" style=\"color:#0c3552;font-weight:700\">" # ADMIN_URL
    # "</a>, choose <b>Activate invite</b>, and enter this email address, the code, and a password of your choice. The code expires in 7 days.</p>"
    # "<p style=\"font-size:12px;color:#3a6e7b\">If you weren't expecting this, you can ignore this email.</p>"
    # "</div>";
  };

  public func testBody() : Text {
    "<div style=\"font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#0c3552\">"
    # "<p>This is a test notification from the Avalon Ice admin dashboard. Email delivery to admins is working.</p>"
    # "<p><a href=\"" # ADMIN_URL # "\" style=\"color:#0c3552;font-weight:700\">Open the admin dashboard</a></p>"
    # "</div>";
  };

  func record(log : AdminTypes.NotificationLog, result : EmailClient.SendResult) {
    switch (result) {
      case (#ok) {
        log.lastSuccessAt := ?Time.now();
        log.lastError := null;
      };
      case (#err(error)) { log.lastError := ?error };
    };
  };

  // Email every active admin. Never traps: a failure is recorded on the
  // log for the dashboard and returned.
  public func sendToAdmins(state : AdminTypes.AdminState, subject : Text, htmlBody : Text) : async EmailClient.SendResult {
    let log = state.notifications;
    let now = Time.now();
    log.lastAttemptAt := ?now;

    let recipients = Admins.activeRecipients(state);
    if (recipients.size() == 0) {
      let result = #err("No active admin accounts to notify.");
      record(log, result);
      return result;
    };

    if (now - log.windowStart >= HOUR_NS) {
      log.windowStart := now;
      log.sentInWindow := 0;
    };
    // Each recipient is a separate delivery, so the whole batch counts.
    if (log.sentInWindow + recipients.size() > MAX_EMAILS_PER_HOUR) {
      let result = #err("Hourly notification limit reached; new inquiries are still saved in the dashboard.");
      record(log, result);
      return result;
    };
    log.sentInWindow += recipients.size();

    let result = await EmailClient.sendServiceEmail(FROM_USERNAME, recipients, subject, htmlBody);
    record(log, result);
    result;
  };
};
