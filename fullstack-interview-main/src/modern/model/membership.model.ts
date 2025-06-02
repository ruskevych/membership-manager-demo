import { MembershipState, BillingInterval, PaymentMethod } from '../shared/enums/membership.enum';
import { Membership as IMembership } from '../interfaces/membership.interface';

export class MembershipModel implements IMembership {
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

    constructor(data: Partial<IMembership>) {
        this.id = data.id || 0;
        this.uuid = data.uuid || '';
        this.name = data.name || '';
        this.userId = data.userId || 2000; // Default userId
        this.recurringPrice = data.recurringPrice || 0;
        this.validFrom = data.validFrom ? new Date(data.validFrom) : new Date();
        this.validUntil = this.calculateValidUntil(data.billingInterval as BillingInterval, data.billingPeriods || 0);
        this.state = this.calculateState();
        this.assignedBy = data.assignedBy || 'Admin';
        this.paymentMethod = data.paymentMethod || null;
        this.billingInterval = data.billingInterval || BillingInterval.MONTHLY;
        this.billingPeriods = data.billingPeriods || 0;
    }

    private calculateValidUntil(billingInterval: BillingInterval, periods: number): Date {
        const validUntil = new Date(this.validFrom);
        
        switch (billingInterval) {
            case BillingInterval.MONTHLY:
                validUntil.setMonth(validUntil.getMonth() + periods);
                break;
            case BillingInterval.YEARLY:
                validUntil.setMonth(validUntil.getMonth() + periods * 12);
                break;
            case BillingInterval.WEEKLY:
                validUntil.setDate(validUntil.getDate() + periods * 7);
                break;
        }
        
        return validUntil;
    }

    private calculateState(): string {
        const now = new Date();
        if (this.validFrom > now) {
            return MembershipState.PENDING;
        }
        if (this.validUntil < now) {
            return MembershipState.EXPIRED;
        }
        return MembershipState.ACTIVE;
    }

    validate(): { isValid: boolean; error?: string } {
        // Check mandatory fields
        if (!this.name || !this.recurringPrice) {
            return { isValid: false, error: "missingMandatoryFields" };
        }

        // Check negative price
        if (this.recurringPrice < 0) {
            return { isValid: false, error: "negativeRecurringPrice" };
        }

        // Check cash payment limit
        if (this.recurringPrice > 100 && this.paymentMethod === PaymentMethod.CASH) {
            return { isValid: false, error: "cashPriceBelow100" };
        }

        // Validate billing periods based on interval
        if (this.billingInterval === BillingInterval.MONTHLY) {
            if (this.billingPeriods > 12) {
                return { isValid: false, error: "billingPeriodsMoreThan12Months" };
            }
            if (this.billingPeriods < 6) {
                return { isValid: false, error: "billingPeriodsLessThan6Months" };
            }
        } else if (this.billingInterval === BillingInterval.YEARLY) {
            if (this.billingPeriods > 3) {
                if (this.billingPeriods > 10) {
                    return { isValid: false, error: "billingPeriodsMoreThan10Years" };
                } else {
                    return { isValid: false, error: "billingPeriodsLessThan3Years" };
                }
            }
        } else if (!Object.values(BillingInterval).includes(this.billingInterval as BillingInterval)) {
            return { isValid: false, error: "invalidBillingPeriods" };
        }

        return { isValid: true };
    }

    generatePeriods(): Array<{ id: number; uuid: string; membershipId: number; start: Date; end: Date; state: string }> {
        const periods = [];
        let periodStart = new Date(this.validFrom);

        for (let i = 0; i < this.billingPeriods; i++) {
            const start = new Date(Date.UTC(
                periodStart.getUTCFullYear(),
                periodStart.getUTCMonth(),
                periodStart.getUTCDate()
            ));
            const end = new Date(Date.UTC(
                start.getUTCFullYear(),
                start.getUTCMonth(),
                start.getUTCDate()
            ));

            switch (this.billingInterval) {
                case BillingInterval.MONTHLY:
                    end.setUTCMonth(start.getUTCMonth() + 1);
                    break;
                case BillingInterval.YEARLY:
                    end.setUTCMonth(start.getUTCMonth() + 12);
                    break;
                case BillingInterval.WEEKLY:
                    end.setUTCDate(start.getUTCDate() + 7);
                    break;
            }

            periods.push({
                id: i + 1,
                uuid: crypto.randomUUID(),
                membershipId: this.id,
                start,
                end,
                state: 'planned'
            });

            periodStart = end;
        }

        return periods;
    }
} 