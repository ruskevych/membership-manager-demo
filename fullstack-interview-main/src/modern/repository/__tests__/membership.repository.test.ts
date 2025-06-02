import { DataSource } from 'typeorm';
import { MembershipRepository } from '../membership.repository';
import { Membership } from '../../entity/membership.entity';
import { MembershipPeriod } from '../../entity/membership-period.entity';
import { BillingInterval, PaymentMethod, MembershipState } from '../../shared/enums/membership.enum';

describe('MembershipRepository', () => {
    let repository: MembershipRepository;
    let dataSource: DataSource;

    beforeAll(async () => {
        // Wait for database to be ready
        await new Promise(resolve => setTimeout(resolve, 1000));

        dataSource = new DataSource({
            type: 'postgres',
            host: 'localhost',
            port: 5433, // Use the mapped port from docker-compose
            username: 'postgres',
            password: 'postgres',
            database: 'membership_test',
            entities: [Membership, MembershipPeriod],
            synchronize: true,
            dropSchema: true,
            logging: false
        });

        await dataSource.initialize();

        // Create repository instances
        const membershipRepo = dataSource.getRepository(Membership);
        const periodRepo = dataSource.getRepository(MembershipPeriod);

        repository = new MembershipRepository();
        // Set the repositories
        (repository as any).membershipRepo = membershipRepo;
        (repository as any).periodRepo = periodRepo;
    });

    afterAll(async () => {
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });

    beforeEach(async () => {
        if (dataSource && dataSource.isInitialized) {
            // Clear all tables
            await dataSource.synchronize(true);
        }
    });

    describe('create', () => {
        it('should create a new membership', async () => {
            const membershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                userId: 2000,
                validFrom: new Date(),
                validUntil: new Date(),
                state: MembershipState.ACTIVE,
                assignedBy: 'Admin',
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6,
                paymentMethod: PaymentMethod.CARD
            };

            const result = await repository.create(membershipData);

            expect(result).toBeDefined();
            expect(result.id).toBeDefined();
            expect(result.uuid).toBeDefined();
            expect(result.name).toBe(membershipData.name);
            expect(result.recurringPrice).toBe(membershipData.recurringPrice);
        });
    });

    describe('findAll', () => {
        it('should return all memberships', async () => {
            // Create test memberships
            const membership1 = await repository.create({
                name: 'Test Membership 1',
                recurringPrice: 50,
                userId: 2000,
                validFrom: new Date(),
                validUntil: new Date(),
                state: MembershipState.ACTIVE,
                assignedBy: 'Admin',
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6,
                paymentMethod: PaymentMethod.CARD
            });

            const membership2 = await repository.create({
                name: 'Test Membership 2',
                recurringPrice: 100,
                userId: 2000,
                validFrom: new Date(),
                validUntil: new Date(),
                state: MembershipState.ACTIVE,
                assignedBy: 'Admin',
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6,
                paymentMethod: PaymentMethod.CARD
            });

            const result = await repository.findAll();

            expect(result).toHaveLength(2);
            expect(result.map(m => m.id)).toEqual(
                expect.arrayContaining([membership1.id, membership2.id])
            );
        });

        it('should return empty array when no memberships exist', async () => {
            const result = await repository.findAll();
            expect(result).toHaveLength(0);
        });
    });

    describe('findById', () => {
        it('should return membership by id', async () => {
            const membership = await repository.create({
                name: 'Test Membership',
                recurringPrice: 50,
                userId: 2000,
                validFrom: new Date(),
                validUntil: new Date(),
                state: MembershipState.ACTIVE,
                assignedBy: 'Admin',
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6,
                paymentMethod: PaymentMethod.CARD
            });

            const result = await repository.findById(membership.id);

            expect(result).toBeDefined();
            expect(result?.id).toBe(membership.id);
            expect(result?.name).toBe(membership.name);
        });

        it('should return null for non-existent id', async () => {
            const result = await repository.findById(999);
            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete existing membership', async () => {
            const membership = await repository.create({
                name: 'Test Membership',
                recurringPrice: 50,
                userId: 2000,
                validFrom: new Date(),
                validUntil: new Date(),
                state: MembershipState.ACTIVE,
                assignedBy: 'Admin',
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6,
                paymentMethod: PaymentMethod.CARD
            });

            const result = await repository.delete(membership.id);
            expect(result).toBe(true);

            const deleted = await repository.findById(membership.id);
            expect(deleted).toBeNull();
        });

        it('should return false for non-existent membership', async () => {
            const result = await repository.delete(999);
            expect(result).toBe(false);
        });
    });

    describe('getMembershipPeriods', () => {
        it('should return periods for a membership', async () => {
            const membership = await repository.create({
                name: 'Test Membership',
                recurringPrice: 50,
                userId: 2000,
                validFrom: new Date(),
                validUntil: new Date(),
                state: MembershipState.ACTIVE,
                assignedBy: 'Admin',
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6,
                paymentMethod: PaymentMethod.CARD
            });

            // Create test periods
            await repository.createMembershipPeriod({
                membershipId: membership.id,
                start: new Date(),
                end: new Date(),
                state: 'planned',
                membership
            });

            const periods = await repository.getMembershipPeriods(membership.id);

            expect(periods).toHaveLength(1);
            expect(periods[0].membershipId).toBe(membership.id);
        });

        it('should return empty array for non-existent membership', async () => {
            const periods = await repository.getMembershipPeriods(999);
            expect(periods).toHaveLength(0);
        });
    });
}); 