import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AdminEmailInfo {
    status: AdminStatus;
    email: string;
    isPrimary: boolean;
    addedAt: bigint;
    addedBy: string;
}
export interface AdminInviteResult {
    emailed: boolean;
    expiresAt: bigint;
    email: string;
    setupCode: string;
    emailError?: string;
}
export interface AdminSessionInfo {
    email: string;
    isPrimary: boolean;
}
export interface Cell {
    value: Value;
    name: string;
}
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
export interface NotificationStatus {
    lastSuccessAt?: bigint;
    lastAttemptAt?: bigint;
    recipients: Array<string>;
    lastError?: string;
}
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
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type Result_1 = {
    __kind__: "ok";
    ok: NotificationStatus;
} | {
    __kind__: "err";
    err: string;
};
export type Result_2 = {
    __kind__: "ok";
    ok: Array<AdminEmailInfo>;
} | {
    __kind__: "err";
    err: string;
};
export type Result_3 = {
    __kind__: "ok";
    ok: AdminInviteResult;
} | {
    __kind__: "err";
    err: string;
};
export type Result_4 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Result__1 {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
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
export enum AdminStatus {
    active = "active",
    pending = "pending"
}
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
    activateAdminAccount(email: string, setupCode: string, password: string): Promise<Result>;
    addAdminEmail(token: string, newEmail: string): Promise<Result_3>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    execute(qJson: string): Promise<Result__1>;
    exportInquiries(): Promise<Array<Inquiry>>;
    getAdminEmails(token: string): Promise<Result_2>;
    getAdminSession(token: string): Promise<AdminSessionInfo | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInquiry(id: bigint): Promise<Inquiry | null>;
    getInquiryCount(token: string): Promise<bigint>;
    getNotificationStatus(token: string): Promise<Result_1>;
    isAuthenticated(token: string): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    listInquiries(token: string): Promise<Array<Inquiry>>;
    login(email: string, password: string): Promise<string | null>;
    logout(token: string): Promise<void>;
    needsInitialSetup(): Promise<boolean>;
    removeAdminEmail(token: string, targetEmail: string): Promise<Result>;
    schema(): Promise<string>;
    sendTestNotification(token: string): Promise<Result>;
    setupPassword(password: string): Promise<boolean>;
    submitInquiry(inquiry: Inquiry): Promise<bigint>;
    updateInquiry(token: string, id: bigint, status: InquiryStatus, notes: string | null): Promise<Inquiry | null>;
    updateInquiryStatus(id: bigint, status: InquiryStatus, notes: string | null): Promise<Inquiry | null>;
    verifyAdminAccess(email: string): Promise<boolean>;
}
