import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gameRecords = pgTable("game_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  gameType: text("game_type").notNull().default("chronoflip"), // 'chronoflip' or 'rps'
  symbol: text("symbol"), // '🔥' or '❄️' for chronoflip
  userGuess: text("user_guess"), // '🔥' or '❄️' for chronoflip, 'rock'/'paper'/'scissors' for rps
  opponentChoice: text("opponent_choice"), // for rps games
  isCorrect: boolean("is_correct"),
  result: text("result"), // 'win', 'lose', 'draw'
  amountStaked: integer("amount_staked").default(0), // in sats
  amountWon: integer("amount_won").default(0), // in sats
  streak: integer("streak").notNull().default(0),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  bestStreak: integer("best_streak").notNull().default(0),
  totalGuesses: integer("total_guesses").notNull().default(0),
  correctGuesses: integer("correct_guesses").notNull().default(0),
  lastPlayed: timestamp("last_played").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  gameRecords: many(gameRecords),
  stats: one(userStats),
}));

export const gameRecordsRelations = relations(gameRecords, ({ one }) => ({
  user: one(users, {
    fields: [gameRecords.userId],
    references: [users.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameRecordSchema = createInsertSchema(gameRecords).pick({
  userId: true,
  gameType: true,
  symbol: true,
  userGuess: true,
  opponentChoice: true,
  isCorrect: true,
  result: true,
  amountStaked: true,
  amountWon: true,
  streak: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).pick({
  userId: true,
  bestStreak: true,
  totalGuesses: true,
  correctGuesses: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type GameRecord = typeof gameRecords.$inferSelect;
export type InsertGameRecord = z.infer<typeof insertGameRecordSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
