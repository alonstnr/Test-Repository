import { Request, Response, NextFunction } from 'express';
import * as activityService from '../services/activity.service';
import { prisma } from '../config/prisma';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await prisma.organization.findUnique({ where: { ownerId: (req.user as any).id } });
    if (!org) {
      return res.status(400).json({ success: false, error: 'יש ליצור ארגון קודם' });
    }
    const activity = await activityService.createActivity(org.id, req.body);
    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
}

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await activityService.getActivities(req.query as any);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const activity = await activityService.getActivityById(req.params.id);
    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await prisma.organization.findUnique({ where: { ownerId: (req.user as any).id } });
    if (!org) {
      return res.status(403).json({ success: false, error: 'אין הרשאה' });
    }
    const activity = await activityService.updateActivity(req.params.id, org.id, req.body);
    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
}

export async function deactivate(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await prisma.organization.findUnique({ where: { ownerId: (req.user as any).id } });
    if (!org) {
      return res.status(403).json({ success: false, error: 'אין הרשאה' });
    }
    await activityService.deactivateActivity(req.params.id, org.id);
    res.json({ success: true, message: 'הפעילות הושבתה' });
  } catch (err) {
    next(err);
  }
}

export async function getRegistrants(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await prisma.organization.findUnique({ where: { ownerId: (req.user as any).id } });
    if (!org) {
      return res.status(403).json({ success: false, error: 'אין הרשאה' });
    }
    const registrants = await activityService.getActivityRegistrants(req.params.id, org.id);
    res.json({ success: true, data: registrants });
  } catch (err) {
    next(err);
  }
}

export async function getCalendar(req: Request, res: Response, next: NextFunction) {
  try {
    const { month, year } = req.query;
    const m = parseInt(month as string) || new Date().getMonth() + 1;
    const y = parseInt(year as string) || new Date().getFullYear();
    const data = await activityService.getCalendarData((req.user as any).id, y, m);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
