import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { registerUser, sanitizeUser } from '../services/auth.service';
import { env } from '../config/env';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await registerUser(req.body);
    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json({ success: true, data: user });
    });
  } catch (err) {
    next(err);
  }
}

export function login(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('local', (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, error: info?.message || 'התחברות נכשלה' });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ success: true, data: sanitizeUser(user) });
    });
  })(req, res, next);
}

export function logout(req: Request, res: Response) {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'שגיאה בהתנתקות' });
    }
    req.session.destroy(() => {
      res.json({ success: true, message: 'התנתקת בהצלחה' });
    });
  });
}

export function getMe(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'לא מחובר' });
  }
  res.json({ success: true, data: sanitizeUser(req.user) });
}

export function googleAuth(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

export function googleCallback(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('google', {
    failureRedirect: `${env.CLIENT_URL}/login?error=google-auth-failed`,
  })(req, res, () => {
    res.redirect(`${env.CLIENT_URL}/dashboard`);
  });
}
