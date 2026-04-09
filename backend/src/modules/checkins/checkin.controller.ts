import * as checkinService from "./checkin.service.js";

import type { NextFunction, Request, Response } from "express";
import type {
  CreateCheckinInput,
  UpdateCheckinInput,
  CheckinQuery,
} from "./checkin.types.js";

export async function createCheckinHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await checkinService.createCheckin(
      req.body as CreateCheckinInput,
      req.userId!
    );
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function getCheckinsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = req.query as unknown as CheckinQuery;
    const result = await checkinService.getCheckins(query, req.userId!);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function getCheckinByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params as { id: string };
    const result = await checkinService.getCheckinById(id, req.userId!);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateCheckinHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params as { id: string };
    const result = await checkinService.updateCheckin(
      id,
      req.userId!,
      req.body as UpdateCheckinInput
    );
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function deleteCheckinHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params as { id: string };
    await checkinService.deleteCheckin(id, req.userId!);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}