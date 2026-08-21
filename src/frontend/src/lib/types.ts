import type { Inquiry, OrderDetails } from "@/backend";
import { InquiryStatus, InquiryType } from "@/backend";

export type { Inquiry, OrderDetails };
export { InquiryStatus, InquiryType };

/** Form payload for a General inquiry. */
export interface GeneralFormValues {
  name: string;
  phone: string;
  email: string;
  message: string;
}

/** Form payload for a Commercial Wholesale inquiry. */
export interface WholesaleFormValues {
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  estimatedWeeklyUsage: string;
  street: string;
  city: string;
  zip: string;
  desiredDeliveryDays: string[];
  deliveryFrequency: string;
}

/** Form payload for an Event & Festival Supply inquiry. */
export interface EventFormValues {
  hostName: string;
  contactPerson: string;
  phone: string;
  email: string;
  eventDate: string;
  deliveryTimeWindow: string;
  venueName: string;
  venueAddress: string;
  totalBags: string;
  iceType: string;
  onSiteFreezer: boolean;
}

/** Union of all inquiry form payloads keyed by inquiry type. */
export type InquiryFormValues =
  | { type: InquiryType.General; values: GeneralFormValues }
  | { type: InquiryType.Wholesale; values: WholesaleFormValues }
  | { type: InquiryType.Event; values: EventFormValues };

/** Result of a successful inquiry submission. */
export interface SubmissionResult {
  referenceId: string;
  inquiry: Inquiry;
}

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  [InquiryStatus.New]: "New",
  [InquiryStatus.Contacted]: "Contacted",
  [InquiryStatus.InReview]: "In Review",
  [InquiryStatus.Fulfilled]: "Fulfilled",
};

export const INQUIRY_TYPE_LABELS: Record<InquiryType, string> = {
  [InquiryType.General]: "General",
  [InquiryType.Wholesale]: "Wholesale",
  [InquiryType.Event]: "Event",
};
