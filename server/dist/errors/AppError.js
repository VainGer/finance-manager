"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.TransactionError = exports.CategoryError = exports.CategoryBusinessError = exports.BusinessError = exports.CredentialError = exports.ServiceUnavailableError = exports.DatabaseError = exports.ValidationError = exports.ForbiddenError = exports.UnauthorizedError = exports.ConflictError = exports.BadRequestError = exports.NotFoundError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message) {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class ValidationError extends BadRequestError {
    constructor(message) {
        super(message);
    }
}
exports.ValidationError = ValidationError;
class DatabaseError extends AppError {
    constructor(message) {
        super(message, 500);
    }
}
exports.DatabaseError = DatabaseError;
class ServiceUnavailableError extends AppError {
    constructor(message) {
        super(message, 503);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class CredentialError extends UnauthorizedError {
    constructor(message = "Invalid credentials") {
        super(message);
    }
}
exports.CredentialError = CredentialError;
class BusinessError extends AppError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
    }
}
exports.BusinessError = BusinessError;
class CategoryBusinessError extends BusinessError {
    constructor(message) {
        super(message, 400);
    }
}
exports.CategoryBusinessError = CategoryBusinessError;
class CategoryError extends AppError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
    }
}
exports.CategoryError = CategoryError;
class TransactionError extends AppError {
    constructor(message, statusCode = 400) {
        super(message, statusCode);
    }
}
exports.TransactionError = TransactionError;
class InternalServerError extends AppError {
    constructor(message = "Internal Server Error") {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=AppError.js.map