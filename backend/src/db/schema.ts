import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const checkinStatus = pgEnum("checkin_status", ["done", "missed"]);
export const frequencyEnum = pgEnum("frequency", ["daily", "weekly"]);
export const strictnessEnum = pgEnum("strictness", [
  "normal",
  "strict",
  "brutal",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const goals = pgTable(
  "goals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    reason: text("reason"),
    frequency: frequencyEnum("frequency").notNull().default("daily"),
    strictness: strictnessEnum("strictness").notNull().default("strict"),
    reminderTime: text("reminder_time"), // "HH:MM" in user's timezone, null = no reminder
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("goals_user_id_idx").on(t.userId)],
);

export const checkins = pgTable(
  "checkins",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    goalId: uuid("goal_id")
      .notNull()
      .references(() => goals.id, { onDelete: "cascade" }),
    date: timestamp("date", { withTimezone: true }).notNull(),
    status: checkinStatus("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("checkins_goal_id_idx").on(t.goalId),
    index("idx_checkins_date").on(t.date),
  ],
);
