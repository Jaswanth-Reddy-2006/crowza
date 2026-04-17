import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { AppError } from '../middleware/errorHandler';
import axios from 'axios';
import logger from '../utils/logger';
import { UserRole } from '@crowza/shared';

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Call Firebase Auth REST API for sign-in
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const { idToken, refreshToken, localId } = response.data;

    // Get user data from Firebase Admin to check/set custom claims
    const userRecord = await auth.getUser(localId);
    
    // Ensure role exists, default to ATTENDEE if not set
    let role = userRecord.customClaims?.role as UserRole || UserRole.ATTENDEE;

    if (!userRecord.customClaims?.role) {
      await auth.setCustomUserClaims(localId, { role });
      // Re-fetch token if claims changed (or just tell client to refresh)
    }

    res.json({
      status: 'success',
      data: {
        token: idToken,
        refreshToken,
        user: {
          id: localId,
          email: userRecord.email,
          role,
        },
      },
    });
  } catch (error: any) {
    logger.error('Login error:', error.response?.data || error.message);
    next(new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS'));
  }
};

export const qrVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { qrToken, deviceId } = req.body;
    // Logic for verifying QR code (e.g., checking it against a database/cache)
    // For now, simulate success
    res.json({
      status: 'success',
      message: 'QR verified',
      token: 'session_token_placeholder',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyMfa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mfaToken, code } = req.body;
    // Simulate MFA verification
    res.json({
      status: 'success',
      message: 'MFA verified',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    
    // Use Firebase Auth REST API to refresh token
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }
    );

    res.json({
      status: 'success',
      data: {
        token: response.data.id_token,
        refreshToken: response.data.refresh_token,
      },
    });
  } catch (error: any) {
    logger.error('Refresh token error:', error.response?.data || error.message);
    next(new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN'));
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Auth middleware should attach user to req
    const user = (req as any).user;
    res.json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For stateless JWT, logout is usually client-side (clearing storage)
    // or adding token to a blacklist/revoking refresh tokens in Firebase
    const uid = (req as any).user?.uid;
    if (uid) {
      await auth.revokeRefreshTokens(uid);
    }
    
    res.json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
