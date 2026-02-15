import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserProfile((req.user as any).id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.updateUserProfile((req.user as any).id, req.body);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function getVolunteerProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await userService.getVolunteerProfile((req.user as any).id);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}

export async function upsertVolunteerProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await userService.upsertVolunteerProfile((req.user as any).id, req.body);
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
}
