import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/inquiries";

module {
  // Persist a new inquiry and return its assigned id.
  public func submit(inquiries : List.List<Types.Inquiry>, inquiry : Types.Inquiry) : Nat {
    let id = inquiries.size();
    let persisted : Types.Inquiry = {
      inquiry with
      id = id;
      timestamp = Time.now();
      status = #New;
    };
    inquiries.add(persisted);
    id
  };

  // Fetch a single inquiry by id.
  public func get(inquiries : List.List<Types.Inquiry>, id : Nat) : ?Types.Inquiry {
    inquiries.find(func i = i.id == id)
  };

  // Update an inquiry's status and notes.
  public func update(inquiries : List.List<Types.Inquiry>, id : Nat, status : Types.InquiryStatus, notes : ?Text) : ?Types.Inquiry {
    var updated : ?Types.Inquiry = null;
    let snapshot = inquiries.toArray();
    inquiries.clear();
    for (inquiry in snapshot.values()) {
      if (inquiry.id == id) {
        let rebuilt : Types.Inquiry = {
          inquiry with
          status = status;
          notes = notes;
        };
        updated := ?rebuilt;
        inquiries.add(rebuilt);
      } else {
        inquiries.add(inquiry);
      };
    };
    updated
  };

  // Export all inquiries (for CSV/JSON export).
  public func export(inquiries : List.List<Types.Inquiry>) : [Types.Inquiry] {
    inquiries.toArray()
  };
};
