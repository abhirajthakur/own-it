import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../db/index.js";
import { goals } from "../../db/schema.js";
import { AppError } from "../../middleware/errorHandler.js";

import type { CreateGoalInput, UpdateGoalInput } from "./goals.types.js";

export async function createGoal(input: CreateGoalInput, userId: string) {
  const [goal] = await db
    .insert(goals)
    .values({
      userId,
      ...input,
    })
    .returning();
  if (!goal) {
    throw new Error("Failed to create goal");
  }
  const { userId: _userId, ...remainingFields } = goal;
  return remainingFields;
}

export async function getUserGoals(userId: string) {
  return db
    .select({
      id: goals.id,
      title: goals.title,
      reason: goals.reason,
      frequency: goals.frequency,
      strictness: goals.strictness,
      reminderTime: goals.reminderTime,
      createdAt: goals.createdAt,
      updatedAt: goals.updatedAt,
    })
    .from(goals)
    .where(and(eq(goals.userId, userId), isNull(goals.archivedAt)));
}

export async function getGoalById(goalId: string, userId: string) {
  const [goal] = await db
    .select({
      id: goals.id,
      title: goals.title,
      reason: goals.reason,
      frequency: goals.frequency,
      strictness: goals.strictness,
      reminderTime: goals.reminderTime,
      createdAt: goals.createdAt,
      updatedAt: goals.updatedAt,
    })
    .from(goals)
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));

  if (!goal) {
    throw new AppError(`No goal exists with id: ${goalId} `, 404);
  }

  return goal;
}

export async function updateGoal(
  goalId: string,
  userId: string,
  input: UpdateGoalInput,
) {
  const [updated] = await db
    .update(goals)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error(`Failed to update goal with id: ${goalId}`);
  }

  const { userId: _userId, ...remainingFields } = updated;

  return remainingFields;
}

export async function archiveGoal(goalId: string, userId: string) {
  const [updated] = await db
    .update(goals)
    .set({
      archivedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
    .returning();

  return !!updated;
}

export async function restoreGoal(goalId: string, userId: string) {
  const [restored] = await db
    .update(goals)
    .set({
      archivedAt: null,
      updatedAt: new Date(),
    })
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
    .returning();

  if (!restored) {
    throw new Error(`Failed to restore goal with id: ${goalId}`);
  }

  return restored;
}

export async function deleteGoal(goalId: string, userId: string) {
  const result = await db
    .delete(goals)
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
  return (result.rowCount ?? 0) > 0;
}
