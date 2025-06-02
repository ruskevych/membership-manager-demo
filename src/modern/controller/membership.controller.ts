import { Request, Response, NextFunction } from 'express';
import { MembershipService } from '../service/membership.service';
import { MembershipError, MembershipErrorCode } from '../shared/errors/membership.error';

export class MembershipController {
    private service: MembershipService;

    constructor() {
        this.service = new MembershipService();
    }

    async getAllMemberships(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const memberships = await this.service.getAllMemberships();
            res.json(memberships);
        } catch (error) {
            next(error);
        }
    }

    async getMembershipById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new MembershipError(
                    'Invalid membership ID format',
                    MembershipErrorCode.VALIDATION_FAILED
                );
            }

            const membership = await this.service.getMembershipById(id);
            if (!membership) {
                throw new MembershipError(
                    `Membership with id ${id} not found`,
                    MembershipErrorCode.NOT_FOUND
                );
            }

            res.json(membership);
        } catch (error) {
            next(error);
        }
    }

    async createMembership(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.service.createMembership(req.body);
            if ('error' in result) {
                throw new MembershipError(
                    result.error,
                    MembershipErrorCode.VALIDATION_FAILED
                );
            }

            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateMembership(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new MembershipError(
                    'Invalid membership ID format',
                    MembershipErrorCode.VALIDATION_FAILED
                );
            }

            const result = await this.service.updateMembership(id, req.body);
            if ('error' in result) {
                throw new MembershipError(
                    result.error,
                    MembershipErrorCode.VALIDATION_FAILED
                );
            }

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteMembership(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new MembershipError(
                    'Invalid membership ID format',
                    MembershipErrorCode.VALIDATION_FAILED
                );
            }

            const result = await this.service.deleteMembership(id);
            if (!result.success) {
                throw new MembershipError(
                    result.error || 'Failed to delete membership',
                    MembershipErrorCode.DELETE_FAILED
                );
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getMembershipPeriods(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const membershipId = parseInt(req.params.id);
            if (isNaN(membershipId)) {
                throw new MembershipError(
                    'Invalid membership ID format',
                    MembershipErrorCode.VALIDATION_FAILED
                );
            }

            const periods = await this.service.getMembershipPeriods(membershipId);
            res.json(periods);
        } catch (error) {
            next(error);
        }
    }
} 