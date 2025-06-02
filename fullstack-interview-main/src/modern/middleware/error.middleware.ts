import { Request, Response, NextFunction } from 'express';
import { MembershipError, MembershipErrorCode } from '../shared/errors/membership.error';

interface ErrorResponse {
    status: number;
    message: string;
    code?: string;
    details?: unknown;
}

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        details: error instanceof MembershipError ? error.details : undefined
    });

    const errorResponse: ErrorResponse = {
        status: 500,
        message: 'Internal Server Error'
    };

    if (error instanceof MembershipError) {
        switch (error.code) {
            case MembershipErrorCode.NOT_FOUND:
                errorResponse.status = 404;
                errorResponse.message = error.message;
                break;
            case MembershipErrorCode.CREATION_FAILED:
            case MembershipErrorCode.UPDATE_FAILED:
            case MembershipErrorCode.DELETE_FAILED:
                errorResponse.status = 400;
                errorResponse.message = error.message;
                break;
            case MembershipErrorCode.FILE_OPERATION_FAILED:
                errorResponse.status = 500;
                errorResponse.message = 'Internal Server Error';
                break;
            default:
                errorResponse.status = 500;
                errorResponse.message = 'Internal Server Error';
        }
        errorResponse.code = error.code;
        
        // Only include details in non-production environments
        if (process.env.NODE_ENV !== 'production') {
            errorResponse.details = error.details;
        }
    }

    res.status(errorResponse.status).json(errorResponse);
}; 