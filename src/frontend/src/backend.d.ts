import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface Cell {
    value: Value;
    name: string;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface OrderDetails {
    iceType?: string;
    deliveryAddress?: string;
    deliveryFrequency?: string;
    desiredDeliveryDays: Array<string>;
    deliveryTimeWindow?: string;
    estimatedWeeklyUsage?: string;
    businessName?: string;
    totalBags?: string;
    message?: string;
    onSiteFreezer?: boolean;
    venueName?: string;
    eventDate?: string;
}
export interface Inquiry {
    id: bigint;
    status: InquiryStatus;
    orderDetails: OrderDetails;
    inquiryType: InquiryType;
    name: string;
    businessName?: string;
    email: string;
    address?: string;
    notes?: string;
    timestamp: bigint;
    phone: string;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export enum InquiryStatus {
    New = "New",
    Contacted = "Contacted",
    InReview = "InReview",
    Fulfilled = "Fulfilled"
}
export enum InquiryType {
    Event = "Event",
    General = "General",
    Wholesale = "Wholesale"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    execute(qJson: string): Promise<Result>;
    exportInquiries(): Promise<Array<Inquiry>>;
    getCallerUserRole(): Promise<UserRole>;
    getInquiry(id: bigint): Promise<Inquiry | null>;
    isAuthenticated(token: string): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    login(email: string, password: string): Promise<string | null>;
    logout(token: string): Promise<void>;
    schema(): Promise<string>;
    setupPassword(password: string): Promise<boolean>;
    submitInquiry(inquiry: Inquiry): Promise<bigint>;
    updateInquiryStatus(id: bigint, status: InquiryStatus, notes: string | null): Promise<Inquiry | null>;
}
