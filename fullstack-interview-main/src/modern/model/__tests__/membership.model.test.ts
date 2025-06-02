import { MembershipModel } from '../membership.model';
import { BillingInterval, PaymentMethod } from '../../shared/enums/membership.enum';

describe('MembershipModel', () => {
    describe('validation', () => {
        it('should validate mandatory fields', () => {
            const membership = new MembershipModel({});
            const result = membership.validate();
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('missingMandatoryFields');
        });

        it('should validate negative price', () => {
            const membership = new MembershipModel({
                name: 'Test Membership',
                recurringPrice: -10
            });
            const result = membership.validate();
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('negativeRecurringPrice');
        });

        it('should validate cash payment limit', () => {
            const membership = new MembershipModel({
                name: 'Test Membership',
                recurringPrice: 150,
                paymentMethod: PaymentMethod.CASH
            });
            const result = membership.validate();
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('cashPriceBelow100');
        });

        describe('billing periods validation', () => {
            it('should validate monthly billing periods (less than 6)', () => {
                const membership = new MembershipModel({
                    name: 'Test Membership',
                    recurringPrice: 50,
                    billingInterval: BillingInterval.MONTHLY,
                    billingPeriods: 3
                });
                const result = membership.validate();
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('billingPeriodsLessThan6Months');
            });

            it('should validate monthly billing periods (more than 12)', () => {
                const membership = new MembershipModel({
                    name: 'Test Membership',
                    recurringPrice: 50,
                    billingInterval: BillingInterval.MONTHLY,
                    billingPeriods: 15
                });
                const result = membership.validate();
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('billingPeriodsMoreThan12Months');
            });

            it('should validate yearly billing periods (more than 3)', () => {
                const membership = new MembershipModel({
                    name: 'Test Membership',
                    recurringPrice: 50,
                    billingInterval: BillingInterval.YEARLY,
                    billingPeriods: 4
                });
                const result = membership.validate();
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('billingPeriodsLessThan3Years');
            });

            it('should validate yearly billing periods (more than 10)', () => {
                const membership = new MembershipModel({
                    name: 'Test Membership',
                    recurringPrice: 50,
                    billingInterval: BillingInterval.YEARLY,
                    billingPeriods: 12
                });
                const result = membership.validate();
                expect(result.isValid).toBe(false);
                expect(result.error).toBe('billingPeriodsMoreThan10Years');
            });

            it('should validate valid yearly billing periods (3 or less)', () => {
                const membership = new MembershipModel({
                    name: 'Test Membership',
                    recurringPrice: 50,
                    billingInterval: BillingInterval.YEARLY,
                    billingPeriods: 3
                });
                const result = membership.validate();
                expect(result.isValid).toBe(true);
                expect(result.error).toBeUndefined();
            });
        });

        it('should validate valid membership data', () => {
            const membership = new MembershipModel({
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6,
                paymentMethod: PaymentMethod.CARD
            });
            const result = membership.validate();
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
        });
    });

    describe('period generation', () => {
        it('should generate correct number of periods', () => {
            const membership = new MembershipModel({
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6
            });
            const periods = membership.generatePeriods();
            expect(periods).toHaveLength(6);
        });

        it('should generate periods with correct intervals (monthly)', () => {
            const startDate = new Date('2024-01-01');
            const membership = new MembershipModel({
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 3,
                validFrom: startDate
            });

            const periods = membership.generatePeriods();
            expect(periods).toHaveLength(3);
            expect(periods[0].start).toEqual(startDate);
            expect(periods[0].end).toEqual(new Date('2024-02-01'));
            expect(periods[1].start).toEqual(new Date('2024-02-01'));
            expect(periods[1].end).toEqual(new Date('2024-03-01'));
            expect(periods[2].start).toEqual(new Date('2024-03-01'));
            expect(periods[2].end).toEqual(new Date('2024-04-01'));
        });

        it('should generate periods with correct intervals (yearly)', () => {
            const startDate = new Date('2024-01-01');
            const membership = new MembershipModel({
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: BillingInterval.YEARLY,
                billingPeriods: 3,
                validFrom: startDate
            });

            const periods = membership.generatePeriods();
            expect(periods).toHaveLength(3);
            expect(periods[0].start).toEqual(startDate);
            expect(periods[0].end).toEqual(new Date('2025-01-01'));
            expect(periods[1].start).toEqual(new Date('2025-01-01'));
            expect(periods[1].end).toEqual(new Date('2026-01-01'));
            expect(periods[2].start).toEqual(new Date('2026-01-01'));
            expect(periods[2].end).toEqual(new Date('2027-01-01'));
        });

        it('should set correct state for all periods', () => {
            const membership = new MembershipModel({
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 3
            });

            const periods = membership.generatePeriods();
            periods.forEach(period => {
                expect(period.state).toBe('planned');
            });
        });
    });

    describe('state calculation', () => {
        it('should set state to pending for future start date', () => {
            const futureDate = new Date();
            futureDate.setMonth(futureDate.getMonth() + 1);
            
            const membership = new MembershipModel({
                name: 'Test Membership',
                recurringPrice: 50,
                validFrom: futureDate,
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6
            });

            expect(membership.state).toBe('pending');
        });

        it('should set state to expired for past end date', () => {
            const pastDate = new Date();
            pastDate.setFullYear(pastDate.getFullYear() - 1);
            
            const membership = new MembershipModel({
                name: 'Test Membership',
                recurringPrice: 50,
                validFrom: pastDate,
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6
            });

            expect(membership.state).toBe('expired');
        });

        it('should set state to active for current date range', () => {
            const now = new Date();
            const membership = new MembershipModel({
                name: 'Test Membership',
                recurringPrice: 50,
                validFrom: now,
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6
            });

            expect(membership.state).toBe('active');
        });
    });
}); 