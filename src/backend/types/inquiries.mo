import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type InquiryType = { #General; #Wholesale; #Event };

  public type InquiryStatus = { #New; #InReview; #Contacted; #Fulfilled };

  // Custom JSON structure capturing the inquiry-specific payload. Optional
  // fields are populated depending on the inquiryType.
  public type OrderDetails = {
    message : ?Text;
    businessName : ?Text;
    estimatedWeeklyUsage : ?Text;
    deliveryAddress : ?Text;
    desiredDeliveryDays : [Text];
    deliveryFrequency : ?Text;
    eventDate : ?Text;
    deliveryTimeWindow : ?Text;
    venueName : ?Text;
    totalBags : ?Text;
    iceType : ?Text;
    onSiteFreezer : ?Bool;
  };

  public type Inquiry = {
    id : Nat;
    timestamp : Int;
    inquiryType : InquiryType;
    name : Text;
    email : Text;
    phone : Text;
    businessName : ?Text;
    address : ?Text;
    orderDetails : OrderDetails;
    status : InquiryStatus;
    notes : ?Text;
  };

  // Admin authentication state: hashed master password plus active session
  // tokens mapped to their expiry timestamp.
  public type AuthState = {
    var passwordHash : ?Text;
    var sessions : Map.Map<Text, Int>;
    var adminPrincipal : ?Principal;
  };
};
