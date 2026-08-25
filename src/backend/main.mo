import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import List "mo:core/List";
import Types "types/inquiries";
import InquiriesApi "mixins/inquiries-api";
import ListEntity "mo:caffeineai-oql/ListEntity";
import Entity "mo:caffeineai-oql/Entity";
import NatValue "mo:caffeineai-oql/NatValue";
import IntValue "mo:caffeineai-oql/IntValue";
import TextValue "mo:caffeineai-oql/TextValue";
import BoolValue "mo:caffeineai-oql/BoolValue";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let inquiries : List.List<Types.Inquiry>;
  let auth : Types.AuthState;

  include MixinAuthorization(accessControlState, null);
  include InquiriesApi(inquiries, auth);
  include Expose({
    entities = [
      // Inquiry data is admin-only: the controller (Sales@AvalonIce.co) reads
      // every row; no end user reads it directly.
      inquiries.toEntityManual("inquiry", "Inquiry", "id")
        .payload("id", func i = i.id)
        .payload("timestamp", func i = i.timestamp)
        .payload("inquiryType", func i = switch (i.inquiryType) { case (#General) "General"; case (#Wholesale) "Wholesale"; case (#Event) "Event" })
        .payload("name", func i = i.name)
        .payload("email", func i = i.email)
        .payload("phone", func i = i.phone)
        .payload("businessName", func i = i.businessName ?? "")
        .payload("address", func i = i.address ?? "")
        .payload("orderDetails_message", func i = i.orderDetails.message ?? "")
        .payload("orderDetails_businessName", func i = i.orderDetails.businessName ?? "")
        .payload("orderDetails_estimatedWeeklyUsage", func i = i.orderDetails.estimatedWeeklyUsage ?? "")
        .payload("orderDetails_deliveryAddress", func i = i.orderDetails.deliveryAddress ?? "")
        .payload("orderDetails_desiredDeliveryDays", func i = i.orderDetails.desiredDeliveryDays.values().join(", "))
        .payload("orderDetails_deliveryFrequency", func i = i.orderDetails.deliveryFrequency ?? "")
        .payload("orderDetails_eventDate", func i = i.orderDetails.eventDate ?? "")
        .payload("orderDetails_deliveryTimeWindow", func i = i.orderDetails.deliveryTimeWindow ?? "")
        .payload("orderDetails_venueName", func i = i.orderDetails.venueName ?? "")
        .payload("orderDetails_totalBags", func i = i.orderDetails.totalBags ?? "")
        .payload("orderDetails_iceType", func i = i.orderDetails.iceType ?? "")
        .payload("orderDetails_onSiteFreezer", func i = i.orderDetails.onSiteFreezer ?? false)
        .payload("status", func i = switch (i.status) { case (#New) "New"; case (#InReview) "In Review"; case (#Contacted) "Contacted"; case (#Fulfilled) "Fulfilled" })
        .payload("notes", func i = i.notes ?? "")
        .controllerOnly()
        .build(),
    ];
  });
};
