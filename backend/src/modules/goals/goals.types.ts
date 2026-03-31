import { z } from "zod";

export const frequencyEnum = z.enum(["daily", "weekly"]);
export const strictnessEnum = z.enum(["normal", "strict", "brutal"]);

export const goalBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  reason: z.string().max(1000).optional().nullable(),
  frequency: frequencyEnum.default("daily"),
  strictness: strictnessEnum.default("strict"),
  reminderTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format HH:MM")
    .optional()
    .nullable(),
});

export const createGoalSchema = goalBaseSchema;
export const updateGoalSchema = goalBaseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
