import { Request, Response, NextFunction } from 'express';
import JWT from '../utils/JWT';
import * as AppErrors from '../errors/AppError';

// Extend Express Request to include custom properties
declare global {
  namespace Express {
    interface Request {
      profileId?: string;
      tokenJti?: string;
    }
  }
}

/**
 * Middleware to verify access tokens from request headers
 * Supports both web and mobile clients by checking:
 * 1. Authorization header (Bearer token) - Standard for web
 * 2. x-access-token header - Alternative for mobile clients
 */
export const accessTokenVerification = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header (Bearer token) or x-access-token header
    const authHeader = req.headers.authorization;
    const tokenFromHeader = req.headers['x-access-token'] as string;
    
    // Extract token from different sources
    let token: string | null = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Web standard - extract from Bearer token
      token = authHeader.split(' ')[1];
    } else if (tokenFromHeader) {
      // Mobile alternative - direct token header
      token = tokenFromHeader;
    }
    
    if (!token) {
      throw new AppErrors.UnauthorizedError('Access token is required');
    }
    
    // Verify the token
    const decoded = JWT.verifyAccessToken(token);
    
    if (!decoded) {
      throw new AppErrors.UnauthorizedError('Invalid or expired access token');
    }
    
    // Add the profile ID to the request object for use in route handlers
    req.profileId = decoded.profileId;
    
    next();
  } catch (error) {
    if (error instanceof AppErrors.AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
    }
  }
};

/**
 * Optional middleware to verify refresh tokens
 * Used for token refresh operations
 */
export const refreshTokenVerification = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from request body or headers
    const token = req.body.refreshToken || req.headers['x-refresh-token'] as string;
    
    if (!token) {
      throw new AppErrors.UnauthorizedError('Refresh token is required');
    }
    
    // Verify the token without checking expiration
    const decoded = JWT.verifyRefreshToken(token);
    
    if (!decoded) {
      throw new AppErrors.UnauthorizedError('Invalid refresh token');
    }
    
    // Add the profile ID to the request object for use in route handlers
    req.profileId = decoded.profileId;
    req.tokenJti = decoded.jti;
    
    next();
  } catch (error) {
    if (error instanceof AppErrors.AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
    }
  }
};