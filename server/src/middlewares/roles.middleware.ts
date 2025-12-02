import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../entities/User';

export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !user.roles) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const hasRole = user.roles.some((role: UserRole) => roles.includes(role));
    if (!hasRole) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
