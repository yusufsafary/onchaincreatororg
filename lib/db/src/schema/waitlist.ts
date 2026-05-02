import { pgTable, bigserial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const waitlistTable = pgTable("waitlist", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  email: text("email").unique().notNull(),
  role: text("role"),
  handle: text("handle"),
  chain: text("chain"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlistTable).omit({ id: true, createdAt: true });
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlistTable.$inferSelect;
