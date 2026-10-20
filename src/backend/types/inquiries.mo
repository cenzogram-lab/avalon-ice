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
};
