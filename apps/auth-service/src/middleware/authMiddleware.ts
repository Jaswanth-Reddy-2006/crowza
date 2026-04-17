import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(public message: string, public statusCode: number, public errorCode?: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    (req as any).user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'attendee',
    };

    next();
  } catch (error: any) {
    logger.error('Authentication error:', error.message);
    next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      next(new AppError('Forbidden', 403, 'FORBIDDEN'));
      return;
    }
    next();
  };
};

export const authMiddleware = authenticate;
