import { Request, Response, NextFunction } from 'express';
import * as orgService from '../services/organization.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await orgService.createOrganization((req.user as any).id, req.body);
    res.status(201).json({ success: true, data: org });
  } catch (err) {
    next(err);
  }
}

export async function getMine(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await orgService.getOrganizationByOwner((req.user as any).id);
    res.json({ success: true, data: org });
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await orgService.getOrganizationById(req.params.id);
    res.json({ success: true, data: org });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const org = await orgService.updateOrganization(req.params.id, (req.user as any).id, req.body);
    res.json({ success: true, data: org });
  } catch (err) {
    next(err);
  }
}
