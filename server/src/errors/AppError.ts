export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string) {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string) {
        super(message, 403);
    }
}

export class ValidationError extends BadRequestError {
    constructor(message: string) {
        super(message);
    }
}

export class DatabaseError extends AppError {
    constructor(message: string) {
        super(message, 500);
    }
}

export class ServiceUnavailableError extends AppError {
    constructor(message: string) {
        super(message, 503);
    }
}

export class CredentialError extends UnauthorizedError {
    constructor(message: string = "Invalid credentials") {
        super(message);
    }
}

export class BusinessError extends AppError {
    constructor(message: string, statusCode: number = 400) {
        super(message, statusCode);
    }
}

export class CategoryBusinessError extends BusinessError {
    constructor(message: string) {
        super(message, 400);
    }
}

export class CategoryError extends AppError {
    constructor(message: string, statusCode: number = 400) {
        super(message, statusCode);
    }
}

export class TransactionError extends AppError {
    constructor(message: string, statusCode: number = 400) {
        super(message, statusCode);
    }
}