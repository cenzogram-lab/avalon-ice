import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/inquiries";

module {
  // Field limits for public submissions. Generous next to what the forms
  // collect; they only stop oversized records from being stored forever.
  public let MAX_CONTACT_CHARS : Nat = 254; // name, email, phone
  public let MAX_FIELD_CHARS : Nat = 500; // business, address, details
  public let MAX_MESSAGE_CHARS : Nat = 5000;
  public let MAX_DELIVERY_DAYS : Nat = 7;

  func tooLong(value : ?Text, max : Nat) : Bool {
    switch (value) {
      case (?v) v.size() > max;
      case null false;
    };
  };

  // Why a public submission is rejected, or null when it is acceptable.
  public func validate(inquiry : Types.Inquiry) : ?Text {
    if (inquiry.name.trim(#char ' ') == "") return ?"Name is required.";
    if (inquiry.name.size() > MAX_CONTACT_CHARS or inquiry.email.size() > MAX_CONTACT_CHARS or inquiry.phone.size() > MAX_CONTACT_CHARS) {
      return ?"Name, email or phone is too long.";
    };
    let d = inquiry.orderDetails;
    if (tooLong(d.message, MAX_MESSAGE_CHARS)) return ?"Message is too long.";
    for (field in [inquiry.businessName, inquiry.address, d.businessName, d.estimatedWeeklyUsage, d.deliveryAddress, d.deliveryFrequency, d.eventDate, d.deliveryTimeWindow, d.venueName, d.totalBags, d.iceType].values()) {
      if (tooLong(field, MAX_FIELD_CHARS)) return ?"A form field is too long.";
    };
    if (d.desiredDeliveryDays.size() > MAX_DELIVERY_DAYS) return ?"Too many delivery days.";
    for (day in d.desiredDeliveryDays.values()) {
      if (day.size() > 20) return ?"Invalid delivery day.";
    };
    null;
  };

  // Persist a new inquiry and return its assigned id. The id is the
  // record's position in the list (records are never deleted), which keeps
  // lookups O(1). Server-owned fields are always set here, never taken from
  // the submitter.
  public func submit(inquiries : List.List<Types.Inquiry>, inquiry : Types.Inquiry) : Nat {
    let id = inquiries.size();
    let persisted : Types.Inquiry = {
      inquiry with
      id;
      timestamp = Time.now();
      status = #New;
      notes = null;
    };
    inquiries.add(persisted);
    id;
  };

  public func count(inquiries : List.List<Types.Inquiry>) : Nat {
    inquiries.size();
  };

  // Fetch a single inquiry by id.
  public func get(inquiries : List.List<Types.Inquiry>, id : Nat) : ?Types.Inquiry {
    switch (inquiries.get(id)) {
      case (?inquiry) { if (inquiry.id == id) return ?inquiry };
      case null {};
    };
    // Defensive fallback should the id/position invariant ever not hold.
    inquiries.find(func i = i.id == id);
  };

  // Update an inquiry's status and notes in place.
  public func update(inquiries : List.List<Types.Inquiry>, id : Nat, status : Types.InquiryStatus, notes : ?Text) : ?Types.Inquiry {
    let ?current = get(inquiries, id) else return null;
    let rebuilt : Types.Inquiry = { current with status; notes };
    switch (inquiries.get(id)) {
      case (?atIndex) {
        if (atIndex.id == id) {
          inquiries.put(id, rebuilt);
          return ?rebuilt;
        };
      };
      case null {};
    };
    // Fallback: rewrite the list, preserving order.
    let snapshot = inquiries.toArray();
    inquiries.clear();
    for (inquiry in snapshot.values()) {
      inquiries.add(if (inquiry.id == id) rebuilt else inquiry);
    };
    ?rebuilt;
  };

  // Export all inquiries (for CSV/JSON export).
  public func export(inquiries : List.List<Types.Inquiry>) : [Types.Inquiry] {
    inquiries.toArray();
  };
};
