import * as goalsService from "./goals.service.js";
import { createGoalSchema } from "./goals.types.js";

import type { NextFunction, Request, Response } from "express";

export async function getGoalsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await goalsService.getUserGoals(req.userId!);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function getGoalByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;
    const result = await goalsService.getGoalById(id, req.userId!);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function createGoalHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = createGoalSchema.parse(req.body);
    const result = await goalsService.createGoal(input, req.userId!);
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
}

export async function updateGoalHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id as string;
    const input = createGoalSchema.parse(id);
    const result = await goalsService.updateGoal(id, req.userId!, input);
    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
}
