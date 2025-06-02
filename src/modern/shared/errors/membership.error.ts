export class MembershipError extends Error {
    constructor(
        message: string,
        public readonly code: MembershipErrorCode,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = 'MembershipError';
    }
}

export enum MembershipErrorCode {
    NOT_FOUND = 'MEMBERSHIP_NOT_FOUND',
    CREATION_FAILED = 'MEMBERSHIP_CREATION_FAILED',
    UPDATE_FAILED = 'MEMBERSHIP_UPDATE_FAILED',
    DELETE_FAILED = 'MEMBERSHIP_DELETE_FAILED',
    FETCH_FAILED = 'MEMBERSHIP_FETCH_FAILED',
    PERIOD_CREATION_FAILED = 'MEMBERSHIP_PERIOD_CREATION_FAILED',
    PERIOD_FETCH_FAILED = 'MEMBERSHIP_PERIOD_FETCH_FAILED',
    VALIDATION_FAILED = 'VALIDATION_FAILED'
} 