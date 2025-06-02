import { Membership, MembershipPeriod, MembershipWithPeriods } from '../interfaces/membership.interface';
import { MembershipModel } from '../model/membership.model';
import { MembershipRepository } from '../repository/membership.repository';
import { MembershipError } from '../shared/errors/membership.error';
import { Membership as MembershipEntity } from '../entity/membership.entity';
import { MembershipPeriod as MembershipPeriodEntity } from '../entity/membership-period.entity';

export class MembershipService {
    private repository: MembershipRepository;

    constructor() {
        this.repository = new MembershipRepository();
    }

    async getAllMemberships(): Promise<MembershipWithPeriods[]> {
        try {
            const memberships = await this.repository.findAll();
            const membershipWithPeriods: MembershipWithPeriods[] = await Promise.all(
                memberships.map(async (membership) => {
                    const periods = await this.repository.getMembershipPeriods(membership.id);
                    return {
                        membership,
                        periods
                    };
                })
            );
            return membershipWithPeriods;
        } catch (error) {
            console.error('Error fetching memberships with periods:', error);
            throw new Error('Failed to fetch memberships with periods');
        }
    }

    async getMembershipById(id: number): Promise<MembershipWithPeriods | null> {
        try {
            const membership = await this.repository.findById(id);
            if (!membership) {
                return null;
            }

            const periods = await this.repository.getMembershipPeriods(id);
            return {
                membership,
                periods
            };
        } catch (error) {
            console.error(`Error fetching membership ${id} with periods:`, error);
            throw new Error('Failed to fetch membership with periods');
        }
    }

    async createMembership(data: Omit<Membership, 'id' | 'uuid'>): Promise<MembershipWithPeriods | { error: string }> {
        const membershipModel = new MembershipModel(data);
        const validation = membershipModel.validate();
        
        if (!validation.isValid) {
            return { error: validation.error || 'Invalid membership data' };
        }

        try {
            // Create the membership
            const membership = await this.repository.create(membershipModel as unknown as Omit<MembershipEntity, 'id' | 'uuid'>);
            
            // Generate and create membership periods
            const periods = membershipModel.generatePeriods();
            const createdPeriods = await Promise.all(
                periods.map(period => 
                    this.repository.createMembershipPeriod({
                        ...period,
                        membershipId: membership.id,
                        membership: membership as MembershipEntity
                    } as Omit<MembershipPeriodEntity, 'id' | 'uuid'>)
                )
            );

            return {
                membership,
                periods: createdPeriods
            };
        } catch (error) {
            console.error('Error creating membership with periods:', error);
            if (error instanceof MembershipError) {
                return { error: error.message };
            }
            return { error: 'Failed to create membership with periods' };
        }
    }

    async updateMembership(id: number, data: Partial<Membership>): Promise<MembershipWithPeriods | { error: string }> {
        try {
            const existingMembership = await this.repository.findById(id);
            if (!existingMembership) {
                return { error: 'Membership not found' };
            }

            const updatedMembership = await this.repository.update(id, data);
            if (!updatedMembership) {
                return { error: 'Failed to update membership' };
            }

            const periods = await this.repository.getMembershipPeriods(id);
            return {
                membership: updatedMembership,
                periods
            };
        } catch (error) {
            console.error(`Error updating membership ${id}:`, error);
            throw new Error('Failed to update membership');
        }
    }

    async deleteMembership(id: number): Promise<{ success: boolean; error?: string }> {
        try {
            const deleted = await this.repository.delete(id);
            return {
                success: deleted,
                error: deleted ? undefined : 'Membership not found'
            };
        } catch (error) {
            console.error(`Error deleting membership ${id}:`, error);
            if (error instanceof MembershipError) {
                return { success: false, error: error.message };
            }
            return { success: false, error: 'Failed to delete membership' };
        }
    }

    async getMembershipPeriods(membershipId: number): Promise<MembershipPeriod[]> {
        return await this.repository.getMembershipPeriods(membershipId);
    }
} 