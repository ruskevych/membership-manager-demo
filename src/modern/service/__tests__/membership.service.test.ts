import { MembershipService } from '../membership.service';
import { MembershipRepository } from '../../repository/membership.repository';
import { MembershipModel } from '../../model/membership.model';
import { BillingInterval, PaymentMethod, MembershipState } from '../../shared/enums/membership.enum';
import { MembershipError, MembershipErrorCode } from '../../shared/errors/membership.error';
import { MembershipPeriod } from '../../entity/membership-period.entity';
import { Membership } from '../../entity/membership.entity';

// Mock the repository
jest.mock('../../repository/membership.repository');

describe('MembershipService', () => {
    let service: MembershipService;
    let mockRepository: jest.Mocked<MembershipRepository>;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        
        // Create a new instance of the service
        service = new MembershipService();
        
        // Get the mocked repository instance
        mockRepository = (MembershipRepository as jest.MockedClass<typeof MembershipRepository>).prototype;
    });

    describe('getAllMemberships', () => {
        it('should return all memberships with their periods', async () => {
            const mockMembership = new MembershipModel({
                id: 1,
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

            const mockPeriods: MembershipPeriod[] = [{
                id: 1,
                uuid: 'test-uuid',
                membershipId: 1,
                start: new Date(),
                end: new Date(),
                state: 'planned',
                membership: mockMembership as unknown as Membership
            }];

            mockRepository.findAll.mockResolvedValue([mockMembership]);
            mockRepository.getMembershipPeriods.mockResolvedValue(mockPeriods);

            const result = await service.getAllMemberships();

            expect(result).toHaveLength(1);
            expect(result[0].membership).toEqual(mockMembership);
            expect(result[0].periods).toEqual(mockPeriods);
            expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
            expect(mockRepository.getMembershipPeriods).toHaveBeenCalledWith(1);
        });

        it('should handle repository errors', async () => {
            mockRepository.findAll.mockRejectedValue(new Error('Database error'));

            await expect(service.getAllMemberships()).rejects.toThrow('Failed to fetch memberships with periods');
        });
    });

    describe('createMembership', () => {
        it('should create a valid membership with periods', async () => {
            const membershipData = {
                name: 'Test Membership',
                recurringPrice: 50,
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6,
                paymentMethod: PaymentMethod.CARD,
                userId: 2000,
                validFrom: new Date(),
                validUntil: new Date(),
                state: MembershipState.ACTIVE,
                assignedBy: 'Admin'
            };

            const createdMembership = new MembershipModel({
                ...membershipData,
                id: 1,
                uuid: 'test-uuid'
            });

            mockRepository.create.mockResolvedValue(createdMembership);
            mockRepository.createMembershipPeriod.mockImplementation(async (period) => ({
                ...period,
                id: 1,
                uuid: 'period-uuid',
                membership: createdMembership as unknown as Membership
            }));

            const result = await service.createMembership(membershipData);

            expect('error' in result).toBe(false);
            if (!('error' in result)) {
                expect(result.membership).toEqual(createdMembership);
                expect(result.periods).toHaveLength(6);
                expect(mockRepository.create).toHaveBeenCalledTimes(1);
                expect(mockRepository.createMembershipPeriod).toHaveBeenCalledTimes(6);
            }
        });

        it('should return error for invalid membership data', async () => {
            const invalidData = {
                name: 'Test Membership',
                recurringPrice: -50,
                userId: 2000,
                validFrom: new Date(),
                validUntil: new Date(),
                state: MembershipState.ACTIVE,
                assignedBy: 'Admin',
                billingInterval: BillingInterval.MONTHLY,
                billingPeriods: 6,
                paymentMethod: PaymentMethod.CARD
            };

            const result = await service.createMembership(invalidData);

            expect('error' in result).toBe(true);
            if ('error' in result) {
                expect(result.error).toBe('negativeRecurringPrice');
            }
            expect(mockRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('getMembershipById', () => {
        it('should return membership with periods if found', async () => {
            const mockMembership = new MembershipModel({
                id: 1,
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

            const mockPeriods: MembershipPeriod[] = [{
                id: 1,
                uuid: 'test-uuid',
                membershipId: 1,
                start: new Date(),
                end: new Date(),
                state: 'planned',
                membership: mockMembership as unknown as Membership
            }];

            mockRepository.findById.mockResolvedValue(mockMembership);
            mockRepository.getMembershipPeriods.mockResolvedValue(mockPeriods);

            const result = await service.getMembershipById(1);

            expect(result).not.toBeNull();
            if (result) {
                expect(result.membership).toEqual(mockMembership);
                expect(result.periods).toEqual(mockPeriods);
            }
        });

        it('should return null if membership not found', async () => {
            mockRepository.findById.mockResolvedValue(null);

            const result = await service.getMembershipById(999);

            expect(result).toBeNull();
            expect(mockRepository.getMembershipPeriods).not.toHaveBeenCalled();
        });
    });

    describe('deleteMembership', () => {
        it('should successfully delete existing membership', async () => {
            mockRepository.delete.mockResolvedValue(true);

            const result = await service.deleteMembership(1);

            expect(result.success).toBe(true);
            expect(result.error).toBeUndefined();
        });

        it('should handle non-existent membership', async () => {
            mockRepository.delete.mockResolvedValue(false);

            const result = await service.deleteMembership(999);

            expect(result.success).toBe(false);
            expect(result.error).toBe('Membership not found');
        });

        it('should handle repository errors', async () => {
            mockRepository.delete.mockRejectedValue(
                new MembershipError('Database error', MembershipErrorCode.DELETE_FAILED)
            );

            const result = await service.deleteMembership(1);

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        });
    });
}); 