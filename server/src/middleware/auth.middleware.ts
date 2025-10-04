import { Request, Response, NextFunction } from 'express';
import JWT from '../utils/JWT';
import * as AppErrors from '../errors/AppError';

declare global {
  namespace Express {
    interface Request {
      profileId?: string;
      tokenJti?: string;
    }
  }
}


export const accessTokenVerification = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // First try to get token from cookies (new method)
    let token: string | null = req.cookies?.accessToken || null;
    
    // Fallback to headers for backward compatibility
    if (!token) {
      const authHeader = req.headers.authorization;
      const tokenFromHeader = req.headers['x-access-token'] as string;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else if (tokenFromHeader) {
        token = tokenFromHeader;
      }
    }
    
    if (!token) {
      throw new AppErrors.UnauthorizedError('Access token is required');
    }

    const decoded = JWT.verifyAccessToken(token);
    
    if (!decoded) {
      throw new AppErrors.UnauthorizedError('Invalid or expired access token');
    }
    
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


export const refreshTokenVerification = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // First try to get token from cookies (new method)
    let token: string | null = req.cookies?.refreshToken || null;
    
    // Fallback to request body/headers for backward compatibility
    if (!token) {
      token = req.body.refreshToken || req.headers['x-refresh-token'] as string;
    }
    
    if (!token) {
      throw new AppErrors.UnauthorizedError('Refresh token is required');
    }
    
    const decoded = JWT.verifyRefreshToken(token);
    
    if (!decoded) {
      throw new AppErrors.UnauthorizedError('Invalid refresh token');
    }
    
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