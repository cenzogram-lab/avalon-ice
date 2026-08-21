import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type UserRole = { #admin; #user; #guest };

  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  type InquiryType = { #General; #Wholesale; #Event };

  type InquiryStatus = { #New; #InReview; #Contacted; #Fulfilled };

  type OrderDetails = {
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

  type Inquiry = {
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

  type AuthState = {
    var passwordHash : ?Text;
    var sessions : Map.Map<Text, Int>;
    var adminPrincipal : ?Principal;
  };

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControlState;
    inquiries : List.List<Inquiry>;
    auth : AuthState;
  };

  public func migration(_old : OldActor) : NewActor {
    {
      accessControlState = {
        var adminAssigned = false;
        userRoles = Map.empty();
      };
      inquiries = List.empty();
      auth = {
        var passwordHash = null;
        var sessions = Map.empty();
        var adminPrincipal = null;
      };
    };
  };
};
