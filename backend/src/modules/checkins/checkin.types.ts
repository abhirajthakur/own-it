import { z } from "zod";

export const checkinStatusEnum = z.enum(["done", "missed"]);

export const createCheckinSchema = z.object({
  goalId: z.uuid(),
  date: z.date(),
  status: checkinStatusEnum,
});

export const updateCheckinSchema = z.object({
  status: checkinStatusEnum,
});

export const checkinParamsSchema = z.object({
  id: z.uuid(),
});

export const checkinQuerySchema = z.object({
  goalId: z.uuid().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type CreateCheckinInput = z.infer<typeof createCheckinSchema>;
export type UpdateCheckinInput = z.infer<typeof updateCheckinSchema>;
export type CheckinParams = z.infer<typeof checkinParamsSchema>;
export type CheckinQuery = z.infer<typeof checkinQuerySchema>;
