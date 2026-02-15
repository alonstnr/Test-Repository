import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, error: 'יש להתחבר כדי לגשת לדף זה' });
  }
  next();
}

export function requireRole(role: 'ORGANIZATION' | 'VOLUNTEER') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ success: false, error: 'יש להתחבר כדי לגשת לדף זה' });
    }
    const user = req.user as any;
    if (user.role !== role) {
      return res.status(403).json({ success: false, error: 'אין הרשאה לפעולה זו' });
    }
    next();
  };
}
