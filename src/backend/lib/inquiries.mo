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

  // A query response can't exceed ~3 MB. A page stops once its records
  // reach this many bytes (or rows), leaving ample room for Candid framing,
  // so a long or spammed history can't make the dashboard unloadable.
  public let PAGE_BYTE_BUDGET : Nat = 1_500_000;
  public let PAGE_MAX_ROWS : Nat = 500;

  func textBytes(t : Text) : Nat { t.encodeUtf8().size() };

  func optBytes(t : ?Text) : Nat {
    switch (t) {
      case (?v) textBytes(v);
      case null 0;
    };
  };

  // Upper-bound-ish encoded size of one record: its text plus a fixed
  // allowance for numbers, variants and option tags.
  public func approxBytes(i : Types.Inquiry) : Nat {
    let d = i.orderDetails;
    var bytes = 256 + textBytes(i.name) + textBytes(i.email) + textBytes(i.phone) + optBytes(i.businessName) + optBytes(i.address) + optBytes(i.notes);
    for (field in [d.message, d.businessName, d.estimatedWeeklyUsage, d.deliveryAddress, d.deliveryFrequency, d.eventDate, d.deliveryTimeWindow, d.venueName, d.totalBags, d.iceType].values()) {
      bytes += optBytes(field);
    };
    for (day in d.desiredDeliveryDays.values()) bytes += 8 + textBytes(day);
    bytes;
  };

  // Records from `start` in id order, cut at the byte budget. A page always
  // holds at least one record, so paging always makes progress.
  public func page(inquiries : List.List<Types.Inquiry>, start : Nat, byteBudget : Nat, maxRows : Nat) : Types.InquiryPage {
    let total = inquiries.size();
    let rows = List.empty<Types.Inquiry>();
    var bytes = 0;
    var index = start;
    label filling while (index < total) {
      let ?inquiry = inquiries.get(index) else break filling;
      let size = approxBytes(inquiry);
      if (rows.size() > 0 and (bytes + size > byteBudget or rows.size() >= maxRows)) break filling;
      rows.add(inquiry);
      bytes += size;
      index += 1;
    };
    {
      inquiries = rows.toArray();
      next = if (index < total) ?index else null;
      total;
    };
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
