import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.Authentication || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwt.accessSecret);
    (req as any).user = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
