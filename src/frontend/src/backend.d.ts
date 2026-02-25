import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface FoundObject {
    id: bigint;
    status: Variant_claimed_available;
    createdAt: bigint;
    description: string;
    finder: Principal;
    location: string;
}
export interface PublicStats {
    totalRecovered: bigint;
    totalObjects: bigint;
    totalStolen: bigint;
}
export type ObjectType = {
    __kind__: "other";
    other: string;
} | {
    __kind__: "bike";
    bike: null;
} | {
    __kind__: "notebook";
    notebook: null;
} | {
    __kind__: "phone";
    phone: null;
};
export interface SubscriptionInfo {
    isExpired: boolean;
    plan: SubscriptionPlan;
    expirationDate?: bigint;
    objectCount: bigint;
    objectLimit: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type ObjectStatus = {
    __kind__: "stolen";
    stolen: TheftInfo;
} | {
    __kind__: "safe";
    safe: null;
};
export interface LeadStats {
    today: bigint;
    total: bigint;
    thisWeek: bigint;
}
export interface PersonalObject {
    id: bigint;
    status: ObjectStatus;
    model: string;
    owner: Principal;
    createdAt: bigint;
    objType: ObjectType;
    brand: string;
    identifier: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface Lead {
    name: string;
    whatsapp: string;
    timestamp: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface TheftInfo {
    latitude: bigint;
    latitudeStart?: bigint;
    date: bigint;
    stolenPlace?: string;
    reportDate: bigint;
    longitude: bigint;
    boNumber: string;
    longitudeStart?: bigint;
    location: string;
}
export enum SubscriptionPlan {
    premiumMonthly = "premiumMonthly",
    free = "free",
    premiumAnnual = "premiumAnnual"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_claimed_available {
    claimed = "claimed",
    available = "available"
}
export interface backendInterface {
    addFoundObject(description: string, location: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    canRegisterMoreObjects(): Promise<boolean>;
    claimFoundObject(foundObjectId: bigint): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    findMoreObjects(_objectType: string): Promise<Array<PersonalObject>>;
    getAllLeads(): Promise<Array<Lead>>;
    getAvailableFoundObjects(): Promise<Array<FoundObject>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyObjects(): Promise<Array<PersonalObject>>;
    getMySubscription(): Promise<SubscriptionInfo>;
    getObjectById(objectId: bigint): Promise<PersonalObject | null>;
    getObjectsByStatus(status: ObjectStatus): Promise<Array<PersonalObject>>;
    getObjectsByType(_objType: ObjectType): Promise<Array<PersonalObject>>;
    getPublicStats(): Promise<PublicStats>;
    getStats(): Promise<LeadStats>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    promoteToAdmin(user: Principal): Promise<void>;
    publicObjectSearch(identifier: string): Promise<string>;
    registerObject(brand: string, model: string, identifier: string, objType: ObjectType): Promise<bigint>;
    reportTheft(objectId: bigint, boNumber: string, latitude: bigint, longitude: bigint, date: bigint, location: string, stolenPlace: string | null, latitudeStart: bigint | null, longitudeStart: bigint | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitLead(name: string, whatsapp: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    upgradeToPremium(plan: SubscriptionPlan, stripeCustomerId: string, expirationDate: bigint): Promise<void>;
}
