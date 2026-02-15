import { Request, Response, NextFunction } from 'express';
import * as registrationService from '../services/registration.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { activityId, timeSlotIds } = req.body;
    const registrations = await registrationService.registerForTimeSlots(
      (req.user as any).id,
      activityId,
      timeSlotIds
    );
    res.status(201).json({ success: true, data: registrations });
  } catch (err) {
    next(err);
  }
}

export async function getMine(req: Request, res: Response, next: NextFunction) {
  try {
    const registrations = await registrationService.getUserRegistrations((req.user as any).id);
    res.json({ success: true, data: registrations });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req: Request, res: Response, next: NextFunction) {
  try {
    await registrationService.cancelRegistration(req.params.id, (req.user as any).id);
    res.json({ success: true, message: 'ההרשמה בוטלה בהצלחה' });
  } catch (err) {
    next(err);
  }
}
