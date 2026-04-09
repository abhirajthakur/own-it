import { and, eq, gte, isNull, lte } from "drizzle-orm";
import { db } from "../../db/index.js";
import { checkins, goals } from "../../db/schema.js";
import { AppError } from "../../middleware/errorHandler.js";

import type {
  CheckinQuery,
  CreateCheckinInput,
  UpdateCheckinInput,
} from "./checkin.types.js";

export async function createCheckin(input: CreateCheckinInput, userId: string) {
  const [goal] = await db
    .select({ id: goals.id })
    .from(goals)
    .where(
      and(
        eq(goals.id, input.goalId),
        eq(goals.userId, userId),
        isNull(goals.archivedAt),
      ),
    );

  if (!goal) {
    throw new AppError(`No goal exists with id: ${input.goalId}`, 404);
  }

  const [checkin] = await db
    .insert(checkins)
    .values({
      goalId: input.goalId,
      date: new Date(input.date),
      status: input.status,
    })
    .returning();

  if (!checkin) {
    throw new Error("Failed to create checkin");
  }

  return checkin;
}

export async function getCheckins(query: CheckinQuery, userId: string) {
  const conditions = [eq(goals.userId, userId), isNull(goals.archivedAt)];

  if (query.goalId) {
    conditions.push(eq(checkins.goalId, query.goalId));
  }

  if (query.startDate) {
    conditions.push(gte(checkins.date, new Date(query.startDate)));
  }

  if (query.endDate) {
    conditions.push(lte(checkins.date, new Date(query.endDate)));
  }

  return db
    .select({
      id: checkins.id,
      goalId: checkins.goalId,
      date: checkins.date,
      status: checkins.status,
      createdAt: checkins.createdAt,
    })
    .from(checkins)
    .innerJoin(
      goals,
      and(eq(checkins.goalId, goals.id), eq(goals.userId, userId)),
    )
    .where(and(...conditions));
}

export async function getCheckinById(checkinId: string, userId: string) {
  const [checkin] = await db
    .select({
      id: checkins.id,
      goalId: checkins.goalId,
      date: checkins.date,
      status: checkins.status,
      createdAt: checkins.createdAt,
    })
    .from(checkins)
    .innerJoin(
      goals,
      and(eq(checkins.goalId, goals.id), eq(goals.userId, userId)),
    )
    .where(eq(checkins.id, checkinId));

  if (!checkin) {
    throw new AppError(`No checkin exists with id: ${checkinId}`, 404);
  }

  return checkin;
}

export async function updateCheckin(
  checkinId: string,
  userId: string,
  input: UpdateCheckinInput,
) {
  const [existing] = await db
    .select({ id: checkins.id })
    .from(checkins)
    .innerJoin(
      goals,
      and(eq(checkins.goalId, goals.id), eq(goals.userId, userId)),
    )
    .where(eq(checkins.id, checkinId));

  if (!existing) {
    throw new AppError(`No checkin exists with id: ${checkinId}`, 404);
  }

  const [updated] = await db
    .update(checkins)
    .set(input)
    .where(eq(checkins.id, checkinId))
    .returning();

  if (!updated) {
    throw new Error(`Failed to update checkin with id: ${checkinId}`);
  }

  return updated;
}

export async function deleteCheckin(checkinId: string, userId: string) {
  const [existing] = await db
    .select({ id: checkins.id })
    .from(checkins)
    .innerJoin(
      goals,
      and(eq(checkins.goalId, goals.id), eq(goals.userId, userId)),
    )
    .where(eq(checkins.id, checkinId));

  if (!existing) {
    throw new AppError(`No checkin exists with id: ${checkinId}`, 404);
  }

  const result = await db.delete(checkins).where(eq(checkins.id, checkinId));

  return (result.rowCount ?? 0) > 0;
}
