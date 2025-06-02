import { Membership } from '../entity/membership.entity';
import { MembershipPeriod } from '../entity/membership-period.entity';
import { MembershipModel } from '../model/membership.model';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { v4 as uuidv4 } from 'uuid';
import { MembershipError, MembershipErrorCode } from '../shared/errors/membership.error';
import { QueryFailedError } from 'typeorm';

export class MembershipRepository {
    private membershipRepo: Repository<Membership>;
    private periodRepo: Repository<MembershipPeriod>;

    constructor() {
        this.membershipRepo = AppDataSource.getRepository(Membership);
        this.periodRepo = AppDataSource.getRepository(MembershipPeriod);
    }

    async findAll(): Promise<MembershipModel[]> {
        try {
            const memberships = await this.membershipRepo.find();
            return memberships.map(m => new MembershipModel(m));
        } catch (error) {
            throw new MembershipError(
                'Failed to fetch memberships',
                MembershipErrorCode.FETCH_FAILED,
                error
            );
        }
    }

    async findById(id: number): Promise<MembershipModel | null> {
        try {
            const membership = await this.membershipRepo.findOneBy({ id });
            return membership ? new MembershipModel(membership) : null;
        } catch (error) {
            throw new MembershipError(
                `Failed to fetch membership ${id}`,
                MembershipErrorCode.FETCH_FAILED,
                error
            );
        }
    }

    async create(membershipData: Omit<Membership, 'id' | 'uuid'>): Promise<MembershipModel> {
        try {
            const membership = this.membershipRepo.create({
                ...membershipData,
                uuid: uuidv4()
            });
            
            const savedMembership = await this.membershipRepo.save(membership);
            return new MembershipModel(savedMembership);
        } catch (error) {
            throw new MembershipError(
                'Failed to create membership',
                MembershipErrorCode.CREATION_FAILED,
                error
            );
        }
    }

    async update(id: number, membershipData: Partial<Membership>): Promise<MembershipModel | null> {
        try {
            const membership = await this.membershipRepo.findOneBy({ id });
            if (!membership) {
                throw new MembershipError(
                    `Membership with id ${id} not found`,
                    MembershipErrorCode.NOT_FOUND
                );
            }

            const updatedMembership = await this.membershipRepo.save({
                ...membership,
                ...membershipData
            });

            return new MembershipModel(updatedMembership);
        } catch (error) {
            if (error instanceof MembershipError) {
                throw error;
            }
            throw new MembershipError(
                `Failed to update membership ${id}`,
                MembershipErrorCode.UPDATE_FAILED,
                error
            );
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const result = await this.membershipRepo.delete(id);
            
            if (result.affected === 0) {
                return false;
            }
            
            return true;
        } catch (error) {
            if (error instanceof QueryFailedError) {
                return false;
            }
            throw new MembershipError(
                `Failed to delete membership ${id}`,
                MembershipErrorCode.DELETE_FAILED,
                error
            );
        }
    }

    async getMembershipPeriods(membershipId: number): Promise<MembershipPeriod[]> {
        try {
            return await this.periodRepo.findBy({ membershipId });
        } catch (error) {
            throw new MembershipError(
                `Failed to fetch periods for membership ${membershipId}`,
                MembershipErrorCode.PERIOD_FETCH_FAILED,
                error
            );
        }
    }

    async createMembershipPeriod(period: Omit<MembershipPeriod, 'id' | 'uuid'>): Promise<MembershipPeriod> {
        try {
            const newPeriod = this.periodRepo.create({
                ...period,
                uuid: uuidv4()
            });
            
            return await this.periodRepo.save(newPeriod);
        } catch (error) {
            throw new MembershipError(
                'Failed to create membership period',
                MembershipErrorCode.PERIOD_CREATION_FAILED,
                error
            );
        }
    }
} 