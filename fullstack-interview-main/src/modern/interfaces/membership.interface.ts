export interface Membership {
    id: number;
    uuid: string;
    name: string;
    userId: number;
    recurringPrice: number;
    validFrom: Date;
    validUntil: Date;
    state: string;
    assignedBy: string;
    paymentMethod: string | null;
    billingInterval: string;
    billingPeriods: number;
}

export interface MembershipPeriod {
    id: number;
    uuid: string;
    membershipId: number;
    start: Date;
    end: Date;
    state: string;
}

export interface MembershipWithPeriods {
    membership: Membership;
    periods: MembershipPeriod[];
} 